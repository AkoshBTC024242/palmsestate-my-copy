export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <section className="py-24 bg-gradient-to-br from-orange-900 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold mb-8">About Palms Estate</h1>
          <p className="text-2xl font-light">Your Trusted Partner in Luxury Rental Living</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-orange-900 mb-8">Our Story</h2>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Founded in 2020, Palms Estate has been redefining luxury rental living with a commitment to excellence, transparency, and tenant satisfaction.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                We specialize in premium properties in prime locations, offering a curated selection of high-end apartments, villas, and penthouses for discerning renters.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our mission is to make finding and securing your dream rental home seamless, secure, and enjoyable.
              </p>
            </div>
            <div className="bg-gray-200 border-2 border-dashed rounded-2xl w-full h-96"></div>
          </div>

          <div className="mt-20">
            <h2 className="text-4xl font-bold text-center text-orange-900 mb-16">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-orange-900 mb-4">Integrity</h3>
                <p className="text-lg text-gray-700">Transparent processes and honest communication</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-orange-900 mb-4">Excellence</h3>
                <p className="text-lg text-gray-700">Only the finest properties and highest service standards</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-orange-900 mb-4">Innovation</h3>
                <p className="text-lg text-gray-700">Modern technology for a better rental experience</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
