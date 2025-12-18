export default function PropertyCard({ property }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
      {/* Image Container with Zoom Effect */}
      <div className="h-64 overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>
      
      {/* Glassmorphism Overlay (Appears on Hover) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
        <div className="backdrop-blur-md bg-white/20 border border-white/30 p-4 rounded-xl">
          <h3 className="font-serif text-xl font-bold text-white">{property.title}</h3>
          <p className="text-amber-200 font-sans font-semibold text-lg my-2">{property.price}</p>
          <div className="flex items-center text-white/90 font-sans text-sm">
            <span className="mr-4">📍 {property.location}</span>
            <span>🛏️ {property.bedrooms} Bedrooms</span>
          </div>
          <button className="mt-4 w-full bg-white text-amber-700 font-sans font-bold py-2 rounded-lg hover:bg-amber-100 transition-colors">
            View Details
          </button>
        </div>
      </div>

      {/* Always-visible Bottom Info */}
      <div className="bg-white p-4">
        <h3 className="font-serif text-lg font-bold text-gray-800">{property.title}</h3>
        <p className="text-amber-600 font-sans font-semibold">{property.price}</p>
      </div>
    </div>
  );
}
