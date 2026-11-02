import React, { useState, useEffect } from 'react';
import { Eye, ExternalLink, Github, Sparkles, ArrowUpRight, Plus, FolderKanban, ShieldCheck } from 'lucide-react';

/**
 * Project Hall of Fame
 * Upgraded interactive project gallery driven dynamically by the project management backend.
 * MANDATORY: The public gallery initially renders a polished empty state.
 * Selected projects appear only after explicit publication from the Admin Dashboard.
 */
export default function ProjectHallOfFame({ onInspectProject, onOpenAdmin, refreshTrigger = 0 }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredProjectId, setHoveredProjectId] = useState(null);

  // Fetch published projects from API
  useEffect(() => {
    let isMounted = true;
    async function loadPublishedProjects() {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setProjects(data.projects || []);
          }
        }
      } catch (err) {
        console.warn('Could not load public projects from API:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadPublishedProjects();
    return () => { isMounted = false; };
  }, [refreshTrigger]);

  const getStatusBadge = (statusType, statusText) => {
    switch (statusType) {
      case 'in-development':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 font-mono text-[10px] font-semibold tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
            {statusText}
          </span>
        );
      case 'concept':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-cyan-300 font-mono text-[10px] font-semibold tracking-wider">
            {statusText}
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-volt/15 border border-volt/40 text-volt font-mono text-[10px] font-semibold tracking-wider">
            {statusText}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-white font-mono text-[10px] font-semibold tracking-wider">
            {statusText}
          </span>
        );
    }
  };

  return (
    <section 
      id="hall-of-fame"
      className="relative min-h-screen py-24 md:py-36 bg-charcoal text-charcoal-text border-b border-charcoal-border overflow-hidden"
    >
      {/* Editorial Decorative Grid & Crosshairs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="max-w-[1600px] h-full mx-auto px-4 sm:px-8 grid grid-cols-12 gap-4">
          <div className="col-span-1 border-r border-charcoal-border/40 h-full"></div>
          <div className="col-span-10 border-r border-charcoal-border/40 h-full hidden md:block"></div>
          <div className="col-span-1 h-full"></div>
        </div>
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
              <Sparkles className="w-3.5 h-3.5" />
              <span>[04] // CURATED TROPHY COLLECTION</span>
            </div>
            <h2 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white uppercase tracking-tight leading-none">
              PROJECT HALL OF FAME
            </h2>
          </div>

          <div className="max-w-md font-mono text-xs text-charcoal-secondary text-left md:text-right">
            <span>DRIVEN DIRECTLY BY THE PROTECTED PROJECT MANAGEMENT SYSTEM.</span>
            <div className="mt-2 text-volt font-bold">[EXCLUSIVE CURATED EXHIBITION]</div>
          </div>
        </div>

        {/* Dynamic Gallery Content */}
        {projects.length === 0 ? (
          /* MANDATORY POLISHED EMPTY STATE */
          <div className="relative my-8 p-12 sm:p-20 rounded-2xl bg-charcoal-surface border border-charcoal-border text-center overflow-hidden flex flex-col items-center justify-center">
            
            {/* Background subtle watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none">
              <span className="font-display font-black text-[22vw] uppercase tracking-tightest">
                FUTURE
              </span>
            </div>

            {/* Glowing Telemetry Indicator */}
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-2xl bg-charcoal border border-volt/40 flex items-center justify-center text-volt shadow-[0_0_30px_rgba(210,253,82,0.2)]">
                <FolderKanban className="w-8 h-8" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-volt animate-ping"></span>
            </div>

            {/* Empty State Headline & Supporting Text */}
            <span className="font-mono text-xs text-volt uppercase tracking-widest block mb-3 font-semibold">
              CURATED GALLERY ARCHIVE
            </span>

            <h3 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white uppercase tracking-tight max-w-2xl leading-[1.05]">
              THE NEXT CHAPTER IS YOURS TO DISCOVER.
            </h3>

            <p className="mt-4 font-body text-base sm:text-lg text-charcoal-secondary max-w-lg leading-relaxed">
              Selected projects will appear here soon. Add, edit, import from GitHub, and publish projects through the protected admin dashboard.
            </p>

            {/* Admin Console Action Trigger */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-volt text-charcoal font-mono text-xs uppercase tracking-wider font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  <span>MANAGE & PUBLISH PROJECTS</span>
                </button>
              )}
            </div>

            {/* Micro Metadata Footer */}
            <div className="mt-12 pt-8 border-t border-charcoal-border/60 w-full max-w-md flex items-center justify-between font-mono text-[11px] text-charcoal-muted uppercase">
              <span>STATUS // GALLERY READY</span>
              <span>ACCESS // PROTECTED</span>
            </div>

          </div>
        ) : (
          /* ACTIVE PUBLISHED PROJECTS GRID */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {projects.map((project) => {
              const isHovered = hoveredProjectId === project.id;

              return (
                <div
                  key={project.id}
                  onMouseEnter={() => setHoveredProjectId(project.id)}
                  onMouseLeave={() => setHoveredProjectId(null)}
                  className={`relative rounded-xl overflow-hidden bg-charcoal-surface border transition-all duration-500 ease-out flex flex-col justify-between group cursor-pointer ${
                    isHovered 
                      ? 'border-volt shadow-[0_0_35px_rgba(210,253,82,0.18)] translate-y-[-4px]' 
                      : 'border-charcoal-border hover:border-white/30'
                  }`}
                  onClick={() => onInspectProject && onInspectProject(project)}
                >
                  {/* Card Top Stamp Bar */}
                  <div className="p-5 border-b border-charcoal-border flex items-center justify-between font-mono text-xs text-charcoal-secondary uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold transition-colors duration-300 ${isHovered ? 'text-volt' : 'text-white'}`}>
                        {project.id}
                      </span>
                      <span>•</span>
                      <span className="text-[11px] truncate max-w-[180px] sm:max-w-none">{project.category}</span>
                    </div>
                    <div>
                      {getStatusBadge(project.status.toLowerCase(), project.status)}
                    </div>
                  </div>

                  {/* Card Interactive Image Canvas Frame */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/80">
                    <img
                      src={project.primaryImage}
                      alt={project.title}
                      className={`absolute inset-0 w-full h-full object-cover object-center filter grayscale contrast-125 transition-all duration-700 ease-out ${
                        isHovered ? 'opacity-0 scale-105' : 'opacity-80 scale-100'
                      }`}
                      loading="lazy"
                    />

                    <img
                      src={project.revealImage || project.primaryImage}
                      alt={`${project.title} Schematic`}
                      className={`absolute inset-0 w-full h-full object-cover object-center filter contrast-150 transition-all duration-700 ease-out ${
                        isHovered ? 'opacity-90 scale-105' : 'opacity-0 scale-95'
                      }`}
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-surface via-transparent to-transparent opacity-80"></div>

                    {/* Floating Action Trigger Button on Hover */}
                    <div className={`absolute bottom-4 right-4 z-20 transition-all duration-300 transform ${
                      isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                    }`}>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onInspectProject) onInspectProject(project);
                        }}
                        className="px-3.5 py-1.5 rounded-sm bg-volt text-charcoal font-mono text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-lg hover:brightness-110 active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>INSPECT PROJECT</span>
                      </button>
                    </div>

                    <div className="absolute top-4 left-4 z-20">
                      <span className={`font-mono text-[10px] px-2.5 py-1 rounded backdrop-blur-md border uppercase transition-colors duration-300 ${
                        isHovered ? 'bg-volt text-charcoal border-volt font-bold' : 'bg-black/60 text-white/70 border-white/10'
                      }`}>
                        {isHovered ? 'SCHEMATIC REVEALED' : 'HOVER TO REVEAL'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content & Metadata */}
                  <div className="p-6 md:p-8 flex flex-col justify-between flex-grow">
                    <div>
                      {project.subtitle && (
                        <div className="font-mono text-[10px] text-volt tracking-widest uppercase mb-1">
                          {project.subtitle}
                        </div>
                      )}
                      <h3 className={`font-display font-bold text-2xl sm:text-3xl uppercase tracking-tight transition-colors duration-300 ${
                        isHovered ? 'text-volt' : 'text-white'
                      }`}>
                        {project.title}
                      </h3>
                      
                      <p className="mt-3 font-body text-sm sm:text-base text-charcoal-secondary leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Technology Tags Strip */}
                    <div className="mt-6 pt-5 border-t border-charcoal-border flex flex-wrap items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {project.tags?.map(tag => (
                          <span 
                            key={tag}
                            className={`font-mono text-[10px] px-2 py-0.5 rounded uppercase transition-colors duration-300 ${
                              isHovered 
                                ? 'bg-volt/15 text-volt border border-volt/30' 
                                : 'bg-black/40 text-charcoal-muted border border-white/5'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-white/50 group-hover:text-volt flex items-center gap-1 transition-colors">
                          <span>DETAILS</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
