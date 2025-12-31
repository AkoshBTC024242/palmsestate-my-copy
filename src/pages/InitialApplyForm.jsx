import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { sendApplicationConfirmation } from '../lib/emailService';
import { User, Mail, Phone, Calendar, FileText, CheckCircle, Loader, ArrowLeft } from 'lucide-react';

function InitialApplyForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    preferredDate: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { error } = await supabase.from('applications').insert({
        property_id: Number(id),
        user_id: user?.id,
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        preferred_date: formData.preferredDate || null,
        message: formData.message,
        status: 'submitted',
        created_at: new Date().toISOString(),
      });

      if (error) throw error;

      await sendApplicationConfirmation(formData.email, {
        message: 'Your application has been submitted. We will review and contact you soon.'
      });

      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

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
          <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Apply for Property</h1>
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
