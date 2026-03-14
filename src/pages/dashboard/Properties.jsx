import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  Building2, Search, Filter, MapPin, Heart,
  BedDouble, Bath, Square, ArrowRight, Loader2
} from 'lucide-react';


function DashboardProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setProperties(data);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter(property =>
    property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-light text-white">Properties</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#A1A1AA]" />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 bg-[#18181B] border border-[#27272A] rounded-lg text-white text-sm placeholder-[#A1A1AA] focus:outline-none focus:border-[#F97316]/50 w-full sm:w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <Link
            key={property.id}
            to={`/properties/${property.id}`}
            className="bg-[#18181B] border border-[#27272A] rounded-xl overflow-hidden hover:border-[#F97316]/30 transition-all hover:-translate-y-1"
          >
            <div className="h-48 bg-gradient-to-br from-[#F97316]/20 to-[#EA580C]/20 flex items-center justify-center">
              {property.images?.[0] ? (
                <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-12 h-12 text-[#F97316]/30" />
              )}
            </div>
            <div className="p-4">
              <h3 className="text-white font-medium mb-2">{property.title}</h3>
              <p className="text-[#A1A1AA] text-sm flex items-center gap-1 mb-3">
                <MapPin className="w-3 h-3" /> {property.location}
              </p>
              <div className="flex items-center gap-3 text-xs text-[#A1A1AA] mb-3">
                <span className="flex items-center gap-1"><BedDouble className="w-3 h-3" /> {property.bedrooms}</span>
                <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {property.bathrooms}</span>
                <span className="flex items-center gap-1"><Square className="w-3 h-3" /> {property.sqft || '—'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#F97316] font-light">${property.price?.toLocaleString()}</span>
                <ArrowRight className="w-4 h-4 text-[#A1A1AA]" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default DashboardProperties;
