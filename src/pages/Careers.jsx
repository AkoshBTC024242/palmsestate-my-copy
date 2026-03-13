import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Heart, Users, Globe, Award, Clock, 
  Coffee, Zap, ArrowRight, Send, CheckCircle, X,
  Mail, Phone, MapPin, Star, Target, TrendingUp
} from 'lucide-react';

function Careers() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    message: '',
    resume: null
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const openPositions = [
    {
      title: 'Luxury Property Advisor',
      type: 'Full-time',
      location: 'Miami, FL',
      department: 'Sales',
      description: 'Join our elite team of luxury property advisors serving high-net-worth clients in South Florida.',
      requirements: [
        '5+ years in luxury real estate',
        'Proven track record of high-value transactions',
        'Excellent network of affluent clients',
        'Fluent in English and Spanish preferred',
        'REALTOR® certification required'
      ]
    },
    {
      title: 'Concierge Manager',
      type: 'Full-time',
      location: 'New York, NY',
      department: 'Concierge Services',
      description: 'Lead our premier concierge team in delivering exceptional white-glove service to discerning clients.',
      requirements: [
        '7+ years in luxury hospitality or concierge',
        'Experience managing high-performance teams',
        'Global network of luxury service providers',
        'Multi-lingual preferred',
        'Crisis management experience'
      ]
    },
    {
      title: 'Digital Marketing Specialist',
      type: 'Full-time',
      location: 'Remote (US-based)',
      department: 'Marketing',
      description: 'Drive our digital presence and create compelling content for luxury property marketing.',
      requirements: [
        '3+ years in luxury brand marketing',
        'Expertise in SEO/SEM and social media',
        'Video production and editing skills',
        'Experience with CRM and marketing automation',
        'Portfolio of luxury campaigns'
      ]
    },
    {
      title: 'Client Relations Associate',
      type: 'Full-time',
      location: 'Buffalo, NY',
      department: 'Operations',
      description: 'Support our clients throughout their journey with Palms Estate, ensuring seamless experiences.',
      requirements: [
        '2+ years in client service roles',
        'Exceptional communication skills',
        'Detail-oriented and organized',
        'Passion for luxury real estate',
        'Flexible schedule including weekends'
      ]
    },
    {
      title: 'Property Acquisition Specialist',
      type: 'Full-time',
      location: 'London, UK',
      department: 'Acquisitions',
      description: 'Identify and secure exclusive luxury properties for our global portfolio.',
      requirements: [
        '5+ years in property acquisition',
        'Strong negotiation skills',
        'Knowledge of European luxury markets',
        'Network of developers and owners',
        'Willingness to travel frequently'
      ]
    }
  ];

  const benefits = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: 'Comprehensive Healthcare',
      description: 'Medical, dental, and vision coverage for you and your family'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Uncapped Commission',
      description: 'Industry-leading commission structure with no caps'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Opportunities',
      description: 'Work across our international office network'
    },
    {
      icon: <Coffee className="w-6 h-6" />,
      title: 'Luxury Perks',
      description: 'Access to exclusive properties, events, and partners'
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Professional Development',
      description: 'Continuous training and industry certification support'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Flexible Schedules',
      description: 'Work-life balance with remote options'
    }
  ];

  const values = [
    {
      title: 'Excellence',
      description: 'We pursue perfection in every interaction and transaction.'
    },
    {
      title: 'Discretion',
      description: 'Client confidentiality is our sacred duty.'
    },
    {
      title: 'Innovation',
      description: 'We embrace technology and new ideas to serve better.'
    },
    {
      title: 'Integrity',
      description: 'Honesty and transparency guide our every decision.'
    }
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'resume') {
      setFormData(prev => ({ ...prev, resume: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Application submitted:', formData);
      setIsSubmitted(true);
      
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          position: '',
          experience: '',
          message: '',
          resume: null
        });
      }, 5000);

    } catch (err) {
      setError('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDismissSuccess = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/5 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
              <Briefcase className="w-5 h-5 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                JOIN OUR TEAM
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6">
              Build Your Future{' '}
              <span className="text-[#F97316] font-medium">With Us</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#A1A1AA] mb-8 leading-relaxed">
              Join a team of passionate professionals dedicated to redefining luxury real estate. 
              At Palms Estate, we don't just build careers – we cultivate legacies.
            </p>
          </div>
        </div>
      </section>

      {/* Our Culture */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-6 py-3 mb-6">
              <Heart className="w-4 h-4 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-xs uppercase">
                OUR CULTURE
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
              More Than a{' '}
              <span className="text-[#F97316] font-medium">Career</span>
            </h2>
            <p className="text-[#A1A1AA] text-lg mb-8 leading-relaxed">
              At Palms Estate, we've built a culture that celebrates excellence, nurtures talent, 
              and rewards ambition. We believe that when our people thrive, our clients win.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {values.map((value, index) => (
                <div key={index} className="bg-[#18181B] border border-[#27272A] rounded-xl p-4">
                  <h3 className="text-white font-medium mb-1">{value.title}</h3>
                  <p className="text-[#A1A1AA] text-xs">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-8 text-center">
              <div className="text-5xl font-light text-white mb-2">15+</div>
              <div className="text-white/80 text-sm">Years Excellence</div>
            </div>
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 text-center">
              <div className="text-5xl font-light text-[#F97316] mb-2">50+</div>
              <div className="text-[#A1A1AA] text-sm">Team Members</div>
            </div>
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 text-center">
              <div className="text-5xl font-light text-[#F97316] mb-2">4</div>
              <div className="text-[#A1A1AA] text-sm">Global Offices</div>
            </div>
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 text-center">
              <div className="text-5xl font-light text-[#F97316] mb-2">800+</div>
              <div className="text-[#A1A1AA] text-sm">Clients Served</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Award className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              WHY JOIN US
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Exceptional{' '}
            <span className="text-[#F97316] font-medium">Benefits</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316]/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-[#F97316]/10 rounded-xl flex items-center justify-center mb-6">
                <div className="text-[#F97316]">{benefit.icon}</div>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">{benefit.title}</h3>
              <p className="text-[#A1A1AA]">{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open Positions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Target className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              OPEN POSITIONS
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Find Your{' '}
            <span className="text-[#F97316] font-medium">Place</span>
          </h2>
        </div>

        <div className="space-y-4">
          {openPositions.map((position, index) => (
            <div 
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 hover:border-[#F97316]/30 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h3 className="text-xl font-medium text-white mb-2">{position.title}</h3>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="flex items-center gap-1 text-[#F97316]">
                      <Briefcase className="w-4 h-4" />
                      {position.type}
                    </span>
                    <span className="flex items-center gap-1 text-[#A1A1AA]">
                      <MapPin className="w-4 h-4" />
                      {position.location}
                    </span>
                    <span className="flex items-center gap-1 text-[#A1A1AA]">
                      <Users className="w-4 h-4" />
                      {position.department}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    const element = document.getElementById('application-form');
                    element?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 bg-[#F97316] text-white px-6 py-3 rounded-xl hover:bg-[#EA580C] transition-colors whitespace-nowrap"
                >
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Application Form */}
      <section id="application-form" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
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
              <h3 className="font-serif text-3xl font-light text-white mb-4">Application Received!</h3>
              <p className="text-[#A1A1AA] mb-8 max-w-lg mx-auto">
                Thank you for your interest in joining Palms Estate. Our talent acquisition team will review your application and contact you within 3-5 business days.
              </p>
              <button
                onClick={handleDismissSuccess}
                className="inline-flex items-center gap-2 bg-[#F97316] text-white px-8 py-3 rounded-full hover:bg-[#EA580C] transition-colors"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-serif text-3xl font-light text-white mb-2">Apply Now</h2>
              <p className="text-[#A1A1AA] mb-8">
                Ready to join our team? Complete the form below and we'll be in touch.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#A1A1AA] mb-2">Position of Interest *</label>
                  <select
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                    required
                  >
                    <option value="" className="bg-[#0A0A0A]">Select a position</option>
                    {openPositions.map((pos, idx) => (
                      <option key={idx} value={pos.title} className="bg-[#0A0A0A]">
                        {pos.title} - {pos.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#A1A1AA] mb-2">Years of Experience *</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                    required
                  >
                    <option value="" className="bg-[#0A0A0A]">Select experience</option>
                    <option value="0-2" className="bg-[#0A0A0A]">0-2 years</option>
                    <option value="3-5" className="bg-[#0A0A0A]">3-5 years</option>
                    <option value="5-7" className="bg-[#0A0A0A]">5-7 years</option>
                    <option value="7-10" className="bg-[#0A0A0A]">7-10 years</option>
                    <option value="10+" className="bg-[#0A0A0A]">10+ years</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A1A1AA] mb-2">Resume/CV *</label>
                  <input
                    type="file"
                    name="resume"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx"
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-[#F97316]/10 file:text-[#F97316] hover:file:bg-[#F97316]/20"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#A1A1AA] mb-2">Why Palms Estate? *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white resize-none"
                    placeholder="Tell us why you'd be a great fit for our team..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white py-4 rounded-xl font-medium transition-all duration-300 ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl hover:shadow-[#F97316]/20 hover:-translate-y-1'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Application
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-4">
            Questions About{' '}
            <span className="font-medium">Careers?</span>
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Our talent acquisition team is here to help with any questions about opportunities at Palms Estate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:careers@palmsestate.org"
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-3 rounded-full hover:bg-[#0A0A0A] transition-colors"
            >
              <Mail className="w-4 h-4" />
              careers@palmsestate.org
            </a>
            <a
              href="tel:+18286239765"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <Phone className="w-4 h-4" />
              +1 (828) 623-9765
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Careers;
