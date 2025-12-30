import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Heart } from 'lucide-react';

function PropertyFavoriteButton({ propertyId, size = 'md', showLabel = false }) {
  const { user, isAuthenticated } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check if property is already saved
  useEffect(() => {
    if (user && propertyId) {
      checkIfSaved();
    }
  }, [user, propertyId]);

  const checkIfSaved = async () => {
    if (!user || !propertyId) return;
    
    try {
      setError(null);
      const { data, error } = await supabase
        .from('saved_properties')
        .select('id')
        .eq('user_id', user.id)
        .eq('property_id', propertyId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking saved status:', error);
        setError(error.message);
      }

      setIsSaved(!!data);
    } catch (error) {
      console.error('Error in checkIfSaved:', error);
      setError(error.message);
    }
  };

  const toggleSave = async () => {
    if (!isAuthenticated) {
      // Redirect to sign in if not authenticated
      window.location.href = '/signin';
      return;
    }

    if (!user || !propertyId) {
      setError('Missing user or property information');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isSaved) {
        // Remove from saved
        const { error } = await supabase
          .from('saved_properties')
          .delete()
          .eq('user_id', user.id)
          .eq('property_id', propertyId);

        if (error) throw error;
        setIsSaved(false);
        console.log('Property removed from saved');
      } else {
        // Add to saved
        const { error } = await supabase
          .from('saved_properties')
          .insert({
            user_id: user.id,
            property_id: propertyId,
            created_at: new Date().toISOString()
          });

        if (error) throw error;
        setIsSaved(true);
        console.log('Property added to saved');
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      setError(error.message);
      
      // Check if saved_properties table exists
      if (error.message.includes('relation "saved_properties" does not exist')) {
        console.log('⚠️ saved_properties table does not exist');
        setError('Feature not available. Please contact support.');
      }
    } finally {
      setLoading(false);
    }
  };

  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={toggleSave}
        disabled={loading}
        className={`${sizes[size]} flex items-center justify-center rounded-full border ${
          isSaved 
            ? 'bg-rose-500 border-rose-600 text-white hover:bg-rose-600' 
            : 'bg-white/90 border-gray-300 text-gray-700 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-300'
        } transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
        title={isSaved ? 'Remove from saved' : 'Save property'}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <Heart className={`w-4/5 h-4/5 ${isSaved ? 'fill-current' : ''}`} />
        )}
      </button>
      
      {showLabel && (
        <span className="text-xs mt-1 text-gray-600">
          {isSaved ? 'Saved' : 'Save'}
        </span>
      )}
      
      {error && (
        <div className="text-xs text-rose-500 mt-1">
          {error}
        </div>
      )}
    </div>
  );
}

export default PropertyFavoriteButton;
