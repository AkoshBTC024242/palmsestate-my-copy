import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Bed, Bath, Square, DollarSign, Calendar, Search, Filter } from "lucide-react";
import { format } from "date-fns";

export default function Apartments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [bedroomFilter, setBedroomFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("available");

  const { data: apartments = [], isLoading } = useQuery({
    queryKey: ['apartments'],
    queryFn: () => base44.entities.Apartment.list('-created_date'),
    initialData: []
  });

  const filteredApartments = apartments.filter(apt => {
    const matchesSearch = apt.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         apt.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBedrooms = bedroomFilter === "all" || apt.bedrooms === parseInt(bedroomFilter);
    const matchesStatus = statusFilter === "all" || apt.status === statusFilter;
    
    let matchesPrice = true;
    if (priceFilter === "under_1500") matchesPrice = apt.monthly_rent < 1500;
    else if (priceFilter === "1500_2500") matchesPrice = apt.monthly_rent >= 1500 && apt.monthly_rent < 2500;
    else if (priceFilter === "2500_3500") matchesPrice = apt.monthly_rent >= 2500 && apt.monthly_rent < 3500;
    else if (priceFilter === "over_3500") matchesPrice = apt.monthly_rent >= 3500;

    return matchesSearch && matchesBedrooms && matchesPrice && matchesStatus;
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-[#1a1f35] to-[#2d3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Find Your Perfect Apartment</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Quality apartments built and managed by Premier Construction
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto bg-white rounded-2xl p-2 shadow-2xl">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search by city or apartment name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-12 border-0 focus:ring-0"
                  />
                </div>
                <Button className="bg-[#ff6b35] hover:bg-[#ff8c5a] h-12 px-8">
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters & Listings */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <Card className="mb-8 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-5 h-5 text-[#ff6b35]" />
                <h3 className="text-lg font-semibold text-[#1a1f35]">Filter Results</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Bedrooms</label>
                  <Select value={bedroomFilter} onValueChange={setBedroomFilter}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Bedrooms</SelectItem>
                      <SelectItem value="1">1 Bedroom</SelectItem>
                      <SelectItem value="2">2 Bedrooms</SelectItem>
                      <SelectItem value="3">3 Bedrooms</SelectItem>
                      <SelectItem value="4">4+ Bedrooms</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Price Range</label>
                  <Select value={priceFilter} onValueChange={setPriceFilter}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="under_1500">Under $1,500</SelectItem>
                      <SelectItem value="1500_2500">$1,500 - $2,500</SelectItem>
                      <SelectItem value="2500_3500">$2,500 - $3,500</SelectItem>
                      <SelectItem value="over_3500">Over $3,500</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Availability</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBedroomFilter("all");
                      setPriceFilter("all");
                      setStatusFilter("available");
                      setSearchTerm("");
                    }}
                    className="w-full h-10"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-[#1a1f35]">{filteredApartments.length}</span> apartments
            </p>
          </div>

          {/* Apartment Grid */}
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
          ) : filteredApartments.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">No apartments found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredApartments.map((apartment) => (
                <Card key={apartment.id} className="group overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                  {apartment.images && apartment.images.length > 0 ? (
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={apartment.images[0]}
                        alt={apartment.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className={`${
                          apartment.status === 'available' ? 'bg-green-500' :
                          apartment.status === 'pending' ? 'bg-yellow-500' :
                          'bg-gray-500'
                        } text-white`}>
                          {apartment.status}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-lg">No Image</span>
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold text-[#1a1f35] mb-2 group-hover:text-[#ff6b35] transition-colors">
                      {apartment.title}
                    </h3>
                    
                    <div className="flex items-center gap-2 text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{apartment.city}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4 pb-4 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{apartment.bedrooms} Bed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{apartment.bathrooms} Bath</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Square className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{apartment.square_feet} sqft</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-1 text-2xl font-bold text-[#ff6b35]">
                          <DollarSign className="w-5 h-5" />
                          {apartment.monthly_rent?.toLocaleString()}
                        </div>
                        <span className="text-sm text-gray-500">per month</span>
                      </div>
                      {apartment.available_from && (
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            Available
                          </div>
                          <span className="text-xs text-gray-500">
                            {format(new Date(apartment.available_from), 'MMM d')}
                          </span>
                        </div>
                      )}
                    </div>

                    <Link to={createPageUrl(`ApartmentDetails?id=${apartment.id}`)}>
                      <Button className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a] text-white rounded-xl">
                        View Details & Apply
                      </Button>
                    </Link>
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