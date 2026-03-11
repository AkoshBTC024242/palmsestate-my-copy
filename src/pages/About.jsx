import { 
  Award, Shield, Users, Globe, Star, TrendingUp, 
  Heart, Home, Lock, CheckCircle, Quote, Target,
  MapPin, Calendar, Briefcase, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

function About() {
  const teamMembers = [
    {
      name: 'Eleanor Sterling',
      title: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      experience: '15+ years in luxury real estate',
      specialties: ['Private Island Estates', 'Celebrity Clients', 'Yacht Docks'],
      bio: 'Former international hotelier turned luxury property curator.'
    },
    {
      name: 'Marcus Chen',
      title: 'Head of Global Acquisitions',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      experience: '12+ years in property investment',
      specialties: ['Market Analysis', 'Portfolio Strategy', 'International Law'],
      bio: 'MBA from Wharton with expertise in luxury market trends.'
    },
    {
      name: 'Isabella Rossi',
      title: 'Creative Director & Stylist',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      experience: '10+ years in luxury interior design',
      specialties: ['Architectural Styling', 'Art Curation', 'Feng Shui'],
      bio: 'Former Vogue Living editor with an eye for extraordinary spaces.'
    },
    {
      name: 'James Kensington',
      title: 'Concierge Director',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
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
      quote: "Palms Estate transformed how we experience luxury travel. Their attention to detail is unparalleled.",
      author: "Alexander Sterling",
      role: "Tech Entrepreneur",
      location: "Silicon Valley"
    },
    {
      quote: "From private islands to penthouses, they consistently deliver beyond expectations.",
      author: "Sophia Chen",
      role: "Art Collector",
      location: "Hong Kong"
    },
    {
      quote: "The discretion and professionalism are exactly what we need for our family's properties.",
      author: "The Al-Farsi Family",
      role: "International Investors",
      location: "Dubai"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Hero Section - Seamlessly joined with header (no pt-24) */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
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
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-black/40 backdrop-blur-xl border border-[#F97316]/20 rounded-3xl p-8 md:p-16 max-w-4xl mx-auto shadow-2xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 px-6 py-3 rounded-full text-sm tracking-widest font-sans font-light text-[#F97316] mb-6">
                <Sparkles className="w-4 h-4" />
                <span>ESTABLISHED 2010</span>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6">
                Palms <span className="text-[#F97316] font-medium">Estate</span>
              </h1>
              <div className="h-0.5 w-24 bg-[#F97316] mx-auto mb-8"></div>
              <p className="font-sans text-xl md:text-2xl lg:text-3xl text-[#A1A1AA] font-light leading-relaxed">
                Curating the World's Most{' '}
                <span className="text-[#F97316] font-medium">Extraordinary</span>{' '}
                Living Experiences
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-[#A1A1AA] tracking-widest">DISCOVER</span>
            <div className="w-5 h-9 border-2 border-[#27272A] rounded-full flex justify-center">
              <div className="w-1 h-2 bg-[#F97316] rounded-full mt-2 animate-scroll"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24 bg-[#0A0A0A]">
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
                Redefining Luxury Living{' '}
                <span className="text-[#F97316]">Since 2010</span>
              </h2>
              <div className="space-y-4 font-sans text-[#A1A1AA] leading-relaxed">
                <p>
                  Founded in the heart of Miami's luxury district, Palms Estate began with a simple vision: 
                  to create exceptional living experiences that transcend ordinary luxury.
                </p>
                <p>
                  What started as a boutique agency with five exclusive properties has evolved into 
                  a global network of extraordinary residences, each meticulously selected for architectural 
                  brilliance, unparalleled privacy, and transformative living experiences.
                </p>
                <p>
                  Today, we stand as trusted advisors to discerning individuals, families, and corporations 
                  seeking not just properties, but destinations that inspire and elevate.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-[#0A0A0A] border border-[#27272A] rounded-2xl">
                  <div className="font-serif text-3xl font-light text-[#F97316] mb-1">14+</div>
                  <div className="font-sans text-xs text-[#A1A1AA]">Years Excellence</div>
                </div>
                <div className="text-center p-4 bg-[#0A0A0A] border border-[#27272A] rounded-2xl">
                  <div className="font-serif text-3xl font-light text-[#F97316] mb-1">200+</div>
                  <div className="font-sans text-xs text-[#A1A1AA]">Exclusive Properties</div>
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
              The Pillars of Our{' '}
              <span className="text-[#F97316] font-medium">Excellence</span>
            </h2>
            <p className="font-sans text-lg md:text-xl text-[#A1A1AA] max-w-3xl mx-auto">
              These principles guide every decision we make and every experience we create.
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
              <span className="text-[#F97316] font-medium">Luxury Advisors</span>
            </h2>
            <p className="font-sans text-lg md:text-xl text-[#A1A1AA] max-w-3xl mx-auto">
              A collective of industry experts dedicated to delivering unparalleled service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="bg-[#18181B] border border-[#27272A] rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
              <span className="text-[#F97316] font-medium">Discerning Clients</span>
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
              Begin Your{' '}
              <span className="text-white/90 font-medium">Extraordinary Journey</span>
            </h2>
            <p className="font-sans text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience the Palms Estate difference. Let us transform how you live, travel, and invest.
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
          </div>
        </div>
      </section>

      {/* Custom Animations */}
      <style>{`
        @keyframes scroll {
          0%, 100% { transform: translateY(0); opacity: 0.5; }
          50% { transform: translateY(10px); opacity: 1; }
        }
        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default About;
