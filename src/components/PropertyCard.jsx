// src/components/PropertyCard.jsx - UPDATE WITH FIXED FAVORITE BUTTON
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, Maximize2, Eye, Sparkles } from 'lucide-react';
import { useState } from 'react';
import PropertyFavoriteButton from './PropertyFavoriteButton'; // Import the fixed button

function PropertyCard({ property }) {
  const [isHovered, setIsHovered] = useState(false);

  const formatPrice = (price) => {
    if (price >= 10000) {
      return `$${(price / 1000).toFixed(0)}k`;
    }
    return `$${price.toLocaleString()}`;
  };

  return (
    <div 
      className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-64 md:h-72 lg:h-80 overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />

        {/* Property Type Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-2 rounded-full text-xs font-sans font-bold uppercase tracking-wider backdrop-blur-md border ${
            property.type === 'Exclusive' 
              ? 'bg-red-500/90 text-white border-red-400/50' 
              : property.type === 'Penthouse'
              ? 'bg-blue-500/90 text-white border-blue-400/50'
              : property.type === 'Premium'
              ? 'bg-amber-500/90 text-white border-amber-400/50'
              : 'bg-emerald-500/90 text-white border-emerald-400/50'
          }`}>
            {property.type}
          </span>
        </div>

        {/* FIXED: Use PropertyFavoriteButton instead of local state */}
        <div className="absolute top-4 right-4">
          <PropertyFavoriteButton 
            propertyId={property.id}
            size="md"
          />
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-4 left-4 right-4 backdrop-blur-md bg-black/50 border border-white/20 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-sans font-bold text-white text-xl">
                {formatPrice(property.price)}<span className="text-sm font-normal opacity-90">/{property.pricePer}</span>
              </div>
              {property.featured && (
                <div className="flex items-center gap-1 mt-1">
                  <Sparkles size={12} className="text-amber-300" />
                  <span className="text-xs text-amber-300 font-medium">Featured</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <div className="text-xs text-white/80">Security Deposit</div>
                <div className="text-sm font-semibold text-white">
                  ${(property.price * 2).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Glass Overlay on Hover */}
        {isHovered && (
          <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-6 transition-all duration-500">
            <div className="w-full backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl p-6 transform translate-y-0 opacity-100 transition-all duration-500">
              <div className="text-xl font-serif font-bold text-white mb-2">{property.title}</div>
              <div className="font-sans text-white/90 mb-4 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {property.location}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {property.amenities?.slice(0, 3).map((amenity, i) => (
                  <span key={i} className="text-xs bg-white/30 text-white px-3 py-1.5 rounded-full">
                    {amenity}
                  </span>
                ))}
                {property.amenities?.length > 3 && (
                  <span className="text-xs bg-white/20 text-white px-3 py-1.5 rounded-full">
                    +{property.amenities.length - 3} more
                  </span>
                )}
              </div>
              <Link
                to={`/properties/${property.id}`}
                className="w-full flex items-center justify-center gap-2 bg-white text-amber-700 py-3 rounded-xl font-sans font-bold hover:bg-amber-50 transition-colors"
              >
                <Eye size={18} />
                Quick Preview
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-6">
        <div className="mb-4">
          <h3 className="font-serif text-xl font-bold text-gray-900 mb-2 line-clamp-1">{property.title}</h3>
          <div className="flex items-center text-gray-600 font-sans">
            <MapPin className="w-4 h-4 mr-2 text-amber-500 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>
        </div>

        {/* Property Stats */}
        <div className="backdrop-blur-sm bg-gray-50/50 border border-gray-200/50 rounded-2xl p-4 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Bed className="w-5 h-5 text-amber-600" />
                <div className="font-serif text-xl font-bold text-gray-900">{property.bedrooms}</div>
              </div>
              <div className="font-sans text-xs text-gray-600">Bedrooms</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Bath className="w-5 h-5 text-amber-600" />
                <div className="font-serif text-xl font-bold text-gray-900">{property.bathrooms}</div>
              </div>
              <div className="font-sans text-xs text-gray-600">Bathrooms</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Square className="w-5 h-5 text-amber-600" />
                <div className="font-serif text-xl font-bold text-gray-900">
                  {(property.squareFeet / 1000).toFixed(1)}k
                </div>
              </div>
              <div className="font-sans text-xs text-gray-600">Sq Ft</div>
            </div>
          </div>
        </div>

        {/* Quick Amenities */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {property.amenities?.slice(0, 2).map((amenity, i) => (
              <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full">
                <span className="text-xs text-amber-700 font-medium">{amenity}</span>
              </span>
            ))}
            {property.amenities?.length > 2 && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-full">
                <Maximize2 size={12} className="text-gray-600" />
                <span className="text-xs text-gray-600 font-medium">
                  +{property.amenities.length - 2} amenities
                </span>
              </span>
            )}
          </div>
        </div>

        {/* View Details Button */}
        <Link
          to={`/properties/${property.id}`}
          className="block w-full text-center bg-gradient-to-r from-gray-900 to-black text-white py-3 rounded-xl font-sans font-bold hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            View Property Details
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-500 -translate-x-full group-hover:translate-x-0 transition-transform duration-700"></div>
        </Link>
      </div>
    </div>
  );
}

export default PropertyCard;
