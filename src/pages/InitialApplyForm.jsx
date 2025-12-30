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
        property_id: Number(id), // convert to number if bigint
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Application Submitted</h2>
          <p>We will review and get back to you soon.</p>
          <Link to="/properties" className="mt-4 inline-block text-amber-600">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to={`/properties/${id}`} className="inline-flex items-center text-amber-600 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Property
        </Link>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-6">Submit Application</h1>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name *" required className="w-full p-3 border rounded-lg" />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email *" required type="email" className="w-full p-3 border rounded-lg" />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone *" required className="w-full p-3 border rounded-lg" />
            <input name="preferredDate" value={formData.preferredDate} onChange={handleChange} type="date" className="w-full p-3 border rounded-lg" />
            <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Message" rows="4" className="w-full p-3 border rounded-lg" />
            <button type="submit" disabled={submitting} className="w-full bg-amber-600 text-white py-3 rounded-lg">
              {submitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default InitialApplyForm;
