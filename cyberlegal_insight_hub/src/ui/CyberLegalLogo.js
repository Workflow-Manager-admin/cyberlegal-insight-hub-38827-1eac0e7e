import React from "react";

/**
 * PUBLIC_INTERFACE
 * CyberLegalLogo: Modern SVG logo for CyberLegal Insight Hub, styled for glass/neumorphic look.
 * - Accessible (alt text via title, aria-label)
 * - Responsive and prominent for navbar use
 * - Colors use CSS variables for theming, with glassy/neumorphic shadows
 */
function CyberLegalLogo({
  size = 36,
  title = "CyberLegal Insight Hub Logo",
  ...props
}) {
  // SVG design: Shield + digital motif, blue/yellow accent, subtle glass shadow.
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={title}
      role="img"
      style={{
        display: "block",
        filter:
          "drop-shadow(0 4px 10px rgba(37,99,235,0.09)) drop-shadow(0 1.5px 4px #fbbf2435)",
        ...props.style,
      }}
      {...props}
    >
      <title>{title}</title>
      <defs>
        {/* Glass gradient for shield */}
        <linearGradient
          id="cyberlegal-shield-bg"
          x1="0"
          y1="0"
          x2="44"
          y2="44"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--primary,#2563eb)" stopOpacity="0.86" />
          <stop offset="0.55" stopColor="var(--base-light,#fff)" stopOpacity="0.24" />
          <stop offset="1" stopColor="var(--accent,#fbbf24)" stopOpacity="0.82" />
        </linearGradient>
        {/* Neumorph edge shadow */}
        <filter id="cyberlegal-neu-shadow" x="-20%" y="-10%" width="140%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#d1d9e6" floodOpacity="0.13"/>
          <feDropShadow dx="0" dy="4" stdDeviation="5.5" floodColor="#2563eb" floodOpacity="0.14"/>
        </filter>
      </defs>
      {/* Shield outline for legal/cyber motif */}
      <path
        d="M22 3.6C29.6 6.6 37.9 7.8 39.2 9.1c0 17.7-5 26.5-17.2 30.6-12.2-4.2-17.2-12.9-17.2-30.6C5.8 7.8 14.4 6.6 22 3.6z"
        fill="url(#cyberlegal-shield-bg)"
        stroke="var(--primary,#2563eb)"
        strokeWidth="2"
        filter="url(#cyberlegal-neu-shadow)"
      />
      {/* Digital/Circuit mark for "insight" */}
      <g>
        <circle
          cx="22"
          cy="18.7"
          r="6"
          fill="var(--base-light,#fff)"
          fillOpacity="0.83"
          stroke="var(--accent,#fbbf24)"
          strokeWidth="2"
        />
        <circle
          cx="22"
          cy="18.7"
          r="2.1"
          fill="var(--primary,#2563eb)"
          stroke="var(--accent,#fbbf24)"
          strokeWidth="0.7"
        />
        {/* Digital arcs */}
        <path
          d="M22 12v-2.6M22 25.4v2.4M16.1 18.7h-2.55M30.5 18.7h-2.45"
          stroke="var(--primary,#2563eb)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* Digital "ray" lines */}
        <path
          d="M18.6 14.9l-1.45-1.45M25.4 14.9l1.44-1.45M18.6 22.55l-1.45 1.45M25.4 22.55l1.44 1.45"
          stroke="var(--accent,#fbbf24)"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </g>
      {/* "Glass reflection" highlight */}
      <ellipse
        cx="17.4"
        cy="10.4"
        rx="4"
        ry="1.2"
        fill="#fff"
        fillOpacity="0.18"
        style={{ mixBlendMode: "screen" }}
      />
    </svg>
  );
}

export default CyberLegalLogo;
