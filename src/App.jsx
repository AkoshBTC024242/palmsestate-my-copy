import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardProvider } from './contexts/DashboardContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import PublicLayout from './components/PublicLayout';
import NotFound from './pages/NotFound';

// Lazy load heavy components for better performance
const Home = lazy(() => import('./pages/Home'));
const Properties = lazy(() => import('./pages/Properties'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const ApplicationForm = lazy(() => import('./pages/ApplicationForm'));
const InitialApplyForm = lazy(() => import('./pages/InitialApplyForm'));

// Dashboard pages - lazy loaded
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Applications = lazy(() => import('./pages/dashboard/Applications'));
const ApplicationDetail = lazy(() => import('./pages/dashboard/ApplicationDetail'));
const SavedProperties = lazy(() => import('./pages/dashboard/SavedProperties'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const PaymentPage = lazy(() => import('./pages/dashboard/PaymentPage'));

// Admin pages - lazy loaded
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProperties = lazy(() => import('./pages/admin/AdminProperties'));
const AdminPropertyEdit = lazy(() => import('./pages/admin/AdminPropertyEdit'));
const AdminApplications = lazy(() => import('./pages/admin/AdminApplications'));
const AdminApplicationDetail = lazy(() => import('./pages/admin/AdminApplicationDetail'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <DashboardProvider>
            {/* Scroll restoration on route change */}
            <ScrollToTop />
            
            <div className="min-h-screen flex flex-col">
              <Suspense fallback={<LoadingSpinner fullScreen />}>
                <Routes>
                  {/* ===== PUBLIC ROUTES WITH HEADER/FOOTER ===== */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/properties/:id" element={<PropertyDetails />} />
                    <Route path="/properties/:id/initial-apply" element={<InitialApplyForm />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                  </Route>
                  
                  {/* ===== USER DASHBOARD ROUTES ===== */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<Dashboard />} />
                    <Route path="applications" element={<Applications />} />
                    <Route path="applications/:id" element={<ApplicationDetail />} />
                    <Route path="applications/:id/payment" element={<PaymentPage />} />
                    <Route path="saved" element={<SavedProperties />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                  
                  {/* ===== ADMIN DASHBOARD ROUTES ===== */}
                  <Route path="/admin" element={
                    <AdminProtectedRoute>
                      <DashboardLayout isAdmin />
                    </AdminProtectedRoute>
                  }>
                    <Route index element={<AdminDashboard />} />
                    <Route path="properties" element={<AdminProperties />} />
                    <Route path="properties/new" element={<AdminPropertyEdit />} />
                    <Route path="properties/:id/edit" element={<AdminPropertyEdit />} />
                    <Route path="applications" element={<AdminApplications />} />
                    <Route path="applications/:id" element={<AdminApplicationDetail />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="payments" element={<AdminPayments />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="settings" element={<AdminSettings />} />
                  </Route>
                  
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
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
          </DashboardProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
