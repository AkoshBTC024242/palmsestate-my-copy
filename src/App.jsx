import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Contact from './pages/Contact';
import About from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/properties/:id" element={<PropertyDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            {/* Optional: Add a 404 route */}
            <Route path="*" element={
              <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-serif font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
                  <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                  <a href="/" className="bg-amber-600 text-white px-6 py-3 rounded-full font-sans font-semibold hover:bg-amber-700 transition-colors">
                    Return Home
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;