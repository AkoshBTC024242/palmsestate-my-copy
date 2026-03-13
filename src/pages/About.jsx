import { 
  Award, Shield, Users, Globe, Star, TrendingUp, 
  Heart, Home, Lock, CheckCircle, Quote, Target,
  MapPin, Calendar, Briefcase, Sparkles, Building2,
  Key, Phone, Mail, Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

function About() {
  const teamMembers = [
    {
      name: 'Michael Hamlin',
      title: 'CEO & Founder',
      image: 'https://i.ibb.co/xKD2fNZs/image-44.jpg',
      experience: '25+ years in real estate brokerage',
      specialties: ['Strategic Vision', 'Market Leadership', 'Investment Strategy'],
      bio: 'Higher education in broker and real estate with decades of industry leadership.'
    },
    {
      name: 'Kathie Florini',
      title: 'Chief Marketing Officer (CMO)',
      image: 'https://i.ibb.co/2Yctrzy7/image-32.jpg',
      experience: '20+ years in real estate marketing',
      specialties: ['Brand Strategy', 'Digital Marketing', 'Client Acquisition'],
      bio: 'Visionary marketing leader with a track record of building luxury brands.'
    },
    {
      name: 'Eleanor Sterling',
      title: 'Co-Founder & Chief Accounting Officer',
      image: 'https://i.ibb.co/Qj74Wv2S/file-000000007318722f83c6d7e5b794cae2.png',
      experience: '15+ years in luxury real estate',
      specialties: ['Financial Strategy', 'Portfolio Management', 'Risk Assessment'],
      bio: 'Former international hotelier turned luxury property curator.'
    },
    {
      name: 'Marcus Chen',
      title: 'Head of Global Acquisitions',
      image: 'https://i.ibb.co/tTTpY8cB/image-45.jpg',
      experience: '12+ years in property investment',
      specialties: ['Market Analysis', 'Portfolio Strategy', 'International Law'],
      bio: 'MBA from Wharton with expertise in luxury market trends.'
    },
    {
      name: 'Isabella Rossi',
      title: 'Creative Director & Stylist',
      image: 'https://i.ibb.co/R4DkySyf/image-39.jpg',
      experience: '10+ years in luxury interior design',
      specialties: ['Architectural Styling', 'Art Curation', 'Feng Shui'],
      bio: 'Former Vogue Living editor with an eye for extraordinary spaces.'
    },
    {
      name: 'James Kensington',
      title: 'Concierge Director',
      image: 'https://i.ibb.co/CsXHy5yV/image-30.jpg',
      experience: '8+ years in premium hospitality',
      specialties: ['VIP Experiences', 'Event Planning', 'Security Protocols'],
      bio: 'Former five-star hotel manager with global connections.'
    }
  ];

  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Absolute Discretion',
      description: 'We protect our clients\' privacy with the highest level of confidentiality and NDAs.',
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Uncompromising Quality',
      description: 'Every property in our portfolio is personally vetted by our executive team.',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Market Excellence',
      description: 'We maintain an edge through continuous market analysis and trend forecasting.',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Client-Centric Service',
      description: 'Tailored experiences designed around each client\'s unique lifestyle and preferences.',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Network',
      description: 'Access to exclusive properties through our worldwide network of partners.',
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Secure Transactions',
      description: 'End-to-end encrypted processes with legal teams ensuring smooth transactions.',
    }
  ];

  const milestones = [
    { year: '2010', title: 'Founded in Miami', description: 'Started with 5 luxury properties' },
    { year: '2013', title: 'European Expansion', description: 'Opened London and Paris offices' },
    { year: '2016', title: 'Forbes Recognition', description: 'Featured in Forbes Luxury Collection' },
    { year: '2019', title: 'Global Network', description: '50+ countries, 200+ exclusive properties' },
    { year: '2022', title: 'Digital Innovation', description: 'Launched VR property tours' },
    { year: '2024', title: 'Award Winner', description: 'Luxury Travel Awards 2024' }
  ];

  const testimonials = [
    {
      quote: "Palms Estate transformed how we experience luxury real estate. Their attention to detail and market expertise is unparalleled.",
      author: "Alexander Sterling",
      role: "Tech Entrepreneur",
      location: "Silicon Valley"
    },
    {
      quote: "From investment properties to our primary residence, they consistently deliver beyond expectations with professionalism.",
      author: "Sophia Chen",
      role: "Art Collector",
      location: "Hong Kong"
    },
    {
      quote: "The discretion and professionalism are exactly what we need for our family's multi-million dollar portfolio.",
      author: "The Al-Farsi Family",
      role: "International Investors",
      location: "Dubai"
    }
  ];

  const services = [
    {
      icon: <Building2 className="w-6 h-6" />,
      title: 'Luxury Sales',
      description: 'Expert representation for buying and selling premium properties.'
    },
    {
      icon: <Key className="w-6 h-6" />,
      title: 'Premium Rentals',
      description: 'Exclusive access to the finest rental properties worldwide.'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Investment Advisory',
      description: 'Strategic guidance for real estate portfolio growth.'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Relocation',
      description: 'Seamless transitions for international clients.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section - Removed pt-24 to eliminate gap */}
      <section className="relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-[#F97316]/5"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48">
          <div className="bg-black/40 backdrop-blur-xl border border-[#F97316]/20 rounded-3xl p-8 md:p-16 max-w-4xl mx-auto shadow-2xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 px-6 py-3 rounded-full text-sm tracking-widest font-sans font-light text-[#F97316] mb-6">
                <Sparkles className="w-4 h-4" />
                <span>PREMIER REAL ESTATE SINCE 2010</span>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6">
                Palms <span className="text-[#F97316] font-medium">Estate</span>
              </h1>
              <div className="h-0.5 w-24 bg-[#F97316] mx-auto mb-8"></div>
              <p className="font-sans text-xl md:text-2xl lg:text-3xl text-[#A1A1AA] font-light leading-relaxed">
                Where{' '}
                <span className="text-[#F97316] font-medium">Luxury Living</span>{' '}
                Meets Uncompromising Service
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Bar - Quick overview of services */}
      <div className="bg-[#18181B] border-y border-[#27272A] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {services.map((service, index) => (
              <div key={index} className="flex items-center gap-2 text-[#A1A1AA] hover:text-[#F97316] transition-colors">
                <span className="text-[#F97316]">{service.icon}</span>
                <span className="text-sm font-light">{service.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 md:p-12 shadow-xl">
              <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-6 py-3 mb-6">
                <Briefcase className="w-4 h-4 text-[#F97316]" />
                <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                  OUR STORY
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-6">
                Redefining{' '}
                <span className="text-[#F97316]">Luxury Real Estate</span>
              </h2>
              <div className="space-y-4 font-sans text-[#A1A1AA] leading-relaxed">
                <p>
                  Founded in 2010, Palms Estate emerged from a vision to transform how discerning clients 
                  experience luxury real estate. What began as a boutique agency in Miami has grown into 
                  a trusted name in premium property sales, rentals, and investment advisory.
                </p>
                <p>
                  Today, we serve an international clientele of entrepreneurs, investors, and families 
                  seeking exceptional properties and white-glove service. Our team combines deep market 
                  expertise with a commitment to absolute discretion and personalized attention.
                </p>
                <p>
                  Whether you're buying your dream home, selling a prized asset, or building a portfolio, 
                  Palms Estate delivers unparalleled results through integrity, innovation, and dedication 
                  to your success.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-[#0A0A0A] border border-[#27272A] rounded-2xl">
                  <div className="font-serif text-3xl font-light text-[#F97316] mb-1">$2B+</div>
                  <div className="font-sans text-xs text-[#A1A1AA]">In Sales</div>
                </div>
                <div className="text-center p-4 bg-[#0A0A0A] border border-[#27272A] rounded-2xl">
                  <div className="font-serif text-3xl font-light text-[#F97316] mb-1">500+</div>
                  <div className="font-sans text-xs text-[#A1A1AA]">Properties Sold</div>
                </div>
                <div className="text-center p-4 bg-[#0A0A0A] border border-[#27272A] rounded-2xl">
                  <div className="font-serif text-3xl font-light text-[#F97316] mb-1">50+</div>
                  <div className="font-sans text-xs text-[#A1A1AA]">Countries Served</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-[#F97316]/30 group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-xl flex items-center justify-center">
                      <span className="font-serif text-xl font-light text-white">{milestone.year}</span>
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-light text-white mb-2 group-hover:text-[#F97316] transition-colors">
                        {milestone.title}
                      </h3>
                      <p className="font-sans text-[#A1A1AA] text-sm">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-[#0A0A0A] border-t border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
              <Shield className="w-5 h-5 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm md:text-base uppercase">
                OUR VALUES
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
              The Principles That{' '}
              <span className="text-[#F97316] font-medium">Define Us</span>
            </h2>
            <p className="font-sans text-lg md:text-xl text-[#A1A1AA] max-w-3xl mx-auto">
              Every decision we make is guided by these core beliefs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-[#F97316]/30 group"
              >
                <div className="w-16 h-16 bg-[#F97316]/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#F97316]/20 transition-colors">
                  <div className="text-[#F97316]">
                    {value.icon}
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-light text-white mb-4">{value.title}</h3>
                <p className="font-sans text-[#A1A1AA] leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
              <Users className="w-5 h-5 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm md:text-base uppercase">
                OUR TEAM
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
              Meet Our{' '}
              <span className="text-[#F97316] font-medium">Leadership</span>
            </h2>
            <p className="font-sans text-lg md:text-xl text-[#A1A1AA] max-w-3xl mx-auto">
              Seasoned professionals dedicated to your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-[#18181B] border border-[#27272A] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:border-[#F97316]/30 group"
              >
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-serif text-xl font-light text-white mb-1">{member.name}</h3>
                  <div className="font-sans text-[#F97316] font-medium mb-4">{member.title}</div>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-[#A1A1AA] font-sans text-sm mb-2">
                      <Target className="w-4 h-4 text-[#F97316]" />
                      <span className="font-medium text-white">{member.experience}</span>
                    </div>
                    <div className="space-y-1">
                      {member.specialties.map((specialty, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#F97316]"></div>
                          <span className="font-sans text-sm text-[#A1A1AA]">{specialty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <p className="font-sans text-[#A1A1AA] text-sm italic border-t border-[#27272A] pt-4">
                    "{member.bio}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-[#0A0A0A] border-t border-[#27272A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
              <Quote className="w-5 h-5 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm md:text-base uppercase">
                CLIENT TESTIMONIALS
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
              Trusted by{' '}
              <span className="text-[#F97316] font-medium">Industry Leaders</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-[#F97316]/30"
              >
                <div className="mb-6">
                  <Quote className="w-12 h-12 text-[#F97316]/20" />
                </div>
                <p className="font-serif text-lg text-[#E4E4E7] italic mb-8 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-[#27272A] pt-6">
                  <div className="font-serif text-xl font-light text-white">{testimonial.author}</div>
                  <div className="font-sans text-[#F97316] text-sm mt-1">{testimonial.role}</div>
                  <div className="flex items-center gap-1 mt-2">
                    <MapPin className="w-3 h-3 text-[#A1A1AA]" />
                    <span className="font-sans text-[#A1A1AA] text-xs">{testimonial.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Accreditation */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-[#18181B] border border-[#27272A] rounded-3xl px-8 py-6 shadow-lg">
              <h3 className="font-serif text-2xl font-light text-white mb-6">Accreditation & Awards</h3>
              <div className="flex flex-wrap justify-center items-center gap-8">
                <div className="text-center">
                  <Award className="w-10 h-10 text-[#F97316] mx-auto mb-2" />
                  <div className="font-sans text-sm text-white">Forbes Global Properties</div>
                </div>
                <div className="w-px h-8 bg-[#27272A]"></div>
                <div className="text-center">
                  <Star className="w-10 h-10 text-[#F97316] mx-auto mb-2" />
                  <div className="font-sans text-sm text-white">Luxury Travel Awards 2024</div>
                </div>
                <div className="w-px h-8 bg-[#27272A]"></div>
                <div className="text-center">
                  <CheckCircle className="w-10 h-10 text-[#F97316] mx-auto mb-2" />
                  <div className="font-sans text-sm text-white">International Luxury Association</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-8 md:p-16 text-center shadow-2xl">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6">
              Experience the{' '}
              <span className="text-white/90 font-medium">Palms Estate Difference</span>
            </h2>
            <p className="font-sans text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Whether you're buying, selling, or renting, our team is ready to assist you with unparalleled expertise and discretion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/contact" 
                className="bg-black text-white px-8 py-4 rounded-full font-sans font-medium hover:bg-[#0A0A0A] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                Connect With Our Team
              </Link>
              <Link 
                to="/properties" 
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-sans font-medium hover:bg-white/10 transition-colors"
              >
                Explore Properties
              </Link>
            </div>

            {/* Contact Bar */}
            <div className="mt-8 pt-8 border-t border-white/20 flex flex-wrap justify-center gap-8">
              <div className="flex items-center gap-2 text-white/80">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+1 (828) 623-9765</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Mail className="w-4 h-4" />
                <span className="text-sm">concierge@palmsestate.org</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Clock className="w-4 h-4" />
                <span className="text-sm">24/7 Concierge</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
