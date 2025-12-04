import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Home, Shield, Clock, Award, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#1a1f35] to-[#2d3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Palms Estate</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Your trusted partner in finding the perfect rental home
            </p>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-4xl font-bold text-[#1a1f35] mb-6">Who We Are</h2>
              <p className="text-lg text-gray-600 mb-4">
                Palms Estate is dedicated to providing quality rental properties in prime locations. We understand that finding the right home is about more than just four walls – it's about finding a place where you can truly live and thrive.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Our portfolio includes modern apartments with contemporary amenities, all professionally managed to ensure your comfort and satisfaction. We pride ourselves on responsive service, transparent communication, and maintaining properties to the highest standards.
              </p>
              <p className="text-lg text-gray-600">
                Whether you're looking for a cozy studio or a spacious family apartment, we're here to help you find your perfect home.
              </p>
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80"
                alt="Modern Apartment"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ff6b35]/10 rounded-2xl mb-4">
                <Home className="w-8 h-8 text-[#ff6b35]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1f35] mb-2">Quality Properties</h3>
              <p className="text-gray-600">Well-maintained apartments in prime locations</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ff6b35]/10 rounded-2xl mb-4">
                <Shield className="w-8 h-8 text-[#ff6b35]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1f35] mb-2">Trusted Service</h3>
              <p className="text-gray-600">Professional management you can rely on</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ff6b35]/10 rounded-2xl mb-4">
                <Clock className="w-8 h-8 text-[#ff6b35]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1f35] mb-2">24/7 Support</h3>
              <p className="text-gray-600">Responsive maintenance and assistance</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ff6b35]/10 rounded-2xl mb-4">
                <Award className="w-8 h-8 text-[#ff6b35]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1f35] mb-2">Excellence</h3>
              <p className="text-gray-600">Committed to your satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your New Home?</h2>
          <p className="text-xl mb-8 text-white/90">
            Browse our available apartments and start your application today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Rentals")}>
              <Button size="lg" className="bg-white text-[#ff6b35] hover:bg-gray-100 text-lg px-8 rounded-xl">
                View Apartments
                <ArrowRight className="ml-2 w-5 h-5" />
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