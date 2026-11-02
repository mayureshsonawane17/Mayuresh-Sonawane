import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Handwritten Signature Graphic for Mayuresh Sonawane.
 * Built with clean vector paths and dynamic stroke-dashoffset animation.
 */
export default function Signature({ className = "w-64 h-24", color = "#08080A" }) {
  const svgRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const paths = svgEl.querySelectorAll('.signature-path');
    
    // Set initial dasharray and offset for each path
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });

    // Animate stroke draw-in on scroll trigger or entrance
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: svgEl,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(paths, {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: 'power2.out',
            stagger: 0.25,
            onComplete: () => setHasAnimated(true),
          });
        },
        once: true,
      });
    }, svgEl);

    return () => ctx.revert();
  }, []);

  const replay = () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    const paths = svgEl.querySelectorAll('.signature-path');
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDashoffset = `${length}`;
    });
    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 1.6,
      ease: 'power2.out',
      stagger: 0.2,
    });
  };

  return (
    <div className="relative inline-block cursor-pointer group" onClick={replay} title="Click to replay signature">
      <svg 
        ref={svgRef}
        className={className} 
        viewBox="0 0 450 140" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Mayuresh Sonawane Signature"
      >
        {/* Dynamic 'M' initial with expressive flourish */}
        <path 
          d="M30 110 C 25 80, 40 25, 55 22 C 70 20, 75 75, 88 95 C 100 110, 115 35, 125 32 C 135 30, 138 65, 145 92" 
          stroke={color} 
          strokeWidth="3.2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="signature-path transition-opacity duration-300"
        />
        {/* 'ayuresh' cursive flow */}
        <path 
          d="M148 88 C 158 75, 175 72, 180 85 C 185 96, 172 108, 162 105 C 155 102, 158 80, 192 78 C 210 77, 218 95, 222 102 C 226 108, 235 65, 238 62 C 242 60, 245 88, 252 100 C 260 102, 275 80, 282 82 C 288 85, 285 98, 296 98 C 305 98, 312 85, 318 82 C 324 80, 328 92, 335 95 C 342 98, 350 78, 355 82 C 360 85, 362 98, 370 98" 
          stroke={color} 
          strokeWidth="2.8" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="signature-path transition-opacity duration-300"
        />
        {/* Underline sweep gesture in voltage lime */}
        <path 
          d="M75 115 C 150 125, 280 128, 410 98" 
          stroke="#D2FD52" 
          strokeWidth="3.0" 
          strokeLinecap="round"
          className="signature-path transition-opacity duration-300"
        />
        {/* End accent dot */}
        <circle 
          cx="418" 
          cy="96" 
          r="3.5" 
          fill={color} 
          className={`transition-opacity duration-500 ${hasAnimated ? 'opacity-100' : 'opacity-0'}`}
        />
      </svg>
      <span className="absolute -bottom-2 right-0 font-mono text-[9px] text-paper-muted opacity-0 group-hover:opacity-100 transition-opacity">
        [CLICK TO REPLAY]
      </span>
    </div>
  );
}
