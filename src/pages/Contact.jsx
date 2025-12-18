import { useState } from 'react';
import { 
  Phone, Mail, MapPin, Clock, Send, CheckCircle, 
  MessageSquare, User, Mail as MailIcon, Calendar,
  Shield, Star, Users, Globe
} from 'lucide-react';

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
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      
      // Reset form after success
      setTimeout(() => {
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
        setIsSubmitted(false);
      }, 5000);
    }, 1500);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 pt-24 pb-20">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center mb-12">
          <div className="inline-block backdrop-blur-md bg-white/60 border border-gray-200/50 rounded-2xl px-8 py-4 mb-6">
            <span className="font-sans text-amber-600 font-semibold tracking-widest text-sm md:text-base uppercase">
              PREMIUM CONCIERGE
            </span>
          </div>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Connect With <span className="text-amber-600">Excellence</span>
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
            <div className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-8 shadow-xl">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-8">Contact Information</h3>
              
              <div className="space-y-8">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                    <Phone className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-gray-900 mb-1">24/7 Concierge</h4>
                    <a 
                      href="tel:+18286239765" 
                      className="font-sans text-amber-600 hover:text-amber-700 transition-colors text-lg"
                    >
                      +1 (828) 623-9765
                    </a>
                    <p className="font-sans text-gray-600 text-sm mt-1">Available around the clock</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                    <MailIcon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-gray-900 mb-1">Email</h4>
                    <a 
                      href="mailto:admin@palmsestate.org" 
                      className="font-sans text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      admin@palmsestate.org
                    </a>
                    <p className="font-sans text-gray-600 text-sm mt-1">Response within 2 hours</p>
                  </div>
                </div>

                {/* Global Offices */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 rounded-xl">
                    <Globe className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-sans font-bold text-gray-900 mb-1">Global Offices</h4>
                    <div className="font-sans text-gray-700">
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
                  <Clock className="w-5 h-5 text-amber-600" />
                  Service Hours
                </h4>
                <div className="space-y-2 font-sans text-gray-700">
                  <div className="flex justify-between">
                    <span>Concierge:</span>
                    <span className="font-bold">24/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Office Hours:</span>
                    <span className="font-bold">8 AM - 8 PM (Local)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency:</span>
                    <span className="font-bold text-green-600">Always Available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Us Card */}
            <div className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-8 shadow-xl">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">Why Choose Palms Estate</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Star className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-sans font-bold text-gray-900">Award-Winning Service</h4>
                    <p className="font-sans text-gray-600 text-sm mt-1">Recognized by Forbes Global Properties</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-sans font-bold text-gray-900">Complete Confidentiality</h4>
                    <p className="font-sans text-gray-600 text-sm mt-1">NDA protection for all clients</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Users className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-sans font-bold text-gray-900">Dedicated Advisor</h4>
                    <p className="font-sans text-gray-600 text-sm mt-1">Personal concierge for each client</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-amber-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-sans font-bold text-gray-900">Verified Properties</h4>
                    <p className="font-sans text-gray-600 text-sm mt-1">Every listing personally inspected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Response Time Card */}
            <div className="backdrop-blur-md bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/50 rounded-3xl p-8 shadow-xl">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">Our Commitment</h3>
              <div className="space-y-4">
                <div className="bg-white/70 rounded-2xl p-4">
                  <div className="font-sans text-3xl font-bold text-amber-600 mb-1">2 Hours</div>
                  <div className="font-sans text-gray-700">Initial Response Time</div>
                </div>
                <div className="bg-white/70 rounded-2xl p-4">
                  <div className="font-sans text-3xl font-bold text-amber-600 mb-1">24 Hours</div>
                  <div className="font-sans text-gray-700">Property Viewing Arranged</div>
                </div>
                <div className="bg-white/70 rounded-2xl p-4">
                  <div className="font-sans text-3xl font-bold text-amber-600 mb-1">7 Days</div>
                  <div className="font-sans text-gray-700">Average Closing Time</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-2">
            <div className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-8 md:p-12 shadow-xl">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-24 h-24 mx-auto mb-6 flex items-center justify-center bg-gradient-to-r from-green-100 to-emerald-100 rounded-full">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-gray-900 mb-4">Message Received</h3>
                  <p className="font-sans text-gray-600 mb-8 max-w-lg mx-auto">
                    Thank you for contacting Palms Estate. Our luxury concierge team will reach out to you within 2 hours to discuss your requirements.
                  </p>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 max-w-lg mx-auto">
                    <h4 className="font-sans font-bold text-gray-900 mb-2">What to Expect Next:</h4>
                    <ul className="font-sans text-gray-700 space-y-2 text-left">
                      <li className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-600" />
                        Initial contact within 2 hours
                      </li>
                      <li className="flex items-center gap-2">
                        <User className="w-4 h-4 text-amber-600" />
                        Dedicated advisor assigned
                      </li>
                      <li className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        Viewing arrangement discussion
                      </li>
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">Schedule Your Consultation</h2>
                  <p className="font-sans text-gray-600 mb-8">
                    Complete the form below and our luxury property specialists will contact you to arrange a private viewing or consultation.
                  </p>

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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent font-sans bg-white/50"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent font-sans bg-white/50"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent font-sans bg-white/50"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent font-sans bg-white/50"
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent font-sans bg-white/50"
                          required
                        >
                          <option value="">Select a service</option>
                          {serviceTypes.map(service => (
                            <option key={service} value={service}>{service}</option>
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent font-sans bg-white/50"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent font-sans bg-white/50 resize-none"
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
                        className="mt-1 h-5 w-5 text-amber-600 rounded border-gray-300 focus:ring-amber-500"
                      />
                      <label htmlFor="subscribe" className="ml-3 font-sans text-gray-700">
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
                        className={`w-full flex items-center justify-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white py-4 rounded-xl font-sans font-bold transition-all duration-300 ${
                          isSubmitting 
                            ? 'opacity-75 cursor-not-allowed' 
                            : 'hover:shadow-xl hover:-translate-y-1'
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
                        <a href="/privacy" className="text-amber-600 hover:underline">Privacy Policy</a> and{' '}
                        <a href="/terms" className="text-amber-600 hover:underline">Terms of Service</a>.
                      </p>
                    </div>
                  </form>
                </>
              )}
            </div>

            {/* FAQ Section */}
            <div className="mt-8 backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-8 shadow-xl">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-sans font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                    What is the typical response time?
                  </h4>
                  <p className="font-sans text-gray-600">
                    Our luxury concierge team responds to all inquiries within 2 hours during business hours, 
                    and within 4 hours outside of regular hours. For urgent matters, call our 24/7 line.
                  </p>
                </div>

                <div>
                  <h4 className="font-sans font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                    Do you require NDAs for privacy?
                  </h4>
                  <p className="font-sans text-gray-600">
                    Yes, we offer Non-Disclosure Agreements for all clients requiring complete confidentiality. 
                    This is standard for our high-profile and ultra-luxury clients.
                  </p>
                </div>

                <div>
                  <h4 className="font-sans font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-600" />
                    What locations do you serve?
                  </h4>
                  <p className="font-sans text-gray-600">
                    We operate globally with a focus on luxury markets in North America, Europe, the Caribbean, 
                    Middle East, and Asia-Pacific. Our network includes over 50 prime locations worldwide.
                  </p>
                </div>

                <div>
                  <h4 className="font-sans font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-amber-600" />
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