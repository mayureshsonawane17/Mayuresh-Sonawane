import React, { useRef, useState, useEffect } from 'react';
import { Terminal, MoveDown, Sparkles, Gamepad2, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import HeroShaderCanvas from './HeroShaderCanvas';
import { personalInfo } from '../data/portfolioData';

/**
 * Hero Component — Cinematic Editorial Experience
 * Directly inspired by the interaction and visual storytelling of landonorris.com.
 * Features:
 * - Centered, towering portrait rising from the bottom of the viewport
 * - Architectural typography backdrop (MAYURESH SONAWANE)
 * - OFF+BRAND sinusoidal wave shader transformation (Mayuresh <-> Spider-Man mask)
 * - Bespoke bottom-left polygonal technical badge (adapted from Lando's next-race card)
 * - Clean editorial framing without clunky sliders or dashboard widgets
 * - ZERO physical location or GPS coordinates
 */
export default function Hero({ onExploreClick }) {
  const heroRef = useRef(null);
  const bgTextRef = useRef(null);
  const subjectRef = useRef(null);
  const badgeRef = useRef(null);

  // Alter-ego mask state
  const [isMaskActive, setIsMaskActive] = useState(false);
  const [isBadgeHovered, setIsBadgeHovered] = useState(false);
  const [isCanvasHovered, setIsCanvasHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  // Calculate target mask transition (0.0 = unmasked, 1.0 = Spider-Man mask)
  const targetMaskProgress = isMaskActive || isBadgeHovered || isCanvasHovered ? 1.0 : 0.0;

  // Parallax displacement tracking
  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width;
    const normY = (e.clientY - rect.top) / rect.height;

    const clampedX = Math.max(0, Math.min(1, normX));
    const clampedY = Math.max(0, Math.min(1, normY));
    setMousePos({ x: clampedX, y: clampedY });

    const deltaX = clampedX - 0.5;
    const deltaY = clampedY - 0.5;

    // 3D Parallax layers
    if (bgTextRef.current) {
      gsap.to(bgTextRef.current, {
        x: deltaX * -30,
        y: deltaY * -15,
        duration: 0.8,
        ease: 'power2.out',
      });
    }

    if (subjectRef.current) {
      gsap.to(subjectRef.current, {
        x: deltaX * 14,
        y: deltaY * 8,
        rotationY: deltaX * 2,
        duration: 0.8,
        ease: 'power2.out',
      });
    }
  };

  // Entrance choreography
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-edge-meta', { y: -15, opacity: 0, duration: 0.8 });
      tl.from(bgTextRef.current, { scale: 0.95, y: 30, opacity: 0, duration: 1.2 }, '-=0.5');
      tl.from(subjectRef.current, { y: 50, duration: 1.2 }, '-=0.8');
      tl.from(badgeRef.current, { x: -30, opacity: 0, duration: 0.9 }, '-=0.6');
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[100svh] h-[100svh] pt-20 pb-8 flex flex-col justify-between bg-paper overflow-hidden select-none"
    >
      {/* Decorative Technical Hairline Grid & Corner Crosshairs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="max-w-[1720px] h-full mx-auto px-4 sm:px-8 grid grid-cols-12 gap-4">
          <div className="h-full border-r border-paper-border/40"></div>
          <div className="hidden md:block col-span-5 h-full border-r border-paper-border/25"></div>
          <div className="hidden lg:block col-span-5 h-full border-r border-paper-border/25"></div>
          <div className="h-full border-r border-paper-border/40"></div>
        </div>

        {/* Technical Corner Crosshairs */}
        <div className="absolute top-24 left-6 text-paper-ink/30 font-mono text-xs">+</div>
        <div className="absolute top-24 right-6 text-paper-ink/30 font-mono text-xs">+</div>
        <div className="absolute bottom-8 left-6 text-paper-ink/30 font-mono text-xs">+</div>
        <div className="absolute bottom-8 right-6 text-paper-ink/30 font-mono text-xs">+</div>
      </div>

      {/* Top Edge Metadata Bar */}
      <div className="hero-edge-meta relative z-20 max-w-[1720px] w-full mx-auto px-4 sm:px-8 pt-2 flex items-center justify-between font-mono text-[11px] text-paper-secondary tracking-widest uppercase">
        <div className="flex items-center gap-3">
          <span className="text-paper-ink font-semibold">[{personalInfo.systemEdition}]</span>
          <span className="hidden sm:inline text-paper-muted">•</span>
          <span className="hidden sm:inline">CREATIVE DEVELOPER ARCHITECTURE</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-paper-ink">
            <Terminal className="w-3.5 h-3.5 text-volt-deep" />
            <span>{personalInfo.systemStatus}</span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-volt animate-ping" />
            <span className="text-paper-ink font-semibold">
              {targetMaskProgress > 0.5 ? 'ALTER EGO // SPIDER-MAN MASK' : 'CREATIVE BUILDER // ACTIVE'}
            </span>
          </div>
        </div>
      </div>

      {/* Architectural Typographic Backdrop (Behind Head) */}
      <div
        ref={bgTextRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none select-none z-0 overflow-hidden leading-none"
      >
        <div className="flex flex-col items-center justify-center">
          <span className="font-display font-black text-[16vw] lg:text-[20vw] tracking-tighter text-paper-ink/[0.045] uppercase">
            MAYURESH
          </span>
          <span className="font-display font-black text-[14vw] lg:text-[17vw] tracking-tightest text-paper-ink/[0.035] -mt-[6vw] uppercase">
            SONAWANE
          </span>
        </div>
      </div>

      {/* Centered Towering Portrait Subject */}
      <div 
        ref={subjectRef}
        className="relative z-10 w-full flex-1 flex items-end justify-center pointer-events-none"
      >
        <div 
          className="relative w-full max-w-[580px] sm:max-w-[680px] lg:max-w-[780px] h-[70vh] sm:h-[78vh] lg:h-[84vh] flex items-end justify-center pointer-events-auto"
          onMouseEnter={() => setIsCanvasHovered(true)}
          onMouseLeave={() => setIsCanvasHovered(false)}
        >
          {/* Subtle Ambient Grounding Shadow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-24 bg-gradient-to-t from-paper-ink/20 via-paper-ink/5 to-transparent rounded-full filter blur-2xl pointer-events-none" />

          {/* Base Cutout Layer (Instant High-Fidelity First Paint & Progressive Fallback) */}
          <img 
            src="/assets/personal/hero-unmasked.png" 
            alt={personalInfo.name}
            className="w-full h-full object-contain object-bottom pointer-events-none select-none filter contrast-[1.04]"
            loading="eager"
            fetchpriority="high"
          />

          {/* WebGL GLSL Sinusoidal Wave Shader Layer */}
          <HeroShaderCanvas
            unmaskedSrc="/assets/personal/hero-unmasked.png"
            maskedSrc="/assets/personal/hero-masked.png"
            maskProgress={targetMaskProgress}
            isHovered={isCanvasHovered || isBadgeHovered}
            mousePos={mousePos}
            onClick={() => setIsMaskActive(prev => !prev)}
          />

          {/* Micro Persona Stamp Pill */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="px-4 py-1.5 rounded-full bg-paper/90 backdrop-blur-md border border-paper-border font-mono text-[10px] text-paper-ink uppercase tracking-widest shadow-sm flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${targetMaskProgress > 0.5 ? 'bg-volt animate-ping' : 'bg-volt'}`} />
              <span className="font-semibold">
                {targetMaskProgress > 0.5 ? 'ALTER EGO // SPIDER-MAN MASK' : 'MAYURESH SONAWANE // BUILDER'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Technical Controls & Meta Deck */}
      <div className="relative z-20 max-w-[1720px] w-full mx-auto px-4 sm:px-8 flex items-end justify-between">
        
        {/* Bottom-Left: Polygonal Technical Card (Adapted from Lando Norris Next-Race Card) */}
        <div 
          ref={badgeRef}
          onMouseEnter={() => setIsBadgeHovered(true)}
          onMouseLeave={() => setIsBadgeHovered(false)}
          onClick={() => setIsMaskActive(prev => !prev)}
          className="relative w-[130px] sm:w-[145px] h-[190px] sm:h-[210px] p-3 flex flex-col justify-between cursor-pointer group transition-transform duration-300 hover:-translate-y-1"
          title="Hover or tap to reveal Spider-Man mask transformation"
        >
          {/* Polygonal SVG Wireframe Border from landonorris.com */}
          <div className="absolute inset-0 pointer-events-none">
            <svg 
              className="w-full h-full text-paper-border group-hover:text-volt transition-colors duration-300" 
              viewBox="0 0 119 244" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <path 
                d="M118.5 6v232a5.5 5.5 0 0 1-5.5 5.5H6A5.5 5.5 0 0 1 .5 238V25A5.5 5.5 0 0 1 6 19.5h46.346c4.695 0 9.167-2 12.297-5.498l7.46-8.337A15.5 15.5 0 0 1 83.653.5H113a5.5 5.5 0 0 1 5.5 5.5Z" 
                stroke="currentColor" 
                strokeWidth="1.5"
                className="transition-colors duration-300"
              />
            </svg>
            <div className="absolute inset-1 bg-paper/80 backdrop-blur-sm -z-10 rounded-sm" />
          </div>

          {/* Card Top: Eyebrow */}
          <div className="relative z-10 font-mono text-[9px] uppercase tracking-widest text-paper-secondary flex items-center justify-between">
            <span className="font-semibold text-paper-ink">SPRINT // 01</span>
            <span className="w-1.5 h-1.5 rounded-full bg-volt animate-volt-pulse" />
          </div>

          {/* Card Middle: Current Build Highlight */}
          <div className="relative z-10 my-auto py-1">
            <div className="flex items-center gap-1.5 text-volt-deep font-mono text-[10px] uppercase font-bold tracking-wider mb-0.5">
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>ORIGIN</span>
            </div>
            <div className="font-display font-black text-xs sm:text-sm uppercase tracking-tight text-paper-ink leading-tight">
              2D GAME
            </div>
            <div className="font-mono text-[8px] text-paper-muted uppercase tracking-wider mt-0.5">
              IN DEVELOPMENT
            </div>
          </div>

          {/* Card Divider Line */}
          <div className="relative z-10 w-full h-[1px] bg-paper-border group-hover:bg-volt/60 transition-colors" />

          {/* Card Bottom: Mask Trigger */}
          <div className="relative z-10 pt-1">
            <div className="flex items-center justify-between font-mono text-[9px] text-paper-secondary uppercase tracking-wider">
              <span className="group-hover:text-volt-deep font-bold transition-colors">
                {targetMaskProgress > 0.5 ? 'MASK: ACTIVE' : 'ALTER EGO'}
              </span>
              <Sparkles className="w-3 h-3 text-volt-deep group-hover:rotate-45 transition-transform" />
            </div>
            <div className="font-mono text-[8px] text-paper-muted uppercase tracking-tight mt-0.5">
              HOVER TO WEAR
            </div>
          </div>
        </div>

        {/* Center Prompt (Mobile / Minimal) */}
        <div className="hidden lg:flex flex-col items-center gap-2 mb-2 font-mono text-[11px] text-paper-secondary tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className="text-paper-ink font-semibold">{personalInfo.title.toUpperCase()}</span>
            <span className="text-paper-muted">•</span>
            <span>GODOT • REACT • THREE.JS</span>
          </div>
        </div>

        {/* Bottom-Right: Editorial Scroll Indicator */}
        <a
          href="#about"
          className="flex items-center gap-3 px-4 py-2.5 rounded-full border border-paper-border bg-paper hover:bg-paper-tint text-paper-ink transition-all group shadow-sm hover:border-volt"
          aria-label="Scroll to A Message from Me"
        >
          <div className="flex flex-col text-right">
            <span className="font-mono text-[9px] text-paper-muted uppercase tracking-widest">NEXT SECTION</span>
            <span className="font-mono text-xs uppercase tracking-wider font-semibold text-paper-ink">
              [01 // A MESSAGE FROM ME]
            </span>
          </div>
          <div className="w-7 h-7 rounded-full bg-paper-pure border border-paper-border flex items-center justify-center group-hover:border-volt group-hover:bg-volt transition-colors">
            <MoveDown className="w-3.5 h-3.5 text-paper-ink group-hover:translate-y-0.5 transition-transform" />
          </div>
        </a>

      </div>
    </section>
  );
}
