import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase, submitApplication } from '../lib/supabase'; // Import the new function
import { sendApplicationConfirmation } from '../lib/emailService';
import PaymentForm from '../components/PaymentForm';
import { 
  Calendar, User, Mail, Phone, FileText, ArrowLeft, 
  CreditCard, CheckCircle, Home, Shield, Clock, Building, DollarSign, Users, Dog
} from 'lucide-react';

function ApplicationForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    preferredDate: '',
    notes: '',
    agreeTerms: false,
    employmentStatus: '',
    monthlyIncome: '',
    occupants: '1',
    hasPets: false,
    petDetails: '',
    applicationType: 'rental' // Added application type
  });
  
  const [step, setStep] = useState(1);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const APPLICATION_FEE = 5000;

  useEffect(() => {
    fetchProperty();
  }, [id]);

  useEffect(() => {
    if (user && !formData.fullName) {
      const userFullName = user.user_metadata?.full_name || '';
      setFormData(prev => ({
        ...prev,
        fullName: userFullName,
        email: user.email || ''
      }));
    }
  }, [user]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      const { data: supabaseProperty, error: supabaseError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (!supabaseError && supabaseProperty) {
        setProperty(supabaseProperty);
      } else {
        const mockProperties = [
          { id: '1', title: 'Oceanfront Villa Bianca', location: 'Maldives', price_per_week: 35000 },
          { id: '2', title: 'Skyline Penthouse', location: 'Manhattan, NY', price_per_week: 45000 },
          { id: '3', title: 'Mediterranean Estate', location: 'Saint-Tropez, France', price_per_week: 75000 },
          { id: '4', title: 'Modern Cliffside Villa', location: 'Big Sur, CA', price_per_week: 28000 },
          { id: '5', title: 'Alpine Chalet', location: 'Aspen, CO', price_per_week: 32000 },
          { id: '6', title: 'Urban Penthouse Loft', location: 'Miami Beach, FL', price_per_week: 38000 }
        ];
        
        const foundProperty = mockProperties.find(p => p.id === id);
        setProperty(foundProperty || mockProperties[0]);
      }
    } catch (error) {
      console.error('Error fetching property:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const validateStep1 = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (!formData.employmentStatus) {
      setError('Please select employment status');
      return false;
    }
    if (!formData.monthlyIncome || Number(formData.monthlyIncome) < 0) {
      setError('Please enter a valid monthly income');
      return false;
    }
    if (!formData.agreeTerms) {
      setError('You must agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();
    
    if (!validateStep1()) {
      return;
    }

    setSubmitting(true);
    
    try {
      console.log('Submitting application data:', {
        property_id: id,
        user_id: user?.id,
        ...formData
      });

      // Use the new submitApplication function from supabase.jsx
      const result = await submitApplication({
        property_id: id,
        user_id: user?.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        employment_status: formData.employmentStatus,
        monthly_income: formData.monthlyIncome,
        occupants: formData.occupants,
        has_pets: formData.hasPets,
        pet_details: formData.petDetails,
        preferred_tour_date: formData.preferredDate || null,
        notes: formData.notes,
        application_type: formData.applicationType // Added application type
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit application');
      }

      // Store application ID for payment processing
      localStorage.setItem('currentApplicationId', result.data.id);
      console.log('Application created successfully:', result.data.id);
      
      // Move to payment step
      setStep(2);

    } catch (error) {
      console.error('Full application error:', error);
      
      // Check if it's a schema error and provide helpful message
      if (error.message.includes('column') || error.message.includes('null value')) {
        setError(`Database schema issue: ${error.message}. Please contact support to fix the database table.`);
      } else {
        setError(`Failed to submit application: ${error.message}. Please try again or contact support.`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ... rest of the code remains the same until the form section ...

  // In the form section, add application type field (optional)
  // Add this in your form if you want users to select application type:
  {step === 1 && (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
      {/* ... existing code ... */}
      
      <div className="p-6 md:p-8">
        <form onSubmit={handleStep1Submit} className="space-y-6">
          {/* Add Application Type field (optional, hidden with default value) */}
          <input
            type="hidden"
            name="applicationType"
            value="rental"
          />
          
          {/* OR make it visible for users to select: */}
          {/*
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Type *
            </label>
            <select
              name="applicationType"
              required
              value={formData.applicationType}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="rental">Rental</option>
              <option value="purchase">Purchase</option>
              <option value="tour">Tour Only</option>
            </select>
          </div>
          */}
          
          {/* ... rest of your form fields ... */}
        </form>
      </div>
    </div>
  )}

  // ... rest of the component remains the same ...
}

export default ApplicationForm;
