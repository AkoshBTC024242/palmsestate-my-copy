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
  // add your other mock properties
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
    setProperty(found);
    setLoading(false);
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
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
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

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

      // Send confirmation to user
      await sendApplicationConfirmation(formData.email, {
        applicationId: application.id,
        propertyName: property?.title,
        status: 'submitted',
        message: 'Your application has been received. Our team will review shortly.'
      });

      // Send notification to admin
      await sendApplicationConfirmation('admin@palmsestate.org', {
        applicationId: application.id,
        userName: formData.fullName,
        propertyName: property?.title,
        status: 'new submission',
        message: 'New application submitted for property ' + id
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!property) {
    return <div className="min-h-screen flex items-center justify-center">Property not found</div>;
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-2xl shadow-xl">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted</h2>
          <p className="text-gray-600 mb-6">Our team will review your application and get back to you within 24-48 hours with next steps.</p>
          <Link to="/properties" className="inline-flex items-center bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-3 rounded-xl font-sans font-semibold hover:shadow-lg transition-all">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center py-8">
      <div className="w-full max-w-2xl mx-auto px-4">
        <Link to={`/properties/${id}`} className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Property
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Apply for {property.title}</h1>
          <p className="text-gray-600 mb-8">Submit your interest — our team will review and notify you for next steps.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Preferred Tour Date (optional)
              </label>
              <input
                type="date"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Additional Notes (optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                rows="4"
                placeholder="Any special requirements or questions..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all"
            >
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InitialApplyForm;
