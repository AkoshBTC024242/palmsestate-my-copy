// src/components/LazyPropertyCard.jsx
import { useRef, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import PropertyCard from './PropertyCard';

function LazyPropertyCard({ property, priority = false }) {
  const [isVisible, setIsVisible] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    if (priority) {
      // Load immediately if high priority
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once visible
        }
      },
      {
        root: null,
        rootMargin: '200px', // Start loading 200px before entering viewport
        threshold: 0.1,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.disconnect();
      }
    };
  }, [priority]);

  // Simulate loading state
  useEffect(() => {
    if (isVisible && !isLoaded) {
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isLoaded]);

  if (!isVisible) {
    return (
      <div 
        ref={cardRef}
        className="relative bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 min-h-[500px]"
      >
        {/* Placeholder */}
        <div className="h-64 md:h-72 lg:h-80 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
        <div className="p-6">
          <div className="h-6 bg-gray-200 rounded animate-pulse mb-4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-12 bg-gray-200 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div 
        ref={cardRef}
        className="relative bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 min-h-[500px] flex items-center justify-center"
      >
        <div className="flex flex-col items-center">
          <Loader2 className="w-8 h-8 text-amber-500 animate-spin mb-2" />
          <p className="text-sm text-gray-500">Loading property...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={cardRef}>
      <PropertyCard property={property} />
    </div>
  );
}

export default LazyPropertyCard;
