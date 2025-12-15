import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white shadow-lg fixed top-0 w-full z-10">
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link to="/" className="text-5xl font-extrabold text-orange-800">Palms Estate</Link>
        <nav className="flex gap-16 text-2xl">
          <Link to="/" className="hover:text-orange-600 transition font-medium">Home</Link>
          <Link to="/properties" className="hover:text-orange-600 transition font-medium">Properties</Link>
          <Link to="/about" className="hover:text-orange-600 transition font-medium">About Us</Link>
          <Link to="/login" className="hover:text-orange-600 transition font-medium">Login</Link>
        </nav>
      </div>
    </header>
  )
}
