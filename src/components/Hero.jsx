import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ArrowDown, Sparkles, Layers, ArrowUpRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroShaderCanvas from './HeroShaderCanvas';
import { personalInfo } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero Component — Cinematic Opening Experience
 * Concept: "Two States, One Portrait"
 * - Editorial daylight world (unmasked, off-white) & charcoal night world (masked)
 * - Single source of truth: reveal (0.0 to 1.0) and seam angle (-12deg)
 * - Asymmetric portrait (~58-62% horizontal anchor), bleed off bottom
 * - Split typography: "MAYURESH" behind head, "SONAWANE" in front below chin line
 * - GSAP Master Intro Timeline (~3.2s) with seam peek
 * - Responsive 12-column hairline grid, cursor follower, keyboard accessibility
 */
export default function Hero({ onExploreClick }) {
  const heroRef = useRef(null);
  const daylightRef = useRef(null);
  const nightRef = useRef(null);
  const seamLineRef = useRef(null);
  const backNameDayRef = useRef(null);
  const frontNameDayRef = useRef(null);
  const backNameNightRef = useRef(null);
  const frontNameNightRef = useRef(null);
  const portraitStageRef = useRef(null);
  const copyColumnRef = useRef(null);
  const cursorFollowerRef = useRef(null);

  // Interaction & Seam State (0.0 = Unmasked, 1.0 = Masked)
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

  // Initialize GSAP QuickTo setters
  useEffect(() => {
    const proxy = { reveal: 0 };
    quickRevealRef.current = gsap.quickTo(proxy, 'reveal', {
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => {
        updateSeamCss(proxy.reveal);
      },
    });

    if (backNameDayRef.current) {
      quickParallaxBackRef.current = gsap.quickTo(
        [backNameDayRef.current, backNameNightRef.current],
        'x',
        { duration: 0.8, ease: 'power2.out' }
      );
    }

    if (frontNameDayRef.current) {
      quickParallaxFrontRef.current = gsap.quickTo(
        [frontNameDayRef.current, frontNameNightRef.current],
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
        duration: 0.25,
        ease: 'power3.out',
      });
      quickCursorYRef.current = gsap.quickTo(cursorFollowerRef.current, 'y', {
        duration: 0.25,
        ease: 'power3.out',
      });
    }
  }, [updateSeamCss]);

  // Pointer move handler (Desktop parallax & reveal mapping)
  const handlePointerMove = (e) => {
    if (!isIntroCompleteRef.current) return;
    if (isTouchDevice) return;

    if (!hasInteracted) setHasInteracted(true);

    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;

    const normX = (e.clientX - rect.left) / rect.width;
    const normY = (e.clientY - rect.top) / rect.height;
    setMousePos({ x: normX, y: normY });

    // Update cursor follower position
    if (quickCursorXRef.current && quickCursorYRef.current) {
      quickCursorXRef.current(e.clientX);
      quickCursorYRef.current(e.clientY);
    }

    // Parallax displacement
    const dx = normX - 0.5;
    const dy = normY - 0.5;

    if (quickParallaxBackRef.current) quickParallaxBackRef.current(dx * -14);
    if (quickParallaxFrontRef.current) quickParallaxFrontRef.current(dx * 22);
    if (quickParallaxPortraitXRef.current) quickParallaxPortraitXRef.current(dx * 8);
    if (quickParallaxPortraitYRef.current) quickParallaxPortraitYRef.current(dy * 6);

    // Subtle 3D tilt on portrait stage
    if (portraitStageRef.current) {
      gsap.to(portraitStageRef.current, {
        rotationY: dx * 3,
        rotationX: -dy * 2,
        duration: 0.8,
        ease: 'power2.out',
      });
    }

    // Mask interaction: right half of viewport triggers seam reveal (0 to ~0.55)
    if (normX > 0.48) {
      const mappedReveal = Math.min(0.55, (normX - 0.48) / 0.52);
      if (quickRevealRef.current) quickRevealRef.current(mappedReveal);
    } else {
      if (quickRevealRef.current) quickRevealRef.current(0.0);
    }

    // Idle timer reset: springs back to 0 after 1.5s idle
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
      newReveal = Math.min(1.0, reveal + 0.1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      newReveal = Math.max(0.0, reveal - 0.1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      newReveal = 0.0;
    } else if (e.key === 'End') {
      e.preventDefault();
      newReveal = 1.0;
    } else if (e.key === 'Escape') {
      e.preventDefault();
      newReveal = 0.0;
    }

    if (quickRevealRef.current) quickRevealRef.current(newReveal);
  };

  // Touch Drag Support (horizontal swipe with touch-action: pan-y)
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

    // Check if gesture is primarily horizontal
    if (!isHorizontalGestureRef.current && Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 8) {
      isHorizontalGestureRef.current = true;
    }

    if (isHorizontalGestureRef.current) {
      const delta = -diffX / window.innerWidth;
      const targetVal = Math.max(0.0, Math.min(1.0, touchStartRevealRef.current + delta));
      updateSeamCss(targetVal);
    }
  };

  const handleTouchEnd = () => {
    // Spring back to 0 after 1.2s
    setTimeout(() => {
      if (quickRevealRef.current) quickRevealRef.current(0.0);
    }, 1200);
  };

  // Master GSAP Intro Timeline & ScrollTrigger Setup
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

      // 0.00 - 0.60: Hairlines grid draw in
      master.fromTo(
        '.hero-hairline',
        { scaleY: 0, transformOrigin: 'top center' },
        { scaleY: 1, duration: 0.6, ease: 'expo.out', stagger: 0.08 }
      );

      // 0.20 - 1.30: "MAYURESH" letters rise from line masks
      master.fromTo(
        '.back-name-char',
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.045 },
        0.2
      );

      // 0.60 - 1.90: Portrait A reveal (clipPath, scale, brightness)
      master.fromTo(
        '.portrait-unmasked-layer',
        { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.12, filter: 'brightness(0.65) blur(6px)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          scale: 1.0,
          filter: 'brightness(1) blur(0px)',
          duration: 1.3,
          ease: 'power4.inOut',
        },
        0.6
      );

      // 1.10 - 2.00: "SONAWANE" rises in front of torso
      master.fromTo(
        '.front-name-char',
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.04 },
        1.1
      );

      // 1.40: Lime rim light fade-in
      master.fromTo(
        '.hero-rim-glow',
        { opacity: 0 },
        { opacity: 0.6, duration: 0.5, ease: 'power2.out' },
        1.4
      );

      // 1.60 - 2.40: Editorial Copy line-by-line reveal
      master.fromTo(
        '.copy-reveal-line',
        { y: 25, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1 },
        1.6
      );

      // 1.60 - 2.30: Navigation entrance
      master.fromTo(
        '.nav-item',
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.06 },
        1.6
      );
      master.fromTo(
        '.nav-hairline',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: 'expo.out' },
        1.8
      );

      // 2.10 - 3.00: Seam Peek (0 -> 0.3 -> 0) to tease the Spider-Man mask
      master.to(
        { val: 0.0 },
        {
          val: 0.32,
          duration: 0.45,
          ease: 'power2.inOut',
          onUpdate: function () {
            updateSeamCss(this.targets()[0].val);
          },
        },
        2.1
      );
      master.to(
        { val: 0.32 },
        {
          val: 0.0,
          duration: 0.45,
          ease: 'power2.out',
          onUpdate: function () {
            updateSeamCss(this.targets()[0].val);
          },
        },
        2.55
      );

      // Section 6: Scroll-Linked Hero Exit Sweep (NO pinning, NO scroll hijack)
      ScrollTrigger.create({
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          if (!isIntroCompleteRef.current) return;
          const p = self.progress;

          // Portrait translates slower than page
          gsap.set(portraitStageRef.current, { yPercent: -12 * p });

          // Names drift apart horizontally
          gsap.set([backNameDayRef.current, backNameNightRef.current], { xPercent: -6 * p });
          gsap.set([frontNameDayRef.current, frontNameNightRef.current], { xPercent: 6 * p });

          // Seam sweeps 0 to 1 across the exit
          if (p > 0.05) {
            const exitReveal = Math.min(1.0, (p - 0.05) / 0.85);
            updateSeamCss(exitReveal);
          }
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, [updateSeamCss]);

  // Seam clip-path calculation for the Night/Masked layer stack
  // Angle: -12deg. Polygon coordinates across viewport:
  const p = reveal;
  const angleOffset = 14; // percentage slope across height
  const topEdge = Math.max(0, Math.min(140, p * 128 + angleOffset));
  const bottomEdge = Math.max(-40, Math.min(100, p * 128 - angleOffset));

  const nightClipStyle = {
    clipPath: `polygon(0% 0%, ${topEdge}% 0%, ${bottomEdge}% 100%, 0% 100%)`,
    WebkitClipPath: `polygon(0% 0%, ${topEdge}% 0%, ${bottomEdge}% 100%, 0% 100%)`,
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
      aria-valuemax={100}
      aria-valuenow={Math.round(reveal * 100)}
      className="relative min-h-[100svh] h-[100svh] w-full overflow-hidden select-none outline-none focus-visible:ring-2 focus-visible:ring-volt touch-pan-y"
      style={{
        '--reveal': reveal.toString(),
        '--seam-angle': '-12deg',
        backgroundColor: '#EDEAE2',
      }}
    >
      {/* =========================================================================
          WORLD 1: DAYLIGHT (UNMASKED) — Editorial Off-White Palette
          ========================================================================= */}
      <div
        ref={daylightRef}
        className="absolute inset-0 w-full h-full bg-[#EDEAE2] overflow-hidden"
      >
        {/* Film grain & subtle radial vignette */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/[0.02] to-black/[0.06] pointer-events-none" />

        {/* 12-Column Technical Hairline Grid */}
        <div className="absolute inset-0 pointer-events-none max-w-[1720px] mx-auto px-4 sm:px-8 grid grid-cols-12 gap-4">
          <div className="hero-hairline col-span-1 border-r border-[#121212]/[0.08] h-full" />
          <div className="hero-hairline hidden md:block col-span-5 border-r border-[#121212]/[0.05] h-full" />
          <div className="hero-hairline hidden lg:block col-span-5 border-r border-[#121212]/[0.05] h-full" />
          <div className="hero-hairline col-span-1 border-r border-[#121212]/[0.08] h-full" />
        </div>

        {/* Slow drifting lime ambient glow behind head */}
        <div className="hero-rim-glow absolute top-[28%] left-[58%] -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-radial from-volt/15 via-volt/5 to-transparent rounded-full filter blur-3xl pointer-events-none" />

        {/* Back Name Layer: "MAYURESH" (Spanning hero width around head/neck band) */}
        <div
          ref={backNameDayRef}
          className="absolute top-[28%] sm:top-[26%] lg:top-[24%] left-0 right-0 w-full flex items-center justify-center pointer-events-none z-0"
        >
          <div className="overflow-hidden leading-none select-none">
            <span className="font-display font-black text-[18vw] tracking-tighter text-[#121212] uppercase inline-block">
              {'MAYURESH'.split('').map((char, i) => (
                <span key={i} className="back-name-char inline-block">
                  {char}
                </span>
              ))}
            </span>
          </div>
        </div>

        {/* Primary Portrait Cutout A (Unmasked) */}
        <div
          ref={portraitStageRef}
          onMouseEnter={() => setIsOverPortrait(true)}
          onMouseLeave={() => setIsOverPortrait(false)}
          className="absolute bottom-0 left-[54%] sm:left-[58%] lg:left-[60%] -translate-x-1/2 w-full max-w-[580px] sm:max-w-[700px] lg:max-w-[820px] h-[78vh] sm:h-[86vh] lg:h-[94vh] flex items-end justify-center pointer-events-auto z-10"
        >
          {/* Subtle contact shadow where hoodie meets bottom edge */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-20 bg-gradient-to-t from-black/25 via-black/10 to-transparent rounded-full filter blur-xl pointer-events-none" />

          {/* Unmasked High-Fidelity Cutout with Responsive WebP Picture */}
          <picture className="portrait-unmasked-layer relative w-full h-full block">
            <source
              type="image/webp"
              srcSet="/assets/hero/hero-front-640.webp 640w, /assets/hero/hero-front-960.webp 960w, /assets/hero/hero-front-1440.webp 1440w, /assets/hero/hero-front.webp 1600w"
              sizes="(max-width: 768px) 90vw, (max-width: 1280px) 65vw, 820px"
            />
            <img
              src="/assets/hero/hero-front.webp"
              alt="Portrait of Mayuresh Sonawane"
              fetchpriority="high"
              loading="eager"
              className="w-full h-full object-contain object-bottom pointer-events-none select-none"
            />
          </picture>

          {/* Optional WebGL Shader Enhancement Layer (Graceful fallback to pure DOM) */}
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

        {/* Front Name Layer: "SONAWANE" (In front of torso, strictly BELOW chin line) */}
        <div
          ref={frontNameDayRef}
          className="absolute bottom-[8%] sm:bottom-[7%] lg:bottom-[6%] left-0 right-0 w-full flex items-center justify-center pointer-events-none z-20"
        >
          <div className="relative overflow-hidden leading-none select-none">
            {/* Charcoal text */}
            <span className="font-display font-black text-[18vw] tracking-tightest text-[#121212] uppercase inline-block">
              {'SONAWANE'.split('').map((char, i) => (
                <span key={i} className="front-name-char inline-block">
                  {char}
                </span>
              ))}
            </span>
          </div>
        </div>

        {/* Left Column Editorial Narrative (Bottom-Aligned) */}
        <div
          ref={copyColumnRef}
          className="absolute bottom-8 sm:bottom-12 left-4 sm:left-10 lg:left-16 z-30 max-w-[420px] flex flex-col items-start gap-4"
        >
          {/* Label */}
          <div className="copy-reveal-line inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121212]/[0.05] border border-[#121212]/[0.08] font-mono text-[10px] sm:text-[11px] text-[#121212] uppercase tracking-widest font-semibold">
            <span className="w-2 h-2 rounded-full bg-volt" />
            <span>{personalInfo.title}</span>
          </div>

          {/* Headline (Exact copy: "I build things that bring ideas to life.") */}
          <h1 className="copy-reveal-line font-display font-extrabold text-3xl sm:text-4xl lg:text-[42px] leading-[0.98] text-[#121212] tracking-tight uppercase">
            "{personalInfo.heroHeadline}"
          </h1>

          {/* Support Paragraph (Exact copy, max-width ~38ch) */}
          <p className="copy-reveal-line font-body text-xs sm:text-sm text-[#121212]/75 leading-relaxed max-w-[38ch]">
            {personalInfo.supportingDescription}
          </p>

          {/* Restyled CTAs (Lime fill, charcoal text) */}
          <div className="copy-reveal-line flex items-center gap-3 pt-2">
            <a
              href="#about"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-volt text-[#121212] font-mono text-xs uppercase tracking-wider font-bold shadow-sm hover:brightness-105 active:scale-95 transition-all"
            >
              <span>EXPLORE BUILDS</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>

            {/* Accessible Mask Crossfade Toggle Button */}
            <button
              onClick={() => {
                if (!hasInteracted) setHasInteracted(true);
                const nextVal = reveal > 0.5 ? 0.0 : 1.0;
                if (quickRevealRef.current) quickRevealRef.current(nextVal);
              }}
              aria-pressed={reveal > 0.5}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-sm bg-[#121212]/[0.08] hover:bg-[#121212]/[0.15] text-[#121212] font-mono text-xs uppercase tracking-wider font-semibold transition-all border border-[#121212]/[0.1]"
              title="Toggle Spider-Man mask state"
            >
              <Sparkles className="w-3 h-3 text-volt-deep" />
              <span>{reveal > 0.5 ? 'UNMASK' : 'MASK'}</span>
            </button>
          </div>
        </div>

        {/* Scroll cue & interaction hint (Bottom-Right) */}
        <div className="absolute bottom-8 right-6 sm:right-10 z-30 flex flex-col items-end gap-2 text-right pointer-events-none">
          {!hasInteracted && (
            <span className="font-mono text-[9px] text-[#121212]/60 uppercase tracking-widest animate-pulse">
              {isTouchDevice ? 'DRAG TO MEET THE MASK' : 'MOVE TO MEET THE MASK'}
            </span>
          )}
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#121212]/70 uppercase tracking-wider font-semibold">
              SCROLL
            </span>
            <div className="w-[1.5px] h-6 bg-volt animate-bounce" />
          </div>
        </div>
      </div>

      {/* =========================================================================
          WORLD 2: NIGHT / MASKED — Charcoal #121212 & Spider-Man Mask
          Clipped by the seam polygon: (0% to var(--reveal))
          ========================================================================= */}
      <div
        ref={nightRef}
        style={nightClipStyle}
        className="absolute inset-0 w-full h-full bg-[#121212] overflow-hidden pointer-events-none z-20"
        aria-hidden="true"
      >
        {/* Dark hairline grid with faint lime hairlines */}
        <div className="absolute inset-0 max-w-[1720px] mx-auto px-4 sm:px-8 grid grid-cols-12 gap-4">
          <div className="col-span-1 border-r border-volt/10 h-full" />
          <div className="hidden md:block col-span-5 border-r border-volt/5 h-full" />
          <div className="hidden lg:block col-span-5 border-r border-volt/5 h-full" />
          <div className="col-span-1 border-r border-volt/10 h-full" />
        </div>

        {/* Mask Silhouette Lime Rim Glow */}
        <div className="absolute top-[28%] left-[58%] -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-radial from-volt/25 via-volt/5 to-transparent rounded-full filter blur-3xl" />

        {/* Back Name Layer in Off-White (Night) */}
        <div
          ref={backNameNightRef}
          className="absolute top-[28%] sm:top-[26%] lg:top-[24%] left-0 right-0 w-full flex items-center justify-center leading-none select-none z-0"
        >
          <span className="font-display font-black text-[18vw] tracking-tighter text-[#EDEAE2]/90 uppercase">
            MAYURESH
          </span>
        </div>

        {/* Secondary Portrait Cutout B (Spider-Man Mask) Registered exactly on A */}
        <div className="absolute bottom-0 left-[54%] sm:left-[58%] lg:left-[60%] -translate-x-1/2 w-full max-w-[580px] sm:max-w-[700px] lg:max-w-[820px] h-[78vh] sm:h-[86vh] lg:h-[94vh] flex items-end justify-center z-10">
          <picture className="relative w-full h-full block">
            <source
              type="image/webp"
              srcSet="/assets/hero/hero-mask-640.webp 640w, /assets/hero/hero-mask-960.webp 960w, /assets/hero/hero-mask-1440.webp 1440w, /assets/hero/hero-mask.webp 1600w"
              sizes="(max-width: 768px) 90vw, (max-width: 1280px) 65vw, 820px"
            />
            <img
              src="/assets/hero/hero-mask.webp"
              alt="Mayuresh Sonawane wearing a red Spider-Man mask"
              className="w-full h-full object-contain object-bottom filter drop-shadow-[0_0_25px_rgba(210,253,82,0.18)]"
            />
          </picture>
        </div>

        {/* Front Name Layer in Off-White & Lime Outline (Night) */}
        <div
          ref={frontNameNightRef}
          className="absolute bottom-[8%] sm:bottom-[7%] lg:bottom-[6%] left-0 right-0 w-full flex items-center justify-center leading-none select-none z-20"
        >
          <span className="font-display font-black text-[18vw] tracking-tightest text-[#EDEAE2] uppercase">
            SONAWANE
          </span>
        </div>

        {/* Inverted Editorial Copy in Night World */}
        <div className="absolute bottom-8 sm:bottom-12 left-4 sm:left-10 lg:left-16 z-30 max-w-[420px] flex flex-col items-start gap-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-volt/10 border border-volt/30 font-mono text-[10px] sm:text-[11px] text-volt uppercase tracking-widest font-semibold">
            <span className="w-2 h-2 rounded-full bg-volt animate-ping" />
            <span>ALTER EGO // MASKED</span>
          </div>

          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[42px] leading-[0.98] text-[#EDEAE2] tracking-tight uppercase">
            "{personalInfo.heroHeadline}"
          </h2>

          <p className="font-body text-xs sm:text-sm text-[#EDEAE2]/75 leading-relaxed max-w-[38ch]">
            {personalInfo.supportingDescription}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-volt text-[#121212] font-mono text-xs uppercase tracking-wider font-bold">
              <span>EXPLORE BUILDS</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          THE SEAM: 1.5px Electric Lime Edge with Glow & Tick Marks
          ========================================================================= */}
      {reveal > 0.005 && reveal < 0.995 && (
        <div
          ref={seamLineRef}
          className="absolute top-0 bottom-0 pointer-events-none z-30"
          style={{
            left: `${p * 100}%`,
            transform: 'rotate(-12deg)',
            transformOrigin: 'top center',
          }}
        >
          {/* 1.5px Lime Seam Line with Glow */}
          <div className="relative w-[1.5px] h-full bg-volt shadow-[0_0_12px_#D2FD52]">
            {/* Top tick mark */}
            <div className="absolute top-4 -left-1.5 w-3.5 h-[1.5px] bg-volt" />
            {/* Bottom tick mark */}
            <div className="absolute bottom-4 -left-1.5 w-3.5 h-[1.5px] bg-volt" />
          </div>
        </div>
      )}

      {/* =========================================================================
          CUSTOM CURSOR FOLLOWER (Desktop Pointer Only)
          10px lime dot -> 64px ring labeled "MASK" over portrait
          ========================================================================= */}
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
    </section>
  );
}
