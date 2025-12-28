import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminProtectedRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin content...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminProtectedRoute;
