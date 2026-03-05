import React from 'react';

export const Logo = ({ className = "", width = "150", height = "54" }: { className?: string, width?: string, height?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 180" width={width} height={height} className={className}>
    <defs>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#FFD700", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#FFA500", stopOpacity:1}} />
      </linearGradient>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{stopColor:"#0d1117", stopOpacity:1}} />
        <stop offset="100%" style={{stopColor:"#161b22", stopOpacity:1}} />
      </linearGradient>
    </defs>
    {/* Background rect removed for transparency when used as logo, or keep if intended */}
    {/* <rect width="500" height="180" rx="16" fill="url(#bgGrad)"/> */}
    
    <line x1="60" y1="35" x2="60" y2="145" stroke="url(#goldGrad)" strokeWidth="5" strokeLinecap="round"/>
    <line x1="60" y1="35" x2="105" y2="35" stroke="url(#goldGrad)" strokeWidth="5" strokeLinecap="round"/>
    <path d="M105,35 Q135,35 135,65 Q135,95 105,95" fill="none" stroke="url(#goldGrad)" strokeWidth="5" strokeLinecap="round"/>
    <line x1="60" y1="95" x2="105" y2="95" stroke="url(#goldGrad)" strokeWidth="5" strokeLinecap="round"/>
    <line x1="105" y1="95" x2="140" y2="145" stroke="url(#goldGrad)" strokeWidth="5" strokeLinecap="round"/>
    <circle cx="60" cy="35" r="5" fill="#FFD700"/>
    <circle cx="60" cy="95" r="5" fill="#FFD700"/>
    <circle cx="60" cy="145" r="5" fill="#FFD700"/>
    <circle cx="105" cy="35" r="5" fill="#FFA500"/>
    <circle cx="135" cy="65" r="5" fill="#FFD700"/>
    <circle cx="105" cy="95" r="5" fill="#FFA500"/>
    <circle cx="140" cy="145" r="5" fill="#FFD700"/>
    <line x1="60" y1="55" x2="40" y2="55" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
    <circle cx="40" cy="55" r="3" fill="#FFD700" opacity="0.6"/>
    <line x1="135" y1="65" x2="155" y2="65" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
    <circle cx="155" cy="65" r="3" fill="#FFA500" opacity="0.6"/>
    <line x1="60" y1="120" x2="40" y2="120" stroke="#FFD700" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
    <circle cx="40" cy="120" r="3" fill="#FFD700" opacity="0.6"/>
    <circle cx="85" cy="158" r="4" fill="#FFD700" opacity="0.9"/>
    <circle cx="100" cy="158" r="4" fill="#FFA500" opacity="0.7"/>
    <circle cx="115" cy="158" r="4" fill="#FFD700" opacity="0.5"/>
    <text x="185" y="95" fontFamily="'Courier New', Consolas, monospace" fontSize="46" fontWeight="700" letterSpacing="2" fill="url(#goldGrad)" dominantBaseline="middle">ruwad</text>
    <text x="340" y="95" fontFamily="'Courier New', Consolas, monospace" fontSize="46" fontWeight="700" letterSpacing="2" fill="white" dominantBaseline="middle" opacity="0.92">verse</text>
    <text x="185" y="138" fontFamily="Arial, sans-serif" fontSize="13" fill="#FFD700" opacity="0.55" letterSpacing="3">POWERED BY RAED AI</text>
    <line x1="175" y1="72" x2="175" y2="118" stroke="#FFD700" strokeWidth="1.5" opacity="0.3"/>
  </svg>
);
