// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
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

// Lazy load components
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

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <DashboardProvider>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col">
              <Routes>
                {/* Public Routes with Header/Footer */}
                <Route path="/" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Suspense fallback={<LoadingSpinner />}>
                        <Home />
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                } />
                
                <Route path="/properties" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Suspense fallback={<LoadingSpinner />}>
                        <Properties />
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                } />
                
                <Route path="/properties/:id" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Suspense fallback={<LoadingSpinner />}>
                        <PropertyDetails />
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                } />
                
                <Route path="/properties/:id/initial-apply" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Suspense fallback={<LoadingSpinner />}>
                        <InitialApplyForm />
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                } />
                
                <Route path="/contact" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Suspense fallback={<LoadingSpinner />}>
                        <Contact />
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                } />
                
                <Route path="/about" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Suspense fallback={<LoadingSpinner />}>
                        <About />
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                } />
                
                <Route path="/signin" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Suspense fallback={<LoadingSpinner />}>
                        <SignIn />
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                } />
                
                <Route path="/signup" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Suspense fallback={<LoadingSpinner />}>
                        <SignUp />
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                } />
                
                <Route path="/verification-success" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20">
                      <Suspense fallback={<LoadingSpinner />}>
                        <VerificationSuccess />
                      </Suspense>
                    </main>
                    <Footer />
                  </div>
                } />
                
                {/* Protected Application Form */}
                <Route path="/properties/:id/apply" element={
                  <ProtectedRoute>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <main className="flex-grow pt-16 md:pt-20">
                        <Suspense fallback={<LoadingSpinner />}>
                          <ApplicationForm />
                        </Suspense>
                      </main>
                      <Footer />
                    </div>
                  </ProtectedRoute>
                } />
                
                {/* Dashboard Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Dashboard />
                      </Suspense>
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard/applications" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Applications />
                      </Suspense>
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard/applications/:id" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Suspense fallback={<LoadingSpinner />}>
                        <ApplicationDetail />
                      </Suspense>
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard/applications/:id/payment" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Suspense fallback={<LoadingSpinner />}>
                        <PaymentPage />
                      </Suspense>
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard/saved" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Suspense fallback={<LoadingSpinner />}>
                        <SavedProperties />
                      </Suspense>
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard/profile" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Profile />
                      </Suspense>
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                <Route path="/dashboard/settings" element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Suspense fallback={<LoadingSpinner />}>
                        <Settings />
                      </Suspense>
                    </DashboardLayout>
                  </ProtectedRoute>
                } />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminDashboard />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                
                <Route path="/admin/properties" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminProperties />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                
                <Route path="/admin/properties/new" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminPropertyEdit />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                
                <Route path="/admin/properties/:id/edit" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminPropertyEdit />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                
                <Route path="/admin/applications" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminApplications />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                
                <Route path="/admin/applications/:id" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminApplicationDetail />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                
                <Route path="/admin/users" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminUsers />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                
                <Route path="/admin/payments" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminPayments />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                
                <Route path="/admin/analytics" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminAnalytics />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                
                <Route path="/admin/settings" element={
                  <AdminProtectedRoute>
                    <Suspense fallback={<LoadingSpinner />}>
                      <AdminSettings />
                    </Suspense>
                  </AdminProtectedRoute>
                } />
                
                {/* 404 Page */}
                <Route path="*" element={
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main className="flex-grow pt-16 md:pt-20 flex items-center justify-center">
                      <Suspense fallback={<LoadingSpinner />}>
                        <NotFound />
                      </Suspense>
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
