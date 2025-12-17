import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <section className="relative h-screen bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center">
        <div className="text-center px-6 max-w-5xl">
          <h1 className="text-7xl md:text-9xl font-extrabold mb-8">Palms Estate</h1>
          <p className="text-4xl md:text-6xl font-light mb-12">Luxury Rentals Redefined</p>
          <Link to="/properties" className="bg-white text-primary px-20 py-8 rounded-full text-3xl font-bold hover:bg-gray-100 transition shadow-2xl">
            Explore Rentals
          </Link>
        </div>
      </section>

      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-6xl font-bold text-center text-primary mb-20">Featured Luxury Rentals</h2>
          <div className="grid md:grid-cols-3 gap-16">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl hover:-translate-y-4 transition duration-300">
              <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800" alt="Oceanfront Villa" className="w-full h-96 object-cover" />
              <div className="p-12">
                <h3 className="text-4xl font-bold text-primary">Oceanfront Villa</h3>
                <p className="text-5xl font-bold text-accent mt-4">$8,500/month</p>
                <p className="text-2xl text-gray-600 mt-2">Miami Beach, FL</p>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl hover:-translate-y-4 transition duration-300">
              <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800" alt="Beachfront Mansion" className="w-full h-96 object-cover" />
              <div className="p-12">
                <h3 className="text-4xl font-bold text-primary">Beachfront Mansion</h3>
                <p className="text-5xl font-bold text-accent mt-4">$15,000/month</p>
                <p className="text-2xl text-gray-600 mt-2">Malibu, CA</p>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl hover:-translate-y-4 transition duration-300">
              <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800" alt="City Penthouse" className="w-full h-96 object-cover" />
              <div className="p-12">
                <h3 className="text-4xl font-bold text-primary">City Penthouse</h3>
                <p className="text-5xl font-bold text-accent mt-4">$6,200/month</p>
                <p className="text-2xl text-gray-600 mt-2">New York, NY</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
