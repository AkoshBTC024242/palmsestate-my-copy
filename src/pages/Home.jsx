import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      {/* Hero with luxury villa background */}
      <section className="relative h-screen bg-cover bg-center flex items-center justify-center" style={{backgroundImage: "url('https://thumbs.dreamstime.com/b/modern-luxury-beachfront-villa-curved-glass-architecture-pool-sunset-surrounded-palm-trees-ocean-view-stunning-376395239.jpg')"}}>
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative text-center px-6 max-w-5xl text-white">
          <h1 className="text-7xl md:text-9xl font-extrabold mb-8 drop-shadow-2xl">Palms Estate</h1>
          <p className="text-4xl md:text-6xl font-light mb-12 drop-shadow-2xl">Exclusive Luxury Residences | Elevated Living Experiences</p>
          <Link to="/properties" className="bg-white text-primary px-20 py-8 rounded-full text-3xl font-bold hover:bg-gray-100 transition shadow-2xl">
            Discover Exclusive Rentals
          </Link>
        </div>
      </section>

      {/* Featured Rentals with real luxury images */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-6xl font-bold text-center text-primary mb-20">Curated Luxury Residences</h2>
          <div className="grid md:grid-cols-3 gap-16">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl hover:-translate-y-4 transition duration-300 group relative">
              <img src="https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2017/6/15/0/FOD17_Christopher-Brandon_Beach-Project_4.jpg.rend.hgtvcom.1280.960.85.suffix/1497546216989.webp" alt="Oceanfront Villa Interior" className="w-full h-96 object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end">
                <div className="p-8 text-white">
                  <h3 className="text-4xl font-bold">Oceanfront Villa</h3>
                  <p className="text-3xl font-bold text-accent mt-2">$8,500/month</p>
                  <p className="text-xl mt-2">Miami Beach, FL</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl hover:-translate-y-4 transition duration-300 group relative">
              <img src="https://thumbs.dreamstime.com/b/outdoor-luxury-sunset-over-infinity-pool-swimming-summer-beachfront-hotel-resort-tropical-landscape-beautiful-tranquil-beach-377406152.jpg" alt="Beachfront Mansion Exterior" className="w-full h-96 object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end">
                <div className="p-8 text-white">
                  <h3 className="text-4xl font-bold">Beachfront Mansion</h3>
                  <p className="text-3xl font-bold text-accent mt-2">$15,000/month</p>
                  <p className="text-xl mt-2">Malibu, CA</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl hover:-translate-y-4 transition duration-300 group relative">
              <img src="https://thumbs.dreamstime.com/b/luxurious-modern-penthouse-living-room-night-stunning-city-skyline-view-floor-to-ceiling-windows-cozy-interior-359471346.jpg" alt="City Penthouse Night View" className="w-full h-96 object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end">
                <div className="p-8 text-white">
                  <h3 className="text-4xl font-bold">City Penthouse</h3>
                  <p className="text-3xl font-bold text-accent mt-2">$6,200/month</p>
                  <p className="text-xl mt-2">New York, NY</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
