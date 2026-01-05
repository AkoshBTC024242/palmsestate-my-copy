// src/components/PreloadLink.jsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Route to component mapping for preloading
const ROUTE_PRELOADS = {
  '/properties': () => import('../pages/Properties'),
  '/signin': () => import('../pages/SignIn'),
  '/signup': () => import('../pages/SignUp'),
  '/dashboard': () => import('../pages/Dashboard'),
  '/admin': () => import('../pages/AdminDashboard'),
  '/contact': () => import('../pages/Contact'),
  '/about': () => import('../pages/About'),
};

function PreloadLink({ to, children, className, onPreload, ...props }) {
  const [hasPreloaded, setHasPreloaded] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);

  const preloadRoute = () => {
    if (hasPreloaded || isPreloading) return;

    const preloadFn = ROUTE_PRELOADS[to];
    if (preloadFn) {
      setIsPreloading(true);
      
      // Use requestIdleCallback for non-critical preloading
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
          preloadFn()
            .then(() => {
              setHasPreloaded(true);
              onPreload?.();
            })
            .catch(() => {}) // Silent fail
            .finally(() => setIsPreloading(false));
        }, { timeout: 2000 });
      } else {
        setTimeout(() => {
          preloadFn()
            .then(() => {
              setHasPreloaded(true);
              onPreload?.();
            })
            .catch(() => {}) // Silent fail
            .finally(() => setIsPreloading(false));
        }, 100);
      }
    }
  };

  // Auto-preload on mount for important routes
  useEffect(() => {
    if (to === '/properties' || to === '/dashboard') {
      const timer = setTimeout(preloadRoute, 1000);
      return () => clearTimeout(timer);
    }
  }, [to]);

  return (
    <Link
      to={to}
      className={className}
      onMouseEnter={preloadRoute}
      onFocus={preloadRoute}
      onTouchStart={preloadRoute}
      {...props}
    >
      {children}
      {isPreloading && (
        <span className="ml-1 text-xs text-gray-400">(loading...)</span>
      )}
    </Link>
  );
}

export default PreloadLink;
