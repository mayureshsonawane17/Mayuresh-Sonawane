import React from 'react';

/**
 * Geometric "MS" Monogram
 * Inspired by aerodynamic motorsport emblems and architectural geometry.
 */
export default function Monogram({ className = "w-8 h-8", color = "currentColor" }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Mayuresh Sonawane Monogram"
    >
      {/* Outer technical chamfered frame */}
      <rect 
        x="6" 
        y="6" 
        width="88" 
        height="88" 
        rx="4" 
        stroke={color} 
        strokeWidth="2.5" 
        strokeDasharray="4 2"
        opacity="0.3"
      />
      {/* Precision corner ticks */}
      <path d="M6 16V6H16" stroke={color} strokeWidth="3" />
      <path d="M94 16V6H84" stroke={color} strokeWidth="3" />
      <path d="M6 84V94H16" stroke={color} strokeWidth="3" />
      <path d="M94 84V94H84" stroke={color} strokeWidth="3" />

      {/* Interlocking geometric M and S */}
      {/* 'M' Letterform */}
      <path 
        d="M24 74V26L50 50L76 26V74" 
        stroke={color} 
        strokeWidth="6" 
        strokeLinecap="square" 
        strokeLinejoin="miter"
      />
      {/* High-speed 'S' slash accent */}
      <path 
        d="M32 38H68L32 62H68" 
        stroke="#D2FD52" 
        strokeWidth="4" 
        strokeLinecap="square"
        opacity="0.9"
      />
    </svg>
  );
}

