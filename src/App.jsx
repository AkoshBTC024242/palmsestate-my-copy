import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Contact from './pages/Contact';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import ApplicationForm from './pages/ApplicationForm';
import InitialApplyForm from './pages/InitialApplyForm'; // NEW
import PaymentPage from './pages/PaymentPage'; // NEW
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import AdminProtectedRoute from './components/AdminProtectedRoute';
// Dashboard Pages
import Applications from './pages/dashboard/Applications';
import ApplicationDetail from './pages/dashboard/ApplicationDetail';
import SavedProperties from './pages/dashboard/SavedProperties';
import Profile from './pages/dashboard/Profile';
import Settings from './pages/dashboard/Settings';
// Admin Pages
import AdminProperties from './pages/admin/AdminProperties';
import AdminPropertyEdit from './pages/admin/AdminPropertyEdit';
import AdminApplications from './pages/admin/AdminApplications';
import AdminApplicationDetail from './pages/admin/AdminApplicationDetail';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPayments from './pages/admin/AdminPayments';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <Routes>
            {/* ===== PUBLIC ROUTES WITH HEADER/FOOTER ===== */}
            <Route path="/*" element={
              <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 via-white to-gray-50/50">
                <Header />
                <main className="flex-grow pt-16 md:pt-20">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/properties/:id" element={<PropertyDetails />} />
                    <Route path="/properties/:id/initial-apply" element={<InitialApplyForm />} /> {/* NEW */}
                    <Route path="/applications/:id/pay" element={<PaymentPage />} /> {/* NEW */}
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
            {/* ===== USER DASHBOARD ROUTES (NO HEADER/FOOTER) ===== */}
            <Route path="/dashboard/*" element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/applications" element={<Applications />} />
                  <Route path="/applications/:id" element={<ApplicationDetail />} />
                  <Route path="/saved" element={<SavedProperties />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </ProtectedRoute>
            } />
            {/* ===== ADMIN DASHBOARD ROUTES (NO HEADER/FOOTER) ===== */}
            <Route path="/admin/*" element={
              <AdminProtectedRoute>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/properties" element={<AdminProperties />} />
                  <Route path="/properties/new" element={<AdminPropertyEdit />} />
                  <Route path="/properties/:id/edit" element={<AdminPropertyEdit />} />
                  <Route path="/applications" element={<AdminApplications />} />
                  <Route path="/applications/:id" element={<AdminApplicationDetail />} />
                  <Route path="/users" element={<AdminUsers />} />
                  <Route path="/payments" element={<AdminPayments />} />
                  <Route path="/analytics" element={<AdminAnalytics />} />
                  <Route path="/settings" element={<AdminSettings />} />
                </Routes>
              </AdminProtectedRoute>
            } />
            {/* ===== PROTECTED APPLICATION FORM (OLD) - KEEP FOR BACKWARD COMPATIBILITY ===== */}
            <Route path="/properties/:id/apply" element={
              <ProtectedRoute>
                <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 via-white to-gray-50/50">
                  <Header />
                  <main className="flex-grow pt-16 md:pt-20">
                    <ApplicationForm />
                  </main>
                  <Footer />
                </div>
              </ProtectedRoute>
            } />
            {/* ===== 404 PAGE ===== */}
            <Route path="*" element={
              <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 via-white to-gray-50/50">
                <Header />
                <main className="flex-grow pt-16 md:pt-20">
                  <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-b from-white to-amber-50">
                    <div className="text-center px-4 max-w-2xl mx-auto">
                      <div className="mb-8">
                        <div className="inline-block backdrop-blur-md bg-white/60 border border-gray-200/50 rounded-2xl px-8 py-4 mb-6">
                          <span className="font-sans text-amber-600 font-semibold tracking-widest text-sm md:text-base uppercase">
                            ERROR 404
                          </span>
                        </div>
                        <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
                          Page Not <span className="text-amber-600">Found</span>
                        </h1>
                        <p className="font-sans text-lg md:text-xl text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                          The page you're looking for doesn't exist or has been moved to a new location.
                        </p>
                      </div>
                     
                      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a
                          href="/"
                          className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white px-8 py-4 rounded-full font-sans font-bold hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                          Return to Home
                        </a>
                       
                        <a
                          href="/properties"
                          className="inline-flex items-center gap-3 backdrop-blur-md bg-white/10 text-gray-900 border border-gray-300 px-8 py-4 rounded-full font-sans font-bold hover:bg-white/20 transition-all duration-300"
                        >
                          Browse Properties
                        </a>
                      </div>
                    </div>
                  </div>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
