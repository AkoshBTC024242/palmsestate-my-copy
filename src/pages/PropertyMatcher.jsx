import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2, MapPin, Bed, Bath, Maximize, DollarSign, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PropertyMatcher() {
  const [budget, setBudget] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [location, setLocation] = useState("");
  const [amenities, setAmenities] = useState("");
  const [additionalPrefs, setAdditionalPrefs] = useState("");
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [aiRecommendation, setAiRecommendation] = useState("");

  const { data: apartments = [] } = useQuery({
    queryKey: ['apartments-available'],
    queryFn: () => base44.entities.Apartment.filter({ available: true }),
    initialData: []
  });

  const handleMatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMatches([]);
    setAiRecommendation("");

    try {
      const prompt = `You are a real estate matching assistant. Based on the user's preferences, analyze the available properties and recommend the best matches.

User Preferences:
- Budget: ${budget || 'Not specified'}
- Bedrooms: ${bedrooms || 'Not specified'}
- Location: ${location || 'Not specified'}
- Amenities: ${amenities || 'Not specified'}
- Additional: ${additionalPrefs || 'Not specified'}

Available Properties:
${JSON.stringify(apartments, null, 2)}

Return a JSON with:
1. "recommended_property_ids": array of the top 3-5 property IDs that best match (use actual IDs from the data)
2. "explanation": brief explanation of why these properties match the user's needs
3. "insights": any helpful insights or suggestions for the user`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            recommended_property_ids: {
              type: "array",
              items: { type: "string" }
            },
            explanation: { type: "string" },
            insights: { type: "string" }
          }
        }
      });

      const matchedApartments = apartments.filter(apt => 
        result.recommended_property_ids.includes(apt.id)
      );

      setMatches(matchedApartments);
      setAiRecommendation(result.explanation + "\n\n" + result.insights);
    } catch (error) {
      console.error("Matching error:", error);
      alert("Failed to find matches. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-[#1a1f35] to-[#2d3748]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-[#ff6b35]" />
              <span className="text-sm font-medium">AI-Powered Property Matching</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Find Your Perfect Home</h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tell us what you're looking for, and our AI will match you with the best properties
            </p>
          </div>
        </div>
      </section>

      {/* Matching Form */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={handleMatch} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Budget (Monthly Rent)</Label>
                    <Input
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      placeholder="e.g., $1500 or $1000-$2000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Bedrooms</Label>
                    <Input
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      placeholder="e.g., 2 or 2-3"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Preferred Location</Label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Downtown Charlotte, near schools, quiet neighborhood"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Must-Have Amenities</Label>
                  <Input
                    value={amenities}
                    onChange={(e) => setAmenities(e.target.value)}
                    placeholder="e.g., parking, pet-friendly, gym, pool"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Additional Preferences</Label>
                  <Textarea
                    value={additionalPrefs}
                    onChange={(e) => setAdditionalPrefs(e.target.value)}
                    rows={4}
                    placeholder="Any other requirements or preferences? (e.g., move-in date, floor preference, accessibility needs)"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a] text-white h-14 text-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Finding Perfect Matches...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Find My Perfect Home
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* AI Recommendation */}
          {aiRecommendation && (
            <Card className="mt-8 bg-gradient-to-br from-[#ff6b35]/10 to-[#ff8c5a]/10 border-[#ff6b35]/20">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#ff6b35] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#1a1f35] mb-2">AI Recommendation</h3>
                    <p className="text-gray-700 whitespace-pre-line leading-relaxed">{aiRecommendation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Matched Properties */}
          {matches.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-[#1a1f35] mb-6">Your Perfect Matches</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.map((apt, idx) => (
                  <Card key={apt.id} className="hover-lift overflow-hidden border-2 border-[#ff6b35]/20">
                    <div className="relative h-48">
                      <img
                        src={apt.images?.[0] || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80"}
                        alt={apt.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-[#ff6b35] text-white border-0">
                        Match #{idx + 1}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-[#1a1f35] mb-3">{apt.title}</h3>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-5 h-5 text-[#ff6b35]" />
                        <span className="text-2xl font-bold text-[#1a1f35]">
                          ${apt.monthly_rent?.toLocaleString()}
                        </span>
                        <span className="text-gray-500">/month</span>
                      </div>

                      <div className="flex items-center gap-4 mb-4 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Bed className="w-4 h-4" />
                          <span className="text-sm">{apt.bedrooms} Bed</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="w-4 h-4" />
                          <span className="text-sm">{apt.bathrooms} Bath</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Maximize className="w-4 h-4" />
                          <span className="text-sm">{apt.size_sqft} sqft</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{apt.location}</span>
                      </div>

                      <Link to={createPageUrl("Rentals")}>
                        <Button className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a]">
                          View Details
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}