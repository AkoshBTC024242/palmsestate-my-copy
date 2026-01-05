// src/components/FavoriteButtonFallback.jsx
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function FavoriteButtonFallback({ size = 'md', showLabel = false }) {
  const navigate = useNavigate();
  const [localSaved, setLocalSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    
    // Store in localStorage as fallback
    setTimeout(() => {
      setLocalSaved(!localSaved);
      
      // If changing to saved state, redirect to sign in
      if (!localSaved) {
        navigate('/signin');
      }
      
      setLoading(false);
    }, 300);
  };

  const sizes = {
    sm: { button: 'p-1.5', icon: 'w-4 h-4', text: 'text-xs' },
    md: { button: 'p-2.5', icon: 'w-5 h-5', text: 'text-sm' },
    lg: { button: 'p-3', icon: 'w-6 h-6', text: 'text-base' }
  };

  const currentSize = sizes[size];

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`${currentSize.button} flex items-center justify-center rounded-full border transition-all duration-300 ${
          localSaved 
            ? 'bg-rose-500 border-rose-600 text-white' 
            : 'bg-white/90 border-gray-300 text-gray-700 hover:bg-rose-50'
        } ${loading ? 'opacity-70' : 'hover:scale-105'}`}
        title={localSaved ? 'Remove from saved' : 'Save property'}
      >
        {loading ? (
          <div className={`${currentSize.icon} border-2 border-current border-t-transparent rounded-full animate-spin`} />
        ) : (
          <Heart className={`${currentSize.icon} ${localSaved ? 'fill-current' : ''}`} />
        )}
      </button>
      
      {showLabel && (
        <span className={`${currentSize.text} mt-1 font-medium ${
          localSaved ? 'text-rose-600' : 'text-gray-600'
        }`}>
          {localSaved ? 'Saved' : 'Save'}
        </span>
      )}
    </div>
  );
}

export default FavoriteButtonFallback;
