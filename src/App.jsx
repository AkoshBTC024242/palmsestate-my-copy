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
import InitialApplyForm from './pages/InitialApplyForm';
import PaymentPage from './pages/dashboard/PaymentPage';
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
                    <Route path="/properties/:id/initial-apply" element={<InitialApplyForm />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
            
            {/* ===== USER DASHBOARD ROUTES (SEPARATE LAYOUT) ===== */}
            <Route path="/dashboard/*" element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/applications" element={<Applications />} />
                  <Route path="/applications/:id" element={<ApplicationDetail />} />
                  <Route path="/applications/:id/payment" element={<PaymentPage />} />
                  <Route path="/saved" element={<SavedProperties />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </ProtectedRoute>
            } />
            
            {/* ===== ADMIN DASHBOARD ROUTES (SEPARATE LAYOUT) ===== */}
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
                <main className="flex-grow pt-16 md:pt-20 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-xl text-gray-600 mb-8">Page not found</p>
                    <a href="/" className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors">
                      Return Home
                    </a>
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
