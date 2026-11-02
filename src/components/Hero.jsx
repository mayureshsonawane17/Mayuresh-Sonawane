import React, { useRef, useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroShaderCanvas from './HeroShaderCanvas';
import { personalInfo } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero Component — Cinematic Opening Experience
 * Repairs applied:
 * 1. Fitted typography: "MAYURESH" & "SONAWANE" dynamically sized to container width.
 * 2. Strictly zero text touching the face: "SONAWANE" starts below --chin-y.
 * 3. Left copy column rendered once with solid charcoal text, zero duplication.
 * 4. High-fidelity lossless alpha portrait cutout without blotchiness or hard edges.
 * 5. Mask state without green blend modes or muddy filters.
 * 6. Seam hidden at rest (reveal < 0.02) with sub-pixel SVG line registration.
 * 7. Non-wrapping navigation items and responsive layout.
 */
export default function Hero({ onExploreClick }) {
  const heroRef = useRef(null);
  const stageRef = useRef(null);
  const daylightRef = useRef(null);
  const nightRef = useRef(null);
  const backNameTextDayRef = useRef(null);
  const frontNameTextDayRef = useRef(null);
  const backNameTextNightRef = useRef(null);
  const frontNameTextNightRef = useRef(null);
  const backNameBoxRef = useRef(null);
  const frontNameBoxRef = useRef(null);
  const portraitStageRef = useRef(null);
  const copyColumnRef = useRef(null);
  const cursorFollowerRef = useRef(null);

  // Interaction State (0.0 = Unmasked, 1.0 = Masked)
  const [reveal, setReveal] = useState(0.0);
  const [isOverPortrait, setIsOverPortrait] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [webglEnabled, setWebglEnabled] = useState(true);

  // QuickTo references for spring-like smooth cursor tracking
  const quickRevealRef = useRef(null);
  const quickParallaxBackRef = useRef(null);
  const quickParallaxFrontRef = useRef(null);
  const quickParallaxPortraitXRef = useRef(null);
  const quickParallaxPortraitYRef = useRef(null);
  const quickCursorXRef = useRef(null);
  const quickCursorYRef = useRef(null);
  const masterTimelineRef = useRef(null);
  const idleTimerRef = useRef(null);
  const isIntroCompleteRef = useRef(false);

  // Detect touch capability
  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Update CSS custom property --reveal and --seam-angle
  const updateSeamCss = useCallback((value) => {
    const clamped = Math.max(0.0, Math.min(1.0, value));
    setReveal(clamped);
    if (heroRef.current) {
      heroRef.current.style.setProperty('--reveal', clamped.toString());
      heroRef.current.style.setProperty('--seam-angle', '-12deg');
    }
  }, []);

  // Expose for testing & accessibility
  useEffect(() => {
    window.__setHeroReveal = (val) => {
      if (masterTimelineRef.current) {
        masterTimelineRef.current.kill();
      }
      isIntroCompleteRef.current = true;
      updateSeamCss(val);
    };
    return () => {
      delete window.__setHeroReveal;
    };
  }, [updateSeamCss]);

  // FitText implementation: dynamically size MAYURESH and SONAWANE to fit their allocated width
  const updateFitText = useCallback(() => {
    if (!stageRef.current) return;
    const stageWidth = stageRef.current.clientWidth;
    if (!stageWidth) return;

    // Back name: MAYURESH targets ~90vw (0.90 of stage width)
    const targetBackWidth = stageWidth * 0.90;
    if (backNameTextDayRef.current) {
      backNameTextDayRef.current.style.fontSize = '100px';
      const wDay = backNameTextDayRef.current.offsetWidth || 1;
      const sizeDay = Math.floor((targetBackWidth / wDay) * 100);
      backNameTextDayRef.current.style.fontSize = `${sizeDay}px`;
      if (backNameTextNightRef.current) {
        backNameTextNightRef.current.style.fontSize = `${sizeDay}px`;
      }
    }

    // Front name: SONAWANE targets ~52-58vw, right-aligned
    const frontRatio = stageWidth < 1024 ? 0.50 : 0.58;
    const targetFrontWidth = stageWidth * frontRatio;
    if (frontNameTextDayRef.current) {
      frontNameTextDayRef.current.style.fontSize = '100px';
      const wFront = frontNameTextDayRef.current.offsetWidth || 1;
      const sizeFront = Math.floor((targetFrontWidth / wFront) * 100);
      frontNameTextDayRef.current.style.fontSize = `${sizeFront}px`;
      if (frontNameTextNightRef.current) {
        frontNameTextNightRef.current.style.fontSize = `${sizeFront}px`;
      }
    }
  }, []);

  useLayoutEffect(() => {
    updateFitText();
    window.addEventListener('resize', updateFitText);
    return () => window.removeEventListener('resize', updateFitText);
  }, [updateFitText]);

  // Initialize GSAP QuickTo setters
  useEffect(() => {
    const proxy = { reveal: 0 };
    quickRevealRef.current = gsap.quickTo(proxy, 'reveal', {
      duration: 0.55,
      ease: 'power2.out',
      onUpdate: () => {
        updateSeamCss(proxy.reveal);
      },
    });

    if (backNameBoxRef.current) {
      quickParallaxBackRef.current = gsap.quickTo(
        backNameBoxRef.current,
        'x',
        { duration: 0.8, ease: 'power2.out' }
      );
    }

    if (frontNameBoxRef.current) {
      quickParallaxFrontRef.current = gsap.quickTo(
        frontNameBoxRef.current,
        'x',
        { duration: 0.8, ease: 'power2.out' }
      );
    }

    if (portraitStageRef.current) {
      quickParallaxPortraitXRef.current = gsap.quickTo(portraitStageRef.current, 'x', {
        duration: 0.8,
        ease: 'power2.out',
      });
      quickParallaxPortraitYRef.current = gsap.quickTo(portraitStageRef.current, 'y', {
        duration: 0.8,
        ease: 'power2.out',
      });
    }

    if (cursorFollowerRef.current) {
      quickCursorXRef.current = gsap.quickTo(cursorFollowerRef.current, 'x', {
        duration: 0.2,
        ease: 'power3.out',
      });
      quickCursorYRef.current = gsap.quickTo(cursorFollowerRef.current, 'y', {
        duration: 0.2,
        ease: 'power3.out',
      });
    }
  }, [updateSeamCss]);

  // Pointer move handler (Desktop parallax & capped reveal mapping)
  const handlePointerMove = (e) => {
    if (!isIntroCompleteRef.current) return;
    if (isTouchDevice) return;

    if (!hasInteracted) setHasInteracted(true);

    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;

    const normX = (e.clientX - rect.left) / rect.width;
    const normY = (e.clientY - rect.top) / rect.height;
    setMousePos({ x: normX, y: normY });

    if (quickCursorXRef.current && quickCursorYRef.current) {
      quickCursorXRef.current(e.clientX);
      quickCursorYRef.current(e.clientY);
    }

    const dx = normX - 0.5;
    const dy = normY - 0.5;

    if (quickParallaxBackRef.current) quickParallaxBackRef.current(dx * -12);
    if (quickParallaxFrontRef.current) quickParallaxFrontRef.current(dx * 18);
    if (quickParallaxPortraitXRef.current) quickParallaxPortraitXRef.current(dx * 6);
    if (quickParallaxPortraitYRef.current) quickParallaxPortraitYRef.current(dy * 4);

    // Subtle 3D tilt on portrait
    if (portraitStageRef.current) {
      gsap.to(portraitStageRef.current, {
        rotationY: dx * 2.5,
        rotationX: -dy * 1.5,
        duration: 0.8,
        ease: 'power2.out',
      });
    }

    // Mask interaction: right side of stage maps reveal to [0, 0.52]
    // Capped so seam never reaches or covers the left copy column
    if (normX > 0.46) {
      const mappedReveal = Math.min(0.52, (normX - 0.46) / 0.54);
      if (quickRevealRef.current) quickRevealRef.current(mappedReveal);
    } else {
      if (quickRevealRef.current) quickRevealRef.current(0.0);
    }

    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (quickRevealRef.current) quickRevealRef.current(0.0);
    }, 1500);
  };

  const handlePointerLeave = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (quickRevealRef.current) quickRevealRef.current(0.0);
    setIsOverPortrait(false);
  };

  // Keyboard navigation & accessibility handlers
  const handleKeyDown = (e) => {
    if (!hasInteracted) setHasInteracted(true);
    let newReveal = reveal;

    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      newReveal = Math.min(0.52, reveal + 0.1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      newReveal = Math.max(0.0, reveal - 0.1);
    } else if (e.key === 'Home' || e.key === 'Escape') {
      e.preventDefault();
      newReveal = 0.0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newReveal = 0.52;
    }

    if (quickRevealRef.current) quickRevealRef.current(newReveal);
  };

  // Touch Drag Support
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchStartRevealRef = useRef(0);
  const isHorizontalGestureRef = useRef(false);

  const handleTouchStart = (e) => {
    if (!hasInteracted) setHasInteracted(true);
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
    touchStartRevealRef.current = reveal;
    isHorizontalGestureRef.current = false;
  };

  const handleTouchMove = (e) => {
    const diffX = e.touches[0].clientX - touchStartXRef.current;
    const diffY = e.touches[0].clientY - touchStartYRef.current;

    if (!isHorizontalGestureRef.current && Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 8) {
      isHorizontalGestureRef.current = true;
    }

    if (isHorizontalGestureRef.current) {
      const delta = -diffX / window.innerWidth;
      const targetVal = Math.max(0.0, Math.min(0.52, touchStartRevealRef.current + delta));
      updateSeamCss(targetVal);
    }
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      if (quickRevealRef.current) quickRevealRef.current(0.0);
    }, 1200);
  };

  // Master GSAP Intro Timeline & ScrollTrigger
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      updateSeamCss(0.0);
      isIntroCompleteRef.current = true;
      return;
    }

    const ctx = gsap.context(() => {
      const master = gsap.timeline({
        onComplete: () => {
          isIntroCompleteRef.current = true;
        },
      });
      masterTimelineRef.current = master;

      // 0.00 - 0.50: Hairlines
      master.fromTo(
        '.hero-hairline',
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, duration: 0.5, ease: 'expo.out', stagger: 0.06 }
      );

      // 0.15 - 1.00: "MAYURESH" letters rise
      master.fromTo(
        '.back-name-char',
        { yPercent: 110 },
        { yPercent: 0, duration: 0.85, ease: 'expo.out', stagger: 0.04 },
        0.15
      );

      // 0.50 - 1.60: Portrait reveal
      master.fromTo(
        '.portrait-unmasked-layer',
        { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08, filter: 'brightness(0.7) blur(4px)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1.0,
          filter: 'brightness(1) blur(0px)',
          duration: 1.1,
          ease: 'power3.inOut',
        },
        0.5
      );

      // 0.90 - 1.70: "SONAWANE" rises in front of torso
      master.fromTo(
        '.front-name-char',
        { yPercent: 110 },
        { yPercent: 0, duration: 0.85, ease: 'expo.out', stagger: 0.035 },
        0.9
      );

      // 1.20 - 1.90: Editorial Copy line-by-line reveal
      master.fromTo(
        '.copy-reveal-line',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.08 },
        1.2
      );

      // 1.80 - 2.50: Seam Peek (0 -> 0.28 -> 0)
      master.to(
        { val: 0.0 },
        {
          val: 0.28,
          duration: 0.4,
          ease: 'power2.inOut',
          onUpdate: function () {
            updateSeamCss(this.targets()[0].val);
          },
        },
        1.8
      );
      master.to(
        { val: 0.28 },
        {
          val: 0.0,
          duration: 0.4,
          ease: 'power2.out',
          onUpdate: function () {
            updateSeamCss(this.targets()[0].val);
          },
        },
        2.2
      );

      // Scroll-Linked Hero Exit Sweep (NO pinning)
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          if (!isIntroCompleteRef.current) return;
          const pScroll = self.progress;
          if (portraitStageRef.current) {
            gsap.set(portraitStageRef.current, { yPercent: -10 * pScroll });
          }
          if (backNameBoxRef.current) {
            gsap.set(backNameBoxRef.current, { xPercent: -5 * pScroll });
          }
          if (frontNameBoxRef.current) {
            gsap.set(frontNameBoxRef.current, { xPercent: 5 * pScroll });
          }
          if (pScroll > 0.08) {
            const exitReveal = Math.min(0.52, (pScroll - 0.08) / 0.82);
            updateSeamCss(exitReveal);
          }
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, [updateSeamCss]);

  // Seam clip-path calculation for the Night/Masked layer stack
  // Diagonal cut: Angle -12deg across height
  // When reveal = 0, polygon is completely 0 width (outside viewport)
  const angleOffset = 14;
  const p = reveal;
  const topEdge = Math.max(0, Math.min(100, p * 115 + angleOffset));
  const bottomEdge = Math.max(0, Math.min(100, p * 115 - angleOffset));

  const nightClipStyle = {
    clipPath: reveal < 0.01 ? 'polygon(0 0, 0 0, 0 0, 0 0)' : `polygon(0% 0%, ${topEdge}% 0%, ${bottomEdge}% 100%, 0% 100%)`,
    WebkitClipPath: reveal < 0.01 ? 'polygon(0 0, 0 0, 0 0, 0 0)' : `polygon(0% 0%, ${topEdge}% 0%, ${bottomEdge}% 100%, 0% 100%)`,
    opacity: reveal < 0.01 ? 0 : 1,
    visibility: reveal < 0.01 ? 'hidden' : 'visible',
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-label="Reveal the Spider-Man mask"
      aria-valuemin={0}
      aria-valuemax={52}
      aria-valuenow={Math.round(reveal * 100)}
      className="relative min-h-[100svh] h-[100svh] w-full pt-16 overflow-hidden select-none outline-none focus-visible:ring-2 focus-visible:ring-volt touch-pan-y"
      style={{
        '--reveal': reveal.toString(),
        '--seam-angle': '-12deg',
        '--chin-y': '52%',
        backgroundColor: '#EDEAE2',
      }}
    >
      {/* Hero Stage Sized to 100svh minus Nav Height */}
      <div
        ref={stageRef}
        className="relative w-full h-[calc(100svh-64px)] overflow-hidden"
      >
        {/* =========================================================================
            WORLD 1: DAYLIGHT (UNMASKED) — Editorial Off-White Palette
            ========================================================================= */}
        <div
          ref={daylightRef}
          className="absolute inset-0 w-full h-full bg-[#EDEAE2] overflow-hidden"
        >
          {/* Subtle radial vignette */}
          <div className="absolute inset-0 bg-radial from-transparent via-black/[0.01] to-black/[0.04] pointer-events-none" />

          {/* 12-Column Hairline Grid */}
          <div className="absolute inset-0 pointer-events-none max-w-[1720px] mx-auto px-4 sm:px-8 grid grid-cols-12 gap-4">
            <div className="hero-hairline col-span-1 border-r border-[#121212]/[0.08] h-full" />
            <div className="hero-hairline hidden md:block col-span-5 border-r border-[#121212]/[0.05] h-full" />
            <div className="hero-hairline hidden lg:block col-span-5 border-r border-[#121212]/[0.05] h-full" />
            <div className="hero-hairline col-span-1 border-r border-[#121212]/[0.08] h-full" />
          </div>

          {/* Ambient rim glow behind head */}
          <div className="hero-rim-glow absolute top-[28%] left-[60%] -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-radial from-volt/15 via-volt/5 to-transparent rounded-full filter blur-3xl pointer-events-none" />

          {/* Back Name Layer: "MAYURESH" (Band behind head, Y: 18% to 42% of stage) */}
          <div
            ref={backNameBoxRef}
            className="absolute top-[20%] sm:top-[18%] left-0 right-0 w-full flex items-center justify-center pointer-events-none z-0"
          >
            <div className="overflow-hidden leading-none select-none text-center">
              <span
                ref={backNameTextDayRef}
                className="font-display font-black tracking-tighter text-[#121212] uppercase inline-block whitespace-nowrap"
              >
                {'MAYURESH'.split('').map((char, i) => (
                  <span key={i} className="back-name-char inline-block">
                    {char}
                  </span>
                ))}
              </span>
            </div>
          </div>

          {/* Primary Portrait Stage (Unmasked) — Anchored strictly to bottom: 0 */}
          <div
            ref={portraitStageRef}
            onMouseEnter={() => setIsOverPortrait(true)}
            onMouseLeave={() => setIsOverPortrait(false)}
            className="absolute bottom-0 left-[54%] sm:left-[58%] lg:left-[60%] -translate-x-1/2 w-full max-w-[560px] sm:max-w-[680px] lg:max-w-[760px] h-[78%] sm:h-[84%] lg:h-[90%] flex items-end justify-center pointer-events-auto z-10"
          >
            <picture className="portrait-unmasked-layer relative w-full h-full block">
              <source
                type="image/webp"
                srcSet="/assets/hero/hero-front-640.webp 640w, /assets/hero/hero-front-960.webp 960w, /assets/hero/hero-front-1440.webp 1440w, /assets/hero/hero-front.webp 1600w"
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 65vw, 760px"
              />
              <img
                src="/assets/hero/hero-front.webp"
                alt="Portrait of Mayuresh Sonawane"
                fetchpriority="high"
                loading="eager"
                className="w-full h-full object-contain object-bottom pointer-events-none select-none"
              />
            </picture>

            {/* Optional WebGL Shader Enhancement Layer */}
            {webglEnabled && (
              <HeroShaderCanvas
                reveal={reveal}
                seamAngle={-12.0}
                mousePos={mousePos}
                isHovered={isOverPortrait}
                enabled={webglEnabled}
              />
            )}
          </div>

          {/* Front Name Layer: "SONAWANE" (Right-aligned, strictly BELOW chin line, starting at X ~ 36vw) */}
          <div
            ref={frontNameBoxRef}
            className="absolute bottom-[32%] sm:bottom-[5%] right-[2vw] sm:right-[3vw] max-w-[52vw] lg:max-w-[58vw] flex items-center justify-end pointer-events-none z-20"
          >
            <div className="overflow-hidden leading-none select-none text-right">
              <span
                ref={frontNameTextDayRef}
                className="font-display font-black tracking-tightest text-[#121212] uppercase inline-block whitespace-nowrap"
              >
                {'SONAWANE'.split('').map((char, i) => (
                  <span key={i} className="front-name-char inline-block">
                    {char}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            WORLD 2: NIGHT / MASKED — Clipped by the diagonal seam polygon
            Only duplicates the name layers (inverted to off-white) & Spider-Man portrait.
            The copy column is NOT duplicated here so there is zero overlap.
            ========================================================================= */}
        <div
          ref={nightRef}
          style={nightClipStyle}
          className="absolute inset-0 w-full h-full bg-[#121212] overflow-hidden pointer-events-none z-20 transition-opacity duration-150"
          aria-hidden="true"
        >
          {/* Hairlines grid */}
          <div className="absolute inset-0 max-w-[1720px] mx-auto px-4 sm:px-8 grid grid-cols-12 gap-4">
            <div className="col-span-1 border-r border-volt/10 h-full" />
            <div className="hidden md:block col-span-5 border-r border-volt/5 h-full" />
            <div className="hidden lg:block col-span-5 border-r border-volt/5 h-full" />
            <div className="col-span-1 border-r border-volt/10 h-full" />
          </div>

          {/* Back Name Layer in Off-White (Night) */}
          <div className="absolute top-[20%] sm:top-[18%] left-0 right-0 w-full flex items-center justify-center leading-none select-none z-0">
            <span
              ref={backNameTextNightRef}
              className="font-display font-black tracking-tighter text-[#EDEAE2]/90 uppercase whitespace-nowrap"
            >
              MAYURESH
            </span>
          </div>

          {/* Secondary Portrait Cutout B (Spider-Man Mask) Registered exactly on A */}
          <div className="absolute bottom-0 left-[54%] sm:left-[58%] lg:left-[60%] -translate-x-1/2 w-full max-w-[560px] sm:max-w-[680px] lg:max-w-[760px] h-[78%] sm:h-[84%] lg:h-[90%] flex items-end justify-center z-10">
            <picture className="relative w-full h-full block">
              <source
                type="image/webp"
                srcSet="/assets/hero/hero-mask-640.webp 640w, /assets/hero/hero-mask-960.webp 960w, /assets/hero/hero-mask-1440.webp 1440w, /assets/hero/hero-mask.webp 1600w"
                sizes="(max-width: 768px) 90vw, (max-width: 1280px) 65vw, 760px"
              />
              <img
                src="/assets/hero/hero-mask.webp"
                alt="Mayuresh Sonawane wearing Spider-Man mask"
                className="w-full h-full object-contain object-bottom pointer-events-none select-none"
              />
            </picture>
          </div>

          {/* Front Name Layer in Off-White (Night) */}
          <div className="absolute bottom-[32%] sm:bottom-[5%] right-[2vw] sm:right-[3vw] max-w-[52vw] lg:max-w-[58vw] flex items-center justify-end leading-none select-none z-20">
            <span
              ref={frontNameTextNightRef}
              className="font-display font-black tracking-tightest text-[#EDEAE2] uppercase whitespace-nowrap"
            >
              SONAWANE
            </span>
          </div>
        </div>

        {/* =========================================================================
            LEFT COLUMN EDITORIAL NARRATIVE (Solid Charcoal, Single Instance, Z-30)
            X spans 4vw to 32vw. Never covered by seam or overlapped by front name.
            ========================================================================= */}
        <div
          ref={copyColumnRef}
          className="absolute bottom-6 sm:bottom-10 left-4 sm:left-8 lg:left-12 z-30 max-w-[380px] lg:max-w-[420px] flex flex-col items-start gap-3.5 pointer-events-auto"
        >
          {/* Label Pill */}
          <div className="copy-reveal-line inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212]/[0.06] border border-[#121212]/[0.1] font-mono text-[10px] sm:text-[11px] text-[#121212] uppercase tracking-widest font-semibold">
            <span className="w-2 h-2 rounded-full bg-volt" />
            <span>{personalInfo.title}</span>
          </div>

          {/* Headline (Normal Solid Charcoal Text, 3 lines max) */}
          <h1 className="copy-reveal-line font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl leading-[1.05] text-[#121212] tracking-tight uppercase">
            "{personalInfo.heroHeadline}"
          </h1>

          {/* Support Paragraph (16-18px, max-width 36ch) */}
          <p className="copy-reveal-line font-body text-xs sm:text-[15px] text-[#121212]/80 leading-relaxed max-w-[36ch]">
            {personalInfo.supportingDescription}
          </p>

          {/* Action CTAs (Lime fill, charcoal text) */}
          <div className="copy-reveal-line flex items-center gap-3 pt-1">
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-volt text-[#121212] font-mono text-xs uppercase tracking-wider font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all"
            >
              <span>EXPLORE BUILDS</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => {
                if (!hasInteracted) setHasInteracted(true);
                const nextVal = reveal > 0.25 ? 0.0 : 0.52;
                if (quickRevealRef.current) quickRevealRef.current(nextVal);
              }}
              aria-pressed={reveal > 0.25}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-sm bg-[#121212]/[0.08] hover:bg-[#121212]/[0.14] text-[#121212] font-mono text-xs uppercase tracking-wider font-semibold transition-all border border-[#121212]/[0.1]"
              title="Toggle Spider-Man mask state"
            >
              <Sparkles className="w-3 h-3 text-volt-deep" />
              <span>{reveal > 0.25 ? 'UNMASK' : 'MASK'}</span>
            </button>
          </div>
        </div>

        {/* Scroll cue & interaction hint (Bottom-Right) */}
        <div className="absolute bottom-6 right-6 sm:right-8 z-30 flex flex-col items-end gap-1.5 text-right pointer-events-none">
          {!hasInteracted && (
            <span className="font-mono text-[9px] text-[#121212]/60 uppercase tracking-widest animate-pulse">
              {isTouchDevice ? 'DRAG TO MEET THE MASK' : 'MOVE TO MEET THE MASK'}
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#121212]/70 uppercase tracking-wider font-semibold">
              SCROLL
            </span>
            <div className="w-[1.5px] h-5 bg-volt animate-bounce" />
          </div>
        </div>

        {/* =========================================================================
            THE SEAM: 1.5px Electric Lime Edge with Glow & Tick Marks
            Mathematically aligned to topEdge and bottomEdge coordinates.
            Completely hidden at rest (reveal < 0.02).
            ========================================================================= */}
        {reveal >= 0.02 && (
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible"
            style={{
              opacity: reveal >= 0.02 ? 1 : 0,
              visibility: reveal >= 0.02 ? 'visible' : 'hidden',
            }}
          >
            <line
              x1={`${topEdge}%`}
              y1="0%"
              x2={`${bottomEdge}%`}
              y2="100%"
              stroke="#D2FD52"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="filter drop-shadow-[0_0_8px_#D2FD52]"
            />
            {/* Top tick mark */}
            <line
              x1={`${topEdge - 0.8}%`}
              y1="16"
              x2={`${topEdge + 0.8}%`}
              y2="16"
              stroke="#D2FD52"
              strokeWidth="2"
            />
            {/* Bottom tick mark */}
            <line
              x1={`${bottomEdge - 0.8}%`}
              y1="calc(100% - 16px)"
              x2={`${bottomEdge + 0.8}%`}
              y2="calc(100% - 16px)"
              stroke="#D2FD52"
              strokeWidth="2"
            />
          </svg>
        )}

        {/* CUSTOM CURSOR FOLLOWER */}
        {!isTouchDevice && (
          <div
            ref={cursorFollowerRef}
            className={`fixed pointer-events-none z-50 rounded-full border border-volt transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center font-mono text-[9px] uppercase tracking-wider ${
              isOverPortrait
                ? 'w-16 h-16 bg-volt/20 backdrop-blur-xs text-charcoal font-bold shadow-lg'
                : 'w-3 h-3 bg-volt'
            }`}
          >
            {isOverPortrait && <span>MASK</span>}
          </div>
        )}
      </div>
    </section>
  );
}
