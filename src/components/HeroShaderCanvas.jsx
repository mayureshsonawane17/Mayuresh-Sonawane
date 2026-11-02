import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * HeroShaderCanvas
 * WebGL GLSL Shader adapted directly from OFF+BRAND's implementation for landonorris.com.
 * Features:
 * - Fluid sinusoidal wave roll transition between Mayuresh Unmasked and Spider-Man Mask
 *   Formula: float hoverTransition = uv.y + sin(uv.x * PI) * sin(uMaskHover * PI) * 0.22;
 * - Interactive cursor ripple displacement & chromatic dispersion (RGB channel separation)
 * - Laser seam edge glow in electric volt (#D2FD52)
 * - Aspect-ratio correct plane mapping preserving 900x1152 portrait resolution
 */
export default function HeroShaderCanvas({
  unmaskedSrc = '/assets/personal/hero-unmasked.png',
  maskedSrc = '/assets/personal/hero-masked.png',
  maskProgress = 0.0, // 0.0 (Unmasked) to 1.0 (Spider-Man Mask)
  isHovered = false,
  mousePos = { x: 0.5, y: 0.5 },
  onClick,
}) {
  const mountRef = useRef(null);
  const uniformsRef = useRef(null);
  const rendererRef = useRef(null);
  const targetMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const currentMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const targetMaskRef = useRef(maskProgress);

  // Update target coordinates
  useEffect(() => {
    targetMouseRef.current.set(mousePos.x, 1.0 - mousePos.y);
  }, [mousePos]);

  useEffect(() => {
    targetMaskRef.current = Math.max(0.0, Math.min(1.0, maskProgress));
  }, [maskProgress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 800;

    // Scene & Orthographic Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Renderer
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization skipped:', e);
      return;
    }

    // Default 1x1 transparent texture
    const transparentData = new Uint8Array([0, 0, 0, 0]);
    const fallbackTexture = new THREE.DataTexture(transparentData, 1, 1, THREE.RGBAFormat);
    fallbackTexture.needsUpdate = true;

    // Load textures
    const textureLoader = new THREE.TextureLoader();
    let unmaskedTexture = fallbackTexture;
    let maskedTexture = fallbackTexture;

    textureLoader.load(unmaskedSrc, (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      unmaskedTexture = tex;
      if (uniformsRef.current) {
        uniformsRef.current.uTextureUnmasked.value = tex;
        uniformsRef.current.uLoadedUnmasked.value = 1.0;
      }
    });

    textureLoader.load(maskedSrc, (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      maskedTexture = tex;
      if (uniformsRef.current) {
        uniformsRef.current.uTextureMasked.value = tex;
        uniformsRef.current.uLoadedMasked.value = 1.0;
      }
    });

    // GLSL Shaders
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTextureUnmasked;
      uniform sampler2D uTextureMasked;
      uniform float uLoadedUnmasked;
      uniform float uLoadedMasked;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform float uHover;
      uniform float uMaskHover;
      varying vec2 vUv;

      const float PI = 3.14159265358979323846;

      void main() {
        vec2 uv = vUv;

        // Container aspect-ratio fit (contain mode: 900x1152 aspect)
        float textureAspect = 900.0 / 1152.0;
        float containerAspect = uResolution.x / uResolution.y;
        
        vec2 renderUv = uv;
        if (containerAspect > textureAspect) {
          // Wider than image: pillarbox
          float scale = textureAspect / containerAspect;
          renderUv.x = (uv.x - 0.5) / scale + 0.5;
        } else {
          // Taller than image: align bottom
          float scale = containerAspect / textureAspect;
          renderUv.y = uv.y / scale;
        }

        // Clip pixels outside the texture bounds
        if (renderUv.x < 0.0 || renderUv.x > 1.0 || renderUv.y < 0.0 || renderUv.y > 1.0) {
          discard;
        }

        // Fluid cursor ripple effect
        vec2 mouseUv = uMouse;
        float dist = distance(renderUv, mouseUv);
        float radius = 0.35;
        float strength = smoothstep(radius, 0.0, dist) * uHover;
        vec2 dir = renderUv - mouseUv;
        if (length(dir) > 0.0001) dir = normalize(dir);

        float ripple = sin(dist * 35.0 - uTime * 4.0) * 0.012 * strength;

        // Chromatic dispersion offsets
        float rOffset = 0.010 * strength + ripple;
        float gOffset = 0.003 * strength + ripple * 0.5;
        float bOffset = -0.008 * strength;

        vec2 rUv = clamp(renderUv + dir * rOffset, 0.0, 1.0);
        vec2 gUv = clamp(renderUv + dir * gOffset, 0.0, 1.0);
        vec2 bUv = clamp(renderUv + dir * bOffset, 0.0, 1.0);

        // Sample Unmasked texture
        vec4 colUnmasked = vec4(0.0);
        if (uLoadedUnmasked > 0.5) {
          float ur = texture2D(uTextureUnmasked, rUv).r;
          float ug = texture2D(uTextureUnmasked, gUv).g;
          float ub = texture2D(uTextureUnmasked, bUv).b;
          float ua = texture2D(uTextureUnmasked, renderUv).a;
          colUnmasked = vec4(ur, ug, ub, ua);
        }

        // Sample Masked texture
        vec4 colMasked = vec4(0.0);
        if (uLoadedMasked > 0.5) {
          float mr = texture2D(uTextureMasked, rUv).r;
          float mg = texture2D(uTextureMasked, gUv).g;
          float mb = texture2D(uTextureMasked, bUv).b;
          float ma = texture2D(uTextureMasked, renderUv).a;
          colMasked = vec4(mr, mg, mb, ma);
        }

        /* 
         * OFF+BRAND's Exact Sinusoidal Wave Transition Formula
         * from landonorris.com:
         * float hoverTransition = vUv.y + sin(vUv.x * PI) * sin(uHelmetHover * PI) * 0.2;
         */
        float hoverTransition = renderUv.y + sin(renderUv.x * PI) * sin(uMaskHover * PI) * 0.22;
        
        // Smoothstep threshold creates the flowing wave cutoff
        float maskFactor = smoothstep(1.0 - hoverTransition - 0.04, 1.0 - hoverTransition + 0.04, uMaskHover);

        // Electric Volt Lime (#D2FD52) wave seam highlight
        float seamDist = abs(hoverTransition - (1.0 - uMaskHover));
        float waveLaser = smoothstep(0.035, 0.0, seamDist) * sin(uMaskHover * PI) * 1.2;
        vec3 voltLime = vec3(0.824, 0.992, 0.322);

        // Blend unmasked and masked subject
        vec4 finalCol = mix(colUnmasked, colMasked, maskFactor);

        // Apply laser wave crest illumination
        if (finalCol.a > 0.05) {
          finalCol.rgb = mix(finalCol.rgb, voltLime, waveLaser * 0.85);
          
          // Subtle cursor proximity highlight
          float cursorGlow = pow(strength, 2.5) * 0.25;
          finalCol.rgb = mix(finalCol.rgb, voltLime, cursorGlow);
        }

        gl_FragColor = finalCol;
      }
    `;

    const uniforms = {
      uTextureUnmasked: { value: unmaskedTexture },
      uTextureMasked: { value: maskedTexture },
      uLoadedUnmasked: { value: 0.0 },
      uLoadedMasked: { value: 0.0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(width, height) },
      uTime: { value: 0.0 },
      uHover: { value: 0.0 },
      uMaskHover: { value: maskProgress },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let animationId;
    const clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (uniformsRef.current) {
        uniformsRef.current.uTime.value = elapsedTime;

        // Smooth cursor interpolation
        currentMouseRef.current.lerp(targetMouseRef.current, 0.08);
        uniformsRef.current.uMouse.value.copy(currentMouseRef.current);

        // Smooth mask progress interpolation
        const currentMask = uniformsRef.current.uMaskHover.value;
        uniformsRef.current.uMaskHover.value = THREE.MathUtils.lerp(
          currentMask,
          targetMaskRef.current,
          0.09
        );

        // Smooth hover transition
        const targetHover = isHovered ? 1.0 : 0.0;
        uniformsRef.current.uHover.value = THREE.MathUtils.lerp(
          uniformsRef.current.uHover.value,
          targetHover,
          0.06
        );
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      renderer.setSize(w, h);
      if (uniformsRef.current) {
        uniformsRef.current.uResolution.value.set(w, h);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      if (unmaskedTexture && unmaskedTexture !== fallbackTexture) unmaskedTexture.dispose();
      if (maskedTexture && maskedTexture !== fallbackTexture) maskedTexture.dispose();
      fallbackTexture.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [unmaskedSrc, maskedSrc]);

  return (
    <div
      ref={mountRef}
      onClick={onClick}
      className="absolute inset-0 w-full h-full cursor-pointer select-none"
      aria-label="Interactive Spider-Man Mask WebGL Canvas"
    />
  );
}
