import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative h-screen bg-gradient-to-br from-orange-900 to-orange-700 text-white flex items-center">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">Palms Estate</h1>
          <p className="text-3xl md:text-5xl mb-12 font-light">Luxury Rentals Redefined</p>
          <Link to="/properties" className="inline-block bg-white text-orange-900 px-16 py-6 rounded-full text-2xl font-semibold hover:bg-gray-100 transition shadow-lg">
            View Rentals
          </Link>
        </div>
      </section>

      {/* Featured Rentals */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-5xl font-bold text-center text-orange-900 mb-16">Featured Rentals</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800" alt="Oceanfront Villa" className="w-full h-80 object-cover" />
              <div className="p-8">
                <h3 className="text-3xl font-bold text-orange-900">Oceanfront Villa</h3>
                <p className="text-4xl font-bold text-orange-600 mt-4">$8,500/month</p>
                <p className="text-xl text-gray-600 mt-2">Miami Beach, FL</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition">
              <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800" alt="Beachfront Mansion" className="w-full h-80 object-cover" />
              <div className="p-8">
                <h3 className="text-3xl font-bold text-orange-900">Beachfront Mansion</h3>
                <p className="text-4xl font-bold text-orange-600 mt-4">$15,000/month</p>
                <p className="text-xl text-gray-600 mt-2">Malibu, CA</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden hover:shadow-3xl transition">
              <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800" alt="City Penthouse" className="w-full h-80 object-cover" />
              <div className="p-8">
                <h3 className="text-3xl font-bold text-orange-900">City Penthouse</h3>
                <p className="text-4xl font-bold text-orange-600 mt-4">$6,200/month</p>
                <p className="text-xl text-gray-600 mt-2">New York, NY</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
