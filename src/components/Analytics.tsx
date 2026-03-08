import React, { useEffect } from 'react';

// --- مكون التحليلات ---
// يضيف أكواد التتبع لـ Vercel Analytics, Hotjar, Google Search Console
export const Analytics = () => {
  useEffect(() => {
    // Vercel Analytics (Mock)
    console.log('Vercel Analytics initialized');

    // Hotjar (Mock)
    // In a real app, you would inject the script here
    // (function(h,o,t,j,a,r){
    //     h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    //     h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
    //     a=o.getElementsByTagName('head')[0];
    //     r=o.createElement('script');r.async=1;
    //     r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    //     a.appendChild(r);
    // })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    console.log('Hotjar script injected (mock)');

    // Google Search Console (Mock)
    // Typically handled via meta tag in index.html or DNS record
    console.log('Google Search Console verification ready');
  }, []);

  return null; // This component doesn't render anything visible
};
