import { 
  Award, Shield, Users, Globe, Star, TrendingUp, 
  Heart, Home, Lock, CheckCircle, Quote, Target
} from 'lucide-react';

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
      icon: <Shield />,
      title: 'Absolute Discretion',
      description: 'We protect our clients\' privacy with the highest level of confidentiality and NDAs.',
      color: 'from-blue-100 to-blue-50'
    },
    {
      icon: <Star />,
      title: 'Uncompromising Quality',
      description: 'Every property in our portfolio is personally vetted by our executive team.',
      color: 'from-amber-100 to-orange-50'
    },
    {
      icon: <TrendingUp />,
      title: 'Market Excellence',
      description: 'We maintain an edge through continuous market analysis and trend forecasting.',
      color: 'from-emerald-100 to-green-50'
    },
    {
      icon: <Heart />,
      title: 'Client-Centric Service',
      description: 'Tailored experiences designed around each client\'s unique lifestyle and preferences.',
      color: 'from-rose-100 to-pink-50'
    },
    {
      icon: <Globe />,
      title: 'Global Network',
      description: 'Access to exclusive properties through our worldwide network of partners.',
      color: 'from-purple-100 to-violet-50'
    },
    {
      icon: <Lock />,
      title: 'Secure Transactions',
      description: 'End-to-end encrypted processes with legal teams ensuring smooth transactions.',
      color: 'from-cyan-100 to-teal-50'
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50/50 pt-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background with gradient overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/70 via-purple-900/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 md:py-48">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-16 max-w-4xl mx-auto shadow-2xl">
            <div className="text-center mb-8">
              <div className="inline-block backdrop-blur-lg bg-white/20 text-white px-6 py-3 rounded-full text-sm tracking-widest font-sans font-light border border-white/30 mb-6">
                ✦ ESTABLISHED 2010 ✦
              </div>
              <h1 className="font-serif text-4xl md:text-7xl lg:text-8xl font-bold text-white mb-6">
                Palms <span className="text-amber-300">Estate</span>
              </h1>
              <div className="h-2 w-48 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto mb-8 rounded-full"></div>
              <p className="font-sans text-2xl md:text-3xl lg:text-4xl text-white/95 font-light leading-relaxed">
                Curating the World's Most <span className="font-bold text-amber-300">Extraordinary</span> Living Experiences
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-8 md:p-12 shadow-xl">
              <div className="inline-block backdrop-blur-sm bg-amber-50 border border-amber-200/50 rounded-2xl px-6 py-3 mb-6">
                <span className="font-sans text-amber-700 font-semibold tracking-widest text-sm uppercase">
                  OUR STORY
                </span>
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Redefining Luxury Living Since 2010
              </h2>
              <div className="space-y-4 font-sans text-gray-700 leading-relaxed">
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
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
                  <div className="font-serif text-3xl font-bold text-amber-700 mb-1">14+</div>
                  <div className="font-sans text-sm text-gray-600">Years Excellence</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
                  <div className="font-serif text-3xl font-bold text-amber-700 mb-1">200+</div>
                  <div className="font-sans text-sm text-gray-600">Exclusive Properties</div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl">
                  <div className="font-serif text-3xl font-bold text-amber-700 mb-1">50+</div>
                  <div className="font-sans text-sm text-gray-600">Countries Served</div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow group"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-600 to-orange-500 rounded-xl flex items-center justify-center">
                      <span className="font-serif text-xl font-bold text-white">{milestone.year}</span>
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                        {milestone.title}
                      </h3>
                      <p className="font-sans text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-white to-gray-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block backdrop-blur-md bg-white/60 border border-gray-200/50 rounded-2xl px-8 py-4 mb-6">
              <span className="font-sans text-amber-600 font-semibold tracking-widest text-sm md:text-base uppercase">
                OUR VALUES
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              The Pillars of Our <span className="text-amber-600">Excellence</span>
            </h2>
            <p className="font-sans text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide every decision we make and every experience we create.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 ${value.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <div className="text-amber-600">
                    {value.icon}
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="font-sans text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block backdrop-blur-md bg-white/60 border border-gray-200/50 rounded-2xl px-8 py-4 mb-6">
              <span className="font-sans text-amber-600 font-semibold tracking-widest text-sm md:text-base uppercase">
                OUR TEAM
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Meet Our <span className="text-amber-600">Luxury Advisors</span>
            </h2>
            <p className="font-sans text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              A collective of industry experts dedicated to delivering unparalleled service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <div className="p-6">
                  <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <div className="font-sans text-amber-600 font-medium mb-4">{member.title}</div>
                  
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-gray-600 font-sans text-sm mb-2">
                      <Target className="w-4 h-4 text-amber-500" />
                      <span className="font-semibold">{member.experience}</span>
                    </div>
                    <div className="space-y-1">
                      {member.specialties.map((specialty, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                          <span className="font-sans text-sm text-gray-600">{specialty}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <p className="font-sans text-gray-600 text-sm italic border-t border-gray-200 pt-4">
                    "{member.bio}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block backdrop-blur-md bg-white/60 border border-amber-200/50 rounded-2xl px-8 py-4 mb-6">
              <span className="font-sans text-amber-700 font-semibold tracking-widest text-sm md:text-base uppercase">
                CLIENT TESTIMONIALS
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Trusted by <span className="text-amber-700">Discerning Clients</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="backdrop-blur-md bg-white/90 border border-amber-200/50 rounded-3xl p-8 shadow-xl"
              >
                <div className="mb-6">
                  <Quote className="w-12 h-12 text-amber-200" />
                </div>
                <p className="font-serif text-lg text-gray-800 italic mb-8 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-amber-100 pt-6">
                  <div className="font-serif text-xl font-bold text-gray-900">{testimonial.author}</div>
                  <div className="font-sans text-amber-700">{testimonial.role}</div>
                  <div className="font-sans text-gray-600 text-sm">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Accreditation */}
          <div className="mt-16 text-center">
            <div className="inline-block backdrop-blur-md bg-white/80 border border-gray-200/50 rounded-3xl px-8 py-6 shadow-lg">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">Accreditation & Awards</h3>
              <div className="flex flex-wrap justify-center items-center gap-8">
                <div className="text-center">
                  <Award className="w-12 h-12 text-amber-600 mx-auto mb-2" />
                  <div className="font-sans font-bold text-gray-900">Forbes Global Properties</div>
                </div>
                <div className="text-center">
                  <Star className="w-12 h-12 text-amber-600 mx-auto mb-2" />
                  <div className="font-sans font-bold text-gray-900">Luxury Travel Awards 2024</div>
                </div>
                <div className="text-center">
                  <CheckCircle className="w-12 h-12 text-amber-600 mx-auto mb-2" />
                  <div className="font-sans font-bold text-gray-900">International Luxury Association</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="backdrop-blur-xl bg-gradient-to-r from-amber-600/95 via-orange-500/95 to-amber-600/95 rounded-3xl p-8 md:p-16 text-center shadow-2xl">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Begin Your <span className="text-amber-200">Extraordinary Journey</span>
            </h2>
            <p className="font-sans text-xl text-white/95 mb-8 max-w-2xl mx-auto leading-relaxed">
              Experience the Palms Estate difference. Let us transform how you live, travel, and invest.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/contact" 
                className="bg-white text-amber-700 px-8 py-4 rounded-full font-sans font-bold hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
              >
                Connect With Our Team
              </a>
              <a 
                href="/properties" 
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-sans font-bold hover:bg-white/10 transition-colors"
              >
                Explore Properties
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;