export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-amber-600 to-orange-500 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <h3 className="font-serif text-3xl font-bold">Palms Estate</h3>
            <p className="font-sans mt-2">Premier Luxury Rentals Worldwide</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="font-sans font-semibold">Contact Our Concierge</p>
            <p className="mt-2">📞 +1 (828) 623-9765</p>
            <p>✉️ admin@palmsestate.org</p>
          </div>
        </div>
        
        <div className="border-t border-white/30 mt-8 pt-8 text-center font-sans text-sm">
          <p>© {new Date().getFullYear()} Palms Estate. All rights reserved. | Luxury redefined.</p>
        </div>
      </div>
    </footer>
  );
}
