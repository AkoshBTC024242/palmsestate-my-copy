// src/components/PropertyFavoriteButton.jsx - SIMPLIFIED RELIABLE VERSION
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PropertyFavoriteButton({ propertyId, size = 'md', className = '' }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check initial saved state
  useEffect(() => {
    if (user && propertyId) {
      checkSavedState();
    }
  }, [user, propertyId]);

  const checkSavedState = () => {
    if (!user || !propertyId) {
      setIsSaved(false);
      return;
    }

    // Check localStorage first (fast)
    const saved = JSON.parse(localStorage.getItem('palmsestate_saved_properties') || '{}');
    const userSaved = saved[user.id] || [];
    const isSavedLocal = userSaved.includes(propertyId);
    
    setIsSaved(isSavedLocal);
    
    // Optionally check database in background
    if (isSavedLocal) {
      // Already found in localStorage, we're good
      return;
    }
    
    // Check database for additional saved items
    supabase
      .from('saved_properties')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
      .maybeSingle()
      .then(({ data }) => {
        if (data && !isSavedLocal) {
          // Found in database but not localStorage, update localStorage
          userSaved.push(propertyId);
          saved[user.id] = userSaved;
          localStorage.setItem('palmsestate_saved_properties', JSON.stringify(saved));
          setIsSaved(true);
        }
      })
      .catch(() => {
        // Database error, ignore - we have localStorage
      });
  };

  const handleToggleSave = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!isAuthenticated) {
      navigate('/signin', { state: { from: window.location.pathname } });
      return;
    }

    if (!user || !propertyId) return;

    setLoading(true);
    const newSavedState = !isSaved;

    try {
      // 1. Update UI immediately
      setIsSaved(newSavedState);
      
      // 2. Update localStorage
      const saved = JSON.parse(localStorage.getItem('palmsestate_saved_properties') || '{}');
      let userSaved = saved[user.id] || [];
      
      if (newSavedState) {
        // Add to saved
        if (!userSaved.includes(propertyId)) {
          userSaved.push(propertyId);
        }
      } else {
        // Remove from saved
        userSaved = userSaved.filter(id => id !== propertyId);
      }
      
      saved[user.id] = userSaved;
      localStorage.setItem('palmsestate_saved_properties', JSON.stringify(saved));
      
      // 3. Try database in background (don't wait for it)
      const dbPromise = newSavedState ? 
        // Save to database
        supabase.from('saved_properties').insert({
          user_id: user.id,
          property_id: propertyId,
          created_at: new Date().toISOString()
        }) :
        // Remove from database
        supabase.from('saved_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);
      
      dbPromise
        .then(() => {
          console.log(`✅ ${newSavedState ? 'Saved' : 'Unsaved'} property in database`);
        })
        .catch(error => {
          if (error.code === '23505') {
            // Already exists, that's fine
          } else if (error.code === '42P01') {
            console.log('⚠️ Database table not available, using localStorage');
          } else {
            console.error('Database operation error:', error);
          }
        });
      
      // 4. Notify other components
      window.dispatchEvent(new CustomEvent('savedPropertiesChanged', {
        detail: { propertyId, saved: newSavedState }
      }));
      
    } catch (error) {
      console.error('Toggle save error:', error);
      // Revert UI if something went wrong
      setIsSaved(!newSavedState);
    } finally {
      setLoading(false);
    }
  };

  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  const buttonSize = sizes[size];

  return (
    <button
      onClick={handleToggleSave}
      disabled={loading}
      className={`${buttonSize} flex items-center justify-center rounded-full border transition-all duration-200 ${
        isSaved 
          ? 'bg-rose-500 border-rose-600 text-white hover:bg-rose-600' 
          : 'bg-white/90 border-gray-300 text-gray-700 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-300'
      } ${loading ? 'opacity-70 cursor-wait' : 'cursor-pointer hover:scale-105'} ${className}`}
      title={isSaved ? 'Remove from saved' : 'Save property'}
      aria-label={isSaved ? 'Remove from saved properties' : 'Save property to favorites'}
    >
      {loading ? (
        <div className="w-1/2 h-1/2 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <Heart className={`w-2/3 h-2/3 ${isSaved ? 'fill-current' : ''}`} />
      )}
    </button>
  );
}

export default PropertyFavoriteButton;
