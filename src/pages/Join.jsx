import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Heart, Target, Globe, ArrowRight, 
  CheckCircle, Star, Award, Zap, Sparkles,
  Phone, Mail, Calendar, BookOpen, Compass,
  TrendingUp, Shield, Briefcase, Handshake,
  Lightbulb, Rocket, Crown, Gem, Diamond
} from 'lucide-react';

function Join() {
  const [activeTab, setActiveTab] = useState('clients');

  const membershipTiers = [
    {
      name: 'Palm Circle',
      description: 'For discerning clients seeking exceptional properties',
      benefits: [
        'Access to all property listings',
        'Dedicated client advisor',
        'Priority showing scheduling',
        'Market insights newsletter',
        'Invitations to open houses'
      ],
      icon: <Heart className="w-6 h-6" />,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Palm Elite',
      description: 'For high-net-worth individuals requiring white-glove service',
      benefits: [
        'Everything in Palm Circle',
        '24/7 concierge access',
        'Off-market property previews',
        'Investment portfolio review',
        'Private event invitations',
        'Travel and lifestyle coordination'
      ],
      icon: <Crown className="w-6 h-6" />,
      color: 'from-[#F97316] to-[#EA580C]',
      featured: true
    },
    {
      name: 'Palm Legacy',
      description: 'For families and institutions building generational wealth',
      benefits: [
        'Everything in Palm Elite',
        'Multi-generational planning',
        'Estate and trust coordination',
        'Private family office services',
        'International portfolio management',
        'Legacy property curation',
        'Exclusive investment opportunities'
      ],
      icon: <Diamond className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const partnerTiers = [
    {
      name: 'Affiliate Partner',
      description: 'For industry professionals seeking collaboration',
      benefits: [
        'Referral network access',
        'Co-marketing opportunities',
        'Industry event invitations',
        'Digital marketing tools',
        'Quarterly strategy sessions'
      ],
      icon: <Handshake className="w-6 h-6" />
    },
    {
      name: 'Strategic Partner',
      description: 'For established firms seeking deeper integration',
      benefits: [
        'Everything in Affiliate',
        'Joint venture opportunities',
        'Exclusive client events',
        'Brand collaboration',
        'Dedicated relationship manager',
        'Custom marketing campaigns'
      ],
      icon: <Award className="w-6 h-6" />
    },
    {
      name: 'Global Alliance',
      description: 'For international partners expanding reach',
      benefits: [
        'Everything in Strategic',
        'Cross-border referrals',
        'International marketing',
        'Global client events',
        'Preferred vendor status',
        'Equity partnership opportunities'
      ],
      icon: <Globe className="w-6 h-6" />
    }
  ];

  const benefits = [
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Exclusive Access',
      description: 'Off-market properties and VIP experiences'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Elite Network',
      description: 'Connect with like-minded individuals and industry leaders'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Market Intelligence',
      description: 'Data-driven insights and investment opportunities'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'White-Glove Service',
      description: 'Dedicated support for every need'
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: 'Portfolio Growth',
      description: 'Strategic guidance for wealth building'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Curated Experiences',
      description: 'Exclusive events and lifestyle opportunities'
    }
  ];

  const movementPrinciples = [
    {
      title: 'Innovation First',
      description: 'We constantly evolve, embracing new technologies and approaches to serve our clients better.',
      icon: <Lightbulb className="w-6 h-6" />
    },
    {
      title: 'Community Impact',
      description: 'We believe in giving back, supporting local communities and industry education.',
      icon: <Heart className="w-6 h-6" />
    },
    {
      title: 'Global Perspective',
      description: 'We think beyond borders, connecting clients with opportunities worldwide.',
      icon: <Globe className="w-6 h-6" />
    },
    {
      title: 'Legacy Building',
      description: 'We help create lasting value that transcends generations.',
      icon: <Gem className="w-6 h-6" />
    }
  ];

  const events = [
    {
      name: 'Palm Summit',
      date: 'June 15-17, 2026',
      location: 'Miami, FL',
      description: 'Annual gathering of industry leaders and top clients',
      attendees: '200+ invite-only'
    },
    {
      name: 'Luxury Retreat',
      date: 'September 8-12, 2026',
      location: 'Lake Como, Italy',
      description: 'Exclusive networking and lifestyle experience',
      attendees: '50 guests'
    },
    {
      name: 'Investment Forum',
      date: 'November 5-6, 2026',
      location: 'New York, NY',
      description: 'Deep dive into market trends and opportunities',
      attendees: '100+ investors'
    }
  ];

  const testimonials = [
    {
      quote: "Joining the Palms Movement transformed how I approach real estate investment. The network and insights are invaluable.",
      author: "Jonathan Chen",
      role: "Palm Elite Member",
      years: "Member since 2022"
    },
    {
      quote: "As a strategic partner, the collaboration has opened doors we never knew existed. Truly a game-changer for our firm.",
      author: "Sarah Williams",
      role: "Strategic Partner",
      years: "Partner since 2021"
    },
    {
      quote: "The legacy planning and family office services have given us peace of mind for generations to come.",
      author: "The Richardson Family",
      role: "Palm Legacy Members",
      years: "Members since 2020"
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
              <Users className="w-5 h-5 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                JOIN THE MOVEMENT
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6">
              Become Part of{' '}
              <span className="text-[#F97316] font-medium">Something Greater</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#A1A1AA] mb-8 leading-relaxed">
              The Palms Movement is more than a network – it's a community of forward-thinking 
              individuals and organizations shaping the future of luxury real estate.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-xl hover:bg-[#EA580C] transition-all duration-300"
              >
                <Sparkles className="w-5 h-5" />
                Apply for Membership
              </Link>
              <button
                onClick={() => setActiveTab('partners')}
                className="inline-flex items-center justify-center gap-2 bg-[#18181B] border border-[#27272A] text-white px-8 py-4 rounded-xl hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-all duration-300"
              >
                <Handshake className="w-5 h-5" />
                Partner With Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Movement Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Rocket className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              OUR PRINCIPLES
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            What We{' '}
            <span className="text-[#F97316] font-medium">Stand For</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {movementPrinciples.map((principle, index) => (
            <div
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316]/30 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-[#F97316]/10 rounded-xl flex items-center justify-center mb-6">
                <div className="text-[#F97316]">{principle.icon}</div>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">{principle.title}</h3>
              <p className="text-[#A1A1AA] leading-relaxed">{principle.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Membership Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-8 py-4 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'clients'
                ? 'bg-[#F97316] text-white'
                : 'bg-[#18181B] text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/10'
            }`}
          >
            For Clients
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-8 py-4 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'partners'
                ? 'bg-[#F97316] text-white'
                : 'bg-[#18181B] text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/10'
            }`}
          >
            For Partners
          </button>
        </div>

        {activeTab === 'clients' && (
          <div className="grid md:grid-cols-3 gap-6">
            {membershipTiers.map((tier, index) => (
              <div
                key={index}
                className={`relative bg-[#18181B] border ${tier.featured ? 'border-[#F97316]' : 'border-[#27272A]'} rounded-3xl p-8 hover:border-[#F97316] transition-all duration-300 hover:-translate-y-2`}
              >
                {tier.featured && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white px-6 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <div className={`w-14 h-14 bg-gradient-to-br ${tier.color} bg-opacity-10 rounded-xl flex items-center justify-center mb-6`}>
                  <div className="text-white">{tier.icon}</div>
                </div>
                <h3 className="text-2xl font-light text-white mb-2">{tier.name}</h3>
                <p className="text-[#A1A1AA] text-sm mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-8">
                  {tier.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#F97316] flex-shrink-0 mt-0.5" />
                      <span className="text-[#A1A1AA] text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-[#F97316] hover:text-[#F97316]/80 transition-colors"
                >
                  Inquire About Membership
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'partners' && (
          <div className="grid md:grid-cols-3 gap-6">
            {partnerTiers.map((tier, index) => (
              <div
                key={index}
                className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316] transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-[#F97316]/10 rounded-xl flex items-center justify-center mb-6">
                  <div className="text-[#F97316]">{tier.icon}</div>
                </div>
                <h3 className="text-2xl font-light text-white mb-2">{tier.name}</h3>
                <p className="text-[#A1A1AA] text-sm mb-6">{tier.description}</p>
                <ul className="space-y-3 mb-8">
                  {tier.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#F97316] flex-shrink-0 mt-0.5" />
                      <span className="text-[#A1A1AA] text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 text-[#F97316] hover:text-[#F97316]/80 transition-colors"
                >
                  Explore Partnership
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Benefits Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Award className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              MEMBER BENEFITS
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            A World of{' '}
            <span className="text-[#F97316] font-medium">Advantages</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316]/30 transition-all duration-300"
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

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-12">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-4">
              Exclusive{' '}
              <span className="font-medium">Events</span>
            </h2>
            <p className="text-white/90 text-xl max-w-2xl mx-auto">
              Members gain access to private gatherings, industry summits, and lifestyle experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="text-white text-lg font-medium mb-2">{event.name}</div>
                <div className="text-white/80 text-sm mb-3">{event.date}</div>
                <div className="text-white/80 text-sm mb-4">{event.location}</div>
                <p className="text-white/70 text-sm mb-4">{event.description}</p>
                <div className="flex items-center gap-2 text-white/60 text-xs">
                  <Users className="w-3 h-3" />
                  {event.attendees}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full hover:bg-[#0A0A0A] transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Request Event Access
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F97316] text-[#F97316]" />
                ))}
              </div>
              <p className="text-[#E4E4E7] italic mb-6">"{testimonial.quote}"</p>
              <div className="border-t border-[#27272A] pt-4">
                <div className="text-white font-medium">{testimonial.author}</div>
                <div className="text-[#A1A1AA] text-sm">{testimonial.role}</div>
                <div className="text-[#F97316] text-xs mt-1">{testimonial.years}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Join CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Ready to{' '}
            <span className="text-[#F97316] font-medium">Join Us?</span>
          </h2>
          <p className="text-[#A1A1AA] text-xl mb-8 max-w-2xl mx-auto">
            Whether you're a discerning client seeking exceptional properties or an industry 
            professional looking to collaborate, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-full hover:bg-[#EA580C] transition-colors"
            >
              <Users className="w-5 h-5" />
              Apply for Membership
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#0A0A0A] border border-[#27272A] text-white px-8 py-4 rounded-full hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-colors"
            >
              <Handshake className="w-5 h-5" />
              Explore Partnership
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-[#A1A1AA]">
              <CheckCircle className="w-4 h-4 text-[#F97316]" />
              No joining fee
            </div>
            <div className="flex items-center gap-2 text-[#A1A1AA]">
              <CheckCircle className="w-4 h-4 text-[#F97316]" />
              Flexible terms
            </div>
            <div className="flex items-center gap-2 text-[#A1A1AA]">
              <CheckCircle className="w-4 h-4 text-[#F97316]" />
              Global community
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Join;
