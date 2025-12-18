import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react'; // Install lucide-react for icons

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/20">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-serif font-bold text-amber-600">Palms Estate</Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-white hover:text-amber-400 transition-colors">Home</Link>
            <Link to="/properties" className="text-white hover:text-amber-400 transition-colors">Properties</Link>
            <Link to="/contact" className="text-white hover:text-amber-400 transition-colors">Contact</Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu (Dropdown) */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/20">
            <div className="flex flex-col space-y-4 pt-4">
              <Link to="/" className="text-white hover:text-amber-400 transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
              <Link to="/properties" className="text-white hover:text-amber-400 transition-colors" onClick={() => setIsOpen(false)}>Properties</Link>
              <Link to="/contact" className="text-white hover:text-amber-400 transition-colors" onClick={() => setIsOpen(false)}>Contact</Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
