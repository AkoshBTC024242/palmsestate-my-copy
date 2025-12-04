import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bed, Bath, Maximize, MapPin, DollarSign, Check, Calendar, ExternalLink, Shield, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import NewApartmentDetailsModal from "../components/rentals/NewApartmentDetailsModal";
import AmenityIcon from "../components/shared/AmenityIcon";

export default function Rentals() {
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [bedroomFilter, setBedroomFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");

  const { data: apartments = [], isLoading } = useQuery({
    queryKey: ['apartments'],
    queryFn: () => base44.entities.Apartment.filter({ available: true }, '-created_date'),
    initialData: []
  });

  const availableApartments = apartments.filter(apt => {
    
    const matchesSearch = searchTerm === "" || 
      apt.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBedrooms = bedroomFilter === "all" || 
      (bedroomFilter === "1" && apt.bedrooms === 1) ||
      (bedroomFilter === "2" && apt.bedrooms === 2) ||
      (bedroomFilter === "3" && apt.bedrooms === 3) ||
      (bedroomFilter === "4+" && apt.bedrooms >= 4);
    
    const matchesPrice = priceRange === "all" ||
      (priceRange === "under_1000" && apt.monthly_rent < 1000) ||
      (priceRange === "1000_1500" && apt.monthly_rent >= 1000 && apt.monthly_rent < 1500) ||
      (priceRange === "1500_2000" && apt.monthly_rent >= 1500 && apt.monthly_rent < 2000) ||
      (priceRange === "2000+" && apt.monthly_rent >= 2000);
    
    const matchesLocation = locationFilter === "all" || apt.location === locationFilter;
    const matchesState = stateFilter === "all" || apt.state === stateFilter;

    return matchesSearch && matchesBedrooms && matchesPrice && matchesLocation && matchesState;
  });

  const uniqueLocations = [...new Set(apartments.map(apt => apt.location))].filter(Boolean);
  const uniqueStates = [...new Set(apartments.map(apt => apt.state))].filter(Boolean).sort();

  const handleViewDetails = (apartment) => {
    setSelectedApartment(apartment);
    setShowModal(true);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-[#1a1f35] via-[#2d3748] to-[#1a1f35] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-[#ff6b35] rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#ff8c5a] rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-6">
            <div className="inline-block mb-6 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <p className="text-white/90 text-sm font-semibold tracking-wide">🏡 Premium Rentals</p>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              Available <span className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] bg-clip-text text-transparent">Apartments</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore premium rental properties across prime locations with verified quality and exceptional amenities
            </p>
          </div>
        </div>
      </section>

      {/* Apartments Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search and Filters */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="lg:col-span-2">
                  <Input
                    placeholder="Search by title, location, or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Bedrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bedrooms</SelectItem>
                    <SelectItem value="1">1 Bedroom</SelectItem>
                    <SelectItem value="2">2 Bedrooms</SelectItem>
                    <SelectItem value="3">3 Bedrooms</SelectItem>
                    <SelectItem value="4+">4+ Bedrooms</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under_1000">Under $1,000</SelectItem>
                    <SelectItem value="1000_1500">$1,000 - $1,500</SelectItem>
                    <SelectItem value="1500_2000">$1,500 - $2,000</SelectItem>
                    <SelectItem value="2000+">$2,000+</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {uniqueLocations.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={stateFilter} onValueChange={setStateFilter}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {uniqueStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                </div>
              <div className="mt-4 text-sm text-gray-600">
                Showing {availableApartments.length} of {apartments.filter(a => a.available).length} available apartments
              </div>
            </CardContent>
          </Card>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-64 rounded-2xl mb-4" />
                  <div className="bg-gray-200 h-4 rounded w-3/4 mb-2" />
                  <div className="bg-gray-200 h-4 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : availableApartments.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">No apartments available at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {availableApartments.map((apartment) => (
                <Card key={apartment.id} className="property-card group overflow-hidden hover-lift border-0 shadow-lg">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={apartment.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"}
                      alt={apartment.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {apartment.special_offer && apartment.special_offer !== 'none' && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className={`${apartment.special_offer === 'free_insurance' ? 'bg-green-500' : 'bg-blue-500'} text-white text-sm px-4 py-2 shadow-lg flex items-center gap-2`}>
                          <CheckCircle2 className="w-4 h-4" />
                          {apartment.special_offer === 'free_insurance' ? 'FREE Liability Insurance!' : '$0 Deposit Program'}
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <Badge className="bg-white/90 text-[#ff6b35] border-0 backdrop-blur-sm">
                        Available
                      </Badge>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <div className="flex items-center gap-2 text-white">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm font-medium">{apartment.location}</span>
                      </div>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-[#1a1f35] mb-3 group-hover:text-[#ff6b35] transition-colors">
                      {apartment.title}
                    </h3>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-[#ff6b35]" />
                        <span className="text-2xl font-bold text-[#1a1f35]">
                          ${apartment.monthly_rent?.toLocaleString()}
                        </span>
                        <span className="text-gray-500">/month</span>
                      </div>
                      {apartment.security_deposit > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <Shield className="w-4 h-4 text-blue-600" />
                          <span className="text-gray-600">
                            Security Deposit: <strong className="text-blue-600">${apartment.security_deposit?.toLocaleString()}</strong>
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span className="text-sm">{apartment.bedrooms} Bed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        <span className="text-sm">{apartment.bathrooms} Bath</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize className="w-4 h-4" />
                        <span className="text-sm">{apartment.size_sqft} sqft</span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 flex items-center gap-1 mb-3">
                      <MapPin className="w-4 h-4 text-[#ff6b35]" />
                      {[apartment.city, apartment.state].filter(Boolean).join(', ')}
                    </p>

                    {apartment.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {apartment.amenities.slice(0, 3).map((amenity, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs flex items-center gap-1">
                            <AmenityIcon amenity={amenity} className="w-3 h-3" />
                            {amenity}
                          </Badge>
                        ))}
                        {apartment.amenities.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{apartment.amenities.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}

                    {apartment.available_from && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>Available from {format(new Date(apartment.available_from), 'MMM d, yyyy')}</span>
                      </div>
                    )}

                    {apartment.address && (
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(apartment.address + ', ' + (apartment.city || '') + ', ' + (apartment.state || ''))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-[#ff6b35] hover:underline mb-4"
                      >
                        <MapPin className="w-4 h-4" />
                        View on Google Maps
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    <Button
                      onClick={() => handleViewDetails(apartment)}
                      className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a] text-white rounded-xl"
                    >
                      View Details & Apply
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {showModal && selectedApartment && (
        <NewApartmentDetailsModal
          apartment={selectedApartment}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedApartment(null);
          }}
        />
      )}
    </div>
  );
}