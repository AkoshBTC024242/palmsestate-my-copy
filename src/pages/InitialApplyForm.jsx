import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { sendApplicationConfirmation } from '../lib/emailService';
import { User, Mail, Phone, Calendar, FileText, CheckCircle, AlertCircle, Loader, ArrowLeft } from 'lucide-react';

function InitialApplyForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

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
            user_id: user.id,
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

      // Send confirmation email to user
      await sendApplicationConfirmation(formData.email, {
        applicationId: application.id,
        propertyId: id,
        status: 'submitted',
        message: 'Your application has been received. Our team will review shortly.'
      });

      // Send notification email to admin
      await sendApplicationConfirmation('admin@palmsestate.org', {
        applicationId: application.id,
        userName: formData.fullName,
        propertyId: id,
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Application Submitted</h2>
          <p>We'll review and get back to you soon with next steps.</p>
          <Link to="/properties" className="mt-4 inline-block text-orange-600">Back to Properties</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Apply for Property</h2>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="space-y-4">
          <div className="flex items-center border rounded-lg p-2">
            <User className="w-5 h-5 mr-2" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Full Name"
              className="w-full outline-none"
              required
            />
          </div>

          <div className="flex items-center border rounded-lg p-2">
            <Mail className="w-5 h-5 mr-2" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="w-full outline-none"
              required
            />
          </div>

          <div className="flex items-center border rounded-lg p-2">
            <Phone className="w-5 h-5 mr-2" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Phone"
              className="w-full outline-none"
              required
            />
          </div>

          <div className="flex items-center border rounded-lg p-2">
            <Calendar className="w-5 h-5 mr-2" />
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleInputChange}
              className="w-full outline-none"
            />
          </div>

          <div className="flex items-center border rounded-lg p-2">
            <FileText className="w-5 h-5 mr-2" />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Message or Notes"
              className="w-full outline-none"
              rows="4"
            />
          </div>
        </div>

        <button type="submit" disabled={submitting} className="w-full bg-orange-500 text-white py-4 rounded-lg mt-6">
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}

export default InitialApplyForm;
