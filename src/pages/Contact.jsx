import { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, Send, CheckCircle, 
  MessageSquare, User, Mail as MailIcon, Calendar,
  Shield, Star, Users, Globe, ArrowRight, X
} from 'lucide-react';
import { supabase } from '../lib/supabase';

function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    serviceType: '',
    preferredDate: '',
    message: '',
    subscribe: true
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  const serviceTypes = [
    'Luxury Villa Rental',
    'Penthouse Leasing',
    'Private Island Booking',
    'Yacht & Estate Management',
    'Concierge Services',
    'Private Aviation',
    'Investment Consultation',
    'Other'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log('Submitting form data:', formData);

      // 1. Save to Supabase
      const { data: insertData, error: supabaseError } = await supabase
        .from('contact_submissions')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            service_type: formData.serviceType,
            preferred_date: formData.preferredDate || null,
            message: formData.message,
            subscribe: formData.subscribe,
            status: 'new'
          }
        ])
        .select();

      if (supabaseError) {
        console.error('Supabase error:', supabaseError);
        throw new Error(supabaseError.message);
      }

      console.log('Form saved to Supabase successfully');

      // Store submitted data for confirmation
      setSubmittedData({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        serviceType: formData.serviceType,
        preferredDate: formData.preferredDate,
        message: formData.message
      });

      // 2. Send notification to admin via Edge Function
      try {
        const emailResponse = await fetch('https://hnruxtddkfxsoulskbyr.supabase.co/functions/v1/send-contact-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            formData: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              serviceType: formData.serviceType,
              preferredDate: formData.preferredDate,
              message: formData.message,
              subscribe: formData.subscribe
            } 
          }),
        });

        const emailData = await emailResponse.json();
        console.log('Admin notification response:', emailData);
      } catch (emailErr) {
        console.error('Admin notification failed (form still saved):', emailErr);
      }

      // 3. Send confirmation email to user
      try {
        const userEmailResponse = await fetch('https://hnruxtddkfxsoulskbyr.supabase.co/functions/v1/send-user-confirmation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            userData: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              email: formData.email,
              serviceType: formData.serviceType,
              preferredDate: formData.preferredDate,
              message: formData.message
            } 
          }),
        });

        const userEmailData = await userEmailResponse.json();
        console.log('User confirmation email response:', userEmailData);
      } catch (userEmailErr) {
        console.error('User confirmation email failed:', userEmailErr);
      }

      // Success!
      setIsSubmitted(true);
      
      // Auto-hide success message after 10 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setSubmittedData(null);
      }, 10000);

    } catch (err) {
      console.error('Form submission error:', err);
      setError(`There was an error submitting your form: ${err.message}. Please try again or call us directly.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDismissSuccess = () => {
    setIsSubmitted(false);
    setSubmittedData(null);
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      serviceType: '',
      preferredDate: '',
      message: '',
      subscribe: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white pt-24 pb-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center mb-12">
          <div className="inline-block bg-white border border-orange-200 shadow-lg rounded-2xl px-8 py-4 mb-6">
            <span className="font-sans text-orange-600 font-semibold tracking-widest text-sm md:text-base uppercase">
              PREMIUM CONCIERGE
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light text-gray-900 mb-6 leading-tight">
            Connect With <span className="text-orange-600 font-medium">Excellence</span>
          </h1>
          <p className="font-sans text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your journey to exceptional living begins with a conversation. 
            Our dedicated luxury advisors are ready to guide you every step of the way.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            {/* Contact Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>

              <div className="space-y-8">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-xl">
                    <Phone className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-gray-900 mb-1">24/7 Concierge</h4>
                    <a 
                      href="tel:+18286239765" 
                      className="font-sans text-orange-600 hover:text-orange-700 transition-colors text-lg"
                    >
                      +1 (828) 623-9765
                    </a>
                    <p className="font-sans text-gray-600 text-sm mt-1">Available around the clock</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-xl">
                    <MailIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-gray-900 mb-1">Email</h4>
                    <a 
                      href="mailto:admin@palmsestate.org" 
                      className="font-sans text-orange-600 hover:text-orange-700 transition-colors"
                    >
                      admin@palmsestate.org
                    </a>
                    <p className="font-sans text-gray-600 text-sm mt-1">Response within 2 hours</p>
                  </div>
                </div>

                {/* Global Offices */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-orange-100 rounded-xl">
                    <Globe className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-gray-900 mb-1">Global Offices</h4>
                    <div className="font-sans text-gray-600">
                      <p className="mb-1">• Miami: Luxury District</p>
                      <p className="mb-1">• New York: Upper East Side</p>
                      <p className="mb-1">• London: Mayfair</p>
                      <p className="mb-1">• Dubai: Downtown</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="my-8 border-t border-gray-200"></div>

              {/* Service Hours */}
              <div>
                <h4 className="font-sans font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-orange-600" />
                  Service Hours
                </h4>
                <div className="space-y-2 font-sans text-gray-600">
                  <div className="flex justify-between">
                    <span>Concierge:</span>
                    <span className="font-bold text-gray-900">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Office Hours:</span>
                    <span className="font-bold text-gray-900">8 AM - 8 PM (Local)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency:</span>
                    <span className="font-bold text-green-600">Always Available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Us Card */}
            <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">Why Choose Palms Estate</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Star className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-sans font-bold text-gray-900">Award-Winning Service</h4>
                    <p className="font-sans text-gray-600 text-sm mt-1">Recognized by Forbes Global Properties</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-sans font-bold text-gray-900">Complete Confidentiality</h4>
                    <p className="font-sans text-gray-600 text-sm mt-1">NDA protection for all clients</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-sans font-bold text-gray-900">Dedicated Advisor</h4>
                    <p className="font-sans text-gray-600 text-sm mt-1">Personal concierge for each client</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-orange-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-sans font-bold text-gray-900">Verified Properties</h4>
                    <p className="font-sans text-gray-600 text-sm mt-1">Every listing personally inspected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time Card */}
            <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-3xl p-8 shadow-xl">
              <h3 className="font-serif text-2xl font-bold text-white mb-4">Our Commitment</h3>
              <div className="space-y-4">
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <div className="font-sans text-3xl font-bold text-white mb-1">2 Hours</div>
                  <div className="font-sans text-orange-100">Initial Response Time</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <div className="font-sans text-3xl font-bold text-white mb-1">24 Hours</div>
                  <div className="font-sans text-orange-100">Property Viewing Arranged</div>
                </div>
                <div className="bg-white/10 rounded-2xl p-4 border border-white/20">
                  <div className="font-sans text-3xl font-bold text-white mb-1">7 Days</div>
                  <div className="font-sans text-orange-100">Average Closing Time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-xl relative">
              {isSubmitted ? (
                <div className="text-center py-12 relative">
                  {/* Dismiss button */}
                  <button
                    onClick={handleDismissSuccess}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Success Animation */}
                  <div className="relative mb-8">
                    <div className="w-28 h-28 mx-auto relative">
                      {/* Outer ring animation */}
                      <div className="absolute inset-0 border-4 border-orange-200 rounded-full animate-ping"></div>
                      {/* Inner circle */}
                      <div className="absolute inset-2 bg-orange-100 rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 rounded-full flex items-center justify-center shadow-2xl shadow-orange-600/30">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-serif text-3xl font-bold text-gray-900 mb-4">Message Received!</h3>
                  <p className="font-sans text-gray-600 mb-8 max-w-lg mx-auto">
                    Thank you for contacting Palms Estate, <span className="text-orange-600 font-semibold">{submittedData?.name}</span>. 
                    We've sent a confirmation to <span className="text-gray-900 font-medium">{submittedData?.email}</span>.
                  </p>

                  {/* What happens next */}
                  <div className="bg-orange-50 rounded-2xl p-6 max-w-lg mx-auto border border-orange-100">
                    <h4 className="font-sans font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-600" />
                      What Happens Next?
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-orange-700 text-xs font-bold">1</span>
                        </div>
                        <div className="text-left">
                          <p className="text-gray-900 text-sm font-medium">Check Your Email</p>
                          <p className="text-gray-600 text-xs">We've sent a confirmation with your request details</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-orange-700 text-xs font-bold">2</span>
                        </div>
                        <div className="text-left">
                          <p className="text-gray-900 text-sm font-medium">Advisor Assignment</p>
                          <p className="text-gray-600 text-xs">A dedicated luxury advisor will be assigned to you</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-orange-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-orange-700 text-xs font-bold">3</span>
                        </div>
                        <div className="text-left">
                          <p className="text-gray-900 text-sm font-medium">Initial Contact</p>
                          <p className="text-gray-600 text-xs">You'll hear from us within 2 hours to discuss your needs</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next steps preview */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm">
                    <span className="text-gray-500">Redirecting to home in 10 seconds</span>
                    <ArrowRight className="w-4 h-4 text-orange-600 animate-pulse" />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">Schedule Your Consultation</h2>
                  <p className="font-sans text-gray-600 mb-8">
                    Complete the form below and our luxury property specialists will contact you to arrange a private viewing or consultation.
                  </p>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Name Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-sans font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent font-sans text-gray-900 placeholder-gray-400"
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-sans font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent font-sans text-gray-900 placeholder-gray-400"
                          placeholder="Smith"
                          required
                        />
                      </div>
                    </div>

                    {/* Contact Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-sans font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent font-sans text-gray-900 placeholder-gray-400"
                          placeholder="john.smith@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-sans font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent font-sans text-gray-900 placeholder-gray-400"
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                      </div>
                    </div>

                    {/* Service & Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-sans font-medium text-gray-700 mb-2">
                          Service Type *
                        </label>
                        <select
                          name="serviceType"
                          value={formData.serviceType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent font-sans text-gray-900"
                          required
                        >
                          <option value="" className="bg-white">Select a service</option>
                          {serviceTypes.map(service => (
                            <option key={service} value={service} className="bg-white">{service}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-sans font-medium text-gray-700 mb-2">
                          Preferred Contact Date
                        </label>
                        <input
                          type="date"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent font-sans text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block font-sans font-medium text-gray-700 mb-2">
                        Your Requirements *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent font-sans text-gray-900 placeholder-gray-400 resize-none"
                        placeholder="Please describe your requirements, preferred locations, budget range, timeline, and any specific amenities you're looking for..."
                        required
                      />
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="subscribe"
                        name="subscribe"
                        checked={formData.subscribe}
                        onChange={handleChange}
                        className="mt-1 h-5 w-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                      />
                      <label htmlFor="subscribe" className="ml-3 font-sans text-gray-600">
                        I wish to receive exclusive property updates, market insights, and luxury lifestyle content from Palms Estate. 
                        <span className="block text-sm text-gray-500 mt-1">
                          You can unsubscribe at any time. We respect your privacy.
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-4 rounded-xl font-sans font-bold transition-all duration-300 ${
                          isSubmitting 
                            ? 'opacity-75 cursor-not-allowed' 
                            : 'hover:shadow-xl hover:shadow-orange-600/20 hover:-translate-y-1'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <Send size={20} />
                            Submit Your Inquiry
                          </>
                        )}
                      </button>
                      <p className="text-center font-sans text-sm text-gray-500 mt-4">
                        By submitting this form, you agree to our{' '}
                        <a href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</a> and{' '}
                        <a href="/terms" className="text-orange-600 hover:underline">Terms of Service</a>.
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-white border border-gray-200 rounded-3xl p-8 shadow-xl">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-sans font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                    What is the typical response time?
                  </h4>
                  <p className="font-sans text-gray-600">
                    Our luxury concierge team responds to all inquiries within 2 hours during business hours, 
                    and within 4 hours outside of regular hours. For urgent matters, call our 24/7 line.
                  </p>
                </div>

                <div>
                  <h4 className="font-sans font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                    Do you require NDAs for privacy?
                  </h4>
                  <p className="font-sans text-gray-600">
                    Yes, we offer Non-Disclosure Agreements for all clients requiring complete confidentiality. 
                    This is standard for our high-profile and ultra-luxury clients.
                  </p>
                </div>

                <div>
                  <h4 className="font-sans font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                    What locations do you serve?
                  </h4>
                  <p className="font-sans text-gray-600">
                    We operate globally with a focus on luxury markets in North America, Europe, the Caribbean, 
                    Middle East, and Asia-Pacific. Our network includes over 50 prime locations worldwide.
                  </p>
                </div>

                <div>
                  <h4 className="font-sans font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-orange-600" />
                    Is there a fee for your consultation services?
                  </h4>
                  <p className="font-sans text-gray-600">
                    Initial consultations are complimentary. For specialized services such as investment analysis 
                    or portfolio management, fees are discussed during the initial consultation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
