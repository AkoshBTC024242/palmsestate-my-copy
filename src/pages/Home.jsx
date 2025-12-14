import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="pt-20">
      <section className="relative h-screen bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center overflow-hidden">
        <div className="text-center px-6 z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-8">Palms Estate</h1>
          <p className="text-3xl md:text-5xl mb-12">Luxury Rental Living</p>
          <Link to="/properties" className="bg-white text-primary px-16 py-6 rounded-full text-2xl font-bold hover:bg-accent transition">
            View Rentals
          </Link>
        </div>
      </section>

      <section className="py-20 bg-accent">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-primary-dark mb-16">Why Choose Palms Estate</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-primary-dark mb-4">Premium Locations</h3>
              <p className="text-xl text-gray-700">Hand-selected properties in the most desirable neighborhoods</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-primary-dark mb-4">Luxury Standard</h3>
              <p className="text-xl text-gray-700">High-end finishes, modern amenities, and impeccable service</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-primary-dark mb-4">Simple Application</h3>
              <p className="text-xl text-gray-700">Fast, secure process with $50 application fee</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
