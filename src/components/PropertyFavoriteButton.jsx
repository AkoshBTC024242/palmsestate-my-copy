// src/components/PropertyFavoriteButton.jsx - FIXED
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Heart, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PropertyFavoriteButton({ propertyId, size = 'md', showLabel = false, className = '' }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasChecked, setHasChecked] = useState(false);

  // Check if property is already saved
  useEffect(() => {
    if (propertyId) {
      checkIfSaved();
    }
  }, [user, propertyId]);

  const checkIfSaved = async () => {
    if (!propertyId) return;
    
    setHasChecked(false);
    
    try {
      // First check localStorage (fast)
      const saved = JSON.parse(localStorage.getItem('palmsestate_saved_properties') || '{}');
      const userSaved = user ? saved[user.id] || [] : [];
      const isSavedLocal = userSaved.includes(propertyId);
      
      if (isSavedLocal) {
        setIsSaved(true);
        setHasChecked(true);
        return;
      }
      
      // If user is logged in, check database
      if (user) {
        const { data, error: fetchError } = await supabase
          .from('saved_properties')
          .select('id')
          .eq('user_id', user.id)
          .eq('property_id', propertyId)
          .maybeSingle();

        if (fetchError && fetchError.code !== '42P01' && fetchError.code !== 'PGRST116') {
          console.warn('Error checking saved status:', fetchError);
        }

        setIsSaved(!!data);
        
        // Sync with localStorage
        if (data && !userSaved.includes(propertyId)) {
          userSaved.push(propertyId);
          saved[user.id] = userSaved;
          localStorage.setItem('palmsestate_saved_properties', JSON.stringify(saved));
        }
      } else {
        setIsSaved(false);
      }
    } catch (error) {
      console.error('Error checking saved status:', error);
      setIsSaved(false);
    } finally {
      setHasChecked(true);
    }
  };

  const toggleSave = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!isAuthenticated) {
      navigate('/signin', { state: { from: window.location.pathname } });
      return;
    }

    if (!user || !propertyId) {
      setError('Please sign in to save properties');
      return;
    }

    setLoading(true);
    setError(null);
    const newSavedState = !isSaved;

    try {
      // Update UI immediately
      setIsSaved(newSavedState);
      
      // Update localStorage immediately
      const saved = JSON.parse(localStorage.getItem('palmsestate_saved_properties') || '{}');
      const userSaved = saved[user.id] || [];
      
      if (newSavedState) {
        // Add to saved
        if (!userSaved.includes(propertyId)) {
          userSaved.push(propertyId);
          saved[user.id] = userSaved;
          localStorage.setItem('palmsestate_saved_properties', JSON.stringify(saved));
        }
      } else {
        // Remove from saved
        const filtered = userSaved.filter(id => id !== propertyId);
        saved[user.id] = filtered;
        localStorage.setItem('palmsestate_saved_properties', JSON.stringify(saved));
      }
      
      // Try to save to database (background)
      try {
        if (newSavedState) {
          // Save to database
          const { error: saveError } = await supabase
            .from('saved_properties')
            .insert({
              user_id: user.id,
              property_id: propertyId,
              created_at: new Date().toISOString()
            });

          if (saveError) {
            if (saveError.code === '23505') {
              // Already saved in database, that's fine
            } else if (saveError.code === '42P01') {
              console.log('Database table not found, using localStorage only');
            } else {
              console.error('Database save error:', saveError);
            }
          }
        } else {
          // Remove from database
          const { error: deleteError } = await supabase
            .from('saved_properties')
            .delete()
            .eq('user_id', user.id)
            .eq('property_id', propertyId);

          if (deleteError && deleteError.code !== '42P01') {
            console.error('Database delete error:', deleteError);
          }
        }
      } catch (dbError) {
        console.error('Database operation failed:', dbError);
        // Continue anyway since localStorage worked
      }
      
      // Notify dashboard to refresh
      window.dispatchEvent(new CustomEvent('savedPropertiesUpdated', { 
        detail: { propertyId, saved: newSavedState } 
      }));
      
    } catch (error) {
      console.error('Error toggling save:', error);
      
      // Revert UI on error
      setIsSaved(!newSavedState);
      
      setError('Failed to save. Please try again.');
      
    } finally {
      setLoading(false);
    }
  };

  const sizes = {
    sm: {
      button: 'p-1.5',
      icon: 'w-4 h-4',
      text: 'text-xs'
    },
    md: {
      button: 'p-2.5',
      icon: 'w-5 h-5',
      text: 'text-sm'
    },
    lg: {
      button: 'p-3',
      icon: 'w-6 h-6',
      text: 'text-base'
    }
  };

  const currentSize = sizes[size];

  // Show loading state during initial check
  if (!hasChecked && user && propertyId) {
    return (
      <div className={`${className} flex flex-col items-center`}>
        <button
          disabled
          className={`${currentSize.button} bg-gray-100 rounded-full animate-pulse`}
          title="Loading..."
        >
          <div className={`${currentSize.icon} bg-gray-300 rounded-full`} />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <button
        onClick={toggleSave}
        disabled={loading}
        className={`${currentSize.button} flex items-center justify-center rounded-full border transition-all duration-300 ${
          isSaved 
            ? 'bg-rose-500 border-rose-600 text-white hover:bg-rose-600 shadow-lg' 
            : 'bg-white/90 border-gray-300 text-gray-700 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-300 hover:shadow-md'
        } ${loading ? 'opacity-70 cursor-wait' : 'hover:scale-105'} disabled:cursor-not-allowed`}
        title={isSaved ? 'Remove from saved' : 'Save property'}
        aria-label={isSaved ? 'Remove from saved properties' : 'Save property to favorites'}
        aria-busy={loading}
      >
        {loading ? (
          <div className={`${currentSize.icon} border-2 border-current border-t-transparent rounded-full animate-spin`} />
        ) : (
          <Heart className={`${currentSize.icon} ${isSaved ? 'fill-current' : ''}`} />
        )}
      </button>
      
      {showLabel && (
        <span className={`${currentSize.text} mt-1 font-medium ${
          isSaved ? 'text-rose-600' : 'text-gray-600'
        }`}>
          {isSaved ? 'Saved' : 'Save'}
        </span>
      )}
      
      {error && (
        <div className="flex items-center gap-1 mt-1 max-w-[150px]">
          <AlertCircle className="w-3 h-3 text-rose-500 flex-shrink-0" />
          <span className="text-xs text-rose-500 truncate">{error}</span>
        </div>
      )}
    </div>
  );
}

export default PropertyFavoriteButton;
