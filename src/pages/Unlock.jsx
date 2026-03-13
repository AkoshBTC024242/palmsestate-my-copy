import { Link } from 'react-router-dom';
import { 
  Key, ArrowRight, CheckCircle, Star, Users, 
  TrendingUp, Shield, Award, Zap, Compass,
  Target, Lightbulb, Rocket, Crown, Sparkles,
  Phone, Mail, Calendar, Globe, Heart, Gem
} from 'lucide-react';

function Unlock() {
  const principles = [
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Visionary Thinking',
      description: 'We look beyond the present to identify opportunities others miss, anticipating market shifts and emerging trends.'
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Strategic Precision',
      description: 'Every decision is data-driven, every action purposeful, ensuring optimal outcomes for our clients.'
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Accelerated Growth',
      description: 'We don\'t just maintain value – we create pathways to exponential appreciation and portfolio expansion.'
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: 'White-Glove Service',
      description: 'Our clients deserve nothing less than exceptional, personalized attention at every touchpoint.'
    }
  ];

  const stories = [
    {
      name: 'The Sterling Collection',
      type: 'Portfolio Expansion',
      before: '5 properties, limited growth',
      after: '15 properties, 300% portfolio value increase',
      outcome: 'Strategic acquisitions and premium positioning transformed a regional portfolio into an international collection.',
      icon: <Gem className="w-6 h-6" />
    },
    {
      name: 'Chen Family Estate',
      type: 'Legacy Property',
      before: 'Underperforming heritage estate',
      after: 'Top 1% of market, record sale price',
      outcome: 'Reimagined marketing and strategic renovations unlocked the property\'s true potential, selling for 40% above initial estimates.',
      icon: <Heart className="w-6 h-6" />
    },
    {
      name: 'Horizon Development',
      type: 'Development Project',
      before: 'Stalled luxury development',
      after: 'Fully sold out, premium pricing achieved',
      outcome: 'Strategic repositioning and targeted marketing attracted international buyers, revitalizing the entire project.',
      icon: <Target className="w-6 h-6" />
    }
  ];

  const pathways = [
    {
      title: 'Property Potential',
      description: 'Discover hidden value in existing properties through strategic renovations, repositioning, and premium marketing.',
      benefits: ['Identify underutilized spaces', 'Value-add renovation strategies', 'Premium positioning tactics']
    },
    {
      title: 'Portfolio Growth',
      description: 'Expand and optimize your real estate portfolio with data-driven acquisition strategies.',
      benefits: ['Market opportunity identification', 'Acquisition strategy', 'Portfolio diversification']
    },
    {
      title: 'Legacy Building',
      description: 'Create lasting wealth and generational assets through strategic long-term planning.',
      benefits: ['Intergenerational planning', 'Asset protection', 'Wealth preservation']
    },
    {
      title: 'Market Leadership',
      description: 'Position yourself as a market leader through strategic branding and positioning.',
      benefits: ['Personal branding', 'Network expansion', 'Thought leadership']
    }
  ];

  const metrics = [
    { value: '$2.5B+', label: 'Client Value Unlocked', icon: <TrendingUp className="w-6 h-6" /> },
    { value: '94%', label: 'Above Market Returns', icon: <Award className="w-6 h-6" /> },
    { value: '500+', label: 'Properties Transformed', icon: <Sparkles className="w-6 h-6" /> },
    { value: '15+', label: 'Years of Innovation', icon: <Lightbulb className="w-6 h-6" /> }
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
                <Key className="w-5 h-5 text-[#F97316]" />
                <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                  UNLOCK POTENTIAL
                </span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-white mb-6">
                Discover What's{' '}
                <span className="text-[#F97316] font-medium">Possible</span>
              </h1>
              <p className="text-xl text-[#A1A1AA] mb-8 leading-relaxed">
                Every property has untapped value. Every portfolio has room to grow. 
                We help our clients see beyond the obvious and unlock opportunities 
                that others miss.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-xl hover:bg-[#EA580C] transition-all duration-300"
                >
                  <Compass className="w-5 h-5" />
                  Start Your Journey
                </Link>
                <button
                  onClick={() => window.scrollTo({ top: document.getElementById('pathways').offsetTop, behavior: 'smooth' })}
                  className="inline-flex items-center justify-center gap-2 bg-[#18181B] border border-[#27272A] text-white px-8 py-4 rounded-xl hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-all duration-300"
                >
                  <Target className="w-5 h-5" />
                  Explore Pathways
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {metrics.map((metric, index) => (
                <div key={index} className="bg-[#18181B] border border-[#27272A] rounded-3xl p-6 text-center">
                  <div className="text-[#F97316] flex justify-center mb-3">{metric.icon}</div>
                  <div className="text-3xl font-light text-white mb-2">{metric.value}</div>
                  <div className="text-[#A1A1AA] text-sm">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Lightbulb className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              OUR PHILOSOPHY
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            The{' '}
            <span className="text-[#F97316] font-medium">Unlock</span>{' '}
            Mindset
          </h2>
          <p className="text-xl text-[#A1A1AA] max-w-3xl mx-auto">
            We believe that every challenge contains an opportunity, and every property 
            holds potential waiting to be discovered. Our approach combines vision with 
            precision to transform possibilities into realities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {principles.map((principle, index) => (
            <div
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316]/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-16 h-16 bg-[#F97316]/10 rounded-xl flex items-center justify-center mb-6">
                <div className="text-[#F97316]">{principle.icon}</div>
              </div>
              <h3 className="text-xl font-medium text-white mb-3">{principle.title}</h3>
              <p className="text-[#A1A1AA] leading-relaxed">{principle.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pathways Section */}
      <section id="pathways" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Compass className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              PATHWAYS TO POTENTIAL
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Choose Your{' '}
            <span className="text-[#F97316] font-medium">Journey</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {pathways.map((pathway, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#18181B] to-[#0A0A0A] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316]/30 transition-all duration-300"
            >
              <h3 className="text-2xl font-medium text-white mb-3">{pathway.title}</h3>
              <p className="text-[#A1A1AA] mb-6">{pathway.description}</p>
              <ul className="space-y-3">
                {pathway.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-[#A1A1AA]">
                    <CheckCircle className="w-5 h-5 text-[#F97316] flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-[#F97316] hover:text-[#F97316]/80 transition-colors mt-6"
              >
                Explore This Path
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Success Stories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
            <Sparkles className="w-5 h-5 text-[#F97316]" />
            <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
              SUCCESS STORIES
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Potential{' '}
            <span className="text-[#F97316] font-medium">Realized</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {stories.map((story, index) => (
            <div
              key={index}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 hover:border-[#F97316]/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#F97316]/10 rounded-xl flex items-center justify-center">
                  <div className="text-[#F97316]">{story.icon}</div>
                </div>
                <div>
                  <h3 className="text-white font-medium">{story.name}</h3>
                  <p className="text-[#A1A1AA] text-sm">{story.type}</p>
                </div>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="text-xs text-[#A1A1AA] uppercase mb-1">Before</div>
                  <div className="text-white text-sm">{story.before}</div>
                </div>
                <div>
                  <div className="text-xs text-[#A1A1AA] uppercase mb-1">After</div>
                  <div className="text-[#F97316] font-medium text-sm">{story.after}</div>
                </div>
                <div>
                  <div className="text-xs text-[#A1A1AA] uppercase mb-1">Outcome</div>
                  <div className="text-[#A1A1AA] text-sm">{story.outcome}</div>
                </div>
              </div>

              <Link
                to="/case-study"
                className="inline-flex items-center gap-2 text-[#F97316] hover:text-[#F97316]/80 transition-colors text-sm"
              >
                Read Full Story
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Process Visualization */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-12">
          <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-12 text-center">
            The{' '}
            <span className="font-medium">Unlock</span>{' '}
            Process
          </h2>

          <div className="grid md:grid-cols-4 gap-4 relative">
            {[
              { step: '01', title: 'Discovery', description: 'We uncover hidden potential through deep analysis' },
              { step: '02', title: 'Strategy', description: 'Custom roadmap designed for your unique goals' },
              { step: '03', title: 'Execution', description: 'Precision implementation of strategic initiatives' },
              { step: '04', title: 'Transformation', description: 'Value realized, potential unlocked, future secured' }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-white/30">
                  <span className="text-white font-bold">{item.step}</span>
                </div>
                <h3 className="text-white text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-white/80 text-sm">{item.description}</p>
                {index < 3 && (
                  <ArrowRight className="hidden md:block absolute -right-2 top-8 w-6 h-6 text-white/50" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#18181B] border border-[#27272A] rounded-3xl p-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-6">
            Ready to Unlock Your{' '}
            <span className="text-[#F97316] font-medium">Potential?</span>
          </h2>
          <p className="text-[#A1A1AA] text-xl mb-8 max-w-2xl mx-auto">
            Whether you're looking to maximize a single property or transform an entire portfolio, 
            our team is ready to help you see what's possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-full hover:bg-[#EA580C] transition-colors"
            >
              <Calendar className="w-5 h-5" />
              Schedule Discovery Call
            </Link>
            <a
              href="tel:+18286239765"
              className="inline-flex items-center justify-center gap-2 bg-[#0A0A0A] border border-[#27272A] text-white px-8 py-4 rounded-full hover:bg-[#F97316]/10 hover:border-[#F97316]/30 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Speak With an Advisor
            </a>
          </div>
          <div className="mt-8 pt-8 border-t border-[#27272A] flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2 text-[#A1A1AA]">
              <CheckCircle className="w-4 h-4 text-[#F97316]" />
              Free Initial Consultation
            </div>
            <div className="flex items-center gap-2 text-[#A1A1AA]">
              <CheckCircle className="w-4 h-4 text-[#F97316]" />
              No Obligation
            </div>
            <div className="flex items-center gap-2 text-[#A1A1AA]">
              <CheckCircle className="w-4 h-4 text-[#F97316]" />
              Confidential
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Unlock;
