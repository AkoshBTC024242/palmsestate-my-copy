import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, TrendingUp, Camera, Users, Star, 
  ArrowRight, CheckCircle, Phone, Mail, Calendar,
  DollarSign, PieChart, Target, Zap, Shield,
  BarChart, Clock, Globe, Award, MessageCircle,
  Download, PlayCircle, BookOpen, ChevronRight
} from 'lucide-react';

function Sellers() {
  const [activeTab, setActiveTab] = useState('overview');
  const [valuationData, setValuationData] = useState({
    address: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    condition: 'excellent'
  });

  const benefits = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Maximum Exposure',
      description: 'Your property listed across 50+ luxury platforms globally'
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: 'Professional Photography',
      description: 'Award-winning photographers capture your property\'s essence'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Qualified Buyers',
      description: 'Access to our network of pre-screened luxury buyers'
    },
    {
      icon: <BarChart className="w-6 h-6" />,
      title: 'Data-Driven Pricing',
      description: 'Advanced analytics for optimal pricing strategy'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'White-Glove Service',
      description: 'Dedicated advisor manages every detail'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Fast Transactions',
      description: 'Average 7-day closing for qualified offers'
    }
  ];

  const process = [
    {
      step: '01',
      title: 'Comprehensive Consultation',
      description: 'We meet to understand your goals, timeline, and property details.'
    },
    {
      step: '02',
      title: 'Market Analysis & Pricing',
      description: 'Data-driven valuation to position your property competitively.'
    },
    {
      step: '03',
      title: 'Premium Marketing Campaign',
      description: 'Professional photography, staging, and multi-platform exposure.'
    },
    {
      step: '04',
      title: 'Showings & Negotiations',
      description: 'Private viewings with qualified buyers, expert negotiations.'
    },
    {
      step: '05',
      title: 'Closing & Beyond',
      description: 'Seamless transaction management and post-sale support.'
    }
  ];

  const resources = [
    {
      title: 'Preparing Your Home for Sale',
      description: 'Expert tips on staging and presentation',
      icon: <Home className="w-5 h-5" />,
      readTime: '10 min'
    },
    {
      title: 'Pricing Strategy Guide',
      description: 'How to price your luxury property correctly',
      icon: <DollarSign className="w-5 h-5" />,
      readTime: '8 min'
    },
    {
      title: 'Marketing Your Property',
      description: 'Our multi-channel approach to exposure',
      icon: <Target className="w-5 h-5" />,
      readTime: '12 min'
    },
    {
      title: 'Negotiation Tactics',
      description: 'Maximizing your property\'s value',
      icon: <MessageCircle className="w-5 h-5" />,
      readTime: '15 min'
    }
  ];

  const testimonials = [
    {
      quote: "Palms Estate sold our Miami penthouse in just 5 days for over asking price. Their marketing was exceptional.",
      author: "Jennifer & Michael Roberts",
      location: "Miami Beach",
      salePrice: "$4.2M"
    },
    {
      quote: "The team's knowledge of the luxury market and their network of buyers made all the difference.",
      author: "David Chen",
      location: "New York",
      salePrice: "$8.7M"
    },
    {
      quote: "From photography to closing, every detail was handled with professionalism and care.",
      author: "Elizabeth Sterling",
      location: "London",
      salePrice: "$12.5M"
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
                <Home className="w-5 h-5 text-[#F97316]" />
                <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                  FOR SELLERS
                </span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6">
                Sell Your{' '}
                <span className="text-[#F97316] font-medium">Luxury Property</span>
              </h1>
              <p className="text-xl text-[#A1A1AA] mb-8 leading-relaxed">
                Experience a new standard of luxury real estate marketing. We combine 
                data-driven strategies with white-glove service to maximize your property's value.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-xl hover:bg-[#EA580C] transition-all duration-300"
                >
                  <Calendar className="w-5 h-5" />
                  Schedule Consultation
                </Link>
                <button
                  onClick={() => setActiveTab('valuation')}
                  className="inline-flex items-center justify-center gap-2 bg-[#18181B] border border-[#27272A] text-white px-8 py-4 rounded-xl hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-all duration-300"
                >
                  <DollarSign className="w-5 h-5" />
                  Get Instant Valuation
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
                <div className="text-3xl font-light text-[#F97316] mb-2">$2.5B+</div>
                <div className="text-[#A1A1AA] text-sm">Properties Sold</div>
              </div>
              <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
                <div className="text-3xl font-light text-[#F97316] mb-2">7 Days</div>
                <div className="text-[#A1A1AA] text-sm">Average to Offer</div>
              </div>
              <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
                <div className="text-3xl font-light text-[#F97316] mb-2">98%</div>
                <div className="text-[#A1A1AA] text-sm">List Price Achieved</div>
              </div>
              <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
                <div className="text-3xl font-light text-[#F97316] mb-2">500+</div>
                <div className="text-[#A1A1AA] text-sm">Homes Sold</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap gap-2 border-b border-[#27272A] pb-4">
          {[
            { id: 'overview', label: 'Overview', icon: <Home className="w-4 h-4" /> },
            { id: 'valuation', label: 'Valuation', icon: <DollarSign className="w-4 h-4" /> },
            { id: 'marketing', label: 'Marketing', icon: <Target className="w-4 h-4" /> },
            { id: 'resources', label: 'Resources', icon: <BookOpen className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-[#F97316] text-white'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tab Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        {activeTab === 'overview' && (
          <div>
            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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

            {/* Process */}
            <div className="mb-16">
              <h2 className="font-serif text-3xl font-light text-white mb-8 text-center">Our Process</h2>
              <div className="grid md:grid-cols-5 gap-4">
                {process.map((step, index) => (
                  <div key={index} className="relative">
                    <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 text-center h-full">
                      <div className="text-4xl font-light text-[#F97316]/30 mb-4">{step.step}</div>
                      <h3 className="text-white font-medium mb-2">{step.title}</h3>
                      <p className="text-[#A1A1AA] text-sm">{step.description}</p>
                    </div>
                    {index < process.length - 1 && (
                      <ChevronRight className="hidden lg:block absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#27272A]" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div>
              <h2 className="font-serif text-3xl font-light text-white mb-8 text-center">Success Stories</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#F97316] text-[#F97316]" />
                      ))}
                    </div>
                    <p className="text-[#E4E4E7] italic mb-6">"{testimonial.quote}"</p>
                    <div className="border-t border-[#27272A] pt-4">
                      <div className="text-white font-medium">{testimonial.author}</div>
                      <div className="text-[#A1A1AA] text-sm">{testimonial.location}</div>
                      <div className="text-[#F97316] text-sm mt-2">Sold for {testimonial.salePrice}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'valuation' && (
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="font-serif text-3xl font-light text-white mb-4">Instant Property Valuation</h2>
              <p className="text-[#A1A1AA] mb-8">
                Get a preliminary estimate of your property's value based on current market data.
                For a comprehensive valuation, schedule a consultation with our team.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-[#A1A1AA] mb-2">Property Address *</label>
                  <input
                    type="text"
                    value={valuationData.address}
                    onChange={(e) => setValuationData(prev => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                    placeholder="Enter your property address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#A1A1AA] mb-2">Bedrooms</label>
                    <select
                      value={valuationData.bedrooms}
                      onChange={(e) => setValuationData(prev => ({ ...prev, bedrooms: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                    >
                      <option value="" className="bg-[#0A0A0A]">Select</option>
                      <option value="1" className="bg-[#0A0A0A]">1</option>
                      <option value="2" className="bg-[#0A0A0A]">2</option>
                      <option value="3" className="bg-[#0A0A0A]">3</option>
                      <option value="4" className="bg-[#0A0A0A]">4</option>
                      <option value="5" className="bg-[#0A0A0A]">5+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#A1A1AA] mb-2">Bathrooms</label>
                    <select
                      value={valuationData.bathrooms}
                      onChange={(e) => setValuationData(prev => ({ ...prev, bathrooms: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                    >
                      <option value="" className="bg-[#0A0A0A]">Select</option>
                      <option value="1" className="bg-[#0A0A0A]">1</option>
                      <option value="2" className="bg-[#0A0A0A]">2</option>
                      <option value="3" className="bg-[#0A0A0A]">3</option>
                      <option value="4" className="bg-[#0A0A0A]">4</option>
                      <option value="5" className="bg-[#0A0A0A]">5+</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[#A1A1AA] mb-2">Square Footage</label>
                  <input
                    type="number"
                    value={valuationData.sqft}
                    onChange={(e) => setValuationData(prev => ({ ...prev, sqft: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                    placeholder="e.g., 2500"
                  />
                </div>
                <div>
                  <label className="block text-[#A1A1AA] mb-2">Property Condition</label>
                  <select
                    value={valuationData.condition}
                    onChange={(e) => setValuationData(prev => ({ ...prev, condition: e.target.value }))}
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-xl focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-white"
                  >
                    <option value="excellent" className="bg-[#0A0A0A]">Excellent - Newly renovated</option>
                    <option value="good" className="bg-[#0A0A0A]">Good - Well maintained</option>
                    <option value="fair" className="bg-[#0A0A0A]">Fair - Needs updates</option>
                    <option value="fixer" className="bg-[#0A0A0A]">Fixer - Renovation needed</option>
                  </select>
                </div>
                <button className="w-full bg-[#F97316] text-white py-4 rounded-xl hover:bg-[#EA580C] transition-colors mt-4">
                  Get Estimated Value
                </button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-light mb-4">Why a Professional Valuation Matters</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Accurate pricing maximizes exposure and attracts serious buyers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Data-driven analysis of comparable luxury properties</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Consideration of unique features and market trends</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Strategic pricing for competitive advantage</span>
                </li>
              </ul>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full mt-6 hover:bg-[#0A0A0A] transition-colors"
              >
                Schedule Professional Valuation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'marketing' && (
          <div>
            <div className="grid lg:grid-cols-2 gap-12 mb-16">
              <div>
                <h2 className="font-serif text-3xl font-light text-white mb-4">Premium Marketing Campaign</h2>
                <p className="text-[#A1A1AA] mb-6">
                  Your property deserves exceptional presentation and maximum exposure. 
                  Our comprehensive marketing strategy reaches qualified buyers worldwide.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Camera className="w-5 h-5 text-[#F97316] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-medium">Professional Photography & Video</h3>
                      <p className="text-[#A1A1AA] text-sm">Award-winning photographers, cinematic videography, and drone footage</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-[#F97316] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-medium">Global Platform Distribution</h3>
                      <p className="text-[#A1A1AA] text-sm">Listed on 50+ luxury real estate platforms worldwide</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-[#F97316] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-medium">Targeted Buyer Outreach</h3>
                      <p className="text-[#A1A1AA] text-sm">Direct marketing to our database of qualified luxury buyers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <PieChart className="w-5 h-5 text-[#F97316] flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-medium">Performance Analytics</h3>
                      <p className="text-[#A1A1AA] text-sm">Real-time tracking of listing views, inquiries, and engagement</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8">
                <h3 className="text-xl text-white mb-4">Marketing Package Includes</h3>
                <ul className="space-y-3">
                  {[
                    'Professional photography & virtual tour',
                    'Cinematic property video',
                    'Drone aerial footage',
                    'Print collateral & brochures',
                    'Social media campaign',
                    'Email marketing to buyer network',
                    'Open house events',
                    'International platform listing'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2 text-[#A1A1AA]">
                      <CheckCircle className="w-4 h-4 text-[#F97316]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="text-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-full hover:bg-[#EA580C] transition-colors"
              >
                <PlayCircle className="w-5 h-5" />
                View Sample Marketing Package
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div>
            <h2 className="font-serif text-3xl font-light text-white mb-8 text-center">Seller Resources</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 hover:border-[#F97316]/30 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
                      <div className="text-[#F97316]">{resource.icon}</div>
                    </div>
                    <span className="text-xs text-[#A1A1AA]">{resource.readTime} read</span>
                  </div>
                  <h3 className="text-white font-medium mb-2">{resource.title}</h3>
                  <p className="text-[#A1A1AA] text-sm mb-4">{resource.description}</p>
                  <ArrowRight className="w-4 h-4 text-[#F97316]" />
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-8 text-white">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-light mb-4">Download Our Seller's Guide</h3>
                  <p className="text-white/90 mb-6">
                    Comprehensive guide to selling your luxury property, including pricing strategies, 
                    marketing insights, and preparation tips.
                  </p>
                  <button className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full hover:bg-[#0A0A0A] transition-colors">
                    <Download className="w-4 h-4" />
                    Download Free Guide
                  </button>
                </div>
                <div className="text-center">
                  <div className="text-6xl mb-2">📚</div>
                  <div className="text-lg">The Luxury Seller's Guide</div>
                  <div className="text-white/70 text-sm">35+ pages of expert insights</div>
                </div>
              </div>
            </div>
          </div>
        )}
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
              The{' '}
              <span className="text-[#F97316] font-medium">Palms Estate</span>{' '}
              Advantage
            </h2>
            <p className="text-[#A1A1AA] text-lg mb-8 leading-relaxed">
              We don't just list your property – we create a comprehensive marketing ecosystem 
              designed to attract the right buyers and achieve the best possible price.
            </p>
            <div className="space-y-4">
              {[
                'Average 7 days to first offer',
                '98% of list price achieved',
                'Exclusive buyer network',
                'Award-winning marketing team'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F97316]" />
                  <span className="text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8">
            <h3 className="text-xl text-white mb-4">Recent Sales</h3>
            <div className="space-y-4">
              {[
                { address: '123 Ocean Drive, Miami Beach', price: '$4.2M', days: '5 days' },
                { address: '15 Central Park West, New York', price: '$8.7M', days: '12 days' },
                { address: '22 Kensington Palace Gardens, London', price: '$12.5M', days: '8 days' }
              ].map((sale, index) => (
                <div key={index} className="border-b border-[#27272A] last:border-0 pb-4 last:pb-0">
                  <div className="text-white font-medium mb-1">{sale.address}</div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#F97316]">{sale.price}</span>
                    <span className="text-[#A1A1AA]">Sold in {sale.days}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Ready to Sell Your{' '}
            <span className="font-medium">Property?</span>
          </h2>
          <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
            Let's discuss how we can maximize your property's value and find the perfect buyer.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full hover:bg-[#0A0A0A] transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Schedule Consultation
            </Link>
            <a
              href="tel:+18286239765"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full hover:bg-white/10 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Sellers;
