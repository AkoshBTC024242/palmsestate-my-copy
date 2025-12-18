import PropertyCard from './PropertyCard';

const sampleProperties = [
  {
    id: 1,
    title: "Oceanfront Villa Bianca",
    price: "$25,000 / week",
    location: "Maldives",
    bedrooms: 5,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  },
  // Add 2-5 more property objects here with different Unsplash images
];

export default function FeaturedGrid() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="font-serif text-4xl font-bold text-center text-gray-800 mb-4">A Curated Selection</h2>
      <p className="font-sans text-gray-600 text-center mb-12">Discover our signature residences, defined by unparalleled quality and prestige.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sampleProperties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
