import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { sendApplicationConfirmation } from '../lib/emailService';
import { User, Mail, Phone, Calendar, FileText, CheckCircle, AlertCircle, Loader, ArrowLeft } from 'lucide-react';

const mockProperties = [
  {
    id: '1',
    title: 'Oceanfront Villa Bianca',
    location: 'Maldives',
    price_per_week: 35000,
  },
  {
    id: '2',
    title: 'Skyline Penthouse',
    location: 'Manhattan, NY',
    price_per_week: 45000,
  },
  {
    id: '3',
    title: 'Mediterranean Estate',
    location: 'Saint-Tropez, France',
    price_per_week: 75000,
  },
  {
    id: '4',
    title: 'Modern Cliffside Villa',
    location: 'Big Sur, CA',
    price_per_week: 28000,
  },
  {
    id: '5',
    title: 'Alpine Chalet',
    location: 'Aspen, CO',
    price_per_week: 32000,
  },
  {
    id: '6',
    title: 'Urban Penthouse Loft',
    location: 'Miami Beach, FL',
    price_per_week: 38000,
  }
];

function InitialApplyForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    preferredDate: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const found = mockProperties.find(p => p.id === id);
    setProperty(found || mockProperties[0]);
    setLoading(false);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) return false;
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) return false;
    if (!formData.phone.trim()) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setError('Please fill all required fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const { data: application, error } = await supabase
        .from('applications')
        .insert([
          {
            property_id: id,
            user_id: user?.id,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            preferred_date: formData.preferredDate || null,
            message: formData.message,
            status: 'submitted',
            created_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // Send confirmation
      await sendApplicationConfirmation(formData.email, {
        applicationId: application.id,
        propertyName: property?.title,
        status: 'submitted'
      });

      // Notify admin
      await sendApplicationConfirmation('admin@palmsestate.org', {
        applicationId: application.id,
        userName: formData.fullName,
        propertyName: property?.title,
        status: 'new submission'
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading property...</div>;
  }

  if (!property) {
    return <div className="min-h-screen flex items-center justify-center">Property not found</div>;
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center p-8 max-w-md">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Application Submitted</h2>
          <p className="text-gray-600 mb-6">Our team will review and contact you soon.</p>
          <Link to="/properties" className="bg-amber-600 text-white px-6 py-3 rounded-xl">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center py-8">
      <div className="w-full max-w-2xl mx-auto px-4">
        <Link to={`/properties/${id}`} className="inline-flex items-center text-amber-600 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Property
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Apply for {property.title}</h1>
          <p className="text-gray-600 mb-8">Submit your interest — our team will review and contact you.</p>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name *</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Preferred Tour Date (optional)</label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message (optional)</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full p-3 border rounded-lg"
                rows="4"
              />
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-amber-600 text-white py-4 rounded-lg font-bold">
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InitialApplyForm;
