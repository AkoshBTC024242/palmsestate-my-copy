// src/components/SaveButton.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { isPropertySaved, saveProperty, unsaveProperty } from '../lib/supabase';
import { Heart, Loader2 } from 'lucide-react';

const SaveButton = ({ propertyId, size = 'md', showLabel = false, className = '' }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (user && propertyId) {
      checkIfSaved();
    } else {
      setChecking(false);
    }
  }, [user, propertyId]);

  const checkIfSaved = async () => {
    if (!user || !propertyId) return;
    
    try {
      setChecking(true);
      const result = await isPropertySaved(user.id, propertyId);
      if (result.success) {
        setIsSaved(result.isSaved);
      }
    } catch (error) {
      console.error('Error checking if saved:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleSaveToggle = async (e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (!user) {
      navigate('/signin');
      return;
    }

    try {
      setLoading(true);
      
      if (isSaved) {
        const result = await unsaveProperty(user.id, propertyId);
        if (result.success) {
          setIsSaved(false);
        }
      } else {
        const result = await saveProperty(user.id, propertyId);
        if (result.success) {
          setIsSaved(true);
        }
      }
    } catch (error) {
      console.error('Error toggling save:', error);
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
      button: 'p-2',
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

  if (checking) {
    return (
      <button
        disabled
        className={`${currentSize.button} bg-gray-100 rounded-full opacity-70 ${className}`}
      >
        <Loader2 className={`${currentSize.icon} animate-spin text-gray-400`} />
      </button>
    );
  }

  return (
    <button
      onClick={handleSaveToggle}
      disabled={loading}
      className={`${currentSize.button} ${
        isSaved 
          ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'
      } border rounded-full shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 ${className}`}
      title={isSaved ? "Remove from saved" : "Save property"}
    >
      {loading ? (
        <Loader2 className={`${currentSize.icon} animate-spin ${isSaved ? 'text-red-600' : 'text-gray-600'}`} />
      ) : isSaved ? (
        <Heart className={`${currentSize.icon} fill-red-500 text-red-500`} />
      ) : (
        <Heart className={`${currentSize.icon} hover:text-red-500`} />
      )}
      {showLabel && (
        <span className={`ml-2 ${currentSize.text} font-medium`}>
          {isSaved ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
};

export default SaveButton;
