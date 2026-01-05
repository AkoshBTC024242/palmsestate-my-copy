// src/App.jsx - OPTIMIZED LAZY LOADING
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
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

// Optimize lazy loading with priority loading
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

// Dashboard pages - grouped
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Applications = lazy(() => import('./pages/dashboard/Applications'));
const ApplicationDetail = lazy(() => import('./pages/dashboard/ApplicationDetail'));
const SavedProperties = lazy(() => import('./pages/dashboard/SavedProperties'));
const Profile = lazy(() => import('./pages/dashboard/Profile'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const PaymentPage = lazy(() => import('./pages/dashboard/PaymentPage'));

// Admin pages - grouped
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminProperties = lazy(() => import('./pages/admin/AdminProperties'));
const AdminPropertyEdit = lazy(() => import('./pages/admin/AdminPropertyEdit'));
const AdminApplications = lazy(() => import('./pages/admin/AdminApplications'));
const AdminApplicationDetail = lazy(() => import('./pages/admin/AdminApplicationDetail'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

// Optimized Suspense wrapper with different fallbacks
const RouteSuspense = ({ children, routeType = 'public' }) => {
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 3000); // Show spinner for max 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <Suspense 
      fallback={
        showSpinner ? (
          <LoadingSpinner fullScreen={routeType === 'dashboard'} />
        ) : (
          <div className={`${routeType === 'dashboard' ? 'min-h-[400px]' : 'min-h-[200px]'} flex items-center justify-center`}>
            <p className="text-gray-500">Still loading... Please wait.</p>
          </div>
        )
      }
    >
      {children}
    </Suspense>
  );
};

// Route preloading component
function RoutePreloader() {
  const location = useLocation();

  useEffect(() => {
    // Preload based on current route
    const preloadRoutes = () => {
      const path = location.pathname;

      // Preload likely next routes
      if (path === '/') {
        // If on home page, preload properties and sign in
        Promise.all([
          import('./pages/Properties'),
          import('./pages/SignIn')
        ]).catch(() => {}); // Silent fail
      } else if (path.startsWith('/properties')) {
        // If on properties, preload dashboard
        import('./pages/Dashboard').catch(() => {});
      } else if (path.startsWith('/dashboard')) {
        // If on dashboard, preload admin routes for admin users
        import('./pages/AdminDashboard').catch(() => {});
      }
    };

    // Use requestIdleCallback for non-critical preloading
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadRoutes);
    } else {
      setTimeout(preloadRoutes, 1000);
    }
  }, [location.pathname]);

  return null;
}

// Optimized layout components
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow pt-16 md:pt-20">
      {children}
    </main>
    <Footer />
  </div>
);

const DashboardRouteLayout = ({ children }) => (
  <ProtectedRoute>
    <DashboardLayout>
      {children}
    </DashboardLayout>
  </ProtectedRoute>
);

const AdminRouteLayout = ({ children }) => (
  <AdminProtectedRoute>
    {children}
  </AdminProtectedRoute>
);

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <DashboardProvider>
            <ScrollToTop />
            <RoutePreloader />
            
            <div className="min-h-screen flex flex-col">
              <Routes>
                {/* ===== PUBLIC ROUTES ===== */}
                <Route path="/" element={
                  <PublicLayout>
                    <RouteSuspense>
                      <Home />
                    </RouteSuspense>
                  </PublicLayout>
                } />
                
                <Route path="/properties" element={
                  <PublicLayout>
                    <RouteSuspense>
                      <Properties />
                    </RouteSuspense>
                  </PublicLayout>
                } />
                
                <Route path="/properties/:id" element={
                  <PublicLayout>
                    <RouteSuspense>
                      <PropertyDetails />
                    </RouteSuspense>
                  </PublicLayout>
                } />
                
                <Route path="/properties/:id/initial-apply" element={
                  <PublicLayout>
                    <RouteSuspense>
                      <InitialApplyForm />
                    </RouteSuspense>
                  </PublicLayout>
                } />
                
                <Route path="/contact" element={
                  <PublicLayout>
                    <RouteSuspense>
                      <Contact />
                    </RouteSuspense>
                  </PublicLayout>
                } />
                
                <Route path="/about" element={
                  <PublicLayout>
                    <RouteSuspense>
                      <About />
                    </RouteSuspense>
                  </PublicLayout>
                } />
                
                <Route path="/signin" element={
                  <PublicLayout>
                    <RouteSuspense>
                      <SignIn />
                    </RouteSuspense>
                  </PublicLayout>
                } />
                
                <Route path="/signup" element={
                  <PublicLayout>
                    <RouteSuspense>
                      <SignUp />
                    </RouteSuspense>
                  </PublicLayout>
                } />
                
                <Route path="/verification-success" element={
                  <PublicLayout>
                    <RouteSuspense>
                      <VerificationSuccess />
                    </RouteSuspense>
                  </PublicLayout>
                } />
                
                {/* ===== PROTECTED APPLICATION FORM ===== */}
                <Route path="/properties/:id/apply" element={
                  <ProtectedRoute>
                    <PublicLayout>
                      <RouteSuspense>
                        <ApplicationForm />
                      </RouteSuspense>
                    </PublicLayout>
                  </ProtectedRoute>
                } />
                
                {/* ===== DASHBOARD ROUTES ===== */}
                <Route path="/dashboard" element={
                  <DashboardRouteLayout>
                    <RouteSuspense routeType="dashboard">
                      <Dashboard />
                    </RouteSuspense>
                  </DashboardRouteLayout>
                } />
                
                <Route path="/dashboard/applications" element={
                  <DashboardRouteLayout>
                    <RouteSuspense routeType="dashboard">
                      <Applications />
                    </RouteSuspense>
                  </DashboardRouteLayout>
                } />
                
                <Route path="/dashboard/applications/:id" element={
                  <DashboardRouteLayout>
                    <RouteSuspense routeType="dashboard">
                      <ApplicationDetail />
                    </RouteSuspense>
                  </DashboardRouteLayout>
                } />
                
                <Route path="/dashboard/applications/:id/payment" element={
                  <DashboardRouteLayout>
                    <RouteSuspense routeType="dashboard">
                      <PaymentPage />
                    </RouteSuspense>
                  </DashboardRouteLayout>
                } />
                
                <Route path="/dashboard/saved" element={
                  <DashboardRouteLayout>
                    <RouteSuspense routeType="dashboard">
                      <SavedProperties />
                    </RouteSuspense>
                  </DashboardRouteLayout>
                } />
                
                <Route path="/dashboard/profile" element={
                  <DashboardRouteLayout>
                    <RouteSuspense routeType="dashboard">
                      <Profile />
                    </RouteSuspense>
                  </DashboardRouteLayout>
                } />
                
                <Route path="/dashboard/settings" element={
                  <DashboardRouteLayout>
                    <RouteSuspense routeType="dashboard">
                      <Settings />
                    </RouteSuspense>
                  </DashboardRouteLayout>
                } />
                
                {/* ===== ADMIN ROUTES ===== */}
                <Route path="/admin" element={
                  <AdminRouteLayout>
                    <RouteSuspense routeType="dashboard">
                      <AdminDashboard />
                    </RouteSuspense>
                  </AdminRouteLayout>
                } />
                
                <Route path="/admin/properties" element={
                  <AdminRouteLayout>
                    <RouteSuspense routeType="dashboard">
                      <AdminProperties />
                    </RouteSuspense>
                  </AdminRouteLayout>
                } />
                
                <Route path="/admin/properties/new" element={
                  <AdminRouteLayout>
                    <RouteSuspense routeType="dashboard">
                      <AdminPropertyEdit />
                    </RouteSuspense>
                  </AdminRouteLayout>
                } />
                
                <Route path="/admin/properties/:id/edit" element={
                  <AdminRouteLayout>
                    <RouteSuspense routeType="dashboard">
                      <AdminPropertyEdit />
                    </RouteSuspense>
                  </AdminRouteLayout>
                } />
                
                <Route path="/admin/applications" element={
                  <AdminRouteLayout>
                    <RouteSuspense routeType="dashboard">
                      <AdminApplications />
                    </RouteSuspense>
                  </AdminRouteLayout>
                } />
                
                <Route path="/admin/applications/:id" element={
                  <AdminRouteLayout>
                    <RouteSuspense routeType="dashboard">
                      <AdminApplicationDetail />
                    </RouteSuspense>
                  </AdminRouteLayout>
                } />
                
                <Route path="/admin/users" element={
                  <AdminRouteLayout>
                    <RouteSuspense routeType="dashboard">
                      <AdminUsers />
                    </RouteSuspense>
                  </AdminRouteLayout>
                } />
                
                <Route path="/admin/payments" element={
                  <AdminRouteLayout>
                    <RouteSuspense routeType="dashboard">
                      <AdminPayments />
                    </RouteSuspense>
                  </AdminRouteLayout>
                } />
                
                <Route path="/admin/analytics" element={
                  <AdminRouteLayout>
                    <RouteSuspense routeType="dashboard">
                      <AdminAnalytics />
                    </RouteSuspense>
                  </AdminRouteLayout>
                } />
                
                <Route path="/admin/settings" element={
                  <AdminRouteLayout>
                    <RouteSuspense routeType="dashboard">
                      <AdminSettings />
                    </RouteSuspense>
                  </AdminRouteLayout>
                } />
                
                {/* ===== 404 PAGE ===== */}
                <Route path="*" element={
                  <PublicLayout>
                    <div className="flex items-center justify-center min-h-[60vh]">
                      <RouteSuspense>
                        <NotFound />
                      </RouteSuspense>
                    </div>
                  </PublicLayout>
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
