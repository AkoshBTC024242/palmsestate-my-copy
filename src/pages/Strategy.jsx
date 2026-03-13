import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, Clock, Phone, Mail, Video, MapPin,
  CheckCircle, ArrowRight, Star, Users, Target,
  TrendingUp, Shield, Award, Briefcase, Compass,
  Sparkles, ChevronRight, X, Download
} from 'lucide-react';

function Strategy() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState('video');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    consultationType: 'video',
    preferredDate: '',
    preferredTime: '',
    goals: '',
    hearAbout: '',
    investmentRange: '',
    propertyType: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const consultationTypes = [
    {
      id: 'video',
      name: 'Video Call',
      icon: <Video className="w-5 h-5" />,
      description: 'Face-to-face consultation from anywhere',
      duration: '60 min'
    },
    {
      id: 'phone',
      name: 'Phone Call',
      icon: <Phone className="w-5 h-5" />,
      description: 'Detailed discussion via phone',
      duration: '45 min'
    },
    {
      id: 'in-person',
      name: 'In Person',
      icon: <MapPin className="w-5 h-5" />,
      description: 'Meet at our office or your location',
      duration: '90 min'
    }
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ];

  const goals = [
    'First-time buyer consultation',
    'Investment portfolio review',
    'Property selling strategy',
    'Luxury property search',
    'Portfolio diversification',
    'Generational wealth planning'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Strategy call scheduled:', formData);
      setIsSubmitted(true);
      
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          consultationType: 'video',
          preferredDate: '',
          preferredTime: '',
          goals: '',
          hearAbout: '',
          investmentRange: '',
          propertyType: ''
        });
      }, 5000);

    } catch (error) {
      console.error('Error scheduling:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const advisors = [
    {
      name: 'Eleanor Sterling',
      role: 'Senior Strategy Advisor',
      expertise: ['Portfolio Management', 'International Investment'],
      image: '👩‍💼',
      available: true
    },
    {
      name: 'Marcus Chen',
      role: 'Investment Strategist',
      expertise: ['Market Analysis', 'Acquisition Strategy'],
      image: '👨‍💼',
      available: true
    },
    {
      name: 'Isabella Rossi',
      role: 'Lifestyle Advisor',
      expertise: ['Luxury Properties', 'Concierge Services'],
      image: '👩‍💼',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/5 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
                <Target className="w-5 h-5 text-[#F97316]" />
                <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                  STRATEGY CALL
                </span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6">
                Plan Your{' '}
                <span className="text-[#F97316] font-medium">Success</span>
              </h1>
              <p className="text-xl text-[#A1A1AA] mb-8 leading-relaxed">
                Schedule a complimentary strategy session with one of our luxury real estate advisors. 
                Whether you're buying, selling, or investing, we'll help you create a roadmap for success.
              </p>
              <div className="flex items-center gap-6 text-sm text-[#A1A1AA]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#F97316]" />
                  45-60 min sessions
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-[#F97316]" />
                  Complimentary
                </div>
              </div>
            </div>
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8">
              <h3 className="text-xl text-white mb-4">What to Expect</h3>
              <ul className="space-y-4">
                {[
                  'Personalized market analysis',
                  'Clear action plan and timeline',
                  'Investment strategy recommendations',
                  'Answers to all your questions',
                  'No pressure, no obligation'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#F97316] flex-shrink-0 mt-0.5" />
                    <span className="text-[#A1A1AA] text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Types */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Compass className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              HOW TO CONNECT
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Choose Your{' '}
            <span className="text-[#F97316] font-medium">Consultation Type</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {consultationTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`text-left p-8 rounded-3xl border transition-all duration-300 ${
                selectedType === type.id
                  ? 'bg-gradient-to-br from-[#F97316] to-[#EA580C] border-transparent'
                  : 'bg-[#18181B] border-[#27272A] hover:border-[#F97316]/30'
              }`}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                selectedType === type.id ? 'bg-white/20' : 'bg-[#F97316]/10'
              }`}>
                <div className={selectedType === type.id ? 'text-white' : 'text-[#F97316]'}>
                  {type.icon}
                </div>
              </div>
              <h3 className={`text-xl font-medium mb-2 ${
                selectedType === type.id ? 'text-white' : 'text-white'
              }`}>{type.name}</h3>
              <p className={`text-sm mb-4 ${
                selectedType === type.id ? 'text-white/80' : 'text-[#A1A1AA]'
              }`}>{type.description}</p>
              <div className={`flex items-center gap-2 text-sm ${
                selectedType === type.id ? 'text-white/70' : 'text-[#F97316]'
              }`}>
                <Clock className="w-4 h-4" />
                {type.duration}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Meeting with Advisors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Scheduling Form */}
          <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8">
            <h2 className="font-serif text-2xl font-light text-white mb-6">Schedule Your Call</h2>
            
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-[#F97316]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-[#F97316]" />
                </div>
                <h3 className="text-2xl font-light text-white mb-4">Consultation Scheduled!</h3>
                <p className="text-[#A1A1AA] mb-6">
                  We've sent a calendar invitation to your email. A advisor will confirm your appointment shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-[#F97316] hover:text-[#F97316]/80 transition-colors"
                >
                  Schedule Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A1A1AA] text-sm mb-2">First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A1A1AA] text-sm mb-2">Last Name *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A1A1AA] text-sm mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A1A1AA] text-sm mb-2">Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#A1A1AA] text-sm mb-2">Consultation Type</label>
                  <select
                    name="consultationType"
                    value={formData.consultationType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                  >
                    <option value="video" className="bg-[#0A0A0A]">Video Call</option>
                    <option value="phone" className="bg-[#0A0A0A]">Phone Call</option>
                    <option value="in-person" className="bg-[#0A0A0A]">In Person</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A1A1AA] text-sm mb-2">Preferred Date *</label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      required
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#A1A1AA] text-sm mb-2">Preferred Time *</label>
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                    >
                      <option value="" className="bg-[#0A0A0A]">Select time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time} className="bg-[#0A0A0A]">{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#A1A1AA] text-sm mb-2">Primary Goal *</label>
                  <select
                    name="goals"
                    value={formData.goals}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                  >
                    <option value="" className="bg-[#0A0A0A]">Select your goal</option>
                    {goals.map(goal => (
                      <option key={goal} value={goal} className="bg-[#0A0A0A]">{goal}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#A1A1AA] text-sm mb-2">Investment Range</label>
                  <select
                    name="investmentRange"
                    value={formData.investmentRange}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                  >
                    <option value="" className="bg-[#0A0A0A]">Select range</option>
                    <option value="under-500k" className="bg-[#0A0A0A]">Under $500k</option>
                    <option value="500k-1m" className="bg-[#0A0A0A]">$500k - $1M</option>
                    <option value="1m-3m" className="bg-[#0A0A0A]">$1M - $3M</option>
                    <option value="3m-5m" className="bg-[#0A0A0A]">$3M - $5M</option>
                    <option value="5m-10m" className="bg-[#0A0A0A]">$5M - $10M</option>
                    <option value="10m+" className="bg-[#0A0A0A]">$10M+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#A1A1AA] text-sm mb-2">How did you hear about us?</label>
                  <input
                    type="text"
                    name="hearAbout"
                    value={formData.hearAbout}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                    placeholder="e.g., Referral, Google, Social Media"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white py-4 rounded-xl font-medium transition-all duration-300 ${
                    isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-xl hover:shadow-[#F97316]/20 hover:-translate-y-1'
                  }`}
                >
                  {isSubmitting ? 'Scheduling...' : 'Schedule Strategy Call'}
                </button>

                <p className="text-center text-[#A1A1AA] text-xs">
                  By scheduling, you agree to our{' '}
                  <Link to="/terms" className="text-[#F97316] hover:underline">Terms</Link> and{' '}
                  <Link to="/privacy" className="text-[#F97316] hover:underline">Privacy Policy</Link>.
                </p>
              </form>
            )}
          </div>

          {/* Advisor Selection */}
          <div>
            <h2 className="font-serif text-2xl font-light text-white mb-6">Meet Your Advisors</h2>
            <div className="space-y-4">
              {advisors.map((advisor, index) => (
                <div
                  key={index}
                  className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 hover:border-[#F97316]/30 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{advisor.image}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-white font-medium">{advisor.name}</h3>
                        {advisor.available ? (
                          <span className="text-xs text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
                            Available
                          </span>
                        ) : (
                          <span className="text-xs text-[#A1A1AA] bg-[#0A0A0A] px-3 py-1 rounded-full">
                            Limited Availability
                          </span>
                        )}
                      </div>
                      <p className="text-[#F97316] text-sm mb-2">{advisor.role}</p>
                      <div className="flex flex-wrap gap-2">
                        {advisor.expertise.map((exp, idx) => (
                          <span key={idx} className="text-xs text-[#A1A1AA] bg-[#0A0A0A] px-2 py-1 rounded-full">
                            {exp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-[#18181B] border border-[#27272A] rounded-2xl p-6">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#F97316]" />
                What to Prepare
              </h3>
              <ul className="space-y-3">
                {[
                  'Questions you want answered',
                  'Budget or investment range',
                  'Timeline expectations',
                  'Property preferences (optional)'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[#F97316] flex-shrink-0 mt-0.5" />
                    <span className="text-[#A1A1AA] text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Star className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              FAQ
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Common{' '}
            <span className="text-[#F97316] font-medium">Questions</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              q: 'Is the strategy call really free?',
              a: 'Yes, absolutely. Our initial strategy calls are completely complimentary with no obligation.'
            },
            {
              q: 'How long does the call last?',
              a: 'Most strategy calls last 45-60 minutes, giving us ample time to understand your goals.'
            },
            {
              q: 'What happens after the call?',
              a: 'You\'ll receive a summary of our discussion and recommended next steps, with no pressure to proceed.'
            },
            {
              q: 'Do I need to prepare anything?',
              a: 'Just bring your questions and any initial ideas about your property goals.'
            }
          ].map((faq, index) => (
            <div key={index} className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6">
              <h3 className="text-white font-medium mb-3">{faq.q}</h3>
              <p className="text-[#A1A1AA] text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Ready to Create Your{' '}
            <span className="font-medium">Strategy?</span>
          </h2>
          <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
            Take the first step toward achieving your real estate goals. Schedule your complimentary strategy call today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+18286239765"
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full hover:bg-[#0A0A0A] transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call to Schedule
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Email Us Instead
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Strategy;
