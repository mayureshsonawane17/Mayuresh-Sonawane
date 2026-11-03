import React, { useRef, useEffect, useCallback } from 'react';
import { ArrowDown, Cpu, Sparkles } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

/**
 * Hero Component — Slime/Liquid Blob Reveal Experience
 * Ported faithfully from the user's high-craft prototype ("Your_Name_–_Portfolio.html")
 * 
 * Features:
 * - 2D Canvas spring physics with 3 trailing blobs & velocity-based stretch
 * - Slime bridge beads connecting neighbouring blobs
 * - Wobble harmonic perturbations with dynamic phase
 * - Mask reveal clipping Spider-Man mask over Mayuresh's portrait
 * - Smooth intro sweep trajectory across the face
 * - Pure 2D canvas context — ultra-performant, zero WebGL context failures
 * - Exact editorial off-white palette, SVG flow lines, and pill navigation
 */
export default function Hero({ onExploreClick, onOpenAdmin, onTriggerTransition }) {
  const heroRef = useRef(null);
  const stageRef = useRef(null);
  const parallaxWrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const baseImgRef = useRef(null);
  const revImgRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // Expose test helper window.__setHeroReveal
  const setRevealProgrammaticRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const parallaxWrapper = parallaxWrapperRef.current;
    const cv = canvasRef.current;
    const hero = heroRef.current;
    const bi = baseImgRef.current;
    const ri = revImgRef.current;

    if (!stage || !cv || !hero || !bi || !ri || !parallaxWrapper) return;

    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let S = 600;
    let D = 1;
    let T = 0;
    let dirty = true;
    let wasAct = false;
    let lm = 0;
    let tx = 0.5;
    let ty = 0.4;
    let intro = !reduce;
    let t0 = null;
    let prev = null;
    const sh = [];

    // Smooth cursor-tracking parallax physics
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let curParallaxX = 0;
    let curParallaxY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let curRotX = 0;
    let curRotY = 0;

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const SZ = [0.17, 0.12, 0.085];
    const KS = [46, 25, 14];
    const TAU = 6.28319;

    // Big blobs on independent springs: front quick, others trailing
    for (let q = 0; q < SZ.length; q++) {
      const d = q ? 0.03 + q * 0.02 : 0;
      sh.push({
        i: q,
        x: 0.5,
        y: 0.4,
        vx: 0,
        vy: 0,
        R: 0,
        vR: 0,
        k: KS[q],
        sz: SZ[q],
        ox: Math.cos(q * 2.4 + 1) * d,
        oy: Math.sin(q * 2.4 + 1) * d,
        ph: q * 1.9,
        ang: 0,
        st: 0,
      });
    }

    function fit() {
      if (!stage) return;
      S = stage.clientWidth || 600;
      D = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(S * D);
      cv.height = Math.round(S * D);
      dirty = true;
    }

    fit();
    let ro = null;
    if (window.ResizeObserver) {
      ro = new ResizeObserver(fit);
      ro.observe(stage);
    } else {
      window.addEventListener('resize', fit);
    }

    bi.onload = () => { dirty = true; };
    ri.onload = () => { dirty = true; };
    if (bi.complete && ri.complete) {
      dirty = true;
    }

    function active() {
      for (let i = 0; i < sh.length; i++) {
        if (sh[i].R > 0.003) return true;
      }
      return false;
    }

    function move(e) {
      if (!cv || !hero) return;
      const r = cv.getBoundingClientRect();
      const now = performance.now();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      intro = false;

      // Update liquid blob coordinates
      if (px > -0.1 && px < 1.1 && py > -0.1 && py < 1.1) {
        if (!active()) {
          sh.forEach((s) => {
            s.x = px + s.ox;
            s.y = py + s.oy;
            s.vx = s.vy = 0;
          });
        }
        tx = px;
        ty = py;
        lm = now;
      } else {
        lm = Math.min(lm, now - 500);
      }

      // Minor organic movement tracking cursor across hero viewport
      if (!reduce) {
        const heroRect = hero.getBoundingClientRect();
        const hx = (e.clientX - (heroRect.left + heroRect.width * 0.5)) / (heroRect.width * 0.5);
        const hy = (e.clientY - (heroRect.top + heroRect.height * 0.5)) / (heroRect.height * 0.5);

        targetParallaxX = clamp(hx * 16, -16, 16);
        targetParallaxY = clamp(hy * 10, -10, 10);
        targetRotY = clamp(hx * 3.6, -3.6, 3.6);  // subtle yaw turn
        targetRotX = clamp(-hy * 2.6, -2.6, 2.6); // subtle pitch tilt
      }
    }

    function leave() {
      lm = Math.min(lm, performance.now() - 500);
      targetParallaxX = 0;
      targetParallaxY = 0;
      targetRotX = 0;
      targetRotY = 0;
    }

    hero.addEventListener('pointermove', move);
    hero.addEventListener('pointerdown', move);
    const handlePointerUp = (e) => {
      if (e.pointerType !== 'mouse') leave();
    };
    hero.addEventListener('pointerup', handlePointerUp);
    hero.addEventListener('pointerleave', leave);

    // Outline loop with harmonic wobble & stretch
    function loop(x, y, R, st, ang, ph, wob, eps) {
      const n = 44;
      const c = Math.cos(ang);
      const sn = Math.sin(ang);
      for (let k = 0; k < n; k++) {
        const a = (k / n) * TAU;
        const w = 1 + wob * (
          0.13 * Math.sin(2 * a + T * 1.3 + ph) +
          0.1 * Math.sin(3 * a - T * 1.7 + ph * 1.7) +
          0.05 * Math.sin(5 * a + T * 2.3 + ph * 0.6)
        );
        const rr = R * w + eps;
        const ux = Math.cos(a) * rr * (1 + st);
        const uy = (Math.sin(a) * rr) / (1 + st * 0.55);
        const X = x + ux * c - uy * sn;
        const Y = y + ux * sn + uy * c;
        if (k) ctx.lineTo(X, Y);
        else ctx.moveTo(X, Y);
      }
      ctx.closePath();
    }

    // Slime trace with bridge beads joining neighbouring blobs
    function trace(eps) {
      ctx.beginPath();
      for (let i = 0; i < sh.length; i++) {
        const a = sh[i];
        if (a.R <= 0.003) continue;
        loop(a.x, a.y, a.R, a.st, a.ang, a.ph, 1, eps);
        const b = sh[i + 1];
        if (b && b.R > 0.003) {
          for (let m = 1; m <= 4; m++) {
            const f = m / 5;
            loop(
              a.x + (b.x - a.x) * f,
              a.y + (b.y - a.y) * f,
              (a.R + (b.R - a.R) * f) * 0.9,
              0,
              0,
              a.ph + m,
              0.6,
              eps
            );
          }
        }
      }
    }

    function draw(act) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      ctx.setTransform(S * D, 0, 0, S * D, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      // Base unmasked portrait
      ctx.drawImage(bi, 0, 0, 1, 1);

      if (!act) return;

      // Reveal clipped Spider-Man mask
      ctx.save();
      trace(0);
      ctx.clip();
      ctx.clearRect(0, 0, 1, 1);
      ctx.restore();

      ctx.save();
      trace(1.4 / S);
      ctx.clip();
      ctx.drawImage(ri, 0, 0, 1, 1);
      ctx.restore();
    }

    function frame(ts) {
      const dt = prev === null ? 0.016 : Math.min((ts - prev) / 1000, 0.034);
      prev = ts;
      T = ts / 1000;

      if (intro) {
        if (t0 === null) t0 = ts + 900;
        const p = clamp((ts - t0) / 2600, 0, 1);
        if (ts > t0) {
          tx = 0.2 + 0.62 * ease(p);
          ty = 0.4 + 0.1 * Math.sin(p * Math.PI * 2);
          lm = ts;
        }
        if (p >= 1) intro = false;
      }

      let act = false;
      sh.forEach((s) => {
        const alive = lm > 0 && ts - lm < 2600 + s.i * 700;
        const Tx = tx + s.ox + Math.sin(ts / (700 + s.i * 130) + s.i) * 0.012;
        const Ty = ty + s.oy + Math.cos(ts / (830 + s.i * 90) + s.i * 2) * 0.012;
        const tR = alive ? s.sz : 0;

        if (reduce) {
          s.x = Tx;
          s.y = Ty;
          s.R = tR;
        } else {
          const c = 2 * 0.55 * Math.sqrt(s.k);
          s.vx += ((Tx - s.x) * s.k - s.vx * c) * dt;
          s.vy += ((Ty - s.y) * s.k - s.vy * c) * dt;
          s.x += s.vx * dt;
          s.y += s.vy * dt;
          s.vR += ((tR - s.R) * 40 - s.vR * 9) * dt;
          s.R += s.vR * dt;
        }

        if (s.R < 0) {
          s.R = 0;
          s.vR = 0;
        }

        const sp = Math.hypot(s.vx, s.vy);
        s.st += (clamp(sp * 0.16, 0, 0.5) - s.st) * 0.15;
        if (sp > 0.05) s.ang = Math.atan2(s.vy, s.vx);
        if (s.R > 0.003) act = true;
      });

      if ((act || wasAct || dirty) && bi.complete && ri.complete) {
        draw(act);
        dirty = false;
      }
      wasAct = act;

      // Smooth organic parallax interpolation
      if (!reduce && parallaxWrapper) {
        curParallaxX += (targetParallaxX - curParallaxX) * 0.08;
        curParallaxY += (targetParallaxY - curParallaxY) * 0.08;
        curRotX += (targetRotX - curRotX) * 0.08;
        curRotY += (targetRotY - curRotY) * 0.08;
        parallaxWrapper.style.transform = `translate3d(${curParallaxX.toFixed(2)}px, ${curParallaxY.toFixed(2)}px, 0) rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg)`;
      }

      animFrameIdRef.current = requestAnimationFrame(frame);
    }

    animFrameIdRef.current = requestAnimationFrame(frame);

    // Programmatic test helper
    setRevealProgrammaticRef.current = (val) => {
      if (val > 0.05) {
        tx = 0.5;
        ty = 0.4;
        lm = performance.now();
      } else {
        lm = 0;
      }
      dirty = true;
    };
    window.__setHeroReveal = setRevealProgrammaticRef.current;

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      if (ro) ro.disconnect();
      else window.removeEventListener('resize', fit);
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerdown', move);
      hero.removeEventListener('pointerup', handlePointerUp);
      hero.removeEventListener('pointerleave', leave);
      delete window.__setHeroReveal;
    };
  }, []);

  return (
    <main
      id="hero"
      ref={heroRef}
      className="hero relative w-full h-[100svh] min-h-[600px] overflow-hidden touch-none select-none"
      style={{
        '--bg': '#f6f5f0',
        '--ink': '#16161a',
        '--mute': '#6d6d72',
        '--line': 'rgba(22,22,26,.07)',
        '--red': '#d9252b',
        backgroundColor: 'var(--bg)',
        color: 'var(--ink)',
        fontFamily: '"Bricolage Grotesque", system-ui, -apple-system, sans-serif',
        perspective: '1200px',
      }}
    >
      {/* Background Flow Curves */}
      <svg
        className="lines absolute inset-0 w-full h-full pointer-events-none fill-none"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={{
          stroke: 'var(--line)',
          strokeWidth: 1.5,
        }}
      >
        <path d="M-20 160C180 60 330 260 520 190S800 40 1000 130 1180 90 1230 60" />
        <path d="M-20 330C150 250 300 430 500 360S790 230 980 310 1150 290 1230 250" />
        <path d="M-20 520C200 440 330 640 560 560S850 420 1020 520 1160 500 1230 470" />
        <path d="M-20 700C220 620 360 800 600 730S900 610 1060 700" />
      </svg>

      {/* Top Editorial Header */}
      <header className="absolute inset-x-0 top-0 flex justify-between items-start p-[clamp(16px,2.4vw,32px)] z-30 pointer-events-auto">
        <div className="flex flex-col items-start">
          <h1 className="mark font-extrabold text-[clamp(28px,3.4vw,46px)] leading-[0.88] tracking-[-0.04em] m-0 text-[var(--ink)]">
            Mayuresh<br />Sonawane
          </h1>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--mute)] mt-2 font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-volt border border-volt-deep animate-volt-pulse" />
            <span>Creative Developer &amp; Builder</span>
          </span>
        </div>

        <nav aria-label="Main" className="flex items-center gap-2 flex-wrap justify-end">
          <a
            href="#about"
            className="hero-nav-btn text-[var(--ink)] no-underline font-bold text-[14px] px-4 py-2 border-2 border-[var(--ink)] rounded-xl transition-colors duration-200 hover:bg-[var(--ink)] hover:text-[var(--bg)]"
          >
            About
          </a>
          <a
            href="#hall-of-fame"
            className="hero-nav-btn text-[var(--ink)] no-underline font-bold text-[14px] px-4 py-2 border-2 border-[var(--ink)] rounded-xl transition-colors duration-200 hover:bg-[var(--ink)] hover:text-[var(--bg)]"
          >
            Work
          </a>
          <a
            href="#mask-collection"
            className="hero-nav-btn text-[var(--ink)] no-underline font-bold text-[14px] px-4 py-2 border-2 border-[var(--ink)] rounded-xl transition-colors duration-200 hover:bg-[var(--ink)] hover:text-[var(--bg)]"
          >
            Masks
          </a>
          <a
            href="#journey"
            className="hero-nav-btn hidden md:inline-block text-[var(--ink)] no-underline font-bold text-[14px] px-4 py-2 border-2 border-[var(--ink)] rounded-xl transition-colors duration-200 hover:bg-[var(--ink)] hover:text-[var(--bg)]"
          >
            Journey
          </a>
          <a
            href="#connect"
            className="hero-nav-btn text-[var(--ink)] no-underline font-bold text-[14px] px-4 py-2 border-2 border-[var(--ink)] rounded-xl transition-colors duration-200 hover:bg-[var(--ink)] hover:text-[var(--bg)]"
          >
            Contact
          </a>
          {onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="hero-nav-btn inline-flex items-center gap-1.5 text-[var(--ink)] no-underline font-bold text-[14px] px-4 py-2 border-2 border-[var(--ink)] rounded-xl transition-colors duration-200 hover:bg-[var(--ink)] hover:text-[var(--bg)] cursor-pointer"
              title="Open protected admin dashboard"
            >
              <Cpu className="w-3.5 h-3.5 text-volt-deep" />
              <span>Admin</span>
            </button>
          )}
        </nav>
      </header>

      {/* Central Portrait & Liquid Canvas Stage */}
      <div
        id="stage"
        ref={stageRef}
        className="stage absolute bottom-0 left-1/2 w-[min(100vw,94vh)] aspect-square -translate-x-1/2 z-10"
        style={{
          animation: 'rise 1.2s cubic-bezier(.7,0,.2,1) both',
        }}
      >
        {/* Parallax & 3D Tilt Wrapper tracking cursor */}
        <div
          ref={parallaxWrapperRef}
          className="relative w-full h-full will-change-transform"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Source images for Canvas */}
          <img
            ref={baseImgRef}
            id="base"
            src="/assets/hero/slime-base.webp"
            alt="Portrait of Mayuresh Sonawane"
            width={900}
            height={900}
            className="hidden"
          />
          <img
            ref={revImgRef}
            id="rev"
            src="/assets/hero/slime-rev.webp"
            alt="Mayuresh Sonawane wearing Spider-Man mask"
            width={900}
            height={900}
            className="hidden"
          />

          {/* Liquid Slime Spring Canvas */}
          <canvas
            ref={canvasRef}
            id="cv"
            role="img"
            aria-label="Interactive portrait of Mayuresh Sonawane"
            className="absolute inset-0 w-full h-full block pointer-events-none"
          />
        </div>
      </div>

      {/* Bottom-Left Hint */}
      <p
        className="hint absolute left-[clamp(16px,2.4vw,32px)] bottom-[calc(clamp(16px,2.4vw,32px)+env(safe-area-inset-bottom,0px))] m-0 max-w-[15ch] text-[clamp(13px,1.2vw,16px)] leading-[1.25] text-[var(--mute)] z-30 pointer-events-none bg-[var(--bg)]/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-black/[0.04]"
        style={{
          animation: 'fade 1s 1.4s both',
        }}
      >
        Move your cursor <b className="text-[var(--ink)] font-bold">over my face.</b>
      </p>

      {/* Bottom-Right Editorial Narrative (Desktop & Tablet) */}
      <div
        className="hidden sm:flex absolute right-[clamp(16px,2.4vw,32px)] bottom-[calc(clamp(16px,2.4vw,32px)+env(safe-area-inset-bottom,0px))] max-w-[320px] sm:max-w-[360px] z-30 text-right flex-col items-end gap-2 pointer-events-auto bg-[var(--bg)]/85 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-black/[0.06] shadow-xs"
        style={{
          animation: 'fade 1s 1.6s both',
        }}
      >
        <p className="font-bold text-sm sm:text-base lg:text-lg text-[var(--ink)] leading-[1.2] tracking-tight">
          "{personalInfo.heroHeadline}"
        </p>
        <p className="text-[12px] sm:text-[13px] text-[var(--mute)] leading-relaxed max-w-[30ch]">
          {personalInfo.supportingDescription}
        </p>
        <a
          href="#about"
          onClick={onExploreClick}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--ink)] text-[var(--bg)] font-mono text-[11px] font-bold uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all mt-1"
        >
          <span>EXPLORE BUILDS</span>
          <ArrowDown className="w-3 h-3 text-volt" />
        </a>
      </div>

      {/* Mobile Subtle Explore Pill */}
      <div className="sm:hidden absolute bottom-3 right-3 z-30 pointer-events-auto">
        <a
          href="#about"
          onClick={onExploreClick}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--ink)] text-[var(--bg)] font-mono text-[10px] font-bold uppercase tracking-wider shadow-sm active:scale-95 transition-all"
        >
          <span>EXPLORE</span>
          <ArrowDown className="w-2.5 h-2.5 text-volt" />
        </a>
      </div>

      {/* CSS Keyframes for Rise and Fade */}
      <style>{`
        @keyframes rise {
          from { clip-path: inset(100% 0 0 0); }
          to { clip-path: inset(0 0 0 0); }
        }
        @keyframes fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .stage, .hint { animation: none !important; }
        }
      `}</style>
    </main>
  );
}
