import React, { useState } from 'react';
import { maskCollection } from '../data/portfolioData';
import { Eye, Shield, Sparkles, AlertCircle, ArrowRight, Layers, Scan } from 'lucide-react';

/**
 * MaskCollection Component — "THE MASK COLLECTION"
 * Replaces the reference helmet gallery with Mayuresh's Spider-Man mask showcase.
 * Features cinematic lighting, close-up reveals, interactive specs, and clear temporary disclaimers.
 */
export default function MaskCollection() {
  const [selectedMaskIndex, setSelectedMaskIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [wireframeMode, setWireframeMode] = useState(false);

  const activeMask = maskCollection.masks[selectedMaskIndex] || maskCollection.masks[0];

  return (
    <section 
      id="mask-collection"
      className="relative min-h-screen py-24 md:py-36 bg-charcoal text-charcoal-text border-b border-charcoal-border overflow-hidden"
    >
      {/* Registration Crosshairs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-12 left-6 text-charcoal-crosshair font-mono text-xs">+</div>
        <div className="absolute top-12 right-6 text-charcoal-crosshair font-mono text-xs">+</div>
        <div className="absolute bottom-12 left-6 text-charcoal-crosshair font-mono text-xs">+</div>
        <div className="absolute bottom-12 right-6 text-charcoal-crosshair font-mono text-xs">+</div>
      </div>

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-charcoal-border pb-8 mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 font-mono text-xs text-volt uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-volt" />
              <span>{maskCollection.tagline}</span>
            </div>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white uppercase tracking-tight leading-none">
              {maskCollection.title}
            </h2>
            <p className="mt-2 font-mono text-xs text-charcoal-secondary uppercase tracking-wider">
              {maskCollection.subtitle}
            </p>
          </div>

          <div className="max-w-md font-mono text-xs text-charcoal-secondary text-left md:text-right">
            <span>REINTERPRETING THE HELMET GALLERY INTO A CINEMATIC SPIDER-MAN MASK ARTIFACT COLLECTION.</span>
            <div className="mt-2 text-volt font-bold">[HOVER TO REVEAL TACTILE MESH & SCHEMATICS]</div>
          </div>
        </div>

        {/* Authentic Physical Artifact Verification Banner */}
        <div className="mb-12 p-4 rounded-xl bg-charcoal-surface border border-volt/30 flex items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2 text-volt">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span className="font-semibold uppercase tracking-wider">
              {maskCollection.statusBadge || "AUTHENTIC PHYSICAL ARTIFACT // MULTI-PERSPECTIVE STUDY"}
            </span>
          </div>
          <span className="hidden sm:inline text-charcoal-muted text-[10px]">
            [VERIFIED PHYSICAL ARTIFACT]
          </span>
        </div>

        {/* Center Stage: Interactive Cinematic Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left / Center: Large Cinematic Mask Viewer */}
          <div className="lg:col-span-7 flex flex-col">
            <div 
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black border border-charcoal-border hover:border-volt transition-all duration-500 shadow-2xl group cursor-pointer"
            >
              {/* Primary Cinematic Mask Image */}
              <img
                src={activeMask.image}
                alt={activeMask.name}
                className={`absolute inset-0 w-full h-full object-cover object-center filter contrast-125 transition-all duration-700 ease-out ${
                  isHovered || wireframeMode ? 'opacity-0 scale-105' : 'opacity-90 scale-100'
                }`}
                loading="lazy"
              />

              {/* Secondary Reveal Image (Tactile Mesh / Lens Close-up on Hover) */}
              <img
                src={activeMask.revealImage}
                alt={`${activeMask.name} Lens Detail`}
                className={`absolute inset-0 w-full h-full object-cover object-center filter contrast-150 transition-all duration-700 ease-out ${
                  isHovered || wireframeMode ? 'opacity-100 scale-105' : 'opacity-0 scale-95'
                }`}
                loading="lazy"
              />

              {/* Wireframe Matrix Overlay effect */}
              {wireframeMode && (
                <div className="absolute inset-0 bg-volt/10 backdrop-brightness-125 pointer-events-none mix-blend-screen flex items-center justify-center">
                  <div className="w-full h-full border border-volt/50 grid grid-cols-6 grid-rows-6 opacity-40">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div key={i} className="border border-volt/30"></div>
                    ))}
                  </div>
                </div>
              )}

              {/* Lighting Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80 pointer-events-none"></div>

              {/* Floating Mask Telemetry Pills */}
              <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
                <span className="font-mono text-[10px] px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/10 text-white uppercase tracking-wider">
                  {activeMask.id}
                </span>
                <span className="font-mono text-[10px] px-3 py-1 rounded-full bg-volt text-charcoal font-bold uppercase tracking-wider">
                  {activeMask.specEdition}
                </span>
              </div>

              {/* Interactive Inspection Mode Toggle */}
              <div className="absolute top-5 right-5 z-20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setWireframeMode(!wireframeMode);
                  }}
                  className={`px-3 py-1.5 rounded-full font-mono text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1.5 transition-all backdrop-blur-md ${
                    wireframeMode 
                      ? 'bg-volt text-charcoal shadow-lg border border-volt' 
                      : 'bg-black/60 text-white/80 hover:text-white border border-white/20'
                  }`}
                  title="Toggle wireframe mesh scan"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>{wireframeMode ? 'MESH SCAN ACTIVE' : 'TOGGLE SCAN'}</span>
                </button>
              </div>

              {/* Bottom Mask Identifier */}
              <div className="absolute bottom-5 left-5 right-5 z-20 flex items-end justify-between">
                <div>
                  <span className="font-mono text-[10px] text-volt uppercase tracking-widest block mb-0.5">
                    ARTIFACT IDENTITY
                  </span>
                  <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white uppercase tracking-tight">
                    {activeMask.name}
                  </h3>
                </div>

                <div className="font-mono text-[10px] text-charcoal-muted uppercase">
                  {isHovered ? 'REVEAL MODE ENGAGED' : 'HOVER TO REVEAL MESH'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mask Technical Specifications & Storytelling */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 font-mono text-xs text-volt uppercase tracking-widest mb-3">
                <Shield className="w-4 h-4" />
                <span>TECHNICAL CONSTRUCT & MATERIALS</span>
              </div>

              <h3 className="font-display font-bold text-3xl sm:text-4xl text-white uppercase tracking-tight mb-4">
                {activeMask.name}
              </h3>

              <p className="font-body text-base text-charcoal-secondary leading-relaxed mb-6">
                {activeMask.description}
              </p>

              {/* Spec Specifications Table */}
              <div className="space-y-3 font-mono text-xs border-t border-charcoal-border pt-6">
                <div className="flex items-start justify-between py-2 border-b border-charcoal-border/60">
                  <span className="text-charcoal-muted uppercase">FABRIC CONSTRUCT</span>
                  <span className="text-white font-medium text-right max-w-xs">{activeMask.material}</span>
                </div>

                <div className="flex items-start justify-between py-2 border-b border-charcoal-border/60">
                  <span className="text-charcoal-muted uppercase">OPTIC LENSES</span>
                  <span className="text-white font-medium text-right max-w-xs">{activeMask.lenses}</span>
                </div>

                <div className="flex items-start justify-between py-2 border-b border-charcoal-border/60">
                  <span className="text-charcoal-muted uppercase">VISUAL RECOGNITION</span>
                  <span className="text-volt font-semibold">SPIDER-MAN SIGNATURE</span>
                </div>
              </div>

              {/* Tags Strip */}
              <div className="mt-6 flex flex-wrap gap-2">
                {activeMask.tags.map(tag => (
                  <span key={tag} className="font-mono text-[10px] px-2.5 py-1 rounded bg-black/50 border border-white/10 text-charcoal-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Mask Selection Switcher Tabs */}
            <div className="pt-6 border-t border-charcoal-border">
              <span className="block font-mono text-[10px] text-charcoal-muted uppercase tracking-widest mb-3">
                SELECT ARTIFACT SPECIFICATION
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {maskCollection.masks.map((mask, idx) => (
                  <button
                    key={mask.id}
                    onClick={() => setSelectedMaskIndex(idx)}
                    className={`p-3 rounded-lg border text-left font-mono transition-all duration-300 ${
                      selectedMaskIndex === idx
                        ? 'border-volt bg-volt/10 text-white shadow-lg'
                        : 'border-charcoal-border bg-charcoal-surface text-charcoal-secondary hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <span className="block text-[10px] text-volt font-bold">VIEW 0{idx + 1}</span>
                    <span className="block text-xs font-semibold truncate uppercase mt-0.5">{mask.name.split(' // ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

