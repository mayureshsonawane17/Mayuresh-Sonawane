import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * HeroShaderCanvas
 * Optional enhancement pass for the Cinematic Hero.
 * - Sinusoidal wave ripple at the seam edge
 * - Subtle depth displacement (zero on face via face-protect mask)
 * - Restrained chromatic aberration (<= 1.5px) along seam and hair silhouette only
 * - Electric volt seam laser glow (#D2FD52)
 * - Low-power heuristic & graceful fallback: renders pure DOM layers if disabled.
 */
export default function HeroShaderCanvas({
  reveal = 0.0,
  seamAngle = -12.0, // degrees
  mousePos = { x: 0.5, y: 0.5 },
  isHovered = false,
  enabled = true,
}) {
  const mountRef = useRef(null);
  const uniformsRef = useRef(null);
  const rendererRef = useRef(null);
  const targetRevealRef = useRef(reveal);
  const targetMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const currentMouseRef = useRef(new THREE.Vector2(0.5, 0.5));

  useEffect(() => {
    targetRevealRef.current = Math.max(0.0, Math.min(1.0, reveal));
  }, [reveal]);

  useEffect(() => {
    targetMouseRef.current.set(mousePos.x, 1.0 - mousePos.y);
  }, [mousePos]);

  useEffect(() => {
    // Low-power check
    const isLowPower =
      typeof navigator !== 'undefined' &&
      ((navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
        (navigator.deviceMemory && navigator.deviceMemory <= 4));

    if (!enabled || isLowPower) {
      if (isLowPower) {
        console.warn('HeroShaderCanvas: low-power device detected, WebGL enhancement bypassed in favor of pure DOM layers.');
      }
      return;
    }

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 800;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      renderer.setClearColor(0x000000, 0);
      rendererRef.current = renderer;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('HeroShaderCanvas WebGL fallback active: pure DOM/CSS rendering used.', e);
      return;
    }

    // Textures
    const textureLoader = new THREE.TextureLoader();
    const unmaskedTex = textureLoader.load('/assets/hero/hero-front.webp');
    const maskedTex = textureLoader.load('/assets/hero/hero-mask.webp');
    const depthTex = textureLoader.load('/assets/hero/hero-depth.webp');
    const faceProtectTex = textureLoader.load('/assets/hero/hero-face-protect.webp');

    [unmaskedTex, maskedTex, depthTex, faceProtectTex].forEach((t) => {
      t.minFilter = THREE.LinearFilter;
      t.magFilter = THREE.LinearFilter;
      t.generateMipmaps = false;
    });

    const angleRad = (seamAngle * Math.PI) / 180.0;

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
      uniform sampler2D uTextureDepth;
      uniform sampler2D uTextureFaceProtect;
      uniform float uReveal;
      uniform float uAngle;
      uniform vec2 uMouse;
      uniform vec2 uResolution;
      uniform float uTime;
      uniform float uHover;
      varying vec2 vUv;

      const float PI = 3.14159265358979323846;

      void main() {
        vec2 uv = vUv;

        // Container aspect-ratio fit (600x561 aspect)
        float textureAspect = 600.0 / 561.0;
        float containerAspect = uResolution.x / uResolution.y;
        
        vec2 renderUv = uv;
        if (containerAspect > textureAspect) {
          float scale = textureAspect / containerAspect;
          renderUv.x = (uv.x - 0.5) / scale + 0.5;
        } else {
          float scale = containerAspect / textureAspect;
          renderUv.y = uv.y / scale;
        }

        if (renderUv.x < 0.0 || renderUv.x > 1.0 || renderUv.y < 0.0 || renderUv.y > 1.0) {
          discard;
        }

        // At rest (uReveal < 0.02), render pure unmasked photo without any displacement or chromatic split
        if (uReveal < 0.02) {
          gl_FragColor = texture2D(uTextureUnmasked, renderUv);
          return;
        }

        // Sample face protection mask (1.0 = protect face from displacement & chroma)
        float faceProtect = texture2D(uTextureFaceProtect, renderUv).r;

        // Diagonal seam projection
        float cosA = cos(uAngle);
        float sinA = sin(uAngle);
        float proj = renderUv.x * cosA + (1.0 - renderUv.y) * sinA;
        float maxProj = cosA + abs(sinA);
        float normProj = proj / maxProj;
        float seamDist = normProj - uReveal;

        // Sub-pixel seam ripple (restrained to seam neighborhood outside face)
        float ripple = sin(renderUv.y * 35.0 - uTime * 4.0) * 0.003 * smoothstep(0.06, 0.0, abs(seamDist)) * (1.0 - faceProtect);

        // Sample depth map for subtle clothing edge displacement (zero on face)
        float depth = texture2D(uTextureDepth, renderUv).r * (1.0 - faceProtect);
        vec2 dispOffset = vec2(depth * 0.002, depth * 0.001) * uHover;

        // Chromatic split (strictly <= 1.5px, zero on face)
        float chromaDist = smoothstep(0.03, 0.0, abs(seamDist)) * (1.0 - faceProtect) * 0.0012;
        vec2 rUv = clamp(renderUv + dispOffset + vec2(chromaDist, 0.0), 0.0, 1.0);
        vec2 gUv = clamp(renderUv + dispOffset, 0.0, 1.0);
        vec2 bUv = clamp(renderUv + dispOffset - vec2(chromaDist, 0.0), 0.0, 1.0);

        // Sample Unmasked with chromatic split
        float ur = texture2D(uTextureUnmasked, rUv).r;
        float ug = texture2D(uTextureUnmasked, gUv).g;
        float ub = texture2D(uTextureUnmasked, bUv).b;
        float ua = texture2D(uTextureUnmasked, renderUv).a;
        vec4 colUnmasked = vec4(ur, ug, ub, ua);

        // Sample Masked with chromatic split
        float mr = texture2D(uTextureMasked, rUv).r;
        float mg = texture2D(uTextureMasked, gUv).g;
        float mb = texture2D(uTextureMasked, bUv).b;
        float ma = texture2D(uTextureMasked, renderUv).a;
        vec4 colMasked = vec4(mr, mg, mb, ma);

        // Seam transition cutoff (clean mix, NO color tinting on portrait pixels)
        float factor = smoothstep(-0.006, 0.006, seamDist + ripple);
        vec4 finalCol = mix(colMasked, colUnmasked, factor);

        gl_FragColor = finalCol;
      }
    `;

    const uniforms = {
      uTextureUnmasked: { value: unmaskedTex },
      uTextureMasked: { value: maskedTex },
      uTextureDepth: { value: depthTex },
      uTextureFaceProtect: { value: faceProtectTex },
      uReveal: { value: reveal },
      uAngle: { value: angleRad },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(width, height) },
      uTime: { value: 0.0 },
      uHover: { value: 0.0 },
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

    // IntersectionObserver to pause rendering when offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible || document.hidden) return;

      const elapsedTime = clock.getElapsedTime();

      if (uniformsRef.current) {
        uniformsRef.current.uTime.value = elapsedTime;

        // Smooth mouse
        currentMouseRef.current.lerp(targetMouseRef.current, 0.08);
        uniformsRef.current.uMouse.value.copy(currentMouseRef.current);

        // Smooth reveal
        const curReveal = uniformsRef.current.uReveal.value;
        uniformsRef.current.uReveal.value = THREE.MathUtils.lerp(
          curReveal,
          targetRevealRef.current,
          0.12
        );

        // Hover
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
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      unmaskedTex.dispose();
      maskedTex.dispose();
      depthTex.dispose();
      faceProtectTex.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [enabled, seamAngle]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-10"
      aria-hidden="true"
    />
  );
}
