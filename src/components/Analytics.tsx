import React, { useEffect } from 'react';

// --- مكون التحليلات ---
// يضيف أكواد التتبع لـ Google Analytics و ContentSquare
export const Analytics = () => {
  useEffect(() => {
    // 1. Google Analytics 4
    const gaId = "G-DN62YT2J4Z";
    
    // Load gtag.js
    const scriptGA = document.createElement('script');
    scriptGA.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    scriptGA.async = true;
    document.head.appendChild(scriptGA);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) { window.dataLayer.push(args); }
    window.gtag = gtag; // Make gtag available globally
    gtag('js', new Date());
    gtag('config', gaId);

    // 2. ContentSquare
    const scriptCS = document.createElement('script');
    scriptCS.src = "https://t.contentsquare.net/uxa/383667b318c39.js";
    scriptCS.async = true;
    document.head.appendChild(scriptCS);
    
    console.log('Analytics initialized: Google Analytics and ContentSquare');
  }, []);

  return null; // This component doesn't render anything visible
};

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}
