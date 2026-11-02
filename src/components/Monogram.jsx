import React from 'react';

/**
 * Geometric "MS" Monogram
 * Derived directly from Mayuresh Sonawane's authentic hand-drawn emblem:
 * Sacred triangle with apex flourish loop, inscribed circle, and stylized 'M' initial.
 */
export default function Monogram({ className = "w-8 h-8", color = "currentColor" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Mayuresh Sonawane Monogram"
    >
      {/* Outer precision corner ticks */}
      <path d="M 6 18 V 6 H 18" stroke={color} strokeWidth="2.5" opacity="0.4" />
      <path d="M 114 18 V 6 H 102" stroke={color} strokeWidth="2.5" opacity="0.4" />
      <path d="M 6 102 V 114 H 18" stroke={color} strokeWidth="2.5" opacity="0.4" />
      <path d="M 114 102 V 114 H 102" stroke={color} strokeWidth="2.5" opacity="0.4" />

      {/* Monogram Triangle with Apex Flourish Loop */}
      <path
        d="M 22 90 L 58 18 C 61 11, 65 7, 68 9 C 71 11, 68 18, 62 24 L 98 90 Z"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inscribed Sacred Circle */}
      <circle
        cx="60"
        cy="62"
        r="24"
        stroke={color}
        strokeWidth="2.6"
        opacity="0.85"
      />

      {/* Authentic 'M' Emblem inside Circle */}
      <path
        d="M 48 76 V 46 L 60 62 L 72 46 V 76"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Voltage Lime Horizon Strike */}
      <line
        x1="18"
        y1="90"
        x2="102"
        y2="90"
        stroke="#D2FD52"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
