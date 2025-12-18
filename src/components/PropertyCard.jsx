// src/components/PropertyCard.jsx
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square } from 'lucide-react';

function PropertyCard({ property }) {
  return (
    <div className="group relative bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:-translate-y-2">
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Property Type Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider bg-black/70 text-white">
            {property.type}
          </span>
        </div>
        
        {/* Price Badge */}
        <div className="absolute top-4 right-4 backdrop-blur-md bg-black/40 border border-white/20 rounded-xl px-4 py-2">
          <div className="font-sans font-bold text-white">
            ${property.price.toLocaleString()}<span className="text-sm font-normal opacity-90">/{property.pricePer}</span>
          </div>
        </div>
      </div>
      
      {/* Property Details */}
      <div className="p-6">
        <h3 className="font-serif text-xl font-bold text-gray-900 mb-2">{property.title}</h3>
        
        <div className="flex items-center text-gray-600 font-sans mb-4">
          <MapPin className="w-4 h-4 mr-2 text-amber-500" />
          {property.location}
        </div>
        
        {/* Property Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <Bed className="w-6 h-6 mx-auto text-amber-600 mb-1" />
            <div className="font-serif text-lg font-bold">{property.bedrooms}</div>
            <div className="font-sans text-xs text-gray-600">Bedrooms</div>
          </div>
          <div className="text-center">
            <Bath className="w-6 h-6 mx-auto text-amber-600 mb-1" />
            <div className="font-serif text-lg font-bold">{property.bathrooms}</div>
            <div className="font-sans text-xs text-gray-600">Bathrooms</div>
          </div>
          <div className="text-center">
            <Square className="w-6 h-6 mx-auto text-amber-600 mb-1" />
            <div className="font-serif text-lg font-bold">{(property.squareFeet / 1000).toFixed(1)}k</div>
            <div className="font-sans text-xs text-gray-600">Sq Ft</div>
          </div>
        </div>
        
        {/* View Details Button */}
        <Link
          to={`/properties/${property.id}`}
          className="block w-full text-center bg-gradient-to-r from-gray-900 to-black text-white py-3 rounded-xl font-sans font-semibold hover:shadow-lg transition-all hover:-translate-y-1"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}

export default PropertyCard;