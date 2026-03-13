import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Crown, Sparkles, Heart, Globe, Star, 
  ArrowRight, CheckCircle, Camera, Wine,
  Ship, Plane, Car, Utensils, Music,
  Users, Award, Calendar, Clock, Phone,
  Mail, MapPin, Gem, Diamond, Sun, Moon
} from 'lucide-react';

function Luxury() {
  const [activeExperience, setActiveExperience] = useState('residences');

  const experiences = {
    residences: {
      title: 'Luxury Residences',
      description: 'Extraordinary homes in the world\'s most desirable locations',
      items: [
        {
          name: 'Penthouse Living',
          location: 'New York, London, Dubai',
          features: ['Panoramic views', 'Private terraces', 'Concierge services', 'Smart home technology'],
          image: '🏙️'
        },
        {
          name: 'Waterfront Estates',
          location: 'Miami, French Riviera, Maldives',
          features: ['Private docks', 'Infinity pools', 'Beach access', 'Sunset views'],
          image: '🌊'
        },
        {
          name: 'Private Islands',
          location: 'Caribbean, Pacific, Mediterranean',
          features: ['Complete privacy', 'Staff quarters', 'Helipad', 'Generator backup'],
          image: '🏝️'
        },
        {
          name: 'Historic Estates',
          location: 'Europe, New England, Asia',
          features: ['Architectural heritage', 'Original details', 'Modern updates', 'Gardens'],
          image: '🏰'
        }
      ]
    },
    experiences: {
      title: 'Curated Experiences',
      description: 'Unforgettable moments crafted for discerning tastes',
      items: [
        {
          name: 'Private Aviation',
          description: 'Seamless travel on private jets',
          features: ['Global fleet access', 'Last-minute booking', 'Catering', 'Ground transport'],
          icon: <Plane className="w-5 h-5" />
        },
        {
          name: 'Yacht Charter',
          description: 'Luxury vessels in premier destinations',
          features: ['Crewed charters', 'Itinerary planning', 'Water toys', 'Gourmet dining'],
          icon: <Ship className="w-5 h-5" />
        },
        {
          name: 'Exclusive Dining',
          description: 'Culinary experiences at the world\'s best tables',
          features: ['Michelin-starred', 'Private chefs', 'Wine cellars', 'Cooking classes'],
          icon: <Utensils className="w-5 h-5" />
        },
        {
          name: 'Luxury Transportation',
          description: 'Premium vehicles with professional drivers',
          features: ['Maybach', 'Rolls-Royce', 'Bentley', 'Range Rover'],
          icon: <Car className="w-5 h-5" />
        }
      ]
    },
    events: {
      title: 'Extraordinary Events',
      description: 'Celebrations that become legendary',
      items: [
        {
          name: 'Private Galas',
          features: ['Venue selection', 'Catering', 'Entertainment', 'Guest management'],
          capacity: 'Up to 500 guests'
        },
        {
          name: 'Weddings',
          features: ['Destination venues', 'Planning', 'Photography', 'Accommodation'],
          capacity: 'Intimate to grand'
        },
        {
          name: 'Corporate Retreats',
          features: ['Team building', 'Meeting spaces', 'Wellness', 'Golf'],
          capacity: '10-100 executives'
        },
        {
          name: 'Art & Culture',
          features: ['Private viewings', 'Curator talks', 'Acquisition advice', 'Installation'],
          capacity: 'Exclusive access'
        }
      ]
    }
  };

  const destinations = [
    {
      city: 'Saint-Tropez',
      country: 'France',
      season: 'Summer',
      highlights: ['Yacht clubs', 'Beach clubs', 'Fine dining'],
      image: '🇫🇷'
    },
    {
      city: 'Aspen',
      country: 'USA',
      season: 'Winter',
      highlights: ['Ski-in/ski-out', 'Luxury lodges', 'Après-ski'],
      image: '⛷️'
    },
    {
      city: 'Dubai',
      country: 'UAE',
      season: 'Year-round',
      highlights: ['Ultra-luxury hotels', 'Shopping', 'Desert safaris'],
      image: '🏜️'
    },
    {
      city: 'Lake Como',
      country: 'Italy',
      season: 'Spring/Summer',
      highlights: ['Villas', 'Gardens', 'Boat tours'],
      image: '🏞️'
    }
  ];

  const partners = [
    { name: 'Four Seasons', category: 'Hospitality' },
    { name: 'Ritz-Carlton', category: 'Hospitality' },
    { name: 'Marbella Club', category: 'Resorts' },
    { name: 'Wally Yachts', category: 'Marine' },
    { name: 'Bombardier', category: 'Aviation' },
    { name: 'Rolls-Royce', category: 'Automotive' }
  ];

  const testimonials = [
    {
      quote: "The villa in St. Barths exceeded every expectation. Every detail was perfect.",
      author: "The Richardson Family",
      experience: "Private Island Villa",
      rating: 5
    },
    {
      quote: "Our anniversary celebration at the Michelin-starred dinner was unforgettable.",
      author: "James & Elizabeth Chen",
      experience: "Exclusive Dining",
      rating: 5
    },
    {
      quote: "The yacht charter in Croatia was the trip of a lifetime. Already planning next year.",
      author: "Michael Sterling",
      experience: "Yacht Charter",
      rating: 5
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
              <Crown className="w-5 h-5 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                LUXURY EXPERIENCES
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6">
              Beyond{' '}
              <span className="text-[#F97316] font-medium">Extraordinary</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#A1A1AA] mb-8 leading-relaxed">
              Experience life at its finest. From exceptional properties to curated experiences, 
              we open doors to a world of luxury that most only dream of.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-xl hover:bg-[#EA580C] transition-all duration-300"
              >
                <Sparkles className="w-5 h-5" />
                Begin Your Journey
              </Link>
              <button
                onClick={() => setActiveExperience('experiences')}
                className="inline-flex items-center justify-center gap-2 bg-[#18181B] border border-[#27272A] text-white px-8 py-4 rounded-xl hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-all duration-300"
              >
                <Globe className="w-5 h-5" />
                Explore Experiences
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.keys(experiences).map((key) => (
            <button
              key={key}
              onClick={() => setActiveExperience(key)}
              className={`px-8 py-4 rounded-xl font-medium transition-all duration-300 ${
                activeExperience === key
                  ? 'bg-[#F97316] text-white'
                  : 'bg-[#18181B] text-[#A1A1AA] hover:text-white hover:bg-[#F97316]/10'
              }`}
            >
              {experiences[key].title}
            </button>
          ))}
        </div>

        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-4">
            {experiences[activeExperience].title}
          </h2>
          <p className="text-xl text-[#A1A1AA] max-w-3xl mx-auto">
            {experiences[activeExperience].description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences[activeExperience].items.map((item, index) => (
            <div
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316]/30 transition-all duration-300 hover:-translate-y-1"
            >
              {item.image ? (
                <div className="text-5xl mb-6">{item.image}</div>
              ) : item.icon ? (
                <div className="w-14 h-14 bg-[#F97316]/10 rounded-xl flex items-center justify-center mb-6">
                  <div className="text-[#F97316]">{item.icon}</div>
                </div>
              ) : (
                <div className="w-14 h-14 bg-[#F97316]/10 rounded-xl flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6 text-[#F97316]" />
                </div>
              )}
              
              <h3 className="text-xl font-medium text-white mb-2">{item.name}</h3>
              
              {item.location && (
                <div className="flex items-center gap-2 text-[#A1A1AA] text-sm mb-4">
                  <MapPin className="w-4 h-4 text-[#F97316]" />
                  {item.location}
                </div>
              )}

              {item.description && (
                <p className="text-[#A1A1AA] text-sm mb-4">{item.description}</p>
              )}

              {item.capacity && (
                <div className="text-[#A1A1AA] text-sm mb-4">
                  <span className="text-[#F97316]">Capacity:</span> {item.capacity}
                </div>
              )}

              <ul className="space-y-2 mb-6">
                {item.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                    <CheckCircle className="w-4 h-4 text-[#F97316]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-[#F97316] hover:text-[#F97316]/80 transition-colors text-sm"
              >
                Inquire
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Signature Experiences */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-6 py-3 mb-6">
              <Diamond className="w-4 h-4 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-xs uppercase">
                SIGNATURE EXPERIENCES
              </span>
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
              Curated for the{' '}
              <span className="text-[#F97316] font-medium">Discerning Few</span>
            </h2>
            <p className="text-[#A1A1AA] text-lg mb-8 leading-relaxed">
              Every experience is meticulously planned and executed by our team of luxury lifestyle managers, 
              ensuring that every moment exceeds expectations.
            </p>
            <div className="space-y-4">
              {[
                'Personalized itinerary planning',
                'VIP access to exclusive events',
                'Private guides and translators',
                '24/7 concierge support',
                'Photography and documentation'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[#F97316]" />
                  <span className="text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
              <Sun className="w-8 h-8 text-[#F97316] mx-auto mb-3" />
              <div className="text-white text-lg mb-1">Summer Collection</div>
              <div className="text-[#A1A1AA] text-sm">Mediterranean, Caribbean</div>
            </div>
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
              <Moon className="w-8 h-8 text-[#F97316] mx-auto mb-3" />
              <div className="text-white text-lg mb-1">Winter Collection</div>
              <div className="text-[#A1A1AA] text-sm">Alps, Aspen, Whistler</div>
            </div>
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
              <Ship className="w-8 h-8 text-[#F97316] mx-auto mb-3" />
              <div className="text-white text-lg mb-1">Yacht Week</div>
              <div className="text-[#A1A1AA] text-sm">Croatia, Greece, Amalfi</div>
            </div>
            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
              <Wine className="w-8 h-8 text-[#F97316] mx-auto mb-3" />
              <div className="text-white text-lg mb-1">Wine & Dine</div>
              <div className="text-[#A1A1AA] text-sm">Bordeaux, Tuscany, Napa</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Globe className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              FEATURED DESTINATIONS
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Where Luxury{' '}
            <span className="text-[#F97316] font-medium">Comes to Life</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {destinations.map((dest, index) => (
            <div
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316]/30 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{dest.image}</div>
              <h3 className="text-2xl font-light text-white mb-1">{dest.city}</h3>
              <p className="text-[#A1A1AA] text-sm mb-3">{dest.country}</p>
              <div className="text-[#F97316] text-xs mb-3">Best {dest.season}</div>
              <ul className="space-y-2">
                {dest.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                    <CheckCircle className="w-3 h-3 text-[#F97316]" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Star className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              CLIENT EXPERIENCES
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Memories{' '}
            <span className="text-[#F97316] font-medium">Made</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F97316] text-[#F97316]" />
                ))}
              </div>
              <p className="text-[#E4E4E7] italic mb-6">"{testimonial.quote}"</p>
              <div className="border-t border-[#27272A] pt-4">
                <div className="text-white font-medium">{testimonial.author}</div>
                <div className="text-[#A1A1AA] text-sm">{testimonial.experience}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Luxury Partners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Award className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              TRUSTED PARTNERS
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            The Best of the{' '}
            <span className="text-[#F97316] font-medium">Best</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 text-center hover:border-[#F97316]/30 transition-colors"
            >
              <div className="text-white font-medium mb-1">{partner.name}</div>
              <div className="text-[#A1A1AA] text-xs">{partner.category}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Concierge Services */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-4">
                Your Personal{' '}
                <span className="font-medium">Concierge</span>
              </h2>
              <p className="text-white/90 text-lg mb-6">
                From restaurant reservations to private jet charters, our dedicated concierge team 
                is available 24/7 to handle every request with precision and discretion.
              </p>
              <ul className="space-y-3">
                {[
                  '24/7 dedicated support',
                  'Last-minute arrangements',
                  'VIP access and upgrades',
                  'Multi-lingual team'
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-white">
                    <CheckCircle className="w-5 h-5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <Users className="w-8 h-8 text-white" />
                <div>
                  <div className="text-white text-lg">Average Response</div>
                  <div className="text-3xl text-white font-light">15 min</div>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <Clock className="w-8 h-8 text-white" />
                <div>
                  <div className="text-white text-lg">Availability</div>
                  <div className="text-3xl text-white font-light">24/7</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Globe className="w-8 h-8 text-white" />
                <div>
                  <div className="text-white text-lg">Languages</div>
                  <div className="text-3xl text-white font-light">12+</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Begin Your{' '}
            <span className="text-[#F97316] font-medium">Extraordinary</span>{' '}
            Journey
          </h2>
          <p className="text-[#A1A1AA] text-xl mb-8 max-w-2xl mx-auto">
            Let our luxury lifestyle managers craft an experience that exceeds your wildest expectations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-full hover:bg-[#EA580C] transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Plan Your Experience
            </Link>
            <a
              href="tel:+18286239765"
              className="inline-flex items-center justify-center gap-2 bg-[#0A0A0A] border border-[#27272A] text-white px-8 py-4 rounded-full hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Speak With a Concierge
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Luxury;
