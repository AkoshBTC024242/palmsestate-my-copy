import { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, Send, CheckCircle, 
  MessageSquare, User, Mail as MailIcon, Calendar,
  Shield, Star, Users, Globe, ArrowRight, X,
  Award, Briefcase, Building2, Key, Heart, Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
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
    'Property Sales & Acquisitions',
    'Portfolio Management'
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
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Briefcase className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm md:text-base uppercase">
              PREMIUM CONCIERGE
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-light text-white mb-6 leading-tight">
            Connect With{' '}
            <span className="text-[#F97316] font-medium">Excellence</span>
          </h1>
          <p className="font-sans text-lg md:text-xl lg:text-2xl text-[#A1A1AA] max-w-3xl mx-auto leading-relaxed">
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
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 shadow-xl">
              <h3 className="font-serif text-2xl font-light text-white mb-8">Contact Information</h3>

              <div className="space-y-8">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#F97316]/10 rounded-xl">
                    <Phone className="w-6 h-6 text-[#F97316]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-medium text-white mb-1">24/7 Concierge</h4>
                    <a 
                      href="tel:+18286239765" 
                      className="font-sans text-[#F97316] hover:text-[#F97316]/80 transition-colors text-lg"
                    >
                      +1 (828) 623-9765
                    </a>
                    <p className="font-sans text-[#A1A1AA] text-sm mt-1">Available around the clock</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#F97316]/10 rounded-xl">
                    <MailIcon className="w-6 h-6 text-[#F97316]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-medium text-white mb-1">Email</h4>
                    <a 
                      href="mailto:concierge@palmsestate.org" 
                      className="font-sans text-[#F97316] hover:text-[#F97316]/80 transition-colors"
                    >
                      concierge@palmsestate.org
                    </a>
                    <p className="font-sans text-[#A1A1AA] text-sm mt-1">Response within 2 hours</p>
                  </div>
                </div>

                {/* Global Offices */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-[#F97316]/10 rounded-xl">
                    <Globe className="w-6 h-6 text-[#F97316]" />
                  </div>
                  <div>
                    <h4 className="font-sans font-medium text-white mb-1">Global Offices</h4>
                    <div className="font-sans text-[#A1A1AA]">
                      <p className="mb-1">• Miami: Luxury District</p>
                      <p className="mb-1">• New York: Upper East Side</p>
                      <p className="mb-1">• London: Mayfair</p>
                      <p className="mb-1">• Dubai: Downtown</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="my-8 border-t border-[#27272A]"></div>

              {/* Service Hours */}
              <div>
                <h4 className="font-sans font-medium text-white mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#F97316]" />
                  Service Hours
                </h4>
                <div className="space-y-2 font-sans text-[#A1A1AA]">
                  <div className="flex justify-between">
                    <span>Concierge:</span>
                    <span className="font-medium text-white">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Office Hours:</span>
                    <span className="font-medium text-white">8 AM - 8 PM (Local)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency:</span>
                    <span className="font-medium text-[#F97316]">Always Available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Overview Card */}
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 shadow-xl">
              <h3 className="font-serif text-2xl font-light text-white mb-6">Our Services</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-xl border border-[#27272A]">
                  <Key className="w-5 h-5 text-[#F97316]" />
                  <span className="text-white text-sm">Luxury Rentals & Sales</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-xl border border-[#27272A]">
                  <Building2 className="w-5 h-5 text-[#F97316]" />
                  <span className="text-white text-sm">Portfolio Management</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-xl border border-[#27272A]">
                  <Heart className="w-5 h-5 text-[#F97316]" />
                  <span className="text-white text-sm">Concierge Services</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-[#0A0A0A] rounded-xl border border-[#27272A]">
                  <Zap className="w-5 h-5 text-[#F97316]" />
                  <span className="text-white text-sm">Investment Advisory</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#27272A]">
                <Link 
                  to="/services"
                  className="inline-flex items-center gap-2 text-[#F97316] hover:text-[#F97316]/80 transition-colors text-sm"
                >
                  View all services
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Response Time Card */}
            <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-8 h-8 text-white" />
                <h3 className="font-serif text-2xl font-light text-white">Our Commitment</h3>
              </div>
              <div className="space-y-4">
                <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="font-sans text-3xl font-bold text-white mb-1">2 Hours</div>
                  <div className="font-sans text-orange-100">Initial Response Time</div>
                </div>
                <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="font-sans text-3xl font-bold text-white mb-1">24 Hours</div>
                  <div className="font-sans text-orange-100">Property Viewing Arranged</div>
                </div>
                <div className="bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="font-sans text-3xl font-bold text-white mb-1">7 Days</div>
                  <div className="font-sans text-orange-100">Average Closing Time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 md:p-12 shadow-xl relative">
              {isSubmitted ? (
                <div className="text-center py-12 relative">
                  {/* Dismiss button */}
                  <button
                    onClick={handleDismissSuccess}
                    className="absolute top-4 right-4 text-[#A1A1AA] hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>

                  {/* Success Animation */}
                  <div className="relative mb-8">
                    <div className="w-28 h-28 mx-auto relative">
                      {/* Outer ring animation */}
                      <div className="absolute inset-0 border-4 border-[#F97316]/30 rounded-full animate-ping"></div>
                      {/* Inner circle */}
                      <div className="absolute inset-2 bg-[#F97316]/10 rounded-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-full flex items-center justify-center shadow-2xl shadow-[#F97316]/30">
                          <CheckCircle className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-serif text-3xl font-light text-white mb-4">Message Received!</h3>
                  <p className="font-sans text-[#A1A1AA] mb-8 max-w-lg mx-auto">
                    Thank you for contacting Palms Estate,{' '}
                    <span className="text-[#F97316] font-medium">{submittedData?.name}</span>. 
                    We've sent a confirmation to{' '}
                    <span className="text-white">{submittedData?.email}</span>.
                  </p>

                  {/* What happens next */}
                  <div className="bg-[#0A0A0A] rounded-2xl p-6 max-w-lg mx-auto border border-[#27272A]">
                    <h4 className="font-sans font-medium text-white mb-4 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#F97316]" />
                      What Happens Next?
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#F97316]/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#F97316]/30">
                          <span className="text-[#F97316] text-xs font-bold">1</span>
                        </div>
                        <div className="text-left">
                          <p className="text-white text-sm font-medium">Check Your Email</p>
                          <p className="text-[#A1A1AA] text-xs">Confirmation sent with your request details</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#F97316]/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#F97316]/30">
                          <span className="text-[#F97316] text-xs font-bold">2</span>
                        </div>
                        <div className="text-left">
                          <p className="text-white text-sm font-medium">Advisor Assignment</p>
                          <p className="text-[#A1A1AA] text-xs">A dedicated luxury advisor will contact you</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-[#F97316]/10 flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#F97316]/30">
                          <span className="text-[#F97316] text-xs font-bold">3</span>
                        </div>
                        <div className="text-left">
                          <p className="text-white text-sm font-medium">Initial Consultation</p>
                          <p className="text-[#A1A1AA] text-xs">Discuss your requirements in detail</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next steps preview */}
                  <div className="mt-6 flex items-center justify-center gap-2 text-sm">
                    <span className="text-[#A1A1AA]">Redirecting to home</span>
                    <ArrowRight className="w-4 h-4 text-[#F97316] animate-pulse" />
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-3xl font-light text-white mb-2">Schedule Your Consultation</h2>
                  <p className="font-sans text-[#A1A1AA] mb-8">
                    Complete the form below and our luxury property specialists will contact you to arrange a private consultation.
                  </p>

                  {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Name Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-sans font-medium text-[#A1A1AA] mb-2">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent font-sans text-white placeholder-[#A1A1AA]/50"
                          placeholder="John"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-sans font-medium text-[#A1A1AA] mb-2">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent font-sans text-white placeholder-[#A1A1AA]/50"
                          placeholder="Smith"
                          required
                        />
                      </div>
                    </div>

                    {/* Contact Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-sans font-medium text-[#A1A1AA] mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent font-sans text-white placeholder-[#A1A1AA]/50"
                          placeholder="john.smith@example.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-sans font-medium text-[#A1A1AA] mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent font-sans text-white placeholder-[#A1A1AA]/50"
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                      </div>
                    </div>

                    {/* Service & Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-sans font-medium text-[#A1A1AA] mb-2">
                          Service Type *
                        </label>
                        <select
                          name="serviceType"
                          value={formData.serviceType}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent font-sans text-white"
                          required
                        >
                          <option value="" className="bg-[#0A0A0A]">Select a service</option>
                          {serviceTypes.map(service => (
                            <option key={service} value={service} className="bg-[#0A0A0A]">{service}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-sans font-medium text-[#A1A1AA] mb-2">
                          Preferred Contact Date
                        </label>
                        <input
                          type="date"
                          name="preferredDate"
                          value={formData.preferredDate}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent font-sans text-white"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="block font-sans font-medium text-[#A1A1AA] mb-2">
                        Your Requirements *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent font-sans text-white placeholder-[#A1A1AA]/50 resize-none"
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
                        className="mt-1 h-5 w-5 text-[#F97316] rounded border-[#27272A] bg-[#0A0A0A] focus:ring-[#F97316]"
                      />
                      <label htmlFor="subscribe" className="ml-3 font-sans text-[#A1A1AA]">
                        I wish to receive exclusive property updates, market insights, and luxury lifestyle content from Palms Estate. 
                        <span className="block text-sm text-[#A1A1AA]/60 mt-1">
                          You can unsubscribe at any time. We respect your privacy.
                        </span>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white py-4 rounded-xl font-sans font-medium transition-all duration-300 ${
                          isSubmitting 
                            ? 'opacity-75 cursor-not-allowed' 
                            : 'hover:shadow-xl hover:shadow-[#F97316]/20 hover:-translate-y-1'
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
                      <p className="text-center font-sans text-sm text-[#A1A1AA]/60 mt-4">
                        By submitting this form, you agree to our{' '}
                        <a href="/privacy" className="text-[#F97316] hover:underline">Privacy Policy</a> and{' '}
                        <a href="/terms" className="text-[#F97316] hover:underline">Terms of Service</a>.
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-[#18181B] border border-[#27272A] rounded-3xl p-8 shadow-xl">
              <h3 className="font-serif text-2xl font-light text-white mb-6">Frequently Asked Questions</h3>

              <div className="space-y-6">
                <div>
                  <h4 className="font-sans font-medium text-white mb-2 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#F97316]" />
                    What is the typical response time?
                  </h4>
                  <p className="font-sans text-[#A1A1AA] text-sm leading-relaxed">
                    Our luxury concierge team responds to all inquiries within 2 hours during business hours, 
                    and within 4 hours outside of regular hours. For urgent matters, call our 24/7 line.
                  </p>
                </div>

                <div>
                  <h4 className="font-sans font-medium text-white mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#F97316]" />
                    Do you require NDAs for privacy?
                  </h4>
                  <p className="font-sans text-[#A1A1AA] text-sm leading-relaxed">
                    Yes, we offer Non-Disclosure Agreements for all clients requiring complete confidentiality. 
                    This is standard for our high-profile and ultra-luxury clients.
                  </p>
                </div>

                <div>
                  <h4 className="font-sans font-medium text-white mb-2 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[#F97316]" />
                    What locations do you serve?
                  </h4>
                  <p className="font-sans text-[#A1A1AA] text-sm leading-relaxed">
                    We operate globally with a focus on luxury markets in North America, Europe, the Caribbean, 
                    Middle East, and Asia-Pacific. Our network includes over 50 prime locations worldwide.
                  </p>
                </div>

                <div>
                  <h4 className="font-sans font-medium text-white mb-2 flex items-center gap-2">
                    <Star className="w-5 h-5 text-[#F97316]" />
                    Is there a fee for your consultation services?
                  </h4>
                  <p className="font-sans text-[#A1A1AA] text-sm leading-relaxed">
                    Initial consultations are complimentary. For specialized services such as investment analysis 
                    or portfolio management, fees are discussed during the initial consultation.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-[#27272A]">
                <p className="text-[#A1A1AA] text-sm">
                  Still have questions? <Link to="/faq" className="text-[#F97316] hover:underline">Visit our FAQ page</Link> or call our 24/7 concierge.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
