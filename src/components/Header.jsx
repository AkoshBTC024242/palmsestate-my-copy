import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white shadow-md fixed top-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link to="/" className="text-4xl font-bold text-orange-800">Palms Estate</Link>
        <nav className="flex gap-12 text-xl">
          <Link to="/" className="hover:text-orange-600 transition">Home</Link>
          <Link to="/properties" className="hover:text-orange-600 transition">Properties</Link>
          <Link to="/about" className="hover:text-orange-600 transition">About Us</Link>
          <Link to="/login" className="hover:text-orange-600 transition">Login</Link>
        </nav>
      </div>
    </header>
  )
}
