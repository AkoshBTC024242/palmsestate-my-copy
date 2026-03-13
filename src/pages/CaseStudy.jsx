import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Star, Heart, Users, Calendar, MapPin,
  CheckCircle, Quote, Clock, Target, TrendingUp,
  Shield, Award, Camera, Video, Download,
  ChevronRight, Phone, Mail, MessageCircle
} from 'lucide-react';

function CaseStudy() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('story');

  // In a real app, you'd fetch this data based on the ID
  const caseStudy = {
    id: '1',
    property: 'Oceanfront Estate',
    location: 'Miami Beach, Florida',
    client: {
      name: 'The Richardson Family',
      story: 'Longtime clients seeking a private family compound',
      image: '👨‍👩‍👧‍👦',
      quote: "Palms Estate didn't just find us a house – they found us a home where our family will create memories for generations."
    },
    challenge: 'The family needed a private estate with beach access, multiple structures for extended family, complete privacy from paparazzi, and the ability to host charitable events. After months of searching public listings without success, they came to us for a different approach.',
    solution: 'Our team leveraged our exclusive network to identify an off-market property owned by a private family. We negotiated a confidential transaction with NDAs, coordinated extensive renovations including a guest house addition, and managed the entire process with complete discretion.',
    result: 'The family now enjoys a 7-bedroom main house, 3-bedroom guest villa, private beach access, and a dedicated event pavilion. The property has hosted three successful charity galas and countless family gatherings.',
    timeline: '8 months',
    price: '$12.5M',
    roi: '+15% appraisal since purchase',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    ],
    testimonial: {
      quote: "The team understood that this wasn't just a real estate transaction – it was about our family's future and our dream of creating a legacy property. They handled everything with such care and discretion that we never felt any stress during the process.",
      author: "Elizabeth Richardson",
      role: "Client",
      rating: 5
    },
    timeline_details: [
      { phase: 'Initial Consultation', date: 'January 2025', description: 'Met with family to understand their vision and requirements' },
      { phase: 'Property Search', date: 'January-March 2025', description: 'Identified off-market opportunities through exclusive network' },
      { phase: 'Acquisition', date: 'April 2025', description: 'Negotiated confidential transaction with seller' },
      { phase: 'Renovations', date: 'May-August 2025', description: 'Managed guest house addition and property updates' },
      { phase: 'Move-In', date: 'September 2025', description: 'Family settled into their forever home' }
    ],
    team: [
      { name: 'Eleanor Sterling', role: 'Lead Advisor', expertise: 'Client relations, negotiations' },
      { name: 'Marcus Chen', role: 'Acquisition Specialist', expertise: 'Off-market sourcing' },
      { name: 'Isabella Rossi', role: 'Design Consultant', expertise: 'Renovation coordination' }
    ],
    results: [
      { metric: 'Time to Acquisition', value: '3 months', icon: <Clock className="w-5 h-5" /> },
      { metric: 'Price vs. Market', value: '12% below market', icon: <TrendingUp className="w-5 h-5" /> },
      { metric: 'Post-renovation Value', value: '+15%', icon: <Award className="w-5 h-5" /> },
      { metric: 'Client Satisfaction', value: '5/5', icon: <Star className="w-5 h-5" /> }
    ]
  };

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link 
          to="/case-studies" 
          className="inline-flex items-center gap-2 text-[#A1A1AA] hover:text-[#F97316] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Case Studies
        </Link>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#F97316]/5 via-transparent to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-[#F97316]/10 text-[#F97316] text-xs rounded-full">Case Study</span>
                <span className="text-[#A1A1AA] text-sm">Client Success Story</span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-white mb-4">
                {caseStudy.property}
              </h1>
              <div className="flex items-center gap-2 text-[#A1A1AA] mb-6">
                <MapPin className="w-4 h-4 text-[#F97316]" />
                {caseStudy.location}
              </div>
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#F97316]" />
                  <span className="text-white">{caseStudy.client.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#F97316]" />
                  <span className="text-white">{caseStudy.timeline}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 bg-[#F97316] text-white px-6 py-3 rounded-xl hover:bg-[#EA580C] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  Discuss Your Project
                </Link>
                <Link
                  to="/case-studies"
                  className="inline-flex items-center gap-2 bg-[#18181B] border border-[#27272A] text-white px-6 py-3 rounded-xl hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {caseStudy.results.map((result, index) => (
                <div key={index} className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 text-center">
                  <div className="text-[#F97316] flex justify-center mb-2">{result.icon}</div>
                  <div className="text-2xl font-light text-white mb-1">{result.value}</div>
                  <div className="text-[#A1A1AA] text-sm">{result.metric}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-3 gap-4">
          {caseStudy.images.map((image, index) => (
            <div
              key={index}
              className="relative h-64 rounded-2xl overflow-hidden group cursor-pointer"
            >
              <img
                src={image}
                alt={`${caseStudy.property} - View ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {index === 2 && (
                <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  +12 more
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap gap-2 border-b border-[#27272A] pb-4">
          {[
            { id: 'story', label: 'The Story', icon: <Heart className="w-4 h-4" /> },
            { id: 'process', label: 'Our Process', icon: <Target className="w-4 h-4" /> },
            { id: 'results', label: 'Results', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'team', label: 'The Team', icon: <Users className="w-4 h-4" /> }
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
        {activeTab === 'story' && (
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="prose prose-invert max-w-none">
                <h2 className="font-serif text-3xl font-light text-white mb-6">The Client's Vision</h2>
                <p className="text-[#A1A1AA] text-lg leading-relaxed mb-8">
                  {caseStudy.challenge}
                </p>

                <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 mb-8">
                  <Quote className="w-10 h-10 text-[#F97316] mb-4" />
                  <p className="text-white text-xl italic mb-4">"{caseStudy.testimonial.quote}"</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{caseStudy.testimonial.author}</p>
                      <p className="text-[#A1A1AA] text-sm">{caseStudy.testimonial.role}</p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(caseStudy.testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#F97316] text-[#F97316]" />
                      ))}
                    </div>
                  </div>
                </div>

                <h3 className="font-serif text-2xl font-light text-white mb-4">Our Approach</h3>
                <p className="text-[#A1A1AA] text-lg leading-relaxed">
                  {caseStudy.solution}
                </p>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 sticky top-24">
                <h3 className="text-white font-medium mb-6">Client Snapshot</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#F97316]" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{caseStudy.client.name}</div>
                      <div className="text-[#A1A1AA] text-xs">Client</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#F97316]" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">{caseStudy.location}</div>
                      <div className="text-[#A1A1AA] text-xs">Location</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#F97316]/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#F97316]" />
                    </div>
                    <div>
                      <div className="text-white text-sm font-medium">Completed {caseStudy.timeline_details[4].date}</div>
                      <div className="text-[#A1A1AA] text-xs">Timeline</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-[#27272A]">
                    <div className="text-2xl text-[#F97316] font-light mb-1">{caseStudy.price}</div>
                    <div className="text-[#A1A1AA] text-sm">Final Transaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'process' && (
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-light text-white mb-8 text-center">The Journey</h2>
            <div className="space-y-6">
              {caseStudy.timeline_details.map((phase, index) => (
                <div key={index} className="relative">
                  <div className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 hover:border-[#F97316]/30 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#F97316]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-[#F97316] font-bold">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-medium">{phase.phase}</h3>
                          <span className="text-[#F97316] text-sm">{phase.date}</span>
                        </div>
                        <p className="text-[#A1A1AA]">{phase.description}</p>
                      </div>
                    </div>
                  </div>
                  {index < caseStudy.timeline_details.length - 1 && (
                    <div className="absolute left-6 top-16 w-0.5 h-12 bg-gradient-to-b from-[#F97316] to-transparent"></div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-8 text-center">
              <h3 className="text-2xl font-light text-white mb-4">The Result</h3>
              <p className="text-white/90 text-lg mb-6">{caseStudy.result}</p>
              <div className="inline-block bg-black/20 rounded-full px-6 py-2">
                <span className="text-white">Transaction completed in {caseStudy.timeline}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8">
                <h3 className="text-2xl font-light text-white mb-6">Quantifiable Results</h3>
                <div className="space-y-4">
                  {caseStudy.results.map((result, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-xl border border-[#27272A]">
                      <div className="flex items-center gap-3">
                        <div className="text-[#F97316]">{result.icon}</div>
                        <span className="text-white">{result.metric}</span>
                      </div>
                      <span className="text-[#F97316] font-light text-xl">{result.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8">
                <h3 className="text-2xl font-light text-white mb-6">Client Feedback</h3>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#F97316] text-[#F97316]" />
                  ))}
                </div>
                <p className="text-[#E4E4E7] italic mb-6">"{caseStudy.testimonial.quote}"</p>
                <p className="text-white font-medium">{caseStudy.testimonial.author}</p>
                <p className="text-[#A1A1AA] text-sm">{caseStudy.testimonial.role}</p>
              </div>
            </div>

            <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8">
              <h3 className="text-2xl font-light text-white mb-6 text-center">Value Created</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: 'Purchase Price', value: caseStudy.price, change: '' },
                  { label: 'Current Value', value: '$14.4M', change: '+15%' },
                  { label: 'Equity Gained', value: '$1.9M', change: 'in 8 months' }
                ].map((item, index) => (
                  <div key={index} className="text-center p-6 bg-[#0A0A0A] rounded-2xl border border-[#27272A]">
                    <div className="text-[#A1A1AA] text-sm mb-2">{item.label}</div>
                    <div className="text-3xl text-white font-light mb-1">{item.value}</div>
                    {item.change && <div className="text-[#F97316] text-sm">{item.change}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div>
            <h2 className="font-serif text-3xl font-light text-white mb-8 text-center">The Dedicated Team</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              {caseStudy.team.map((member, index) => (
                <div key={index} className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 text-center hover:border-[#F97316]/30 transition-all duration-300">
                  <div className="w-20 h-20 bg-[#F97316]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">👤</span>
                  </div>
                  <h3 className="text-white font-medium text-lg mb-1">{member.name}</h3>
                  <p className="text-[#F97316] text-sm mb-3">{member.role}</p>
                  <p className="text-[#A1A1AA] text-sm">{member.expertise}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-8 text-center">
              <h3 className="text-2xl font-light text-white mb-4">The Palms Estate Difference</h3>
              <p className="text-white/90 text-lg mb-6 max-w-2xl mx-auto">
                Every client receives a dedicated team of experts working together to achieve exceptional results.
              </p>
              <Link
                to="/team"
                className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full hover:bg-[#0A0A0A] transition-colors"
              >
                Meet the Full Team
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Similar Success Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <h2 className="font-serif text-3xl font-light text-white mb-8 text-center">More Success Stories</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: 'Penthouse Collection, NYC',
              result: 'Sold 5 units in 30 days',
              image: '🗽',
              link: '/case-study/2'
            },
            {
              title: 'Vineyard Estate, Napa',
              result: 'Record price per acre',
              image: '🍷',
              link: '/case-study/3'
            },
            {
              title: 'Private Island, Bahamas',
              result: 'Off-market acquisition',
              image: '🏝️',
              link: '/case-study/4'
            }
          ].map((study, index) => (
            <Link
              key={index}
              to={study.link}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316]/30 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="text-5xl mb-4">{study.image}</div>
              <h3 className="text-xl font-medium text-white mb-2 group-hover:text-[#F97316] transition-colors">{study.title}</h3>
              <p className="text-[#A1A1AA] text-sm mb-4">{study.result}</p>
              <span className="text-[#F97316] text-sm flex items-center gap-1">
                Read Story
                <ChevronRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Ready to Write Your{' '}
            <span className="text-[#F97316] font-medium">Success Story?</span>
          </h2>
          <p className="text-[#A1A1AA] text-xl mb-8 max-w-2xl mx-auto">
            Every client's journey is unique. Let's discuss how we can help you achieve your real estate goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-full hover:bg-[#EA580C] transition-colors"
            >
              <Heart className="w-5 h-5" />
              Start Your Journey
            </Link>
            <a
              href="tel:+18286239765"
              className="inline-flex items-center justify-center gap-2 bg-[#0A0A0A] border border-[#27272A] text-white px-8 py-4 rounded-full hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Speak With an Advisor
            </a>
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-[#A1A1AA]">
              <CheckCircle className="w-4 h-4 text-[#F97316]" />
              Free Initial Consultation
            </div>
            <div className="flex items-center gap-2 text-[#A1A1AA]">
              <CheckCircle className="w-4 h-4 text-[#F97316]" />
              Confidential
            </div>
            <div className="flex items-center gap-2 text-[#A1A1AA]">
              <CheckCircle className="w-4 h-4 text-[#F97316]" />
              No Obligation
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CaseStudy;
