import React, { useState } from 'react';
import { Terminal, Sparkles, ArrowRight, Code2, Layers, Cpu } from 'lucide-react';

/**
 * Build & Explore Split Section — Cinematic Split Interaction
 * Inspired by Lando Norris's "On Track" vs "Off Track" dual editorial storytelling.
 * BUILD represents technical development and engineering.
 * EXPLORE represents creative technology, experiments and visual exploration.
 * NO AUTOMATICALLY POPULATED UNSELECTED PROJECTS.
 */
export default function BuildExploreSplit({ onSelectCategory }) {
  const [activeSide, setActiveSide] = useState(null); // 'build' | 'explore' | null

  return (
    <section 
      id="build-explore"
      className="relative min-h-[90vh] bg-charcoal text-charcoal-text border-b border-charcoal-border overflow-hidden"
    >
      {/* Top Telemetry Header */}
      <div className="relative z-20 max-w-[1600px] mx-auto px-4 sm:px-8 py-6 border-b border-charcoal-border flex items-center justify-between font-mono text-xs tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <span className="text-volt font-bold">[02]</span>
          <span className="text-white font-semibold">DUAL EDITORIAL PATHWAYS</span>
          <span className="hidden md:inline text-charcoal-muted">•</span>
          <span className="hidden md:inline text-charcoal-secondary">SPLIT STORYTELLING</span>
        </div>
        <div className="flex items-center gap-4 text-charcoal-secondary">
          <span className="hidden sm:inline">SELECT TRAJECTORY</span>
          <span className="text-volt font-semibold">[INTERACTIVE ENTRANCES]</span>
        </div>
      </div>

      {/* Split Dual Doors Container */}
      <div className="relative z-10 flex flex-col lg:flex-row w-full min-h-[750px]">
        
        {/* DOOR 1: BUILD (Technical Development & Systems Engineering) */}
        <div 
          onMouseEnter={() => setActiveSide('build')}
          onMouseLeave={() => setActiveSide(null)}
          className={`relative flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-charcoal-border transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group overflow-hidden cursor-pointer ${
            activeSide === 'build' ? 'lg:flex-[1.4]' : activeSide === 'explore' ? 'lg:flex-[0.7]' : 'lg:flex-1'
          }`}
          onClick={() => onSelectCategory && onSelectCategory('BUILD')}
        >
          {/* Background Layered Photography */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1600&auto=format&fit=crop" 
              alt="Build - Technical Software Engineering"
              className="w-full h-full object-cover object-center filter grayscale brightness-50 contrast-125 transition-transform duration-1000 ease-out group-hover:scale-105 group-hover:brightness-60"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/40 group-hover:via-charcoal/50 transition-colors duration-500"></div>
          </div>

          {/* Top Stamp */}
          <div className="relative z-10 flex items-center justify-between font-mono text-xs text-charcoal-secondary uppercase tracking-widest">
            <div className="flex items-center gap-2 text-white">
              <Terminal className="w-4 h-4 text-volt" />
              <span className="font-semibold">ENGINEERING & SYSTEMS</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-charcoal-elevated border border-charcoal-border text-[10px] text-volt font-bold">
              01 // CORE
            </span>
          </div>

          {/* Center Stage Typographic Identity */}
          <div className="relative z-10 my-auto py-12">
            <span className="font-mono text-xs text-volt tracking-widest uppercase block mb-3 font-semibold">
              [TECHNICAL PILLAR]
            </span>
            <h3 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white uppercase tracking-tight leading-[0.95] group-hover:text-volt transition-colors duration-300">
              BUILD
            </h3>
            <p className="mt-4 font-body text-base sm:text-lg text-charcoal-secondary max-w-md leading-relaxed group-hover:text-charcoal-text transition-colors duration-300">
              Technical software architecture, game systems, state machines, clean codebases, and production-grade applications.
            </p>

            {/* Disciplines Chips */}
            <div className="mt-8 flex flex-wrap gap-2 font-mono text-xs">
              {['GAME ENGINES', 'GODOT 4.7', 'REACT', 'TYPESCRIPT', 'SYSTEM ARCHITECTURE', 'CLEAN CODE'].map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded bg-black/60 border border-white/10 text-charcoal-secondary group-hover:border-volt/40 group-hover:text-white transition-colors duration-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Interactive Trigger */}
          <div className="relative z-10 pt-6 border-t border-charcoal-border/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-volt group-hover:bg-volt group-hover:text-charcoal transition-all duration-300">
                <ArrowRight className="w-4 h-4" />
              </span>
              <span className="font-mono text-xs text-white uppercase tracking-wider font-semibold">
                NAVIGATE BUILD TRAJECTORY
              </span>
            </div>
            <span className="font-mono text-xs text-charcoal-muted">SPEC. 02-A</span>
          </div>
        </div>

        {/* DOOR 2: EXPLORE (Creative Technology & Visual Exploration) */}
        <div 
          onMouseEnter={() => setActiveSide('explore')}
          onMouseLeave={() => setActiveSide(null)}
          className={`relative flex-1 flex flex-col justify-between p-8 sm:p-12 lg:p-16 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group overflow-hidden cursor-pointer ${
            activeSide === 'explore' ? 'lg:flex-[1.4]' : activeSide === 'build' ? 'lg:flex-[0.7]' : 'lg:flex-1'
          }`}
          onClick={() => onSelectCategory && onSelectCategory('EXPLORE')}
        >
          {/* Background Layered Photography */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop" 
              alt="Explore - Creative Technology and Shaders"
              className="w-full h-full object-cover object-center filter grayscale brightness-50 contrast-125 transition-transform duration-1000 ease-out group-hover:scale-105 group-hover:brightness-60"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/70 to-charcoal/40 group-hover:via-charcoal/50 transition-colors duration-500"></div>
          </div>

          {/* Top Stamp */}
          <div className="relative z-10 flex items-center justify-between font-mono text-xs text-charcoal-secondary uppercase tracking-widest">
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="w-4 h-4 text-volt" />
              <span className="font-semibold">CREATIVE TECHNOLOGY & LABS</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-charcoal-elevated border border-charcoal-border text-[10px] text-volt font-bold">
              02 // LABS
            </span>
          </div>

          {/* Center Stage Typographic Identity */}
          <div className="relative z-10 my-auto py-12">
            <span className="font-mono text-xs text-volt tracking-widest uppercase block mb-3 font-semibold">
              [EXPERIMENTAL PILLAR]
            </span>
            <h3 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-white uppercase tracking-tight leading-[0.95] group-hover:text-volt transition-colors duration-300">
              EXPLORE
            </h3>
            <p className="mt-4 font-body text-base sm:text-lg text-charcoal-secondary max-w-md leading-relaxed group-hover:text-charcoal-text transition-colors duration-300">
              Real-time WebGL shaders, Three.js spatial physics, generative graphics, tactile micro-interactions, and visual experiments.
            </p>

            {/* Disciplines Chips */}
            <div className="mt-8 flex flex-wrap gap-2 font-mono text-xs">
              {['THREE.JS', 'GLSL SHADERS', 'WEBGL', 'R3F', 'CREATIVE COMPUTING', 'VISUAL STORYTELLING'].map(tag => (
                <span key={tag} className="px-2.5 py-1 rounded bg-black/60 border border-white/10 text-charcoal-secondary group-hover:border-volt/40 group-hover:text-white transition-colors duration-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Bottom Interactive Trigger */}
          <div className="relative z-10 pt-6 border-t border-charcoal-border/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center group-hover:border-volt group-hover:bg-volt group-hover:text-charcoal transition-all duration-300">
                <ArrowRight className="w-4 h-4" />
              </span>
              <span className="font-mono text-xs text-white uppercase tracking-wider font-semibold">
                LAUNCH EXPERIMENTAL LABS
              </span>
            </div>
            <span className="font-mono text-xs text-charcoal-muted">SPEC. 02-B</span>
          </div>
        </div>

      </div>
    </section>
  );
}
