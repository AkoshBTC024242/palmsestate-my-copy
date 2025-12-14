export default function About() {
  return (
    <div className="pt-20 min-h-screen bg-white">
      <section className="py-20 bg-gradient-to-br from-primary to-primary-dark text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold mb-8">About Palms Estate</h1>
          <p className="text-2xl mb-12">Your Trusted Partner in Luxury Rental Living</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-primary-dark mb-8">Our Story</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Founded in 2015, Palms Estate has been redefining luxury rental living with a commitment to excellence, transparency, and tenant satisfaction.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We specialize in premium properties in prime locations, offering a curated selection of high-end apartments, villas, and penthouses for discerning renters.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our mission is simple: to make finding and securing your dream rental home seamless, secure, and enjoyable.
              </p>
            </div>
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-96"></div>
          </div>

          <div className="mt-20">
            <h2 className="text-4xl font-bold text-center text-primary-dark mb-16">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary-dark mb-4">Integrity</h3>
                <p className="text-lg text-gray-700">Transparent processes and honest communication at every step</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary-dark mb-4">Excellence</h3>
                <p className="text-lg text-gray-700">Only the finest properties and highest service standards</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-primary-dark mb-4">Innovation</h3>
                <p className="text-lg text-gray-700">Modern technology for a faster, better rental experience</p>
              </div>
            </div>
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-4xl font-bold text-primary-dark mb-8">Ready to Find Your Home?</h2>
            <Link to="/properties" className="bg-primary text-white px-16 py-6 rounded-full text-2xl font-bold hover:bg-primary-dark transition">
              Browse Properties
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
