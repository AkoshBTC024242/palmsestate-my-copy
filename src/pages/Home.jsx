import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Home, MapPin, Shield, LogIn } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import Testimonials from "../components/home/Testimonials";

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        // User not logged in
      }
    };
    loadUser();
  }, []);

  const { data: apartments = [] } = useQuery({
    queryKey: ['featured-apartments'],
    queryFn: () => base44.entities.Apartment.filter({ available: true }, '-created_date', 6),
    initialData: []
  });

  const features = [
    {
      title: "Prime Locations",
      description: "Apartments in the best neighborhoods with easy access to amenities",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"
    },
    {
      title: "Modern Living",
      description: "Contemporary apartments with all the modern conveniences you need",
      image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"
    },
    {
      title: "Quality Service",
      description: "Dedicated property management and responsive maintenance",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80"
    }
  ];

  const benefits = [
    "Prime Location Properties",
    "Professional Management",
    "24/7 Maintenance",
    "Pet-Friendly Options",
    "Modern Amenities",
    "Flexible Lease Terms",
    "Secure Buildings",
    "Easy Application"
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1f35]/95 via-[#1a1f35]/70 to-transparent z-10" />
          <img
            src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&q=80"
            alt="Luxury Living"
            className="w-full h-full object-cover animate-slow-zoom"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="inline-block px-4 py-2 bg-[#ff6b35]/10 border border-[#ff6b35]/20 rounded-full mb-6">
              <span className="text-[#ff6b35] text-sm font-medium">Welcome to Palms Estate</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect
              <span className="block text-[#ff6b35]">Home Today</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Discover premium apartments in prime locations. Quality living spaces designed for your comfort and lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl("Rentals")}>
                <Button size="lg" className="bg-[#ff6b35] hover:bg-[#ff8c5a] text-white text-lg px-8 py-6 rounded-xl shadow-xl hover:shadow-2xl transition-all">
                  Browse Apartments
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-[#1a1f35] text-lg px-8 py-6 rounded-xl">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ff6b35]/10 rounded-2xl mb-4">
                <Home className="w-8 h-8 text-[#ff6b35]" />
              </div>
              <div className="text-4xl font-bold text-[#1a1f35] mb-2">{apartments.length}+</div>
              <div className="text-gray-600">Available Properties</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ff6b35]/10 rounded-2xl mb-4">
                <MapPin className="w-8 h-8 text-[#ff6b35]" />
              </div>
              <div className="text-4xl font-bold text-[#1a1f35] mb-2">5+</div>
              <div className="text-gray-600">Prime Locations</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ff6b35]/10 rounded-2xl mb-4">
                <Shield className="w-8 h-8 text-[#ff6b35]" />
              </div>
              <div className="text-4xl font-bold text-[#1a1f35] mb-2">100%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
          </div>

          {/* Certification Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-200 rounded-2xl shadow-lg">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-blue-900">US Government Verified</span>
                </div>
                <p className="text-lg font-bold text-blue-900">Licensed Real Estate Agent</p>
                <p className="text-xs text-blue-700">Certified & Regulated by State Authorities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1f35] mb-4">Why Choose Palms Estate</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience quality living with premium amenities and exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-[#1a1f35] mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Apartments */}
      {apartments.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-[#1a1f35] mb-4">Available Now</h2>
              <p className="text-xl text-gray-600">Explore our latest rental properties</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {apartments.slice(0, 3).map((apartment) => (
                <div key={apartment.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={apartment.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"}
                      alt={apartment.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#1a1f35] mb-2">{apartment.title}</h3>
                    <p className="text-gray-600 mb-3 line-clamp-2">{apartment.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#ff6b35]">
                        ${apartment.monthly_rent?.toLocaleString()}/mo
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to={createPageUrl("Rentals")}>
                <Button size="lg" className="bg-[#ff6b35] hover:bg-[#ff8c5a] text-white rounded-xl px-8">
                  View All Apartments
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-20 bg-[#1a1f35] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Commitment to You</h2>
            <p className="text-xl text-gray-300">Quality living with peace of mind</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#ff6b35] flex-shrink-0" />
                <span className="text-lg">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your New Home?</h2>
          <p className="text-xl mb-8 text-white/90">
            Browse our available apartments and apply online today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to={createPageUrl("Rentals")}>
              <Button size="lg" className="bg-white text-[#ff6b35] hover:bg-gray-100 text-lg px-10 py-6 rounded-xl shadow-xl w-full sm:w-auto">
                Browse Apartments
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to={createPageUrl("Contact")}>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#ff6b35] text-lg px-10 py-6 rounded-xl w-full sm:w-auto">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}