import React from 'react';

interface BharatCollegeLogoProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

export const BharatCollegeLogo: React.FC<BharatCollegeLogoProps> = ({
  className = '',
  size = 56,
  animate = false
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-full select-none shrink-0 ${animate ? 'hover:scale-105 transition-transform duration-300' : ''} ${className}`}
      title="Bharat College of Engineering, Badlapur (W)"
    >
      <svg
        viewBox="0 0 400 400"
        width={size}
        height={size}
        className="w-full h-full drop-shadow-md"
      >
        <defs>
          {/* Circular text paths */}
          <path
            id="collegeTopArc"
            d="M 50,200 A 150,150 0 1,1 350,200"
            fill="none"
          />
          <path
            id="collegeBottomArc"
            d="M 350,200 A 150,150 0 0,1 50,200"
            fill="none"
          />

          {/* Gradients */}
          <radialGradient id="cyanInnerGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="60%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#0891b2" />
          </radialGradient>

          <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f766e" />
            <stop offset="100%" stopColor="#115e59" />
          </linearGradient>

          <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>

        {/* Outer Shadow Ring */}
        <circle cx="200" cy="200" r="196" fill="#090d16" />

        {/* Outer Black Border */}
        <circle cx="200" cy="200" r="190" fill="#181e29" stroke="#334155" strokeWidth="3" />

        {/* Subtle white inner boundary */}
        <circle cx="200" cy="200" r="148" fill="none" stroke="#64748b" strokeWidth="1.5" />

        {/* Curved Text - Top: BHARAT COLLEGE OF ENGINEERING */}
        <text
          fill="#ffffff"
          fontSize="24"
          fontWeight="bold"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="5.5"
        >
          <textPath href="#collegeTopArc" startOffset="50%" textAnchor="middle">
            BHARAT COLLEGE OF ENGINEERING
          </textPath>
        </text>

        {/* Curved Text - Bottom: ★ BADLAPUR (W) ★ */}
        <text
          fill="#38bdf8"
          fontSize="23"
          fontWeight="bold"
          fontFamily="system-ui, -apple-system, sans-serif"
          letterSpacing="4"
        >
          <textPath href="#collegeBottomArc" startOffset="50%" textAnchor="middle">
            ★ BADLAPUR (W) ★
          </textPath>
        </text>

        {/* Inner Cyan Circle */}
        <circle
          cx="200"
          cy="200"
          r="142"
          fill="url(#cyanInnerGrad)"
          stroke="#0e7490"
          strokeWidth="3"
        />

        {/* Decorative Engineering Gear in Background */}
        <g opacity="0.25" transform="rotate(15 200 200)">
          <circle cx="200" cy="200" r="95" fill="none" stroke="#042f2e" strokeWidth="16" strokeDasharray="22 16" />
          <circle cx="200" cy="200" r="72" fill="none" stroke="#042f2e" strokeWidth="8" />
        </g>

        {/* Central Emblem Group */}
        <g transform="translate(200, 205)">
          
          {/* Main Shield / Tower Icon */}
          <path
            d="M -52,-55 C -52,-20 -38,30 0,65 C 38,30 52,-20 52,-55 C 22,-52 0,-70 0,-70 C 0,-70 -22,-52 -52,-55 Z"
            fill="url(#shieldGrad)"
            stroke="#042f2e"
            strokeWidth="3.5"
          />

          {/* Inner Pen Nib Tip in upper center */}
          <path
            d="M 0,-85 L 14,-50 L 5,-48 L 5,-20 L -5,-20 L -5,-48 L -14,-50 Z"
            fill="#ffffff"
            stroke="#0f766e"
            strokeWidth="1.5"
          />
          <circle cx="0" cy="-42" r="3.5" fill="#0f766e" />
          <line x1="0" y1="-85" x2="0" y2="-42" stroke="#0f766e" strokeWidth="1.5" />

          {/* Horizontal pillar ridges inside shield */}
          <rect x="-18" y="-12" width="36" height="5" rx="2" fill="#ffffff" opacity="0.9" />
          <rect x="-24" y="-3" width="48" height="5" rx="2" fill="#ffffff" opacity="0.9" />
          <rect x="-18" y="6" width="36" height="5" rx="2" fill="#ffffff" opacity="0.9" />

          {/* Open Book at Bottom */}
          <g transform="translate(0, 52)">
            {/* Left Page */}
            <path
              d="M 0,0 C -25,-12 -55,-10 -70,-5 L -65,12 C -50,8 -25,6 0,16 Z"
              fill="#ffffff"
              stroke="#042f2e"
              strokeWidth="2.5"
            />
            {/* Right Page */}
            <path
              d="M 0,0 C 25,-12 55,-10 70,-5 L 65,12 C 50,8 25,6 0,16 Z"
              fill="#ffffff"
              stroke="#042f2e"
              strokeWidth="2.5"
            />
            {/* Book Spine */}
            <line x1="0" y1="0" x2="0" y2="16" stroke="#0f766e" strokeWidth="3" />
          </g>
        </g>
      </svg>
    </div>
  );
};
