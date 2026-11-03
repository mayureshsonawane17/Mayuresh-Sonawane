import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Authentic Handwritten Signature Graphic for Mayuresh Sonawane.
 * Derived directly from Mayuresh's clearer handwritten pen signature artwork.
 * Features progressive handwriting stroke reveal, dynamic volt lime flourish underline, and replay interaction.
 */
export default function Signature({ 
  className = "w-72 sm:w-96 md:w-[380px]", 
  color = "#08080A",
  showFlourish = true
}) {
  const containerRef = useRef(null);
  const clipRef = useRef(null);
  const underlineRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const isLight = color === '#F5F5F0' || color === 'white' || color === '#FFF' || color === '#FAF9F5';
  const inkAsset = isLight 
    ? '/assets/signature/mayuresh-signature-light.webp' 
    : '/assets/signature/mayuresh-signature-dark.webp';

  const animateSignature = (duration = 1.8) => {
    if (!clipRef.current) return;
    
    const tl = gsap.timeline({
      onComplete: () => setHasAnimated(true)
    });

    // 1. Reveal authentic signature progressively from left to right like natural handwriting
    tl.fromTo(
      clipRef.current,
      { attr: { width: 0 } },
      { attr: { width: 1200 }, duration: duration, ease: 'power2.inOut' }
    );

    // 2. Animate sweeping voltage lime flourish underline in tandem
    if (underlineRef.current) {
      const path = underlineRef.current;
      const length = path.getTotalLength ? path.getTotalLength() : 980;
      path.style.strokeDasharray = `${length}`;
      tl.fromTo(
        path,
        { strokeDashoffset: length, opacity: 0 },
        { strokeDashoffset: 0, opacity: 0.95, duration: duration * 0.55, ease: 'power3.out' },
        `-=${duration * 0.45}`
      );
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 85%',
        onEnter: () => animateSignature(1.8),
        once: true,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const replay = () => {
    setHasAnimated(false);
    animateSignature(1.4);
  };

  return (
    <div 
      ref={containerRef}
      className={`relative inline-block cursor-pointer select-none group aspect-[2/1] ${className}`} 
      onClick={replay} 
      title="Click to replay handwritten signature"
    >
      <svg 
        viewBox="0 0 1200 600" 
        className="w-full h-full block overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Mayuresh Sonawane Authentic Handwritten Signature"
      >
        <defs>
          <clipPath id="mayuresh-sig-clip">
            <rect ref={clipRef} x="0" y="0" width="1200" height="600" />
          </clipPath>
        </defs>

        {/* Authentic Handwritten Ink Graphic with Progressive Clip Reveal */}
        <image 
          href={inkAsset}
          x="0" 
          y="0" 
          width="1200" 
          height="600" 
          preserveAspectRatio="xMidYMid meet"
          clipPath="url(#mayuresh-sig-clip)"
        />

        {/* Sweeping Voltage Lime Flourish Underline */}
        {showFlourish && (
          <path 
            ref={underlineRef}
            d="M 120 454 L 1100 458" 
            stroke="#D2FD52" 
            strokeWidth="3.4" 
            strokeLinecap="round"
            className="pointer-events-none transition-opacity duration-300"
          />
        )}
      </svg>

      {/* Micro Replay Hint */}
      <span className="absolute -bottom-3 right-0 font-mono text-[9px] text-paper-muted opacity-0 group-hover:opacity-100 transition-opacity">
        [AUTHENTIC SCRIPT // CLICK TO REPLAY]
      </span>
    </div>
  );
}
