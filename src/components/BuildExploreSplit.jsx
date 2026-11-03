import React, { useState } from 'react';

/**
 * Build & Explore Split Section — Exact Lando Norris Dual Editorial Experience
 * Reference: landonorris.com "ON TRACK" vs "OFF TRACK" split section
 * Features:
 * - Left Figure: Authentic Spider-Man Cowl in side-profile facing right
 * - Right Figure: Mayuresh Sonawane in side-profile facing left
 * - Canvas: Warm cream paper (#FAF9F5) with organic topographic elevation curves
 * - Center: Dual editorial pathways:
 *     Column 1: "ON TRACK" with electric neon lime marker script overlay + curved voltage button
 *     Column 2: "OFF TRACK" with editorial serif + curved voltage button
 * - Eyeline Match: Mask eye lens and Mayuresh's gaze aligned on the same horizontal horizon line
 */
export default function BuildExploreSplit({ onSelectCategory }) {
  const [hoveredSide, setHoveredSide] = useState(null); // 'on-track' | 'off-track' | null

  const handleNavigate = (category, sectionId) => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    const el = document.querySelector(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      id="build-explore"
      className="relative min-h-[92vh] lg:min-h-screen bg-[#FAF9F5] text-paper-ink border-b border-paper-border overflow-hidden flex flex-col justify-between select-none"
    >
      {/* 1. Organic Topographic Elevation Contour Lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-85">
        <svg 
          className="w-full h-full object-cover" 
          viewBox="0 0 1600 900" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Contour 1: Upper organic curve wrapping helmet */}
          <path 
            d="M -120 180 C 180 140, 320 320, 520 280 C 720 240, 880 120, 1120 160 C 1360 200, 1500 80, 1720 120" 
            stroke="#E3E1D7" 
            strokeWidth="1.5" 
          />
          {/* Contour 2: Flowing mid-upper loop */}
          <path 
            d="M -80 340 C 150 260, 360 480, 680 430 C 950 390, 1100 240, 1380 270 C 1550 290, 1680 420, 1750 450" 
            stroke="#DAD8CD" 
            strokeWidth="1.8" 
          />
          {/* Contour 3: Core central topographic loop */}
          <path 
            d="M 280 -60 C 360 160, 480 340, 780 360 C 1080 380, 1220 200, 1340 -60" 
            stroke="#E7E5DB" 
            strokeWidth="1.4" 
            strokeDasharray="6 4"
          />
          {/* Contour 4: Mid-lower sweeping contour */}
          <path 
            d="M -100 560 C 160 510, 380 660, 640 600 C 920 540, 1120 630, 1380 570 C 1580 520, 1690 620, 1780 590" 
            stroke="#DAD8CD" 
            strokeWidth="1.8" 
          />
          {/* Contour 5: Lower curve wrapping Mayuresh's shoulders */}
          <path 
            d="M -60 760 C 220 700, 460 840, 780 780 C 1040 730, 1260 820, 1520 760 C 1680 720, 1760 780, 1820 750" 
            stroke="#E3E1D7" 
            strokeWidth="1.5" 
          />
          {/* Contour 6: Bottom boundary horizon */}
          <path 
            d="M 120 950 C 380 840, 620 870, 890 840 C 1160 810, 1340 920, 1620 940" 
            stroke="#E7E5DB" 
            strokeWidth="1.3" 
          />
        </svg>
      </div>

      {/* 2. Top Telemetry Header Bar */}
      <div className="relative z-20 max-w-[1600px] w-full mx-auto px-4 sm:px-8 py-5 border-b border-paper-border/60 flex items-center justify-between font-mono text-xs tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <span className="text-volt-deep font-bold">[02]</span>
          <span className="text-paper-ink font-semibold">DUAL EDITORIAL PATHWAYS</span>
          <span className="hidden md:inline text-paper-muted">•</span>
          <span className="hidden md:inline text-paper-secondary">SELECT TRAJECTORY</span>
        </div>
        <div className="flex items-center gap-4 text-paper-secondary">
          <span className="hidden sm:inline">MAYURESH SONAWANE</span>
          <span className="text-volt-deep font-semibold">[INTERACTIVE GATEWAYS]</span>
        </div>
      </div>

      {/* 3. Main Stage: The Exact Lando Norris Three-Zone Layout */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full max-w-[1700px] mx-auto px-4 sm:px-8 py-8 lg:py-16">
        
        {/* ========================================================= */}
        {/* LEFT FIGURE: SPIDER-MAN MASK IN SIDE-PROFILE (FACING RIGHT) */}
        {/* Eyeline-aligned with Mayuresh on the right                 */}
        {/* ========================================================= */}
        <div 
          className={`absolute left-0 bottom-8 sm:bottom-12 lg:bottom-16 pointer-events-none transition-all duration-700 ease-out z-10 hidden sm:block ${
            hoveredSide === 'on-track' 
              ? 'scale-105 translate-x-2 drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)]' 
              : hoveredSide === 'off-track' 
                ? 'opacity-35 scale-95 -translate-x-3' 
                : 'opacity-100 scale-100 translate-x-0'
          }`}
          style={{ width: 'clamp(210px, 21vw, 330px)' }}
        >
          <img 
            src="/assets/split/split-mask-profile.webp" 
            alt="Spider-Man Mask Profile" 
            className="w-full h-auto object-contain object-left-bottom block select-none pointer-events-none"
            loading="lazy"
          />
        </div>

        {/* ========================================================= */}
        {/* RIGHT FIGURE: MAYURESH IN SIDE-PROFILE (FACING LEFT)      */}
        {/* ========================================================= */}
        <div 
          className={`absolute right-0 bottom-0 pointer-events-none transition-all duration-700 ease-out z-10 hidden sm:block ${
            hoveredSide === 'off-track' 
              ? 'scale-105 -translate-x-2 drop-shadow-[0_20px_35px_rgba(0,0,0,0.12)]' 
              : hoveredSide === 'on-track' 
                ? 'opacity-35 scale-95 translate-x-3' 
                : 'opacity-100 scale-100 translate-x-0'
          }`}
          style={{ width: 'clamp(230px, 23vw, 360px)' }}
        >
          <img 
            src="/assets/split/split-mayuresh-profile.webp" 
            alt="Mayuresh Sonawane Profile" 
            className="w-full h-auto object-contain object-right-bottom block select-none pointer-events-none"
            loading="lazy"
          />
        </div>

        {/* ========================================================= */}
        {/* CENTER STAGE: DUAL "ON TRACK" & "OFF TRACK" COLUMNS       */}
        {/* Exact typography, sizing and spacing matching Lando Norris*/}
        {/* ========================================================= */}
        <div className="relative z-20 w-full max-w-[680px] lg:max-w-[740px] mx-auto grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-14 lg:gap-20 items-start px-4">
          
          {/* ----------------------------------------------------- */}
          {/* COLUMN 1: ON TRACK (Technical & Systems Pillar)       */}
          {/* ----------------------------------------------------- */}
          <div 
            onMouseEnter={() => setHoveredSide('on-track')}
            onMouseLeave={() => setHoveredSide(null)}
            onClick={() => handleNavigate('BUILD', '#build')}
            className={`group flex flex-col justify-between p-6 sm:p-7 rounded-2xl transition-all duration-500 cursor-pointer text-left ${
              hoveredSide === 'on-track' 
                ? 'bg-paper-pure/85 shadow-xl backdrop-blur-sm -translate-y-1 ring-1 ring-black/5' 
                : 'hover:bg-paper-pure/40'
            }`}
          >
            <div>
              {/* Stacked Heading: ON (Serif) + TRACK (Bold Sans) + Neon Script */}
              <div className="relative inline-block select-none mb-6">
                
                {/* Expressive Neon Lime Marker Script "ON" */}
                {/* Slanted diagonally across the serif "ON", just like Lando Norris */}
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 pointer-events-none z-20 drop-shadow-[0_2px_12px_rgba(210,253,82,0.8)] -rotate-[16deg]">
                  <svg 
                    width="120" 
                    height="80" 
                    viewBox="0 0 120 80" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-24 sm:w-28 h-auto"
                  >
                    {/* Fluid 'O' Loop */}
                    <path 
                      d="M 40 18 C 24 16, 12 28, 14 46 C 16 62, 30 70, 44 66 C 58 62, 63 44, 60 28 C 57 16, 46 16, 38 18" 
                      stroke="#D2FD52" 
                      strokeWidth="7" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                    {/* Dynamic 'N' Bridge & Downward Stroke */}
                    <path 
                      d="M 68 36 L 66 66 M 66 42 C 75 30, 92 28, 102 38 C 108 45, 108 58, 106 68" 
                      stroke="#D2FD52" 
                      strokeWidth="7" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                    />
                  </svg>
                </div>

                {/* Base Editorial Serif "ON" */}
                <div className="font-editorial italic font-normal text-6xl sm:text-7xl lg:text-8xl text-paper-ink leading-none tracking-tight">
                  ON
                </div>

                {/* Base Bold Punchy Grotesk Sans "TRACK" */}
                <div className="font-body font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight text-paper-ink uppercase leading-none -mt-2 sm:-mt-3 group-hover:text-volt-deep transition-colors duration-300">
                  TRACK
                </div>
              </div>

              {/* Supporting Editorial Paragraph */}
              <p className="font-body text-sm sm:text-base text-paper-secondary leading-relaxed max-w-[260px] sm:max-w-[280px] mb-8">
                Most recent builds, software systems, Godot engine architecture, and production engineering.
              </p>
            </div>

            {/* Lando Norris Voltage Lime Rounded Action Trigger */}
            <div>
              <button 
                type="button"
                className="w-12 h-12 rounded-2xl bg-volt flex items-center justify-center text-charcoal shadow-sm group-hover:bg-[#C2EE35] group-hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="Navigate On Track builds"
              >
                {/* Curved Down-Right Hook Arrow (Exact Lando Norris Style) */}
                <svg 
                  className="w-5 h-5 text-charcoal group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M 6 8 L 12 8 C 15 8, 17 10, 17 13 L 17 19" />
                  <polyline points="13 15 17 19 21 15" />
                </svg>
              </button>
            </div>
          </div>

          {/* ----------------------------------------------------- */}
          {/* COLUMN 2: OFF TRACK (Creative Labs & Culture Pillar)  */}
          {/* ----------------------------------------------------- */}
          <div 
            onMouseEnter={() => setHoveredSide('off-track')}
            onMouseLeave={() => setHoveredSide(null)}
            onClick={() => handleNavigate('EXPLORE', '#mask-collection')}
            className={`group flex flex-col justify-between p-6 sm:p-7 rounded-2xl transition-all duration-500 cursor-pointer text-left ${
              hoveredSide === 'off-track' 
                ? 'bg-paper-pure/85 shadow-xl backdrop-blur-sm -translate-y-1 ring-1 ring-black/5' 
                : 'hover:bg-paper-pure/40'
            }`}
          >
            <div>
              {/* Stacked Heading: OFF (Serif) + TRACK (Bold Sans) */}
              <div className="relative inline-block select-none mb-6">
                
                {/* Base Editorial Serif "OFF" */}
                <div className="font-editorial italic font-normal text-6xl sm:text-7xl lg:text-8xl text-paper-ink leading-none tracking-tight">
                  OFF
                </div>

                {/* Base Bold Punchy Grotesk Sans "TRACK" */}
                <div className="font-body font-black text-5xl sm:text-6xl lg:text-7xl tracking-tight text-paper-ink uppercase leading-none -mt-2 sm:-mt-3 group-hover:text-volt-deep transition-colors duration-300">
                  TRACK
                </div>
              </div>

              {/* Supporting Editorial Paragraph */}
              <p className="font-body text-sm sm:text-base text-paper-secondary leading-relaxed max-w-[260px] sm:max-w-[280px] mb-8">
                Creative experiments, GLSL shaders, Spider-Man cowl collection, and interactive digital stories.
              </p>
            </div>

            {/* Lando Norris Voltage Lime Rounded Action Trigger */}
            <div>
              <button 
                type="button"
                className="w-12 h-12 rounded-2xl bg-volt flex items-center justify-center text-charcoal shadow-sm group-hover:bg-[#C2EE35] group-hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="Navigate Off Track creative labs"
              >
                {/* Curved Down-Right Hook Arrow (Exact Lando Norris Style) */}
                <svg 
                  className="w-5 h-5 text-charcoal group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M 6 8 L 12 8 C 15 8, 17 10, 17 13 L 17 19" />
                  <polyline points="13 15 17 19 21 15" />
                </svg>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* 4. Bottom Telemetry Footer Strip */}
      <div className="relative z-20 max-w-[1600px] w-full mx-auto px-4 sm:px-8 py-4 border-t border-paper-border/60 flex items-center justify-between font-mono text-[11px] text-paper-muted uppercase tracking-wider">
        <span>ARTIFACT // SPIDER-MAN COWL [LEFT]</span>
        <span className="hidden sm:inline">DUAL TRAJECTORY ARCHITECTURE</span>
        <span>SUBJECT // MAYURESH PROFILE [RIGHT]</span>
      </div>

    </section>
  );
}
