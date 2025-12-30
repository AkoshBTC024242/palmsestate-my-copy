import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { sendApplicationConfirmation } from '../lib/emailService';
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
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    preferredDate: '',
    notes: '',
    agreeTerms: false,
    employmentStatus: '',
    monthlyIncome: '',
    occupants: '1',
    hasPets: false,
    petDetails: '',
    applicationType: 'rental'
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchProperty();
  }, [id]);

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
          {
            id: '1',
            title: 'Oceanfront Villa Bianca',
            location: 'Maldives',
            price_per_week: 35000,
          },
          // add your other mock properties
        ];
        const found = mockProperties.find(p => p.id === id);
        setProperty(found || mockProperties[0]);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSubmitting(true);

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
            notes: formData.notes,
            employment_status: formData.employmentStatus,
            monthly_income: formData.monthlyIncome,
            occupants: formData.occupants,
            has_pets: formData.hasPets,
            pet_details: formData.petDetails,
            application_type: formData.applicationType,
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
        message: 'New application for property ' + id
      });

      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!property) return <div>Property not found</div>;
  if (success) return <div>Application Submitted! We'll review and get back to you.</div>;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Apply for {property.title}</h2>

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

        <button type="submit" disabled={submitting} className="w-full bg-amber-600 text-white py-4 rounded-lg mt-6">
          {submitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
}

export default ApplicationForm;
