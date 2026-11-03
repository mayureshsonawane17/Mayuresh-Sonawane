import React, { useEffect, useRef } from 'react';
import Signature from './Signature';
import { Quote, Compass, Sparkles, CheckCircle } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { personalInfo } from '../data/portfolioData';

gsap.registerPlugin(ScrollTrigger);

/**
 * About Section — "A Message from Me"
 * Recreates the visual storytelling behavior of the original portrait-to-card transition.
 * Features docked editorial card container with GSAP ScrollTrigger scrub, oversized typography, and animated vector signature.
 */
export default function About() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const headlineRef = useRef(null);
  const textBlockRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Scrubbed Card Docking & Scale Transition
      gsap.fromTo(
        cardRef.current,
        {
          scale: 1.15,
          y: -40,
          opacity: 0.8,
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        },
        {
          scale: 1.0,
          y: 0,
          opacity: 1,
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'top 30%',
            scrub: 1,
          },
        }
      );

      // 2. Oversized Headline Slide-in Reveal
      gsap.fromTo(
        headlineRef.current,
        {
          x: 40,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headlineRef.current,
            start: 'top 85%',
          },
        }
      );

      // 3. Narrative Copy Fade-up
      gsap.fromTo(
        textBlockRef.current,
        {
          y: 30,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: textBlockRef.current,
            start: 'top 85%',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="relative min-h-screen py-24 md:py-36 bg-paper-pure text-paper-ink border-b border-paper-border overflow-hidden"
    >
      {/* Registration crosshairs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-12 left-6 text-paper-ink/30 font-mono text-xs">+</div>
        <div className="absolute top-12 right-6 text-paper-ink/30 font-mono text-xs">+</div>
        <div className="absolute bottom-12 left-6 text-paper-ink/30 font-mono text-xs">+</div>
        <div className="absolute bottom-12 right-6 text-paper-ink/30 font-mono text-xs">+</div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8">
        
        {/* Section Index & Header */}
        <div className="flex items-center justify-between border-b border-paper-border pb-4 mb-16 font-mono text-xs text-paper-secondary tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className="text-volt-deep font-bold">[01]</span>
            <span className="text-paper-ink font-semibold">A MESSAGE FROM ME</span>
            <span className="hidden sm:inline text-paper-muted">•</span>
            <span className="hidden sm:inline">ORIGINAL MANIFESTO</span>
          </div>
          <div className="flex items-center gap-2">
            <Compass className="w-3.5 h-3.5 text-volt-deep" />
            <span>EDITORIAL PERSPECTIVE</span>
          </div>
        </div>

        {/* Asymmetric 12-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Portrait-to-Card Dock Container with ScrollTrigger */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start">
            
            {/* The Docked Card Container */}
            <div 
              ref={cardRef}
              id="docked-portrait-card"
              className="relative w-full max-w-[440px] rounded-xl overflow-hidden border border-paper-border bg-paper p-3 transition-all duration-500 hover:border-volt group shadow-xl"
            >
              {/* Card Header Telemetry */}
              <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-paper-border font-mono text-[10px] text-paper-secondary uppercase tracking-widest">
                <span className="text-paper-ink font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-volt"></span>
                  SUBJECT // {personalInfo.name.toUpperCase()}
                </span>
                <span className="text-volt-deep font-mono font-bold">[DOCKED CARD]</span>
              </div>

              {/* Portrait Aspect Frame */}
              <div className="relative aspect-[4/5] rounded-lg overflow-hidden bg-charcoal">
                <picture className="w-full h-full block">
                  <source srcSet="/assets/hero/about-profile.webp" type="image/webp" />
                  <img 
                    src="/assets/hero/about-profile.webp" 
                    alt="Mayuresh Sonawane - Creative Developer & Builder"
                    className="about-profile-img w-full h-full object-cover object-center filter grayscale contrast-125 transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </picture>

                {/* Editorial Overlay Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-60"></div>
                
                {/* Micro Telemetry Badge (No Location Information) */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[10px] font-mono text-charcoal-text bg-charcoal/85 backdrop-blur-sm px-3 py-1.5 rounded border border-white/10">
                  <span className="font-medium">IDENTITY // BUILDER</span>
                  <span className="text-volt font-bold">PORTFOLIO // V3.0</span>
                </div>
              </div>

              {/* Card Footer Technical Meta */}
              <div className="pt-3 mt-1 flex items-center justify-between font-mono text-[10px] text-paper-muted">
                <span className="text-volt-deep font-semibold">SCROLL-TRANSFORMED ASSET</span>
                <span>FIG 01.A // DOCKED</span>
              </div>
            </div>

            {/* Micro Caption */}
            <p className="mt-4 font-mono text-[11px] text-paper-secondary tracking-wide uppercase max-w-[440px] text-center lg:text-left">
              The hero portrait seamlessly scales down and docks into this framed editorial card as you scroll.
            </p>
          </div>

          {/* Right Column: Oversized Narrative Typography & Manifesto */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            
            <div>
              {/* Editorial Lead Stamp */}
              <div className="mb-4 inline-flex items-center gap-2 text-volt-deep font-mono text-xs uppercase tracking-widest">
                <Quote className="w-4 h-4 fill-current" />
                <span>{personalInfo.manifesto.leadQuote}</span>
              </div>

              {/* Primary Statement Display Headline */}
              <h2 
                ref={headlineRef}
                className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-paper-ink uppercase tracking-tight leading-[1.05] mb-6"
              >
                "{personalInfo.heroHeadline}"
              </h2>

              {/* Supporting Editorial Description */}
              <p className="font-body font-medium text-lg sm:text-2xl text-paper-ink leading-relaxed mb-8 border-l-2 border-volt pl-4 py-1">
                {personalInfo.supportingDescription}
              </p>

              {/* Narrative Editorial Copy */}
              <div ref={textBlockRef} className="space-y-5 font-body text-base sm:text-lg text-paper-secondary leading-relaxed">
                {personalInfo.manifesto.paragraphs.map((p, idx) => (
                  <p key={idx}>
                    {p}
                  </p>
                ))}
              </div>

              {/* Core Disciplines Grid */}
              <div className="mt-10 pt-8 border-t border-paper-border grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                {personalInfo.manifesto.disciplines.map((d) => (
                  <div key={d.id} className="p-3.5 bg-paper rounded-lg border border-paper-border/60 hover:border-volt transition-colors">
                    <span className="text-volt-deep font-bold block mb-1">{d.id} // {d.tag}</span>
                    <span className="text-paper-ink font-semibold">{d.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Handwritten Signature Section with Real-Time Vector Stroke Draw */}
            <div className="mt-12 pt-8 border-t border-paper-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <span className="block font-mono text-[10px] text-paper-muted uppercase tracking-widest mb-1">
                  {personalInfo.signature.caption}
                </span>
                <Signature className="w-72 sm:w-96 md:w-[380px] text-paper-ink" color="#08080A" />
              </div>

              <div className="text-right font-mono text-xs text-paper-secondary">
                <div className="font-semibold text-paper-ink">{personalInfo.name.toUpperCase()}</div>
                <div className="text-[11px] text-paper-muted">{personalInfo.title.toUpperCase()}</div>
                <div className="text-[10px] text-volt-deep font-semibold mt-1">[AUTHENTIC HANDWRITTEN SCRIPT]</div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
