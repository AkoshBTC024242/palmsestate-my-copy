import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bed, Bath, Maximize, MapPin, DollarSign, Home as HomeIcon, Calendar, Ruler } from "lucide-react";

export default function ForSale() {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [bedroomFilter, setBedroomFilter] = useState("all");
  const [stateFilter, setStateFilter] = useState("all");

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties-for-sale'],
    queryFn: () => base44.entities.PropertyForSale.list('-created_date'),
    initialData: []
  });

  const uniqueStates = [...new Set(properties.map(prop => prop.state))].filter(Boolean).sort();

  const filteredProperties = properties.filter(prop => {
    if (prop.status !== 'available') return false;
    
    const matchesSearch = searchTerm === "" || 
      prop.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prop.address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = propertyType === "all" || prop.property_type === propertyType;
    
    const matchesBedrooms = bedroomFilter === "all" || 
      (bedroomFilter === "1" && prop.bedrooms === 1) ||
      (bedroomFilter === "2" && prop.bedrooms === 2) ||
      (bedroomFilter === "3" && prop.bedrooms === 3) ||
      (bedroomFilter === "4+" && prop.bedrooms >= 4);
    
    const matchesPrice = priceRange === "all" ||
      (priceRange === "under_200k" && prop.price < 200000) ||
      (priceRange === "200k_400k" && prop.price >= 200000 && prop.price < 400000) ||
      (priceRange === "400k_600k" && prop.price >= 400000 && prop.price < 600000) ||
      (priceRange === "600k+" && prop.price >= 600000);
    
    const matchesState = stateFilter === "all" || prop.state === stateFilter;
    
    return matchesSearch && matchesType && matchesBedrooms && matchesPrice && matchesState;
  });

  return (
    <div>
      <section className="relative py-20 bg-gradient-to-br from-[#1a1f35] to-[#2d3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Properties For Sale</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover your dream home from our exclusive collection of properties
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="mb-8 border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="lg:col-span-2">
                  <Input
                    placeholder="Search by address, city, or title..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-12"
                  />
                </div>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Property Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="single_family">Single Family</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="condo">Condo</SelectItem>
                    <SelectItem value="multi_family">Multi Family</SelectItem>
                    <SelectItem value="land">Land</SelectItem>
                  </SelectContent>
                </Select>
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
                    <SelectItem value="under_200k">Under $200K</SelectItem>
                    <SelectItem value="200k_400k">$200K - $400K</SelectItem>
                    <SelectItem value="400k_600k">$400K - $600K</SelectItem>
                    <SelectItem value="600k+">$600K+</SelectItem>
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
                Showing {filteredProperties.length} of {properties.filter(p => p.status === 'available').length} available properties
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
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">No properties found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProperties.map((property) => (
                <Card key={property.id} className="property-card group overflow-hidden hover-lift border-0 shadow-lg">
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={property.images?.[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80"}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-[#ff6b35] text-white border-0">
                        {property.property_type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-[#1a1f35] mb-2 group-hover:text-[#ff6b35] transition-colors">
                      {property.title}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 text-[#ff6b35]" />
                      <span className="text-sm">{property.address}, {property.city}, {property.state}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="w-6 h-6 text-[#ff6b35]" />
                      <span className="text-3xl font-bold text-[#1a1f35]">
                        ${property.price?.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-4 text-gray-600">
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4" />
                        <span className="text-sm">{property.bedrooms} Bed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4" />
                        <span className="text-sm">{property.bathrooms} Bath</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize className="w-4 h-4" />
                        <span className="text-sm">{property.size_sqft?.toLocaleString()} sqft</span>
                      </div>
                    </div>

                    {property.year_built && (
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Calendar className="w-4 h-4" />
                        <span>Built in {property.year_built}</span>
                      </div>
                    )}

                    <Button className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a] text-white rounded-xl">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}