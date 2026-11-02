import React, { useEffect, useState } from 'react';
import Monogram from './Monogram';

/**
 * Signature Lime Transition Panel
 * Inspired by the animated lime curtain transition on landonorris.com.
 * Features an original geometric panel with the "MS" personal monogram.
 */
export default function TransitionPanel({ isOpen, onClose, destinationTitle = "SYSTEM INITIALIZING" }) {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setAnimating(false);
        if (onClose) onClose();
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen && !animating) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] pointer-events-auto flex flex-col justify-between p-8 md:p-14 overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)]"
      style={{
        backgroundColor: '#D2FD52',
        transform: animating ? 'translateY(0%)' : 'translateY(-100%)',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Page transition panel"
    >
      {/* Top Telemetry Header */}
      <div className="flex items-center justify-between text-paper-ink font-mono text-xs tracking-widest uppercase border-b border-paper-ink/15 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-paper-ink animate-ping rounded-full inline-block"></span>
          <span className="font-semibold">[MS // TRANSITION MATRIX]</span>
        </div>
        <div className="hidden sm:block opacity-60">
          SYSTEM // MATRIX ARCHITECTURE V3.0
        </div>
        <div>
          REV // 2026.V3
        </div>
      </div>

      {/* Centerpiece: Geometric Monogram & Animated Destination */}
      <div className="flex flex-col items-center justify-center my-auto text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-paper-ink/10 rounded-xl blur-xl transform scale-125"></div>
          <div className="relative p-6 bg-paper-ink text-volt rounded-lg shadow-2xl">
            <Monogram className="w-20 h-20 md:w-28 md:h-28" color="#D2FD52" />
          </div>
        </div>

        <div className="font-mono text-xs uppercase tracking-widest text-paper-ink/70 mb-2">
          TRANSFERRING VIEWPORT TO
        </div>
        <h2 className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl text-paper-ink tracking-tight uppercase">
          {destinationTitle}
        </h2>
        
        {/* Progress ticker bar */}
        <div className="w-48 md:w-72 h-1 bg-paper-ink/20 mt-8 rounded-full overflow-hidden">
          <div className="h-full bg-paper-ink transition-all duration-1000 ease-out w-full animate-[wiggle_1.2s_ease-in-out]"></div>
        </div>
      </div>

      {/* Bottom Telemetry Footer */}
      <div className="flex items-center justify-between text-paper-ink font-mono text-[11px] tracking-widest uppercase border-t border-paper-ink/15 pt-4">
        <div>CHOREOGRAPHED TRANSITION // LENIS + GSAP</div>
        <div className="font-semibold">MAYURESH SONAWANE PORTFOLIO</div>
      </div>
    </div>
  );
}

