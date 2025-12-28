import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Heart } from 'lucide-react';

function PropertyFavoriteButton({ propertyId, size = 'md', showLabel = false }) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [loading,
