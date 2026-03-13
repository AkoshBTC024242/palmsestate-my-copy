import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Camera, Users, Star, ArrowRight, CheckCircle, 
  Phone, Mail, Calendar, DollarSign, MapPin, Upload,
  FileText, Image, Video, Shield, Award, Clock,
  TrendingUp, BarChart, Globe, ChevronRight, X
} from 'lucide-react';

function Sell() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Property Details
    address: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: 'single-family',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    yearBuilt: '',
    
    // Step 2: Property Features
    lotSize: '',
    stories: '',
    garage: '',
    pool: false,
    waterfront: false,
    view: false,
    renovated: false,
    additionalFeatures: '',
    
    // Step 3: Contact Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bestTimeToContact: 'anytime',
    message: '',
    
    // Step 4: Photos (mock)
    photos: []
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const propertyTypes = [
    'Single Family Home',
    'Condominium',
    'Townhouse',
    'Luxury Villa',
    'Penthouse',
    'Estate',
    'Private Island',
    'Development Land'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e) => {
    // Mock file upload - in real app, you'd upload to storage
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files.map(f => f.name)]
    }));
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Property listing request submitted:', formData);
      setIsSubmitted(true);
      
      setTimeout(() => {
        setIsSubmitted(false);
        setCurrentStep(1);
        setFormData({
          address: '',
          city: '',
          state: '',
          zipCode: '',
          propertyType: 'single-family',
          bedrooms: '',
          bathrooms: '',
          sqft: '',
          yearBuilt: '',
          lotSize: '',
          stories: '',
          garage: '',
          pool: false,
          waterfront: false,
          view: false,
          renovated: false,
          additionalFeatures: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          bestTimeToContact: 'anytime',
          message: '',
          photos: []
        });
      }, 5000);

    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const steps = [
    { number: 1, title: 'Property Details' },
    { number: 2, title: 'Features & Amenities' },
    { number: 3, title: 'Contact Information' },
    { number: 4, title: 'Photos & Submit' }
  ];

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Maximum Exposure',
      description: 'Your property listed on 50+ luxury platforms'
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: 'Professional Photography',
      description: 'Award-winning photography included'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Qualified Buyers',
      description: 'Access to pre-screened luxury buyer network'
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: 'Market Analysis',
      description: 'Data-driven pricing strategy'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/5 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
              <Home className="w-5 h-5 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                SELL YOUR HOME
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6">
              Start Your{' '}
              <span className="text-[#F97316] font-medium">Selling Journey</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#A1A1AA] mb-8 leading-relaxed">
              Tell us about your property and we'll create a customized marketing plan 
              to attract qualified buyers and maximize your home's value.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 text-center">
              <div className="text-[#F97316] flex justify-center mb-3">{benefit.icon}</div>
              <h3 className="text-white font-medium text-sm mb-1">{benefit.title}</h3>
              <p className="text-[#A1A1AA] text-xs">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Multi-Step Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex justify-between items-center">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center relative flex-1">
                <div className="flex items-center w-full">
                  <div className={`w-full h-1 ${
                    step.number <= currentStep ? 'bg-[#F97316]' : 'bg-[#27272A]'
                  }`}></div>
                </div>
                <div className={`absolute top-2 w-10 h-10 rounded-full flex items-center justify-center ${
                  step.number <= currentStep 
                    ? 'bg-[#F97316] text-white' 
                    : 'bg-[#27272A] text-[#A1A1AA]'
                }`}>
                  {step.number}
                </div>
                <div className="mt-12 text-sm text-center">
                  <span className={step.number <= currentStep ? 'text-white' : 'text-[#A1A1AA]'}>
                    {step.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 md:p-12">
          {isSubmitted ? (
            <div className="text-center py-12">
              <div className="w-28 h-28 mx-auto relative mb-8">
                <div className="absolute inset-0 border-4 border-[#F97316]/30 rounded-full animate-ping"></div>
                <div className="absolute inset-2 bg-[#F97316]/10 rounded-full flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <h3 className="font-serif text-3xl font-light text-white mb-4">Request Received!</h3>
              <p className="text-[#A1A1AA] mb-8 max-w-lg mx-auto">
                Thank you for choosing Palms Estate. A luxury property advisor will contact you 
                within 24 hours to discuss your listing and schedule a consultation.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-[#F97316] text-white px-8 py-3 rounded-full hover:bg-[#EA580C] transition-colors"
              >
                Return Home
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Step 1: Property Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-light text-white mb-6">Property Details</h2>
                  
                  <div>
                    <label className="block text-[#A1A1AA] mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[#A1A1AA] mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#A1A1AA] mb-2">State *</label>
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                        required
                      >
                        <option value="" className="bg-[#0A0A0A]">Select</option>
                        <option value="FL" className="bg-[#0A0A0A]">Florida</option>
                        <option value="NY" className="bg-[#0A0A0A]">New York</option>
                        <option value="CA" className="bg-[#0A0A0A]">California</option>
                        <option value="TX" className="bg-[#0A0A0A]">Texas</option>
                        <option value="IL" className="bg-[#0A0A0A]">Illinois</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#A1A1AA] mb-2">ZIP Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#A1A1AA] mb-2">Property Type *</label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                      required
                    >
                      {propertyTypes.map(type => (
                        <option key={type} value={type} className="bg-[#0A0A0A]">{type}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#A1A1AA] mb-2">Bedrooms *</label>
                      <select
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                        required
                      >
                        <option value="" className="bg-[#0A0A0A]">Select</option>
                        {[1,2,3,4,5,6,7,8].map(num => (
                          <option key={num} value={num} className="bg-[#0A0A0A]">{num}</option>
                        ))}
                        <option value="9+" className="bg-[#0A0A0A]">9+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[#A1A1AA] mb-2">Bathrooms *</label>
                      <select
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                        required
                      >
                        <option value="" className="bg-[#0A0A0A]">Select</option>
                        {[1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6].map(num => (
                          <option key={num} value={num} className="bg-[#0A0A0A]">{num}</option>
                        ))}
                        <option value="6.5+" className="bg-[#0A0A0A]">6.5+</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#A1A1AA] mb-2">Square Footage *</label>
                      <input
                        type="number"
                        name="sqft"
                        value={formData.sqft}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                        placeholder="e.g., 2500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#A1A1AA] mb-2">Year Built</label>
                      <input
                        type="number"
                        name="yearBuilt"
                        value={formData.yearBuilt}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                        placeholder="e.g., 2015"
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full bg-[#F97316] text-white py-4 rounded-xl hover:bg-[#EA580C] transition-colors"
                    >
                      Continue to Features
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Features & Amenities */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-light text-white mb-6">Features & Amenities</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#A1A1AA] mb-2">Lot Size (acres)</label>
                      <input
                        type="number"
                        name="lotSize"
                        value={formData.lotSize}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                        placeholder="e.g., 0.5"
                        step="0.1"
                      />
                    </div>
                    <div>
                      <label className="block text-[#A1A1AA] mb-2">Stories</label>
                      <select
                        name="stories"
                        value={formData.stories}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                      >
                        <option value="" className="bg-[#0A0A0A]">Select</option>
                        <option value="1" className="bg-[#0A0A0A]">1</option>
                        <option value="2" className="bg-[#0A0A0A]">2</option>
                        <option value="3" className="bg-[#0A0A0A]">3</option>
                        <option value="4+" className="bg-[#0A0A0A]">4+</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#A1A1AA] mb-2">Garage Spaces</label>
                    <select
                      name="garage"
                      value={formData.garage}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                    >
                      <option value="" className="bg-[#0A0A0A]">Select</option>
                      <option value="0" className="bg-[#0A0A0A]">0</option>
                      <option value="1" className="bg-[#0A0A0A]">1</option>
                      <option value="2" className="bg-[#0A0A0A]">2</option>
                      <option value="3" className="bg-[#0A0A0A]">3</option>
                      <option value="4+" className="bg-[#0A0A0A]">4+</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[#A1A1AA] mb-2">Premium Features</label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl">
                        <input
                          type="checkbox"
                          name="pool"
                          checked={formData.pool}
                          onChange={handleChange}
                          className="w-5 h-5 text-[#F97316] rounded border-[#27272A] bg-[#0A0A0A] focus:ring-[#F97316]"
                        />
                        <span className="text-white">Pool</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl">
                        <input
                          type="checkbox"
                          name="waterfront"
                          checked={formData.waterfront}
                          onChange={handleChange}
                          className="w-5 h-5 text-[#F97316] rounded border-[#27272A] bg-[#0A0A0A] focus:ring-[#F97316]"
                        />
                        <span className="text-white">Waterfront</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl">
                        <input
                          type="checkbox"
                          name="view"
                          checked={formData.view}
                          onChange={handleChange}
                          className="w-5 h-5 text-[#F97316] rounded border-[#27272A] bg-[#0A0A0A] focus:ring-[#F97316]"
                        />
                        <span className="text-white">Scenic View</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl">
                        <input
                          type="checkbox"
                          name="renovated"
                          checked={formData.renovated}
                          onChange={handleChange}
                          className="w-5 h-5 text-[#F97316] rounded border-[#27272A] bg-[#0A0A0A] focus:ring-[#F97316]"
                        />
                        <span className="text-white">Recently Renovated</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#A1A1AA] mb-2">Additional Features</label>
                    <textarea
                      name="additionalFeatures"
                      value={formData.additionalFeatures}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white resize-none"
                      placeholder="Tell us about any unique features, recent upgrades, or special amenities..."
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-[#0A0A0A] border border-[#27272A] text-white py-4 rounded-xl hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-[#F97316] text-white py-4 rounded-xl hover:bg-[#EA580C] transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Information */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-light text-white mb-6">Contact Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#A1A1AA] mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#A1A1AA] mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#A1A1AA] mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#A1A1AA] mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#A1A1AA] mb-2">Best Time to Contact</label>
                    <select
                      name="bestTimeToContact"
                      value={formData.bestTimeToContact}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                    >
                      <option value="anytime" className="bg-[#0A0A0A]">Anytime</option>
                      <option value="morning" className="bg-[#0A0A0A]">Morning (9AM - 12PM)</option>
                      <option value="afternoon" className="bg-[#0A0A0A]">Afternoon (12PM - 5PM)</option>
                      <option value="evening" className="bg-[#0A0A0A]">Evening (5PM - 8PM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#A1A1AA] mb-2">Additional Information</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white resize-none"
                      placeholder="Tell us about your timeline, desired listing price, or any specific questions..."
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-[#0A0A0A] border border-[#27272A] text-white py-4 rounded-xl hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex-1 bg-[#F97316] text-white py-4 rounded-xl hover:bg-[#EA580C] transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Photos & Submit */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="font-serif text-2xl font-light text-white mb-6">Photos & Submit</h2>

                  <div>
                    <label className="block text-[#A1A1AA] mb-2">Upload Property Photos</label>
                    <div className="border-2 border-dashed border-[#27272A] rounded-xl p-8 text-center hover:border-[#F97316]/30 transition-colors">
                      <input
                        type="file"
                        id="photos"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label htmlFor="photos" className="cursor-pointer">
                        <Upload className="w-12 h-12 text-[#F97316] mx-auto mb-4" />
                        <p className="text-white mb-2">Click to upload or drag and drop</p>
                        <p className="text-[#A1A1AA] text-sm">PNG, JPG, GIF up to 10MB each</p>
                      </label>
                    </div>

                    {formData.photos.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {formData.photos.map((photo, index) => (
                          <div key={index} className="flex items-center justify-between bg-[#0A0A0A] border border-[#27272A] rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              <Image className="w-5 h-5 text-[#F97316]" />
                              <span className="text-white text-sm">{photo}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFile(index)}
                              className="text-[#A1A1AA] hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="bg-[#0A0A0A] border border-[#27272A] rounded-xl p-6">
                    <h3 className="text-white font-medium mb-3">Listing Summary</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-[#A1A1AA]">Address:</span> {formData.address}, {formData.city}, {formData.state} {formData.zipCode}</p>
                      <p><span className="text-[#A1A1AA]">Property Type:</span> {formData.propertyType}</p>
                      <p><span className="text-[#A1A1AA]">Size:</span> {formData.bedrooms} bed, {formData.bathrooms} bath, {formData.sqft} sqft</p>
                      <p><span className="text-[#A1A1AA]">Contact:</span> {formData.firstName} {formData.lastName} - {formData.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="flex-1 bg-[#0A0A0A] border border-[#27272A] text-white py-4 rounded-xl hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`flex-1 bg-[#F97316] text-white py-4 rounded-xl hover:bg-[#EA580C] transition-colors ${
                        isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Listing Request'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </section>

      {/* Why Sell With Us */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-6 py-3 mb-6">
              <Award className="w-4 h-4 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-xs uppercase">
                WHY SELL WITH US
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
              Experience the{' '}
              <span className="text-[#F97316] font-medium">Difference</span>
            </h2>
            <p className="text-[#A1A1AA] text-lg mb-8 leading-relaxed">
              When you choose Palms Estate, you're not just listing your property – 
              you're partnering with a team dedicated to maximizing your home's value 
              and providing a seamless selling experience.
            </p>
            <div className="space-y-4">
              {[
                'Comprehensive market analysis',
                'Professional staging consultation',
                'Award-winning photography',
                'Global marketing reach',
                'Expert negotiation',
                'Seamless closing process'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F97316]" />
                  <span className="text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8">
            <h3 className="text-xl text-white mb-4">What Happens Next?</h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#F97316] font-bold">1</span>
                </div>
                <div>
                  <p className="text-white font-medium">Advisor Contact</p>
                  <p className="text-[#A1A1AA] text-sm">Within 24 hours, an advisor will reach out</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#F97316] font-bold">2</span>
                </div>
                <div>
                  <p className="text-white font-medium">Property Consultation</p>
                  <p className="text-[#A1A1AA] text-sm">In-person or virtual property evaluation</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#F97316] font-bold">3</span>
                </div>
                <div>
                  <p className="text-white font-medium">Marketing Proposal</p>
                  <p className="text-[#A1A1AA] text-sm">Customized plan and pricing strategy</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-[#F97316] font-bold">4</span>
                </div>
                <div>
                  <p className="text-white font-medium">List Your Property</p>
                  <p className="text-[#A1A1AA] text-sm">Professional photography and listing launch</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Ready to Get{' '}
            <span className="font-medium">Started?</span>
          </h2>
          <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
            Complete the form above or contact us directly to begin your selling journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+18286239765"
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full hover:bg-[#0A0A0A] transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Sell;
