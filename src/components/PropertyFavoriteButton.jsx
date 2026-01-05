// src/components/PropertyFavoriteButton.jsx - UPDATED
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Heart, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PropertyFavoriteButton({ propertyId, size = 'md', showLabel = false, className = '' }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Check if property is already saved
  useEffect(() => {
    if (propertyId) {
      if (user) {
        checkIfSaved();
      } else {
        // If no user, mark as not saved and stop loading
        setIsSaved(false);
        setLoading(false);
        setInitialCheckDone(true);
      }
    }
  }, [user, propertyId]);

  const checkIfSaved = async () => {
    if (!user || !propertyId) {
      setIsSaved(false);
      setLoading(false);
      setInitialCheckDone(true);
      return;
    }
    
    try {
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('saved_properties')
        .select('id')
        .eq('user_id', user.id)
        .eq('property_id', propertyId)
        .maybeSingle(); // Use maybeSingle instead of single

      if (fetchError) {
        console.warn('Error checking saved status:', fetchError);
        // Don't show error to user for this check
      }

      setIsSaved(!!data);
    } catch (error) {
      console.error('Error in checkIfSaved:', error);
      // Don't show error to user for this check
    } finally {
      setLoading(false);
      setInitialCheckDone(true);
    }
  };

  const toggleSave = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!isAuthenticated) {
      // Navigate to sign in
      navigate('/signin', { state: { from: window.location.pathname } });
      return;
    }

    if (!user || !propertyId) {
      setError('Please sign in to save properties');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSaved) {
        // Remove from saved
        const { error: deleteError } = await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);

        if (deleteError) {
          // Check for common errors
          if (deleteError.code === '42P01') {
            setError('Favorite feature is currently unavailable. Please try again later.');
            console.error('Table does not exist:', deleteError);
          } else {
            throw deleteError;
          }
          return;
        }
        
        setIsSaved(false);
        console.log('✅ Property removed from saved');
      } else {
        // Add to saved
        const { error: insertError } = await supabase
          .from('saved_properties')
          .insert({
            user_id: user.id,
            property_id: propertyId,
            created_at: new Date().toISOString()
          })
          .select()
          .single();

        if (insertError) {
          // Handle unique constraint violation
          if (insertError.code === '23505') {
            // Already saved, update state
            setIsSaved(true);
            console.log('✅ Property already saved');
          } else if (insertError.code === '42P01') {
            setError('Favorite feature is currently unavailable. Please try again later.');
            console.error('Table does not exist:', insertError);
          } else {
            throw insertError;
          }
          return;
        }
        
        setIsSaved(true);
        console.log('✅ Property added to saved');
      }
    } catch (error) {
      console.error('❌ Error toggling save:', error);
      
      // User-friendly error messages
      if (error.code === '42501') {
        setError('Permission denied. Please contact support.');
      } else if (error.code === '42P01') {
        setError('Favorite feature is currently unavailable.');
      } else if (error.message.includes('network')) {
        setError('Network error. Please check your connection.');
      } else {
        setError('Failed to save. Please try again.');
      }
      
      // Re-check status after error
      setTimeout(() => checkIfSaved(), 1000);
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

  // Show loading state
  if (loading && !initialCheckDone) {
    return (
      <button
        disabled
        className={`${currentSize.button} bg-gray-100 rounded-full animate-pulse ${className}`}
        title="Loading..."
      >
        <div className={`${currentSize.icon} bg-gray-300 rounded-full`} />
      </button>
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
