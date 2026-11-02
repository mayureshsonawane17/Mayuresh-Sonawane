import React from 'react';
import { Sparkles, Terminal, Code2, Gamepad2, Layers } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

/**
 * HomeMarquee Component
 * Directly adapted from landonorris.com's home-marquee section.
 * Renders an oversized, continuous kinetic marquee ticker displaying
 * Mayuresh's hero headline and core creative developer disciplines.
 */
export default function HomeMarquee() {
  const marqueeItems = [
    { text: personalInfo.heroHeadline.toUpperCase(), icon: Sparkles, accent: true },
    { text: `${personalInfo.name.toUpperCase()} // ${personalInfo.title.toUpperCase()}`, icon: Terminal },
    { text: "WEBSITES • GAMES • INTERACTIVE DIGITAL EXPERIENCES", icon: Layers },
    { text: "GODOT ENGINE • THREE.JS • WEBGL • CREATIVE CODE", icon: Gamepad2, accent: true },
    { text: "ORIGIN 2D ACTION-ADVENTURE // IN ACTIVE DEVELOPMENT", icon: Code2 },
  ];

  return (
    <section 
      className="relative w-full py-4 sm:py-6 bg-paper-tint border-y border-paper-border overflow-hidden select-none z-20"
      aria-label="Kinetic Narrative Marquee"
    >
      {/* Decorative Side Gradient Vignettes */}
      <div className="absolute top-0 bottom-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-paper via-paper/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-paper via-paper/80 to-transparent z-10 pointer-events-none" />

      {/* Continuously Translating Track */}
      <div className="flex w-fit whitespace-nowrap animate-marquee">
        {/* Track 1 */}
        <div className="flex items-center gap-8 sm:gap-14 px-4 sm:px-7 font-display font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-paper-ink">
          {marqueeItems.map((item, idx) => (
            <div key={`m1-${idx}`} className="flex items-center gap-6 sm:gap-8">
              <span className={item.accent ? "text-paper-ink underline decoration-volt decoration-4 underline-offset-8" : "text-paper-ink/80"}>
                {item.text}
              </span>
              <span className="inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-volt text-paper-ink border border-volt-deep/30 shadow-sm">
                <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-paper-ink" />
              </span>
            </div>
          ))}
        </div>

        {/* Track 2 (Seamless loop duplicate) */}
        <div className="flex items-center gap-8 sm:gap-14 px-4 sm:px-7 font-display font-black text-2xl sm:text-4xl md:text-5xl uppercase tracking-tight text-paper-ink">
          {marqueeItems.map((item, idx) => (
            <div key={`m2-${idx}`} className="flex items-center gap-6 sm:gap-8">
              <span className={item.accent ? "text-paper-ink underline decoration-volt decoration-4 underline-offset-8" : "text-paper-ink/80"}>
                {item.text}
              </span>
              <span className="inline-flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-volt text-paper-ink border border-volt-deep/30 shadow-sm">
                <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-paper-ink" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

