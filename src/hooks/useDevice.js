// src/hooks/useDevice.js
import { useState, useEffect } from 'react';

export const useDevice = () => {
  const [device, setDevice] = useState('desktop');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      const width = window.innerWidth;
      
      if (width < 640) {
        setDevice('mobile');
        setIsMobile(true);
      } else if (width < 1024) {
        setDevice('tablet');
        setIsMobile(false);
      } else {
        setDevice('desktop');
        setIsMobile(false);
      }
    };

    // Initial check
    checkDevice();
    
    // Add event listener
    window.addEventListener('resize', checkDevice);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return { device, isMobile };
};