import React, { useEffect, useRef, useState, useId } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Authentic Handwritten Signature Component for Mayuresh Sonawane.
 * Derived directly from Mayuresh's original handwritten pen signature artwork.
 * 
 * Animation:
 * Features organic stroke-by-stroke handwriting reveal along the authentic pen path:
 * 1. Monogram triangle & apex flourish loop
 * 2. Inscribed circle / sacred oval
 * 3. Central 'M' emblem
 * 4. Fluid cursive "ayuresh" flow
 * 5. Sweeping flourish underlines with volt accent
 */
export default function Signature({ 
  className = "w-72 sm:w-96 md:w-[380px]", 
  color = "#08080A",
  showFlourish = true,
  variant = "dark" // "dark" | "blue" | "light" | "volt"
}) {
  const containerRef = useRef(null);
  const path1Ref = useRef(null);
  const path2Ref = useRef(null);
  const path3Ref = useRef(null);
  const path4Ref = useRef(null);
  const path5Ref = useRef(null);
  const finalRectRef = useRef(null);
  const underlineRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  const rawId = useId();
  const maskId = `sig-handwriting-mask-${rawId.replace(/:/g, '')}`;

  const isLight = color === '#F5F5F0' || color === 'white' || color === '#FFF' || color === '#FAF9F5' || variant === 'light';
  
  let inkAsset = '/assets/signature/mayuresh-signature-dark.webp';
  if (isLight) {
    inkAsset = '/assets/signature/mayuresh-signature-light.webp';
  } else if (variant === 'blue') {
    inkAsset = '/assets/signature/mayuresh-signature-blue.webp';
  } else if (variant === 'volt') {
    inkAsset = '/assets/signature/mayuresh-signature-volt.webp';
  }

  const animateSignature = (speed = 1.0) => {
    const p1 = path1Ref.current;
    const p2 = path2Ref.current;
    const p3 = path3Ref.current;
    const p4 = path4Ref.current;
    const p5 = path5Ref.current;
    const finalRect = finalRectRef.current;
    const flourish = underlineRef.current;

    if (!p1 || !p2 || !p3 || !p4 || !p5) return;

    const strokePaths = [p1, p2, p3, p4, p5];
    
    // Initialize dash arrays for all stroke mask paths
    strokePaths.forEach((path) => {
      const len = path.getTotalLength ? path.getTotalLength() : 800;
      path.style.strokeDasharray = `${len}`;
      path.style.strokeDashoffset = `${len}`;
    });

    if (finalRect) {
      finalRect.style.opacity = '0';
    }

    if (flourish) {
      const flen = flourish.getTotalLength ? flourish.getTotalLength() : 1020;
      flourish.style.strokeDasharray = `${flen}`;
      flourish.style.strokeDashoffset = `${flen}`;
      flourish.style.opacity = '0';
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setHasAnimated(true);
      }
    });

    // 1. Monogram triangle & apex loop (starts at base, leaps to apex loop, lands on base)
    const len1 = p1.getTotalLength ? p1.getTotalLength() : 800;
    tl.to(p1, {
      strokeDashoffset: 0,
      duration: 0.55 * speed,
      ease: 'power2.inOut'
    });

    // 2. Inscribed oval around 'M'
    const len2 = p2.getTotalLength ? p2.getTotalLength() : 600;
    tl.to(p2, {
      strokeDashoffset: 0,
      duration: 0.38 * speed,
      ease: 'power1.inOut'
    }, `-=${0.08 * speed}`);

    // 3. 'M' glyph strokes
    const len3 = p3.getTotalLength ? p3.getTotalLength() : 500;
    tl.to(p3, {
      strokeDashoffset: 0,
      duration: 0.38 * speed,
      ease: 'power1.inOut'
    }, `-=${0.05 * speed}`);

    // 4. Fluid cursive "ayuresh" flow (a -> y -> u -> r -> e -> s -> h)
    const len4 = p4.getTotalLength ? p4.getTotalLength() : 1400;
    tl.to(p4, {
      strokeDashoffset: 0,
      duration: 0.85 * speed,
      ease: 'power2.inOut'
    }, `-=${0.05 * speed}`);

    // 5. Double underline flourishes
    const len5 = p5.getTotalLength ? p5.getTotalLength() : 1800;
    tl.to(p5, {
      strokeDashoffset: 0,
      duration: 0.5 * speed,
      ease: 'power2.out'
    }, `-=${0.1 * speed}`);

    // 6. Volt flourish stroke sweeping in tandem
    if (flourish) {
      tl.to(flourish, {
        strokeDashoffset: 0,
        opacity: 0.95,
        duration: 0.48 * speed,
        ease: 'power3.out'
      }, `<`);
    }

    // 7. Flawless final reveal ensuring 100% full subpixel ink coverage
    if (finalRect) {
      tl.to(finalRect, {
        opacity: 1,
        duration: 0.25 * speed,
        ease: 'power1.out'
      }, `-=${0.1 * speed}`);
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 85%',
        onEnter: () => animateSignature(1.0),
        once: true,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const replay = () => {
    setHasAnimated(false);
    animateSignature(0.85); // Slightly faster on replay
  };

  return (
    <div 
      ref={containerRef}
      className={`relative inline-block cursor-pointer select-none group aspect-[2/1] ${className}`} 
      onClick={replay} 
      title="Click to replay authentic handwritten signature"
    >
      <svg 
        viewBox="0 0 1200 600" 
        className="w-full h-full block overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Mayuresh Sonawane Authentic Handwritten Signature"
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1200" height="600">
            {/* Base mask black (concealed) */}
            <rect x="0" y="0" width="1200" height="600" fill="black" />
            
            {/* Stroke 1: Apex loop & Monogram Triangle */}
            <path
              ref={path1Ref}
              d="M 95 455 L 170 310 Q 220 180 235 120 C 245 60 250 40 255 40 C 268 40 278 70 278 100 C 278 140 265 160 218 175 C 240 190 270 205 270 205 L 340 225 L 405 255 L 395 340 L 395 420 L 95 455 Z"
              fill="none"
              stroke="white"
              strokeWidth="50"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Stroke 2: Inscribed Sacred Oval */}
            <path
              ref={path2Ref}
              d="M 240 178 C 318 178 382 241 382 320 C 382 399 318 462 240 462 C 162 462 98 399 98 320 C 98 241 162 178 240 178 Z"
              fill="none"
              stroke="white"
              strokeWidth="50"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Stroke 3: 'M' Emblem */}
            <path
              ref={path3Ref}
              d="M 180 280 L 180 440 M 180 290 Q 210 325 240 365 Q 268 320 295 280 L 295 440"
              fill="none"
              stroke="white"
              strokeWidth="50"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Stroke 4: Cursive 'ayuresh' flow */}
            <path
              ref={path4Ref}
              d="M 430 415 C 445 375 480 360 495 385 C 505 405 485 430 455 425 C 440 425 455 385 495 385 L 495 430 C 510 380 520 370 530 400 L 535 460 C 538 520 541 558 525 558 C 510 558 505 500 520 450 L 555 415 C 570 370 585 370 595 425 C 605 370 620 370 628 425 C 640 370 655 370 665 425 C 675 375 695 370 700 425 C 715 375 735 370 740 425 C 750 375 770 370 770 425 C 785 385 810 370 824 230 C 830 230 838 340 838 440 C 850 370 875 350 895 380 L 915 445"
              fill="none"
              stroke="white"
              strokeWidth="50"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Stroke 5: Dual Underlines */}
            <path
              ref={path5Ref}
              d="M 90 448 L 920 448 M 90 488 L 1110 456"
              fill="none"
              stroke="white"
              strokeWidth="50"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Full unmask rect triggered at completion */}
            <rect
              ref={finalRectRef}
              x="0"
              y="0"
              width="1200"
              height="600"
              fill="white"
              style={{ opacity: 0 }}
            />
          </mask>
        </defs>

        {/* Authentic Handwritten Ink Graphic (Unveiled organically by handwriting mask) */}
        <image 
          href={inkAsset}
          x="0" 
          y="0" 
          width="1200" 
          height="600" 
          preserveAspectRatio="xMidYMid meet"
          mask={`url(#${maskId})`}
        />

        {/* Sweeping Voltage Lime Flourish Underline */}
        {showFlourish && (
          <path 
            ref={underlineRef}
            d="M 90 488 L 1110 456" 
            stroke="#D2FD52" 
            strokeWidth="3.2" 
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
