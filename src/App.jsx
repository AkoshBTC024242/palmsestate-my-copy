// src/App.jsx - OPTIMIZED VERSION
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
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

// Optimize lazy loading with preload hints
const Home = lazy(() => import('./pages/Home'));
const Properties = lazy(() => import('./pages/Properties'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const VerificationSuccess = lazy(() => import('./pages/VerificationSuccess'));
const ApplicationForm = lazy(() => import('./pages/ApplicationForm'));
const InitialApplyForm = lazy(() => import('./pages/InitialApplyForm'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Dashboard pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Applications = lazy(() => import('./pages/dashboard/Applications'));
const ApplicationDetail = lazy(() => import('./pages/dashboard/ApplicationDetail'));
const SavedProperties = lazy(() => import('./pages/dashboard/SavedProperties'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const PaymentPage = lazy(() => import('./pages/dashboard/PaymentPage'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProperties = lazy(() => import('./pages/admin/AdminProperties'));
const AdminPropertyEdit = lazy(() => import('./pages/admin/AdminPropertyEdit'));
const AdminApplications = lazy(() => import('./pages/admin/AdminApplications'));
const AdminApplicationDetail = lazy(() => import('./pages/admin/AdminApplicationDetail'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

// Route-based code splitting wrapper
const LazyRoute = ({ children }) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

// Component to prefetch routes on hover
const PrefetchLink = ({ to, children }) => {
  const prefetch = () => {
    // This is a simple prefetch strategy
    // In a real app, you'd use React Router's prefetch API
    console.log(`Prefetching route: ${to}`);
  };

  return (
    <div onMouseEnter={prefetch}>
      {children}
    </div>
  );
};

function App() {
  return (
    <Router future={{ v7_startTransition: true }}>
      <ErrorBoundary>
        <AuthProvider>
          <DashboardProvider>
            <ScrollToTop />
            
            <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 via-white to-gray-50/50">
              <Routes>
                {/* ===== PUBLIC ROUTES WITH HEADER/FOOTER ===== */}
                <Route path="/*" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <LazyRoute>
                        <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/properties" element={<Properties />} />
                          <Route path="/properties/:id" element={<PropertyDetails />} />
                          <Route path="/properties/:id/initial-apply" element={<InitialApplyForm />} />
                          <Route path="/contact" element={<Contact />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/signin" element={<SignIn />} />
                          <Route path="/signup" element={<SignUp />} />
                          <Route path="/verification-success" element={<VerificationSuccess />} />
                        </Routes>
                      </LazyRoute>
                    </main>
                    <Footer />
                  </div>
                } />
                
                {/* ===== USER DASHBOARD ROUTES ===== */}
                <Route path="/dashboard/*" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <LazyRoute>
                        <Routes>
                          <Route path="/" element={<Dashboard />} />
                          <Route path="/applications" element={<Applications />} />
                          <Route path="/applications/:id" element={<ApplicationDetail />} />
                          <Route path="/applications/:id/payment" element={<PaymentPage />} />
                          <Route path="/saved" element={<SavedProperties />} />
                          <Route path="/profile" element={<Profile />} />
                          <Route path="/settings" element={<Settings />} />
                        </Routes>
                      </LazyRoute>
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                {/* ===== ADMIN DASHBOARD ROUTES ===== */}
                <Route path="/admin/*" element={
                  <AdminProtectedRoute>
                    <LazyRoute>
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
                    </LazyRoute>
                  </AdminProtectedRoute>
                } />
                
                {/* ===== PROTECTED APPLICATION FORM ===== */}
                <Route path="/properties/:id/apply" element={
                  <ProtectedRoute>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-grow pt-16 md:pt-20">
                        <LazyRoute>
                          <ApplicationForm />
                        </LazyRoute>
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
                      <LazyRoute>
                        <NotFound />
                      </LazyRoute>
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
