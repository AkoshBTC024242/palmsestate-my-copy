import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/DashboardContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DashboardProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow pt-16 md:pt-20">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </DashboardProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
