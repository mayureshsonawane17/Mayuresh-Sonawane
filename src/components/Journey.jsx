import React, { useRef, useEffect } from 'react';
import { Milestone, ChevronLeft, ChevronRight, Sparkles, MapPin, AlertCircle } from 'lucide-react';
import { journeyMilestones } from '../data/portfolioData';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Journey Section — Horizontally Moving Documentary Photo Strip
 * Features vertical-scroll driven horizontal translation via GSAP ScrollTrigger.
 * Touch / mobile fallback with seamless drag scrolling.
 * NO PHYSICAL LOCATION OR GPS COORDINATES DISPLAYED.
 */
export default function Journey() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || window.innerWidth < 1024) return;

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      const totalScroll = track.scrollWidth - window.innerWidth + 120;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 1.1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${Math.round(self.progress * 100)}%`;
            }
          },
        },
      });

      tl.to(track, {
        x: () => -totalScroll,
        ease: 'none',
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const scrollLeft = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: -420, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (trackRef.current) {
      trackRef.current.scrollBy({ left: 420, behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="journey"
      ref={sectionRef}
      className="relative min-h-screen py-24 lg:py-32 bg-paper text-paper-ink border-b border-paper-border overflow-hidden flex flex-col justify-between"
    >

      <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 sm:px-8 mb-6">
        
        {/* Section Header & Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-paper-border pb-6 gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-volt-deep uppercase tracking-widest mb-3">
              <Milestone className="w-3.5 h-3.5" />
              <span>[05] // CHRONOLOGICAL DOCUMENTARY STRIP</span>
            </div>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-paper-ink uppercase tracking-tight leading-none">
              JOURNEY & ACHIEVEMENTS
            </h2>
          </div>

          {/* Controls & Spec Note */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:block font-mono text-xs text-paper-secondary text-right">
              <div>GSAP SCROLLTRIGGER PINNED REEL</div>
              <div className="text-[10px] text-paper-muted">[VERTICAL SCROLL DRIVES HORIZONTAL REEL]</div>
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button 
                onClick={scrollLeft}
                className="w-10 h-10 rounded-full border border-paper-border bg-paper-pure flex items-center justify-center text-paper-ink hover:bg-paper-tint hover:border-volt active:scale-95 transition-all shadow-sm"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={scrollRight}
                className="w-10 h-10 rounded-full border border-paper-border bg-paper-pure flex items-center justify-center text-paper-ink hover:bg-paper-tint hover:border-volt active:scale-95 transition-all shadow-sm"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Horizontal Photo Strip Reel */}
      <div className="relative z-10 w-full overflow-hidden my-auto py-4">
        <div 
          ref={trackRef}
          className="flex gap-8 px-4 sm:px-8 overflow-x-auto lg:overflow-visible pb-4 scrollbar-none snap-x lg:snap-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {journeyMilestones.map((item) => (
            <div
              key={item.id}
              className={`flex-shrink-0 w-[300px] sm:w-[380px] md:w-[440px] snap-center rounded-xl bg-paper-pure border p-6 shadow-xl transition-all duration-300 group flex flex-col justify-between ${
                item.isPlaceholder 
                  ? 'border-dashed border-paper-muted/80 bg-paper/60' 
                  : 'border-paper-border hover:border-volt'
              }`}
            >
              <div>
                {/* Milestone Top Telemetry */}
                <div className="flex items-center justify-between font-mono text-xs text-paper-secondary uppercase tracking-widest pb-3 mb-4 border-b border-paper-border">
                  <span className="font-bold text-volt-deep">CHAPTER {item.id}</span>
                  {item.isPlaceholder ? (
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-700 text-[10px] font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 text-amber-600" />
                      PLACEHOLDER
                    </span>
                  ) : (
                    <span className="text-[11px] text-paper-muted">{item.period}</span>
                  )}
                </div>

                {/* Milestone Photo Aspect Frame */}
                <div className="relative aspect-[16/11] rounded-lg overflow-hidden bg-charcoal mb-5">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center filter grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent"></div>

                  {/* Stamp (No Location Information) */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 font-mono text-[10px] text-white/90 bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm border border-white/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-volt"></span>
                    <span>{item.isPlaceholder ? 'RESERVED // AWAITING SPEC' : 'DEV ARCHIVE // MILESTONE'}</span>
                  </div>
                </div>

                {/* Narrative Details */}
                <span className="font-mono text-[10px] text-volt-deep font-semibold uppercase tracking-widest block mb-1">
                  {item.subtitle}
                </span>
                <h3 className="font-display font-bold text-xl sm:text-2xl uppercase tracking-tight text-paper-ink group-hover:text-volt-deep transition-colors">
                  {item.title}
                </h3>
                <p className="mt-3 font-body text-sm text-paper-secondary leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Tags Strip */}
              <div className="mt-6 pt-4 border-t border-paper-border flex flex-wrap gap-1.5">
                {item.tags.map(tag => (
                  <span 
                    key={tag}
                    className="font-mono text-[9px] px-2 py-0.5 rounded bg-paper-tint border border-paper-border text-paper-secondary uppercase"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scrubber Progress Bar Track */}
      <div className="relative z-10 max-w-[1600px] w-full mx-auto px-4 sm:px-8 mt-6">
        <div className="flex items-center justify-between font-mono text-xs text-paper-secondary">
          <span>01 // ORIGINS</span>
          <div className="flex-1 mx-6 h-1 bg-paper-tint rounded-full overflow-hidden">
            <div 
              ref={progressBarRef}
              className="h-full bg-volt rounded-full transition-all duration-100 ease-out"
              style={{ width: '20%' }}
            ></div>
          </div>
          <span>05 // THE HORIZON</span>
        </div>
      </div>

    </section>
  );
}
