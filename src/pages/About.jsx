export default function About() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-gray-50">
      <section className="py-32 bg-gradient-to-br from-orange-800 to-orange-600 text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-7xl font-bold mb-12">About Palms Estate</h1>
          <p className="text-3xl font-light">Curating Extraordinary Rental Experiences</p>
        </div>
      </section>

      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-6xl font-bold text-center text-orange-800 mb-20">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-16">
            <div className="text-center bg-orange-50 p-16 rounded-3xl shadow-2xl">
              <h3 className="text-4xl font-bold text-orange-800 mb-8">Excellence</h3>
              <p className="text-2xl text-gray-700">Uncompromising quality in every property</p>
            </div>
            <div className="text-center bg-orange-50 p-16 rounded-3xl shadow-2xl">
              <h3 className="text-4xl font-bold text-orange-800 mb-8">Integrity</h3>
              <p className="text-2xl text-gray-700">Transparent and honest partnerships</p>
            </div>
            <div className="text-center bg-orange-50 p-16 rounded-3xl shadow-2xl">
              <h3 className="text-4xl font-bold text-orange-800 mb-8">Innovation</h3>
              <p className="text-2xl text-gray-700">Modern technology for seamless rentals</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
