import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="text-3xl font-bold text-primary">Palms Estate</Link>
        <nav className="hidden md:flex gap-10 text-lg">
          <Link to="/" className="hover:text-primary-dark transition">Home</Link>
          <Link to="/properties" className="hover:text-primary-dark transition">Properties</Link>
          <Link to="/about" className="hover:text-primary-dark transition">About Us</Link>
          <Link to="/login" className="hover:text-primary-dark transition">Login</Link>
        </nav>
      </div>
    </header>
  )
}
