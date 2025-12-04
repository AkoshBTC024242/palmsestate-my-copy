import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";

export default function Contact() {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      detail: "(828) 623-9765",
      link: "tel:8286239765"
    },
    {
      icon: Mail,
      title: "Email",
      detail: "devbreed@hotmail.com",
      link: "mailto:devbreed@hotmail.com"
    },
    {
      icon: MapPin,
      title: "Office",
      detail: "Visit us to view our available properties",
      link: "#"
    },
    {
      icon: Clock,
      title: "Hours",
      detail: "Mon-Fri: 9AM - 6PM, Sat: 10AM - 4PM",
      link: "#"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#1a1f35] to-[#2d3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Have questions about our rental properties? We're here to help
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.link}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-[#ff6b35]/10 rounded-2xl mb-4 group-hover:bg-[#ff6b35] transition-colors">
                  <info.icon className="w-8 h-8 text-[#ff6b35] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-[#1a1f35] mb-2">{info.title}</h3>
                <p className="text-gray-600">{info.detail}</p>
              </a>
            ))}
          </div>

          {/* Map & CTA Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-[#1a1f35] mb-6">Get in Touch</h2>
              <p className="text-lg text-gray-600 mb-6">
                Contact us to learn more about our available apartments or schedule a viewing. Our team is ready to help you find your perfect home.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#ff6b35]/10 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                    <Phone className="w-4 h-4 text-[#ff6b35]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1a1f35]">Call Us</p>
                    <p className="text-gray-600">(828) 623-9765</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#ff6b35]/10 rounded-lg flex items-center justify-center mt-1 flex-shrink-0">
                    <Clock className="w-4 h-4 text-[#ff6b35]" />
                  </div>
                  <div>
                    <p className="font-medium text-[#1a1f35]">Business Hours</p>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 10:00 AM - 4:00 PM</p>
                    <p className="text-gray-600">Sunday: By Appointment</p>
                  </div>
                </div>
              </div>

              <Link to={createPageUrl("Rentals")}>
                <Button className="bg-[#ff6b35] hover:bg-[#ff8c5a] text-white text-lg px-8 py-6 rounded-xl shadow-lg">
                  Browse Apartments
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-96 lg:h-[500px]">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80"
                alt="Beautiful Apartment"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Quality Living Spaces</h3>
                <p className="text-white/90">Modern apartments in prime locations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Find Your New Home?</h2>
          <p className="text-xl mb-8 text-white/90">
            Contact us today to learn more about our available apartments
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:8286239765">
              <Button size="lg" className="bg-white text-[#ff6b35] hover:bg-gray-100 text-lg px-8 py-6 rounded-xl">
                <Phone className="mr-2 w-5 h-5" />
                Call Now
              </Button>
            </a>
            <a href="mailto:devbreed@hotmail.com">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#ff6b35] text-lg px-8 py-6 rounded-xl">
                <Mail className="mr-2 w-5 h-5" />
                Email Us
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}