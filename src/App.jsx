// src/App.jsx - OPTIMIZED WITH COMBINATION APPROACH
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState, startTransition } from 'react';
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

// Priority 1: Critical components (load immediately)
import PreloadLink from './components/PreloadLink';

// Priority 2: Home page (load with medium priority)
const Home = lazy(() => import(
  /* webpackChunkName: "home" */
  /* webpackPrefetch: true */
  './pages/Home'
));

// Priority 3: Key pages (load with low priority)
const Properties = lazy(() => import(
  /* webpackChunkName: "properties" */
  /* webpackPreload: true */
  './pages/Properties'
));

// Priority 4: Other public pages
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

// Optimized Suspense wrapper
const OptimizedSuspense = ({ children, minHeight = 400 }) => {
  const [showFallback, setShowFallback] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFallback(false);
    }, 2000); // Only show spinner for 2 seconds max

    return () => clearTimeout(timer);
  }, []);

  return (
    <Suspense fallback={
      showFallback ? (
        <div style={{ minHeight: `${minHeight}px` }} className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div style={{ minHeight: `${minHeight}px` }} className="flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-2">Taking longer than expected...</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              Refresh page
            </button>
          </div>
        </div>
      )
    }>
      {children}
    </Suspense>
  );
};

// Route preloader component
function RoutePreloader() {
  const location = useLocation();

  useEffect(() => {
    // Load secondary assets after main content
    const loadSecondaryAssets = () => {
      // Preload dashboard if user is likely to visit
      if (location.pathname === '/' || location.pathname === '/properties') {
        setTimeout(() => {
          Promise.all([
            import('./pages/Dashboard'),
            import('./pages/dashboard/Applications')
          ]).catch(() => {}); // Silent fail
        }, 3000);
      }
    };

    const timer = setTimeout(loadSecondaryAssets, 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
}

// Layout components
const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow pt-16 md:pt-20">
      {children}
    </main>
    <Footer />
  </div>
);

function App() {
  const [isCriticalLoaded, setIsCriticalLoaded] = useState(false);

  useEffect(() => {
    // Mark critical load complete after initial render
    setIsCriticalLoaded(true);
    
    // Preload key routes in background
    const preloadKeyRoutes = () => {
      startTransition(() => {
        Promise.all([
          import('./pages/Properties'),
          import('./pages/SignIn'),
          import('./pages/Contact')
        ]).catch(() => {});
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadKeyRoutes);
    } else {
      setTimeout(preloadKeyRoutes, 1000);
    }
  }, []);

  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <DashboardProvider>
            <ScrollToTop />
            <RoutePreloader />
            
            <div className="min-h-screen flex flex-col">
              <Routes>
                {/* Home Route - Highest priority */}
                <Route path="/" element={
                  <PublicLayout>
                    <OptimizedSuspense minHeight={600}>
                      <Home />
                    </OptimizedSuspense>
                  </PublicLayout>
                } />
                
                {/* Properties Route - High priority */}
                <Route path="/properties" element={
                  <PublicLayout>
                    <OptimizedSuspense minHeight={600}>
                      <Properties />
                    </OptimizedSuspense>
                  </PublicLayout>
                } />
                
                {/* Property Details - Medium priority */}
                <Route path="/properties/:id" element={
                  <PublicLayout>
                    <OptimizedSuspense>
                      <PropertyDetails />
                    </OptimizedSuspense>
                  </PublicLayout>
                } />
                
                {/* Other Public Routes */}
                <Route path="/contact" element={
                  <PublicLayout>
                    <OptimizedSuspense>
                      <Contact />
                    </OptimizedSuspense>
                  </PublicLayout>
                } />
                
                <Route path="/about" element={
                  <PublicLayout>
                    <OptimizedSuspense>
                      <About />
                    </OptimizedSuspense>
                  </PublicLayout>
                } />
                
                <Route path="/signin" element={
                  <PublicLayout>
                    <OptimizedSuspense>
                      <SignIn />
                    </OptimizedSuspense>
                  </PublicLayout>
                } />
                
                <Route path="/signup" element={
                  <PublicLayout>
                    <OptimizedSuspense>
                      <SignUp />
                    </OptimizedSuspense>
                  </PublicLayout>
                } />
                
                {/* Add other routes similarly... */}
                
                {/* 404 Route */}
                <Route path="*" element={
                  <PublicLayout>
                    <OptimizedSuspense>
                      <NotFound />
                    </OptimizedSuspense>
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

// Export a wrapped version of Header to use PreloadLink
export function EnhancedHeader() {
  return (
    <Header 
      LinkComponent={PreloadLink}
    />
  );
}

export default App;
