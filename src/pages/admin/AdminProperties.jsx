// src/pages/admin/AdminProperties.jsx - UPDATED FOR YOUR SCHEMA
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, 
  Download, MoreVertical, ChevronLeft, 
  ChevronRight, Building2, DollarSign, MapPin, 
  Bed, Bath, Square, Calendar, CheckCircle, 
  XCircle, Clock, AlertCircle, Loader2, Star, Tag
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

function AdminProperties() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [bulkAction, setBulkAction] = useState('');

  // Fetch properties from Supabase
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('📡 Fetching properties from Supabase...');
      const { data, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (fetchError) {
        console.error('❌ Error fetching properties:', fetchError);
        throw fetchError;
      }
      
      console.log(`✅ Fetched ${data?.length || 0} properties`);
      
      // Ensure all properties have required fields with defaults
      const formattedProperties = data?.map(property => ({
        ...property,
        category: property.category || 'Luxury',
        amenities: property.amenities || '',
        featured: property.featured || false,
        price_per_week: property.price_per_week || property.price,
        property_type: property.property_type || 'villa',
        updated_at: property.updated_at || property.created_at || new Date().toISOString()
      })) || [];
      
      setProperties(formattedProperties);
      
    } catch (err) {
      console.error('❌ Error fetching properties:', err);
      setError('Failed to load properties. Please try again.');
      // Fallback to sample data if database fetch fails
      setProperties(getSampleProperties());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // Sample properties for fallback/demo
  const getSampleProperties = () => {
    return [
      {
        id: 1,
        title: 'Oceanfront Luxury Villa',
        description: 'Exclusive beachfront property with panoramic ocean views and private amenities.',
        location: 'Maldives',
        price: 35000,
        price_per_week: 35000,
        bedrooms: 5,
        bathrooms: 6,
        sqft: 12500,
        image_url: 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4',
        status: 'available',
        category: 'Exclusive',
        amenities: 'Wi-Fi, Pool, Gym, Ocean View',
        featured: true,
        property_type: 'villa',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Manhattan Skyline Penthouse',
        description: 'Modern penthouse with 360° city views and premium finishes.',
        location: 'New York, NY',
        price: 45000,
        price_per_week: 45000,
        bedrooms: 4,
        bathrooms: 5,
        sqft: 8500,
        image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00',
        status: 'available',
        category: 'Premium',
        amenities: 'Wi-Fi, Gym, Concierge, Smart Home',
        featured: true,
        property_type: 'penthouse',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Alpine Mountain Chalet',
        description: 'Luxury ski-in/ski-out chalet with heated pool and mountain views.',
        location: 'Aspen, CO',
        price: 28000,
        price_per_week: 28000,
        bedrooms: 6,
        bathrooms: 7,
        sqft: 9500,
        image_url: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233',
        status: 'rented',
        category: 'Luxury',
        amenities: 'Fireplace, Hot Tub, Sauna, Mountain View',
        featured: false,
        property_type: 'chalet',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  };

  // Filter and search properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filter === 'all' || 
      property.status === filter ||
      property.category === filter ||
      (filter === 'featured' && property.featured) ||
      (filter === 'not_featured' && !property.featured);
    
    return matchesSearch && matchesFilter;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage);

  // Handle property selection
  const togglePropertySelection = (id) => {
    setSelectedProperties(prev =>
      prev.includes(id)
        ? prev.filter(propertyId => propertyId !== id)
        : [...prev, id]
    );
  };

  const selectAllProperties = () => {
    if (selectedProperties.length === paginatedProperties.length) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(paginatedProperties.map(p => p.id));
    }
  };

  // Handle bulk actions
  const handleBulkAction = async () => {
    if (!bulkAction || selectedProperties.length === 0) return;

    try {
      setLoading(true);
      
      if (bulkAction === 'delete') {
        const { error } = await supabase
          .from('properties')
          .delete()
          .in('id', selectedProperties);
        
        if (error) throw error;
        
        // Refresh properties
        await fetchProperties();
        setSelectedProperties([]);
        setBulkAction('');
      } else if (bulkAction === 'status_available') {
        // Update status for selected properties
        const { error } = await supabase
          .from('properties')
          .update({ 
            status: 'available', 
            updated_at: new Date().toISOString() 
          })
          .in('id', selectedProperties);
        
        if (error) throw error;
        
        await fetchProperties();
        setSelectedProperties([]);
        setBulkAction('');
      } else if (bulkAction === 'status_rented') {
        const { error } = await supabase
          .from('properties')
          .update({ 
            status: 'rented', 
            updated_at: new Date().toISOString() 
          })
          .in('id', selectedProperties);
        
        if (error) throw error;
        
        await fetchProperties();
        setSelectedProperties([]);
        setBulkAction('');
      } else if (bulkAction === 'toggle_featured') {
        // Toggle featured status
        const featuredStatus = !properties.find(p => p.id === selectedProperties[0])?.featured;
        const { error } = await supabase
          .from('properties')
          .update({ 
            featured: featuredStatus, 
            updated_at: new Date().toISOString() 
          })
          .in('id', selectedProperties);
        
        if (error) throw error;
        
        await fetchProperties();
        setSelectedProperties([]);
        setBulkAction('');
      }
    } catch (err) {
      console.error('❌ Bulk action error:', err);
      setError('Failed to perform bulk action. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete property
  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchProperties();
    } catch (err) {
      console.error('❌ Delete error:', err);
      setError('Failed to delete property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle featured status
  const handleToggleFeatured = async (id, currentFeatured) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('properties')
        .update({ 
          featured: !currentFeatured, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
      
      await fetchProperties();
    } catch (err) {
      console.error('❌ Toggle featured error:', err);
      setError('Failed to update property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const config = {
      available: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, label: 'Available' },
      rented: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock, label: 'Rented' },
      maintenance: { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: AlertCircle, label: 'Maintenance' },
      unavailable: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, label: 'Unavailable' }
    };
    
    const statusConfig = config[status] || config.available;
    const Icon = statusConfig.icon;
    
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
        <Icon className="w-3 h-3" />
        {statusConfig.label}
      </span>
    );
  };

  // Get category badge
  const getCategoryBadge = (category) => {
    const colors = {
      Luxury: 'bg-purple-100 text-purple-800 border-purple-200',
      Premium: 'bg-blue-100 text-blue-800 border-blue-200',
      Exclusive: 'bg-amber-100 text-amber-800 border-amber-200',
      Standard: 'bg-gray-100 text-gray-800 border-gray-200',
      Budget: 'bg-green-100 text-green-800 border-green-200'
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colors[category] || colors.Standard}`}>
        <Tag className="w-3 h-3 mr-1" />
        {category}
      </span>
    );
  };

  // Export properties to CSV
  const handleExport = () => {
    const csvContent = [
      ['ID', 'Title', 'Location', 'Price', 'Price/Week', 'Status', 'Category', 'Bedrooms', 'Bathrooms', 'Square Feet', 'Property Type', 'Featured', 'Created At'],
      ...filteredProperties.map(property => [
        property.id,
        `"${property.title}"`,
        `"${property.location}"`,
        property.price,
        property.price_per_week || property.price,
        property.status,
        property.category || 'Luxury',
        property.bedrooms,
        property.bathrooms,
        property.sqft,
        property.property_type || 'villa',
        property.featured ? 'Yes' : 'No',
        new Date(property.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `properties-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Properties Management</h1>
            <p className="text-gray-600">Manage all properties in your portfolio</p>
          </div>
          <button
            onClick={() => navigate('/admin/properties/new')}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Add New Property
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.filter(p => p.status === 'available').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.filter(p => p.featured).length}
                </p>
              </div>
              <Star className="w-8 h-8 text-amber-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${properties.reduce((sum, p) => sum + (p.price || 0), 0).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {selectedProperties.length > 0 && (
        <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-blue-800 font-medium">
                {selectedProperties.length} property{selectedProperties.length !== 1 ? 's' : ''} selected
              </span>
              
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select action</option>
                <option value="status_available">Mark as Available</option>
                <option value="status_rented">Mark as Rented</option>
                <option value="toggle_featured">Toggle Featured</option>
                <option value="delete">Delete Properties</option>
              </select>
              
              <button
                onClick={handleBulkAction}
                disabled={!bulkAction}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Apply
              </button>
            </div>
            
            <button
              onClick={() => setSelectedProperties([])}
              className="text-gray-600 hover:text-gray-800"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties by title, location, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">All Properties</option>
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
                <option value="unavailable">Unavailable</option>
                <option value="featured">Featured</option>
                <option value="not_featured">Not Featured</option>
                <option value="Luxury">Luxury</option>
                <option value="Premium">Premium</option>
                <option value="Exclusive">Exclusive</option>
                <option value="Standard">Standard</option>
                <option value="Budget">Budget</option>
              </select>
            </div>
            
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 border border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-12 h-12 animate-spin text-orange-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading properties...</p>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Get started by adding your first property'}
            </p>
            <button
              onClick={() => navigate('/admin/properties/new')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add New Property
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProperties.length === paginatedProperties.length && paginatedProperties.length > 0}
                        onChange={selectAllProperties}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Property</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Featured</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Updated</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginatedProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedProperties.includes(property.id)}
                          onChange={() => togglePropertySelection(property.id)}
                          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={property.image_url}
                              alt={property.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4';
                              }}
                            />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium text-gray-900">{property.title}</h3>
                              {property.featured && (
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Bed className="w-3 h-3" />
                                {property.bedrooms || 3} beds
                              </span>
                              <span className="flex items-center gap-1">
                                <Bath className="w-3 h-3" />
                                {property.bathrooms || 3} baths
                              </span>
                              <span className="flex items-center gap-1">
                                <Square className="w-3 h-3" />
                                {property.sqft?.toLocaleString() || '5000'} sqft
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                              {property.property_type || 'villa'} • {property.amenities?.split(',').slice(0, 2).join(', ')}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">{property.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              ${property.price?.toLocaleString()}/wk
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            ${(property.price * 4)?.toLocaleString()}/mo
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(property.status)}
                      </td>
                      <td className="px-6 py-4">
                        {getCategoryBadge(property.category)}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleFeatured(property.id, property.featured)}
                          className={`p-2 rounded-lg transition-colors ${property.featured ? 'bg-amber-100 text-amber-600 hover:bg-amber-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                          title={property.featured ? 'Remove from featured' : 'Mark as featured'}
                        >
                          <Star className={`w-4 h-4 ${property.featured ? 'fill-amber-500' : ''}`} />
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {property.updated_at ? new Date(property.updated_at).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/properties/${property.id}`)}
                            className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/properties/${property.id}/edit`)}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProperty(property.id)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(startIndex + itemsPerPage, filteredProperties.length)}
                  </span>{' '}
                  of <span className="font-medium">{filteredProperties.length}</span> properties
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium ${
                          currentPage === pageNum
                            ? 'bg-orange-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminProperties;
