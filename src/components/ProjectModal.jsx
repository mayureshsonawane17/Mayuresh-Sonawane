import React from 'react';
import { X, ExternalLink, Github, Sparkles, CheckCircle, Cpu, Layers } from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/80 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
    >
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-charcoal text-charcoal-text border border-volt/40 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between p-6 border-b border-charcoal-border bg-charcoal-surface">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-volt text-charcoal font-bold">
              {project.id}
            </span>
            <span className="font-mono text-xs text-charcoal-secondary uppercase tracking-widest">
              {project.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-charcoal-secondary hover:text-white transition-colors"
            aria-label="Close project modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-8">
          
          {/* Dual Image Comparison Carousel / Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative aspect-video rounded-lg overflow-hidden border border-charcoal-border bg-black">
              <img 
                src={project.primaryImage} 
                alt={`${project.title} Interface`}
                className="w-full h-full object-cover filter contrast-125"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white/80 border border-white/10">
                PRIMARY PREVIEW
              </span>
            </div>

            <div className="relative aspect-video rounded-lg overflow-hidden border border-charcoal-border bg-black">
              <img 
                src={project.revealImage} 
                alt={`${project.title} Schematic`}
                className="w-full h-full object-cover filter contrast-150"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-volt text-charcoal text-[10px] font-mono font-bold">
                SCHEMATIC / WIREFRAME
              </span>
            </div>
          </div>

          {/* Title & Detailed Narrative */}
          <div>
            <div className="font-mono text-xs text-volt uppercase tracking-wider mb-1 font-semibold">
              {project.subtitle} • {project.status}
            </div>
            <h2 id="modal-project-title" className="font-display font-extrabold text-3xl sm:text-4xl text-white uppercase tracking-tight">
              {project.title}
            </h2>
            <p className="mt-3 font-body text-base sm:text-lg text-charcoal-secondary leading-relaxed">
              {project.longDescription || project.description}
            </p>
          </div>

          {/* Project Status Specifications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
            <div className="p-4 rounded-lg bg-charcoal-surface border border-charcoal-border">
              <div className="flex items-center gap-2 text-volt mb-2">
                <CheckCircle className="w-4 h-4" />
                <span className="font-bold">STATUS & LIFECYCLE</span>
              </div>
              <p className="text-charcoal-secondary">
                {project.status === 'IN DEVELOPMENT' 
                  ? 'Currently in active engineering development. Gameplay systems, save states, and loop mechanics are in progress.'
                  : project.status === 'CONCEPT'
                  ? 'Exploratory design concept validating typography, micro-interactions, and visual commerce aesthetics.'
                  : project.status === 'OPEN SOURCE'
                  ? 'Open-source project open to developer contributions and community feedback on GitHub.'
                  : 'Completed client / personal project with responsive UI design and optimized layout.'}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-charcoal-surface border border-charcoal-border">
              <div className="flex items-center gap-2 text-volt mb-2">
                <Layers className="w-4 h-4" />
                <span className="font-bold">EXECUTION DISCIPLINE</span>
              </div>
              <p className="text-charcoal-secondary">
                Rigorous code structure, responsive layout principles, and zero fabricated performance metrics.
              </p>
            </div>
          </div>

          {/* Technology Badges */}
          <div>
            <span className="block font-mono text-xs text-charcoal-muted uppercase tracking-widest mb-3">
              TECHNOLOGY MATRIX
            </span>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded bg-black/60 border border-volt/30 text-volt font-mono text-xs font-semibold">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="p-6 border-t border-charcoal-border bg-charcoal-surface flex items-center justify-between font-mono text-xs">
          <div className="text-charcoal-muted">
            SPECIFICATION // MAYURESH SONAWANE PORTFOLIO
          </div>

          <div className="flex items-center gap-4">
            {project.githubUrl ? (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-charcoal border border-charcoal-border hover:border-volt text-white transition-colors"
              >
                <Github className="w-4 h-4 text-volt" />
                <span>GITHUB REPO</span>
              </a>
            ) : (
              <span className="px-3 py-1.5 rounded bg-charcoal-elevated border border-charcoal-border text-charcoal-muted text-[11px]">
                {project.status === 'IN DEVELOPMENT' ? 'PRIVATE DEV REPO' : 'SOURCE CODE LOCAL'}
              </span>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-volt text-charcoal font-bold tracking-wider uppercase hover:brightness-105 active:scale-95 transition-all"
            >
              CLOSE INSPECTION
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
