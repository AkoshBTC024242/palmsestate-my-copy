import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="fixed top-0 w-full bg-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <Link to="/" className="text-5xl font-extrabold text-primary">Palms Estate</Link>
        <nav className="flex gap-12 text-xl font-medium">
          <Link to="/" className="hover:text-primary transition">Home</Link>
          <Link to="/properties" className="hover:text-primary transition">Properties</Link>
          <Link to="/about" className="hover:text-primary transition">About Us</Link>
          <Link to="/login" className="hover:text-primary transition">Login</Link>
        </nav>
      </div>
    </header>
  )
}
