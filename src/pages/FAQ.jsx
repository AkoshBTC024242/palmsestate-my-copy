import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, Search, Home, DollarSign, FileText, Shield, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openIndex, setOpenIndex] = useState(null);

  const categories = [
    {
      icon: Home,
      title: "Renting",
      color: "text-blue-600",
      faqs: [
        {
          question: "How do I apply for an apartment?",
          answer: "Browse our available apartments on the Rentals page, click 'View Details & Apply' on your preferred property, and fill out the application form. You'll receive a tracking number to monitor your application status."
        },
        {
          question: "What documents do I need to apply?",
          answer: "You'll need proof of employment, recent pay stubs or tax returns, valid ID, rental history, and references. Some applications may require additional documentation based on your situation."
        },
        {
          question: "How long does the application process take?",
          answer: "We typically review applications within 24-48 hours. You'll receive email updates and can track your application status using your tracking number on our website."
        },
        {
          question: "Can I schedule a property viewing?",
          answer: "Yes! When viewing apartment details, you can schedule a tour at a time that works for you. We'll confirm your appointment within 24 hours."
        },
        {
          question: "Are pets allowed?",
          answer: "Pet policies vary by property. Check the individual apartment listing for pet-friendly options. Some properties may require a pet deposit or monthly pet rent."
        }
      ]
    },
    {
      icon: DollarSign,
      title: "Payments & Costs",
      color: "text-green-600",
      faqs: [
        {
          question: "What are the move-in costs?",
          answer: "Typical move-in costs include first month's rent, security deposit (usually equal to one month's rent), and a $50 application fee. Use our cost calculator on each listing for exact amounts."
        },
        {
          question: "When is rent due?",
          answer: "Rent is due on the 1st of each month. We offer online payment through the Tenant Portal for your convenience."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept online payments via credit card, debit card, and bank transfer through our secure Tenant Portal."
        },
        {
          question: "Is the security deposit refundable?",
          answer: "Yes, security deposits are fully refundable at lease end, subject to property condition. Deductions may apply for damages beyond normal wear and tear."
        }
      ]
    },
    {
      icon: FileText,
      title: "Lease & Agreements",
      color: "text-orange-600",
      faqs: [
        {
          question: "What is the lease term?",
          answer: "Most leases are 12 months, though shorter or longer terms may be available. Check the specific property listing or contact us for flexible options."
        },
        {
          question: "Can I renew my lease?",
          answer: "Yes! Use the Tenant Portal to submit a lease renewal request at least 60 days before your lease expires. We'll review and get back to you promptly."
        },
        {
          question: "What happens if I need to break my lease?",
          answer: "Contact us immediately if you need to terminate your lease early. Fees and requirements vary based on your lease terms and local laws."
        },
        {
          question: "Can I sublease my apartment?",
          answer: "Subleasing requires written approval from property management. Submit your request through the Tenant Portal with details about the proposed subtenant."
        }
      ]
    },
    {
      icon: Shield,
      title: "Maintenance & Support",
      color: "text-purple-600",
      faqs: [
        {
          question: "How do I submit a maintenance request?",
          answer: "Use the Tenant Portal to submit maintenance requests. Include photos and detailed descriptions. Emergency requests are prioritized and addressed immediately."
        },
        {
          question: "What qualifies as an emergency?",
          answer: "Emergencies include water leaks, no heat in winter, no AC in extreme heat, electrical hazards, broken locks, or gas leaks. For emergencies, also call (828) 623-9765."
        },
        {
          question: "How quickly are maintenance requests handled?",
          answer: "Emergency requests are addressed within 24 hours. Non-emergency requests are typically completed within 3-5 business days."
        },
        {
          question: "Who handles repairs?",
          answer: "All repairs are handled by our licensed, professional contractors. You'll receive notifications when maintenance is scheduled."
        }
      ]
    }
  ];

  const allFaqs = categories.flatMap((cat, catIdx) => 
    cat.faqs.map((faq, faqIdx) => ({
      ...faq,
      category: cat.title,
      icon: cat.icon,
      color: cat.color,
      index: `${catIdx}-${faqIdx}`
    }))
  );

  const filteredFaqs = searchTerm
    ? allFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allFaqs;

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#1a1f35] to-[#2d3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Find answers to common questions about renting, payments, and more
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for answers..."
                className="pl-12 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {searchTerm ? (
            <div className="space-y-3">
              <p className="text-gray-600 mb-6">
                Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} for "{searchTerm}"
              </p>
              {filteredFaqs.map((faq) => {
                const Icon = faq.icon;
                return (
                  <Card key={faq.index} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-0">
                      <button
                        onClick={() => toggleFaq(faq.index)}
                        className="w-full text-left p-6 flex items-start justify-between gap-4"
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <Icon className={`w-5 h-5 mt-1 ${faq.color}`} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs text-gray-500 font-medium">{faq.category}</span>
                            </div>
                            <h3 className="text-lg font-semibold text-[#1a1f35]">{faq.question}</h3>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 mt-1 ${
                            openIndex === faq.index ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {openIndex === faq.index && (
                        <div className="px-6 pb-6 pt-0">
                          <p className="text-gray-600 leading-relaxed ml-8">{faq.answer}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map((category, catIdx) => {
                const Icon = category.icon;
                return (
                  <div key={catIdx}>
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                        category.color === 'text-blue-600' ? 'from-blue-100 to-blue-200' :
                        category.color === 'text-green-600' ? 'from-green-100 to-green-200' :
                        category.color === 'text-orange-600' ? 'from-orange-100 to-orange-200' :
                        'from-purple-100 to-purple-200'
                      } flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${category.color}`} />
                      </div>
                      <h2 className="text-2xl font-bold text-[#1a1f35]">{category.title}</h2>
                    </div>
                    <div className="space-y-3">
                      {category.faqs.map((faq, faqIdx) => {
                        const index = `${catIdx}-${faqIdx}`;
                        return (
                          <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-0">
                              <button
                                onClick={() => toggleFaq(index)}
                                className="w-full text-left p-6 flex items-start justify-between gap-4"
                              >
                                <h3 className="text-lg font-semibold text-[#1a1f35] flex-1">
                                  {faq.question}
                                </h3>
                                <ChevronDown
                                  className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                                    openIndex === index ? 'rotate-180' : ''
                                  }`}
                                />
                              </button>
                              {openIndex === index && (
                                <div className="px-6 pb-6 pt-0">
                                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Still Have Questions */}
          <Card className="mt-16 bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] border-0 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
              <p className="text-white/90 mb-6 text-lg">
                Can't find what you're looking for? Our team is here to help!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link to={createPageUrl("Contact")}>
                  <Button className="bg-white text-[#ff6b35] hover:bg-gray-100 h-12 px-8 w-full sm:w-auto">
                    Contact Us
                  </Button>
                </Link>
                <a href="tel:8286239765" className="w-full sm:w-auto">
                  <Button variant="outline" className="border-2 border-white text-white hover:bg-white/10 h-12 px-8 w-full">
                    <Phone className="w-5 h-5 mr-2" />
                    Call (828) 623-9765
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}