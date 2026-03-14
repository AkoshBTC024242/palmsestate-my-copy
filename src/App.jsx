// src/App.jsx - COMPLETE UPDATED VERSION WITH ALL ROUTES
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/DashboardContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import DashboardLayout from './components/DashboardLayout';

// Import all frontend pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Contact from './pages/Contact';
import About from './pages/About';
import Services from './pages/Services';
import FAQ from './pages/FAQ';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Disclaimer from './pages/Disclaimer';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import VerificationSent from './pages/VerificationSent';
import EmailConfirmed from './pages/EmailConfirmed';
import VerificationSuccess from './pages/VerificationSuccess';
import ApplicationForm from './pages/ApplicationForm';
import InitialApplyForm from './pages/InitialApplyForm';
import PostApprovalForm from './pages/dashboard/PostApprovalForm';
import NotFound from './pages/NotFound';

// Frontend Footer Pages
import Careers from './pages/Careers';
import Buyers from './pages/Buyers';
import Sellers from './pages/Sellers';
import Sell from './pages/Sell';
import Marketing from './pages/Marketing';
import Unlock from './pages/Unlock';
import DataMarketing from './pages/DataMarketing';
import Luxury from './pages/Luxury';
import Join from './pages/Join';
import Listings from './pages/Listings';
import Exclusive from './pages/Exclusive';
import Strategy from './pages/Strategy';

// Dashboard Pages
import Dashboard from './pages/Dashboard';
import Applications from './pages/dashboard/Applications';
import ApplicationDetail from './pages/dashboard/ApplicationDetail';
import SavedProperties from './pages/dashboard/SavedProperties';
import Profile from './pages/dashboard/Profile';
import Settings from './pages/dashboard/Settings';
import PaymentPage from './pages/dashboard/PaymentPage';

// Admin pages
import AdminDashboard from './pages/AdminDashboard';
import AdminProperties from './pages/admin/AdminProperties';
import AdminPropertyEdit from './pages/admin/AdminPropertyEdit';
import AdminApplications from './pages/admin/AdminApplications';
import AdminApplicationDetail from './pages/admin/AdminApplicationDetail';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPayments from './pages/admin/AdminPayments';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

// ===== TEMPORARY PLACEHOLDERS FOR MISSING DASHBOARD PAGES =====
// Create these files in src/pages/dashboard/ to remove the placeholders

// Placeholder for LiveChat
const LiveChat = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl text-white">Live Chat Coming Soon</h2>
    <p className="text-[#A1A1AA] mt-2">This feature is under development.</p>
  </div>
);

// Placeholder for DashboardProperties
const DashboardProperties = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl text-white">Properties Dashboard Coming Soon</h2>
    <p className="text-[#A1A1AA] mt-2">This feature is under development.</p>
  </div>
);

// Placeholder for DashboardBuyers
const DashboardBuyers = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl text-white">Buyers Guide Coming Soon</h2>
    <p className="text-[#A1A1AA] mt-2">This feature is under development.</p>
  </div>
);

// Placeholder for DashboardSellers
const DashboardSellers = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl text-white">Sellers Guide Coming Soon</h2>
    <p className="text-[#A1A1AA] mt-2">This feature is under development.</p>
  </div>
);

// Placeholder for DashboardMarketing
const DashboardMarketing = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl text-white">Marketing Resources Coming Soon</h2>
    <p className="text-[#A1A1AA] mt-2">This feature is under development.</p>
  </div>
);

// Placeholder for DashboardUnlock
const DashboardUnlock = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl text-white">Unlock Potential Coming Soon</h2>
    <p className="text-[#A1A1AA] mt-2">This feature is under development.</p>
  </div>
);

// Placeholder for DashboardLuxury
const DashboardLuxury = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl text-white">Luxury Experiences Coming Soon</h2>
    <p className="text-[#A1A1AA] mt-2">This feature is under development.</p>
  </div>
);

// Placeholder for DashboardJoin
const DashboardJoin = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl text-white">Join Movement Coming Soon</h2>
    <p className="text-[#A1A1AA] mt-2">This feature is under development.</p>
  </div>
);

// Placeholder for DashboardExclusive
const DashboardExclusive = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl text-white">Exclusive Homes Coming Soon</h2>
    <p className="text-[#A1A1AA] mt-2">This feature is under development.</p>
  </div>
);

// Placeholder for DashboardStrategy
const DashboardStrategy = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl text-white">Strategy Call Coming Soon</h2>
    <p className="text-[#A1A1AA] mt-2">This feature is under development.</p>
  </div>
);

// Placeholder for DashboardFAQ
const DashboardFAQ = () => (
  <div className="p-8 text-center">
    <h2 className="text-2xl text-white">FAQ Coming Soon</h2>
    <p className="text-[#A1A1AA] mt-2">This feature is under development.</p>
  </div>
);

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <DashboardProvider>
            <ScrollToTop />

            <div className="min-h-screen flex flex-col">
              <Routes>
                {/* ===== PUBLIC ROUTES WITH HEADER/FOOTER ===== */}
                <Route path="/" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Home />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/properties" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Properties />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/properties/:id" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <PropertyDetails />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/properties/:id/initial-apply" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <InitialApplyForm />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/contact" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Contact />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/about" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <About />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/services" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Services />
                    </main>
                    <Footer />
                  </div>
                } />

                {/* Frontend Footer Pages */}
                <Route path="/careers" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Careers />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/buyers" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Buyers />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/sellers" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Sellers />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/sell" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Sell />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/marketing" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Marketing />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/unlock" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Unlock />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/data-marketing" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <DataMarketing />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/luxury" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Luxury />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/join" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Join />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/listings" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Listings />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/exclusive" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Exclusive />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/strategy" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Strategy />
                    </main>
                    <Footer />
                  </div>
                } />

                {/* Legal Pages */}
                <Route path="/faq" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <FAQ />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/privacy" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <PrivacyPolicy />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/terms" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <TermsOfService />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/disclaimer" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Disclaimer />
                    </main>
                    <Footer />
                  </div>
                } />

                {/* Auth Routes */}
                <Route path="/signin" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <SignIn />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/signup" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <SignUp />
                    </main>
                    <Footer />
                  </div>
                } />

                {/* Email Verification Routes */}
                <Route path="/verification-sent" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <VerificationSent />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/email-confirmed" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <EmailConfirmed />
                    </main>
                    <Footer />
                  </div>
                } />

                <Route path="/verification-success" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <VerificationSuccess />
                    </main>
                    <Footer />
                  </div>
                } />

                {/* ===== USER DASHBOARD ROUTES (PROTECTED) ===== */}
                {/* Main Dashboard */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                {/* Core Dashboard Pages */}
                <Route path="/dashboard/applications" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Applications />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/applications/:id" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ApplicationDetail />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/applications/:id/post-approval" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <PostApprovalForm />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/applications/:id/payment" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <PaymentPage />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/saved" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <SavedProperties />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/profile" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Profile />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/settings" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Settings />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                {/* NEW Dashboard Pages - Live Chat */}
                <Route path="/dashboard/chat" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <LiveChat />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                {/* NEW Dashboard Pages - Properties */}
                <Route path="/dashboard/properties" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DashboardProperties />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                {/* NEW Dashboard Pages - Resources */}
                <Route path="/dashboard/buyers" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DashboardBuyers />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/sellers" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DashboardSellers />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/marketing" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DashboardMarketing />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                {/* NEW Dashboard Pages - Palms Movement */}
                <Route path="/dashboard/unlock" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DashboardUnlock />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/luxury" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DashboardLuxury />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/join" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DashboardJoin />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                {/* NEW Dashboard Pages - Exclusive */}
                <Route path="/dashboard/exclusive" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DashboardExclusive />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/strategy" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DashboardStrategy />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                <Route path="/dashboard/faq" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <DashboardFAQ />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />

                {/* ===== ADMIN DASHBOARD ROUTES ===== */}
                <Route path="/admin" element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                } />

                <Route path="/admin/properties" element={
                  <AdminProtectedRoute>
                    <AdminProperties />
                  </AdminProtectedRoute>
                } />

                <Route path="/admin/properties/new" element={
                  <AdminProtectedRoute>
                    <AdminPropertyEdit />
                  </AdminProtectedRoute>
                } />

                <Route path="/admin/properties/:id/edit" element={
                  <AdminProtectedRoute>
                    <AdminPropertyEdit />
                  </AdminProtectedRoute>
                } />

                <Route path="/admin/applications" element={
                  <AdminProtectedRoute>
                    <AdminApplications />
                  </AdminProtectedRoute>
                } />

                <Route path="/admin/applications/:id" element={
                  <AdminProtectedRoute>
                    <AdminApplicationDetail />
                  </AdminProtectedRoute>
                } />

                <Route path="/admin/users" element={
                  <AdminProtectedRoute>
                    <AdminUsers />
                  </AdminProtectedRoute>
                } />

                <Route path="/admin/payments" element={
                  <AdminProtectedRoute>
                    <AdminPayments />
                  </AdminProtectedRoute>
                } />

                <Route path="/admin/analytics" element={
                  <AdminProtectedRoute>
                    <AdminAnalytics />
                  </AdminProtectedRoute>
                } />

                <Route path="/admin/settings" element={
                  <AdminProtectedRoute>
                    <AdminSettings />
                  </AdminProtectedRoute>
                } />

                {/* ===== PROTECTED APPLICATION FORM ===== */}
                <Route path="/properties/:id/apply" element={
                  <ProtectedRoute>
                    <div className="min-h-screen flex flex-col">
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
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20 flex items-center justify-center">
                      <NotFound />
                    </main>
                    <Footer />
                  </div>
                } />
              </Routes>
            </div>
          </DashboardProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
