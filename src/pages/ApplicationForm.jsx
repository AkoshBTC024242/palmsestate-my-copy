import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Calendar, User, Mail, Phone, FileText, ArrowLeft, CreditCard } from 'lucide-react';

function ApplicationForm() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: user?.email || '',
    phone: '',
    preferredDate: '',
    notes: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.agreeTerms) {
      alert('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    
    try {
      // 1. Save application to Supabase
      const { data: application, error } = await supabase
        .from('applications')
        .insert([
          {
            property_id: id,
            user_id: user.id,
            status: 'pending',
            notes: formData.notes,
            tour_date: formData.preferredDate || null
          }
        ])
        .select()
        .single();

      if (error) throw error;

      // 2. Redirect to payment page (we'll add Stripe later)
      navigate(`/payment/${application.id}`, {
        state: {
          applicationId: application.id,
          amount: 50,
          propertyId: id
        }
      });

    } catch (error) {
      console.error('Application error:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Button */}
        <Link to={`/property/${id}`} className="inline-flex items-center text-amber-600 mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Property
        </Link>

        {/* Application Form */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-500 p-8 text-white">
            <h1 className="text-3xl font-serif font-bold mb-2">Rental Application</h1>
            <p className="opacity-90">Complete your application for this luxury property</p>
          </div>

          <div className="p-8">
            {/* Application Fee Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
              <div className="flex items-start">
                <CreditCard className="w-6 h-6 text-amber-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Application Fee: $50</h3>
                  <p className="text-amber-700 text-sm">
                    This non-refundable fee covers administrative processing and background checks. 
                    You'll be redirected to secure payment after submitting this form.
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Preferred Tour Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Preferred Tour Date (Optional)
                </label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({...formData, preferredDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 inline mr-2" />
                  Additional Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  rows="4"
                  placeholder="Any special requirements or questions..."
                />
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
                  className="mt-1 mr-3 w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-600">
                  I agree to pay the $50 non-refundable application fee and understand that 
                  this does not guarantee approval. I authorize background and credit checks.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !formData.agreeTerms}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white font-semibold py-4 px-6 rounded-xl hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Proceed to Payment - $50'
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 text-center">
                Have questions? <Link to="/contact" className="text-amber-600 hover:text-amber-700">Contact our concierge</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplicationForm;