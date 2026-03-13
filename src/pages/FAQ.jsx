import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, ChevronUp, HelpCircle, Mail, Phone, 
  MessageSquare, Shield, Home, Key, Users, Clock,
  FileText, CreditCard, Star, Globe, ArrowRight
} from 'lucide-react';

function FAQ() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (index) => {
    setOpenItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqCategories = [
    {
      category: 'General Questions',
      icon: <HelpCircle className="w-6 h-6" />,
      questions: [
        {
          q: 'What makes Palms Estate different from other real estate companies?',
          a: 'Palms Estate specializes exclusively in luxury properties and provides a comprehensive concierge service that goes beyond traditional real estate. Our team of dedicated advisors offers personalized attention, global connections, and a commitment to discretion that discerning clients expect and deserve.'
        },
        {
          q: 'How long has Palms Estate been in business?',
          a: 'Founded in 2010 in Miami, we have over 15 years of experience in luxury real estate, with a proven track record of successful transactions and satisfied clients worldwide.'
        },
        {
          q: 'Do you operate internationally?',
          a: 'Yes, we have a global presence with offices in Miami, New York, London, and Dubai, serving clients in over 50 countries across North America, Europe, the Middle East, and Asia-Pacific.'
        }
      ]
    },
    {
      category: 'Property Services',
      icon: <Home className="w-6 h-6" />,
      questions: [
        {
          q: 'How do I schedule a property viewing?',
          a: 'You can schedule a private viewing through our website contact form, by email at concierge@palmsestate.org, or by calling our 24/7 concierge at +1 (828) 623-9765. We typically arrange viewings within 24 hours of your request.'
        },
        {
          q: 'Are the properties verified before listing?',
          a: 'Absolutely. Every property in our portfolio is personally vetted by our executive team to ensure it meets our strict standards for quality, location, and value. We never list properties sight unseen.'
        },
        {
          q: 'Do you offer virtual tours?',
          a: 'Yes, we offer high-definition virtual tours and video walkthroughs for all our properties. For serious inquiries, we can arrange live virtual viewings with our advisors.'
        }
      ]
    },
    {
      category: 'Rental Process',
      icon: <Key className="w-6 h-6" />,
      questions: [
        {
          q: 'What is the rental application process?',
          a: 'Our rental process begins with a consultation to understand your needs. Once you select a property, we guide you through the application, background check, and lease agreement. Our team coordinates everything with property owners and legal advisors to ensure a smooth transaction.'
        },
        {
          q: 'How long does the rental process take?',
          a: 'For luxury rentals, the process typically takes 3-7 days from application to approval, depending on the property owner\'s requirements and the completeness of your documentation.'
        },
        {
          q: 'What documents are required for rental applications?',
          a: 'Typically, we require proof of identity, income verification (pay stubs, tax returns, or bank statements), references, and a completed application form. International clients may need additional documentation.'
        }
      ]
    },
    {
      category: 'Buying & Selling',
      icon: <Star className="w-6 h-6" />,
      questions: [
        {
          q: 'How do you determine property values?',
          a: 'We conduct comprehensive market analysis using comparable sales, current market trends, property condition, location factors, and our proprietary data to ensure accurate valuations for both buyers and sellers.'
        },
        {
          q: 'What is the average closing time for purchases?',
          a: 'For luxury properties, our average closing time is 7 days for all-cash purchases and 30-45 days for financed transactions. We work with preferred lenders who understand the luxury market to expedite the process.'
        },
        {
          q: 'Do you assist with international purchases?',
          a: 'Yes, we have extensive experience with cross-border transactions and can connect you with international tax advisors, legal counsel, and financial institutions to navigate complex regulations.'
        }
      ]
    },
    {
      category: 'Concierge Services',
      icon: <Users className="w-6 h-6" />,
      questions: [
        {
          q: 'What does your concierge service include?',
          a: 'Our concierge services include lifestyle management (personal shopping, event planning, travel arrangements), private aviation coordination, yacht charter, art advisory, and 24/7 support for any requests you may have.'
        },
        {
          q: 'Is concierge service available to all clients?',
          a: 'Yes, all Palms Estate clients receive dedicated concierge support. The level of service is tailored to your needs, from occasional assistance to comprehensive lifestyle management.'
        },
        {
          q: 'How do I request concierge services?',
          a: 'You can contact your dedicated advisor directly, email concierge@palmsestate.org, or call our 24/7 concierge line at +1 (828) 623-9765 for immediate assistance.'
        }
      ]
    },
    {
      category: 'Privacy & Security',
      icon: <Shield className="w-6 h-6" />,
      questions: [
        {
          q: 'How do you protect client privacy?',
          a: 'We take confidentiality seriously. All clients have the option to sign Non-Disclosure Agreements (NDAs), and we use encrypted communication channels, secure document storage, and strict internal protocols to protect your information.'
        },
        {
          q: 'Do you work with high-profile clients?',
          a: 'Yes, we regularly serve high-net-worth individuals, celebrities, and public figures. Our team is experienced in handling sensitive situations with the utmost discretion and professionalism.'
        },
        {
          q: 'How is my financial information protected?',
          a: 'We never store sensitive financial information. All transactions are handled through secure, encrypted channels, and we work with trusted financial institutions and legal partners to ensure your security.'
        }
      ]
    }
  ];

  const quickAnswers = [
    {
      icon: <Clock className="w-5 h-5" />,
      question: 'Response time?',
      answer: 'Within 2 hours'
    },
    {
      icon: <Phone className="w-5 h-5" />,
      question: '24/7 support?',
      answer: 'Yes, always available'
    },
    {
      icon: <Globe className="w-5 h-5" />,
      question: 'Global coverage?',
      answer: '50+ countries'
    },
    {
      icon: <Users className="w-5 h-5" />,
      question: 'Happy clients?',
      answer: '800+ worldwide'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#F97316]/10 border border-[#F97316]/20 rounded-2xl px-8 py-4 mb-6">
              <HelpCircle className="w-5 h-5 text-[#F97316]" />
              <span className="font-sans text-[#F97316] font-semibold tracking-widest text-sm uppercase">
                FREQUENTLY ASKED QUESTIONS
              </span>
            </div>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6">
              How Can We{' '}
              <span className="text-[#F97316] font-medium">Help?</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#A1A1AA] mb-8 leading-relaxed">
            Find answers to common questions about our services, processes, and how we can assist you with your luxury real estate needs.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickAnswers.map((item, index) => (
            <div key={index} className="bg-[#18181B] border border-[#27272A] rounded-2xl p-6 text-center">
              <div className="text-[#F97316] flex justify-center mb-3">{item.icon}</div>
              <div className="text-white text-sm font-medium mb-1">{item.question}</div>
              <div className="text-[#A1A1AA] text-xs">{item.answer}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {faqCategories.map((category, catIndex) => (
            <div 
              key={catIndex}
              className="bg-[#18181B] border border-[#27272A] rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#F97316]/10 rounded-xl flex items-center justify-center">
                  <div className="text-[#F97316]">{category.icon}</div>
                </div>
                <h2 className="font-serif text-2xl font-light text-white">{category.category}</h2>
              </div>

              <div className="space-y-4">
                {category.questions.map((item, qIndex) => {
                  const globalIndex = `${catIndex}-${qIndex}`;
                  const isOpen = openItems[globalIndex];

                  return (
                    <div 
                      key={qIndex}
                      className="border border-[#27272A] rounded-xl overflow-hidden bg-[#0A0A0A]"
                    >
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-[#F97316]/5 transition-colors"
                      >
                        <span className="text-white font-medium pr-8">{item.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-[#F97316] flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-[#F97316] flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 text-[#A1A1AA] leading-relaxed border-t border-[#27272A] pt-4">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-gradient-to-br from-[#F97316] to-[#EA580C] rounded-3xl p-12 text-center shadow-2xl">
          <h2 className="font-serif text-4xl md:text-5xl font-light text-white mb-4">
            Still Have{' '}
            <span className="font-medium">Questions?</span>
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Our luxury concierge team is available 24/7 to assist you with any inquiries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-[#0A0A0A] transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <Mail className="w-5 h-5" />
              Contact Us
            </Link>
            <a
              href="tel:+18286239765"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              Call Concierge
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default FAQ;