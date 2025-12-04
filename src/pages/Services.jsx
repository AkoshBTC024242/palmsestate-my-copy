import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Home, Building2, Wrench, Factory, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Home,
      title: "Residential Construction",
      description: "Building dream homes from the ground up with attention to every detail",
      features: [
        "Custom Home Design",
        "New Home Construction",
        "Home Additions",
        "Kitchen & Bath Remodeling",
        "Outdoor Living Spaces"
      ],
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80"
    },
    {
      icon: Building2,
      title: "Commercial Construction",
      description: "Professional commercial building services for businesses of all sizes",
      features: [
        "Office Buildings",
        "Retail Spaces",
        "Restaurants",
        "Medical Facilities",
        "Warehouses"
      ],
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80"
    },
    {
      icon: Factory,
      title: "Industrial Construction",
      description: "Large-scale industrial projects with safety and efficiency as priorities",
      features: [
        "Manufacturing Facilities",
        "Distribution Centers",
        "Industrial Parks",
        "Processing Plants",
        "Storage Facilities"
      ],
      image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=1200&q=80"
    },
    {
      icon: Wrench,
      title: "Renovation & Remodeling",
      description: "Transform existing spaces with expert renovation and remodeling services",
      features: [
        "Interior Renovations",
        "Structural Updates",
        "Historic Restoration",
        "Space Planning",
        "Energy Efficiency Upgrades"
      ],
      image: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1200&q=80"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#1a1f35] to-[#2d3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Comprehensive construction solutions tailored to meet your unique needs and exceed your expectations
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {services.map((service, index) => (
              <div
                key={index}
                className={`flex flex-col ${
                  index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                } gap-12 items-center`}
              >
                <div className="flex-1">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ff6b35]/10 rounded-2xl mb-6">
                    <service.icon className="w-8 h-8 text-[#ff6b35]" />
                  </div>
                  <h2 className="text-4xl font-bold text-[#1a1f35] mb-4">{service.title}</h2>
                  <p className="text-xl text-gray-600 mb-6">{service.description}</p>
                  
                  <div className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#ff6b35] flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Link to={createPageUrl("Quote")}>
                    <Button className="bg-[#ff6b35] hover:bg-[#ff8c5a] text-white rounded-xl px-6">
                      Request Quote
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </div>

                <div className="flex-1 w-full">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-96 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1f35] mb-4">Our Process</h2>
            <p className="text-xl text-gray-600">Simple, transparent, and efficient</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consultation", desc: "Discuss your vision and requirements" },
              { step: "02", title: "Planning", desc: "Develop detailed plans and estimates" },
              { step: "03", title: "Construction", desc: "Execute the project with precision" },
              { step: "04", title: "Completion", desc: "Final walkthrough and handover" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-[#ff6b35] text-white text-2xl font-bold rounded-full mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-[#1a1f35] mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Let's Build Something Amazing Together</h2>
          <p className="text-xl mb-8 text-white/90">
            Contact us today to discuss your construction project
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Quote")}>
              <Button size="lg" className="bg-white text-[#ff6b35] hover:bg-gray-100 text-lg px-8 rounded-xl">
                Get Free Quote
              </Button>
            </Link>
            <Link to={createPageUrl("Contact")}>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#ff6b35] text-lg px-8 rounded-xl">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}