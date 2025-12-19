import { useAuth } from '../contexts/AuthContext'; // Add this import
import { useNavigate } from 'react-router-dom'; // Add this

function PropertyDetails() {
  const { user } = useAuth(); // Get auth state
  const navigate = useNavigate();
  // ... rest of your state

  const handleApplyForRental = () => {
    if (!user) {
      // Not logged in - redirect to sign up
      navigate('/signup', { 
        state: { 
          message: 'Please create an account to apply for this rental',
          redirectTo: `/property/${id}/apply` 
        } 
      });
    } else {
      // Logged in - go to application form
      navigate(`/property/${id}/apply`);
    }
  };

  // In your button, change to:
  <button
    onClick={handleApplyForRental}
    className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
  >
    Apply for Rental
  </button>