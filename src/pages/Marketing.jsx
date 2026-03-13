import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, Camera, Users, Globe, TrendingUp, 
  ArrowRight, CheckCircle, PlayCircle, Download,
  BarChart, Image, Video, Share2, Mail, Phone,
  Calendar, Star, Award, PieChart, Search,
  Smartphone, Monitor, Instagram, Facebook, Twitter,
  Youtube, FileText, BookOpen, ChevronRight
} from 'lucide-react';

function Marketing() {
  const [activeStrategy, setActiveStrategy] = useState('digital');

  const strategies = {
    digital: {
      title: 'Digital Marketing',
      description: 'Reach qualified buyers through targeted online campaigns',
      channels: [
        {
          name: 'Social Media Advertising',
          platforms: ['Instagram', 'Facebook', 'LinkedIn', 'YouTube'],
          reach: '500K+ monthly impressions',
          icon: <Instagram className="w-5 h-5" />
        },
        {
          name: 'Search Engine Marketing',
          platforms: ['Google Ads', 'Bing Ads'],
          reach: 'Targeted luxury buyer keywords',
          icon: <Search className="w-5 h-5" />
        },
        {
          name: 'Email Marketing',
          platforms: ['Exclusive buyer database'],
          reach: '50K+ qualified leads',
          icon: <Mail className="w-5 h-5" />
        },
        {
          name: 'Retargeting Campaigns',
          platforms: ['Display ads', 'Video retargeting'],
          reach: 'Re-engage interested viewers',
          icon: <Monitor className="w-5 h-5" />
        }
      ]
    },
    print: {
      title: 'Print & Collateral',
      description: 'Elegant printed materials for discerning clients',
      channels: [
        {
          name: 'Luxury Brochures',
          features: ['Custom designed', 'Premium paper stock', 'Professional photography'],
          icon: <FileText className="w-5 h-5" />
        },
        {
          name: 'Magazine Features',
          features: ['Forbes', 'Robb Report', 'Architectural Digest'],
          icon: <BookOpen className="w-5 h-5" />
        },
        {
          name: 'Direct Mail',
          features: ['Targeted neighborhoods', 'Affluent zip codes'],
          icon: <Mail className="w-5 h-5" />
        },
        {
          name: 'Property Signage',
          features: ['Custom designs', 'Premium materials', 'Illuminated options'],
          icon: <Target className="w-5 h-5" />
        }
      ]
    },
    events: {
      title: 'Events & Experiences',
      description: 'Create memorable experiences for qualified buyers',
      channels: [
        {
          name: 'Private Open Houses',
          features: ['Catered events', 'Live music', 'Champagne receptions'],
          icon: <Users className="w-5 h-5" />
        },
        {
          name: 'Broker Events',
          features: ['Network with top agents', 'Exclusive previews'],
          icon: <Star className="w-5 h-5" />
        },
        {
          name: 'VIP Private Showings',
          features: ['Flexible scheduling', 'Personalized tours'],
          icon: <Calendar className="w-5 h-5" />
        },
        {
          name: 'Virtual Events',
          features: ['Live virtual tours', 'Q&A sessions'],
          icon: <Video className="w-5 h-5" />
        }
      ]
    }
  };

  const photographyServices = [
    {
      title: 'Professional Photography',
      description: 'Award-winning photographers capture every detail',
      features: ['HDR imaging', 'Wide-angle lenses', 'Styling guidance'],
      icon: <Camera className="w-6 h-6" />
    },
    {
      title: 'Cinematic Video',
      description: 'Story-driven videos that evoke emotion',
      features: ['4K resolution', 'Drone aerials', 'Professional editing'],
      icon: <Video className="w-6 h-6" />
    },
    {
      title: 'Virtual Tours',
      description: 'Immersive 3D walkthroughs for remote buyers',
      features: ['Matterport technology', 'Floor plans', 'Interactive hotspots'],
      icon: <Monitor className="w-6 h-6" />
    },
    {
      title: 'Aerial Photography',
      description: 'Stunning drone footage of property and surroundings',
      features: ['FAA certified pilots', '4K video', 'Sunset shoots'],
      icon: <Globe className="w-6 h-6" />
    }
  ];

  const platforms = [
    { name: 'Zillow Luxury', reach: '10M+ monthly visitors' },
    { name: 'Realtor.com', reach: '8M+ monthly visitors' },
    { name: 'Mansion Global', reach: '5M+ monthly visitors' },
    { name: 'Forbes Global Properties', reach: '3M+ monthly visitors' },
    { name: 'Christie\'s International', reach: '2M+ monthly visitors' },
    { name: 'Sotheby\'s International', reach: '2.5M+ monthly visitors' },
    { name: 'Luxury Portfolio', reach: '1.5M+ monthly visitors' },
    { name: 'TopTenRealEstate', reach: '1M+ monthly visitors' }
  ];

  const caseStudies = [
    {
      property: 'Oceanfront Estate, Miami',
      result: 'Sold for $12.5M in 7 days',
      views: '250K+ online views',
      inquiries: '45 qualified inquiries',
      image: '🏖️'
    },
    {
      property: 'Penthouse, New York',
      result: 'Sold for $8.7M at 98% of ask',
      views: '180K+ online views',
      inquiries: '32 qualified inquiries',
      image: '🗽'
    },
    {
      property: 'Country Estate, London',
      result: 'Sold for $15.2M in 12 days',
      views: '320K+ online views',
      inquiries: '58 qualified inquiries',
      image: '🏰'
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
              <Target className="w-5 h-5 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                MARKETING GUIDE
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6">
              Luxury Marketing{' '}
              <span className="text-[#F97316] font-medium">That Sells</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#A1A1AA] mb-8 leading-relaxed">
              Discover how our comprehensive marketing strategies attract qualified buyers 
              and maximize your property's value in today's competitive luxury market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-xl hover:bg-[#EA580C] transition-all duration-300"
              >
                <PlayCircle className="w-5 h-5" />
                View Sample Campaign
              </Link>
              <button
                onClick={() => window.scrollTo({ top: document.getElementById('strategies').offsetTop, behavior: 'smooth' })}
                className="inline-flex items-center justify-center gap-2 bg-[#18181B] border border-[#27272A] text-white px-8 py-4 rounded-xl hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-all duration-300"
              >
                <Download className="w-5 h-5" />
                Download Marketing Guide
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
            <div className="text-3xl font-light text-[#F97316] mb-2">50+</div>
            <div className="text-[#A1A1AA] text-sm">Marketing Platforms</div>
          </div>
          <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
            <div className="text-3xl font-light text-[#F97316] mb-2">2.5M+</div>
            <div className="text-[#A1A1AA] text-sm">Monthly Impressions</div>
          </div>
          <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
            <div className="text-3xl font-light text-[#F97316] mb-2">45+</div>
            <div className="text-[#A1A1AA] text-sm">Avg. Inquiries</div>
          </div>
          <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
            <div className="text-3xl font-light text-[#F97316] mb-2">7 Days</div>
            <div className="text-[#A1A1AA] text-sm">Avg. to Offer</div>
          </div>
        </div>
      </section>

      {/* Photography & Media */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Camera className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              PROFESSIONAL MEDIA
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            First Impressions{' '}
            <span className="text-[#F97316] font-medium">Matter</span>
          </h2>
          <p className="text-xl text-[#A1A1AA] max-w-3xl mx-auto">
            Our award-winning creative team ensures your property is presented in its best light.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {photographyServices.map((service, index) => (
            <div
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316]/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-14 h-14 bg-[#F97316]/10 rounded-xl flex items-center justify-center mb-6">
                <div className="text-[#F97316]">{service.icon}</div>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">{service.title}</h3>
              <p className="text-[#A1A1AA] text-sm mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                    <CheckCircle className="w-4 h-4 text-[#F97316]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Marketing Strategies */}
      <section id="strategies" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <TrendingUp className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              MARKETING STRATEGIES
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Multi-Channel{' '}
            <span className="text-[#F97316] font-medium">Approach</span>
          </h2>
        </div>

        {/* Strategy Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Object.keys(strategies).map((key) => (
            <button
              key={key}
              onClick={() => setActiveStrategy(key)}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeStrategy === key
                  ? 'bg-[#F97316] text-white'
                  : 'bg-[#18181B] text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/10'
              }`}
            >
              {strategies[key].title}
            </button>
          ))}
        </div>

        {/* Strategy Content */}
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8">
          <h3 className="text-2xl font-light text-white mb-2">{strategies[activeStrategy].title}</h3>
          <p className="text-[#A1A1AA] mb-8">{strategies[activeStrategy].description}</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {strategies[activeStrategy].channels.map((channel, index) => (
              <div key={index} className="bg-[#0A0A0A] border border-[#27272A] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-[#F97316]">{channel.icon}</div>
                  <h4 className="text-white font-medium">{channel.name}</h4>
                </div>
                {channel.platforms && (
                  <div className="mb-3">
                    <div className="text-[#A1A1AA] text-xs uppercase mb-1">Platforms</div>
                    <div className="flex flex-wrap gap-2">
                      {channel.platforms.map((platform, idx) => (
                        <span key={idx} className="px-2 py-1 bg-[#F97316]/10 text-[#F97316] text-xs rounded-lg">
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {channel.features && (
                  <ul className="space-y-1 mb-3">
                    {channel.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                        <CheckCircle className="w-3 h-3 text-[#F97316]" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}
                {channel.reach && (
                  <div className="text-sm text-[#F97316]">{channel.reach}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Distribution */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-6 py-3 mb-6">
              <Globe className="w-4 h-4 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-xs uppercase">
                GLOBAL REACH
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
              Featured on{' '}
              <span className="text-[#F97316] font-medium">Premium Platforms</span>
            </h2>
            <p className="text-[#A1A1AA] text-lg mb-8">
              Your property gains exposure across 50+ luxury real estate platforms, 
              reaching qualified buyers worldwide.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {platforms.slice(0, 4).map((platform, index) => (
                <div key={index} className="bg-[#18181B] border border-[#27272A] rounded-xl p-4">
                  <div className="text-white font-medium mb-1">{platform.name}</div>
                  <div className="text-[#A1A1AA] text-sm">{platform.reach}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {platforms.slice(4).map((platform, index) => (
              <div key={index} className="bg-[#18181B] border border-[#27272A] rounded-xl p-4">
                <div className="text-white font-medium mb-1">{platform.name}</div>
                <div className="text-[#A1A1AA] text-sm">{platform.reach}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Award className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              SUCCESS STORIES
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Proven{' '}
            <span className="text-[#F97316] font-medium">Results</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {caseStudies.map((study, index) => (
            <div key={index} className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316]/30 transition-all duration-300">
              <div className="text-4xl mb-4">{study.image}</div>
              <h3 className="text-xl font-medium text-white mb-3">{study.property}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-[#F97316]">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">{study.result}</span>
                </div>
                <div className="flex items-center gap-2 text-[#A1A1AA]">
                  <BarChart className="w-4 h-4" />
                  <span className="text-sm">{study.views}</span>
                </div>
                <div className="flex items-center gap-2 text-[#A1A1AA]">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{study.inquiries}</span>
                </div>
              </div>
              <Link
                to="/case-study"
                className="inline-flex items-center gap-2 text-[#F97316] hover:text-[#F97316]/80 transition-colors text-sm"
              >
                View Full Case Study
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Marketing Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-12">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-8 text-center">
            Your Marketing{' '}
            <span className="font-medium">Timeline</span>
          </h2>
          
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { day: 'Day 1-3', phase: 'Preparation', tasks: ['Photography', 'Staging', 'Materials'] },
              { day: 'Day 4-7', phase: 'Launch', tasks: ['Platform listing', 'Email blast', 'Social media'] },
              { day: 'Day 8-14', phase: 'Promotion', tasks: ['Open houses', 'Broker events', 'Advertising'] },
              { day: 'Day 15+', phase: 'Optimization', tasks: ['Performance tracking', 'Strategy adjustment', 'Feedback'] }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-white text-sm font-light mb-2">{item.day}</div>
                <div className="text-white text-xl font-medium mb-4">{item.phase}</div>
                <ul className="space-y-2">
                  {item.tasks.map((task, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-white/80 text-sm">
                      <CheckCircle className="w-3 h-3 text-white" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketing Guide Download */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-12 text-center">
          <BookOpen className="w-16 h-16 text-[#F97316] mx-auto mb-6" />
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-4">
            Download Our Complete{' '}
            <span className="text-[#F97316] font-medium">Marketing Guide</span>
          </h2>
          <p className="text-[#A1A1AA] text-xl mb-8 max-w-2xl mx-auto">
            Get an in-depth look at our marketing strategies, pricing, and success metrics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="inline-flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-full hover:bg-[#EA580C] transition-colors">
              <Download className="w-5 h-5" />
              Download Free Guide
            </button>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#0A0A0A] border border-[#27272A] text-white px-8 py-4 rounded-full hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-colors"
            >
              <Mail className="w-5 h-5" />
              Request Custom Plan
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Ready to Market Your{' '}
            <span className="font-medium">Property?</span>
          </h2>
          <p className="text-white/90 text-xl mb-8 max-w-2xl mx-auto">
            Let's create a customized marketing plan that showcases your property to the world.
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

export default Marketing;
