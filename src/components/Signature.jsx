import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Handwritten Signature Graphic for Mayuresh Sonawane.
 * Derived directly from Mayuresh's authentic handwritten reference artwork.
 * Combines real-time GSAP stroke-dashoffset vector draw animation with
 * the authentic high-resolution hand-drawn ink texture overlay.
 */
export default function Signature({ 
  className = "w-72 sm:w-96 md:w-[420px] h-28 sm:h-36", 
  color = "#08080A",
  showAuthenticInk = true 
}) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const paths = svgEl.querySelectorAll('.signature-path');
    
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current || svgEl,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(paths, {
            strokeDashoffset: 0,
            duration: 1.8,
            ease: 'power2.out',
            stagger: 0.16,
            onComplete: () => setHasAnimated(true),
          });
        },
        once: true,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const replay = () => {
    const svgEl = svgRef.current;
    if (!svgEl) return;
    setHasAnimated(false);
    const paths = svgEl.querySelectorAll('.signature-path');
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDashoffset = `${length}`;
    });
    gsap.to(paths, {
      strokeDashoffset: 0,
      duration: 1.6,
      ease: 'power2.out',
      stagger: 0.14,
      onComplete: () => setHasAnimated(true),
    });
  };

  const isLight = color === '#F5F5F0' || color === 'white' || color === '#FFF';
  const inkAsset = isLight 
    ? '/assets/signature/mayuresh-signature-light.webp' 
    : '/assets/signature/mayuresh-signature-dark.webp';

  return (
    <div 
      ref={containerRef}
      className={`relative inline-block cursor-pointer select-none group ${className}`} 
      onClick={replay} 
      title="Click to replay handwritten signature"
    >
      {/* 1. Dynamic SVG Vector Stroke Layer */}
      <svg 
        ref={svgRef}
        className="w-full h-full block" 
        viewBox="0 0 760 350" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Mayuresh Sonawane Authentic Handwritten Signature"
      >
        {/* Monogram Triangle with Apex Flourish Loop */}
        <path 
          d="M 26 280 L 138 72 C 146 50, 154 22, 160 24 C 166 26, 158 52, 142 66 C 134 74, 165 96, 216 114 L 266 256 L 26 280 Z" 
          stroke={color} 
          strokeWidth="3.4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="signature-path transition-opacity duration-300"
        />

        {/* Inscribed Sacred Oval */}
        <path 
          d="M 134 122 C 86 122, 64 165, 68 215 C 72 270, 96 320, 136 322 C 180 324, 204 275, 200 218 C 196 160, 172 122, 134 122 Z" 
          stroke={color} 
          strokeWidth="3.0" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="signature-path transition-opacity duration-300"
        />

        {/* Authentic 'M' Emblem */}
        <path 
          d="M 124 276 L 124 164 L 156 222 L 188 172 L 198 285" 
          stroke={color} 
          strokeWidth="3.6" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="signature-path transition-opacity duration-300"
        />

        {/* Cursive 'ayuresh' Script Flow */}
        <path 
          d="M 238 266 C 248 240, 264 228, 274 236 C 282 244, 276 264, 264 264 C 252 264, 252 242, 268 234 L 274 262 C 282 242, 292 230, 302 234 C 310 240, 308 258, 298 262 C 308 244, 318 232, 324 234 L 320 300 C 318 326, 296 328, 292 310 C 288 290, 316 266, 332 258 C 342 242, 350 236, 356 244 L 352 262 C 362 244, 372 236, 380 242 L 376 260 C 386 242, 404 232, 414 234 C 424 236, 422 254, 428 258 C 438 238, 452 232, 456 244 C 458 252, 450 260, 442 260 C 434 260, 436 248, 446 240 C 458 232, 474 232, 480 242 C 484 250, 480 260, 474 260 C 468 260, 472 248, 482 236 L 494 150 L 508 264 C 520 238, 542 228, 552 236 C 560 244, 556 258, 550 260" 
          stroke={color} 
          strokeWidth="3.2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="signature-path transition-opacity duration-300"
        />

        {/* Sweeping Underline in Voltage Lime */}
        <path 
          d="M 180 286 L 708 266" 
          stroke="#D2FD52" 
          strokeWidth="3.2" 
          strokeLinecap="round"
          className="signature-path transition-opacity duration-300"
        />

        {/* Accent Dot */}
        <circle 
          cx="735" 
          cy="252" 
          r="4.2" 
          fill={color} 
          className={`transition-opacity duration-500 ${hasAnimated ? 'opacity-100' : 'opacity-0'}`}
        />
      </svg>

      {/* 2. Authentic High-Resolution Hand-Drawn Ink Texture Overlay */}
      {showAuthenticInk && (
        <img
          src={inkAsset}
          alt="Mayuresh Sonawane Authentic Ink Signature"
          className={`absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-700 ease-out ${
            hasAnimated ? 'opacity-95' : 'opacity-0'
          }`}
        />
      )}

      {/* Micro Replay Hint */}
      <span className="absolute -bottom-3 right-0 font-mono text-[9px] text-paper-muted opacity-0 group-hover:opacity-100 transition-opacity">
        [AUTHENTIC SCRIPT // CLICK TO REPLAY]
      </span>
    </div>
  );
}
