// src/App.jsx - UPDATED WITH EMAIL CONFIRMATION ROUTES
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

// Import all pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Contact from './pages/Contact';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import VerificationSent from './pages/VerificationSent'; // NEW
import EmailConfirmed from './pages/EmailConfirmed'; // NEW
import VerificationSuccess from './pages/VerificationSuccess';
import ApplicationForm from './pages/ApplicationForm';
import InitialApplyForm from './pages/InitialApplyForm';
import PostApprovalForm from './pages/dashboard/PostApprovalForm';
import NotFound from './pages/NotFound';

// Dashboard pages
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
                
                {/* EMAIL VERIFICATION FLOW ROUTES */}
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
                
                {/* ===== USER DASHBOARD ROUTES ===== */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
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
