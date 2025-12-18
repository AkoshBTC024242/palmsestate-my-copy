export default function Hero() {
  const heroStyle = {
    backgroundImage: `url('https://images.unsplash.com/photo-1613977257363-707ba9348227?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`,
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-cover bg-center" style={heroStyle}>
      {/* Dark Overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Glassmorphism Text Container */}
      <div className="relative z-10 max-w-3xl mx-auto text-center backdrop-blur-md bg-white/30 border border-white/20 shadow-2xl rounded-2xl p-8 md:p-12 m-6">
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-4">
          Discover <span className="text-amber-300">Ultimate</span> Luxury
        </h1>
        <p className="text-xl text-white/90 mb-8 font-sans">
          Curated selection of the world's most exquisite villas, penthouses, and private estates.
        </p>
        <button className="bg-gradient-to-r from-amber-600 to-orange-500 text-white font-sans font-semibold py-3 px-8 rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300">
          View Exclusive Properties
        </button>
      </div>
    </section>
  );
}
