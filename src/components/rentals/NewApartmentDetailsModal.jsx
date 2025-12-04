import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bed, Bath, Maximize, MapPin, DollarSign, Calendar, Car, Home, Shield, CheckCircle2, Lock } from "lucide-react";
import ImageGallery from "./ImageGallery";
import VirtualTour from "../shared/VirtualTour";
import AmenityIcon from "../shared/AmenityIcon";
import CostCalculator from "./CostCalculator";
import ApplicationFeePayment from "./ApplicationFeePayment";
import ApplyModal from "./ApplyModal";
import { toast } from "sonner";

export default function NewApartmentDetailsModal({ apartment, isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("details");
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch {}
    };
    loadUser();
  }, []);

  // Check for verified application fee
  const { data: verifiedFee } = useQuery({
    queryKey: ['verified-fee', apartment.id, user?.email],
    queryFn: async () => {
      if (!user) return null;
      const fees = await base44.entities.ApplicationFee.filter({
        apartment_id: apartment.id,
        applicant_email: user.email,
        status: 'verified'
      }, '-created_date', 1);
      return fees[0] || null;
    },
    enabled: !!user && activeTab !== "details"
  });

  const handleApplyClick = async () => {
    if (!user) {
      toast.info("Please sign in to apply for this apartment");
      base44.auth.redirectToLogin(`${window.location.pathname}?apartment=${apartment.id}`);
      return;
    }
    setActiveTab("apply");
  };

  const handleTourClick = async () => {
    if (!user) {
      toast.info("Please sign in to schedule a tour");
      base44.auth.redirectToLogin(`${window.location.pathname}?apartment=${apartment.id}`);
      return;
    }
    setActiveTab("tour");
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto p-0">
          <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
            <h2 className="text-2xl font-bold text-[#1a1f35]">{apartment.title}</h2>
            <p className="text-gray-600 mt-1">{apartment.location}</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="sticky top-[73px] z-10 bg-white border-b">
              <TabsList className="w-full flex justify-center h-14 bg-gray-50">
                <TabsTrigger value="details" className="flex-1 max-w-[200px]">Property Details</TabsTrigger>
                <TabsTrigger value="tour" className="flex-1 max-w-[200px]">Schedule Tour</TabsTrigger>
                <TabsTrigger value="apply" className="flex-1 max-w-[200px]">Apply Now</TabsTrigger>
              </TabsList>
            </div>

            <div className="px-6 py-6">
              <TabsContent value="details" className="space-y-6 mt-0">
                {apartment.images?.length > 0 && <ImageGallery images={apartment.images} apartmentTitle={apartment.title} />}
                {apartment.virtual_tour_url && <VirtualTour url={apartment.virtual_tour_url} title={apartment.title} />}

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-inner">
                  <div className="flex items-baseline gap-2 mb-6">
                    <DollarSign className="w-8 h-8 text-[#ff6b35]" />
                    <span className="text-4xl font-bold text-[#1a1f35]">${apartment.monthly_rent?.toLocaleString()}</span>
                    <span className="text-xl text-gray-500">/month</span>
                  </div>
                  {apartment.security_deposit > 0 && (
                    <div className="flex items-center gap-2 bg-blue-50 border-2 border-blue-200 rounded-xl px-4 py-3 mb-4">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-700">Security Deposit: <strong className="text-blue-600">${apartment.security_deposit?.toLocaleString()}</strong></span>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                      <Bed className="w-6 h-6 text-[#ff6b35] mx-auto mb-2" />
                      <p className="text-2xl font-bold">{apartment.bedrooms}</p>
                      <p className="text-sm text-gray-500">Bedrooms</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                      <Bath className="w-6 h-6 text-[#ff6b35] mx-auto mb-2" />
                      <p className="text-2xl font-bold">{apartment.bathrooms}</p>
                      <p className="text-sm text-gray-500">Bathrooms</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 text-center shadow-sm">
                      <Maximize className="w-6 h-6 text-[#ff6b35] mx-auto mb-2" />
                      <p className="text-2xl font-bold">{apartment.size_sqft}</p>
                      <p className="text-sm text-gray-500">sq ft</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 border-2">
                  <h3 className="text-xl font-bold text-[#1a1f35] mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed">{apartment.description}</p>
                </div>

                <div className="bg-white rounded-xl p-6 border-2">
                  <h3 className="text-xl font-bold text-[#1a1f35] mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#ff6b35]" />
                    Location
                  </h3>
                  <p className="text-gray-700 font-medium">{apartment.location}</p>
                  <p className="text-gray-600 text-sm mt-1">{[apartment.city, apartment.state, apartment.zip_code].filter(Boolean).join(', ')}</p>
                </div>

                {apartment.amenities?.length > 0 && (
                  <div className="bg-white rounded-xl p-6 border-2">
                    <h3 className="text-xl font-bold text-[#1a1f35] mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {apartment.amenities.map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <AmenityIcon amenity={amenity} className="w-5 h-5 text-green-600" />
                          </div>
                          <span className="text-gray-800 font-medium text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  {apartment.parking && <Badge className="bg-blue-100 text-blue-800 border-blue-300 text-sm px-4 py-2"><Car className="w-4 h-4 mr-1" /> Parking Available</Badge>}
                  {apartment.pets_allowed && <Badge className="bg-green-100 text-green-800 border-green-300 text-sm px-4 py-2"><Home className="w-4 h-4 mr-1" /> Pets Allowed</Badge>}
                  {apartment.furnishing && <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-sm px-4 py-2">{apartment.furnishing}</Badge>}
                </div>

                <CostCalculator apartment={apartment} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sticky bottom-0 bg-white pt-4 border-t">
                  <Button onClick={handleTourClick} variant="outline" className="h-14 text-lg border-2 border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Tour
                  </Button>
                  <Button onClick={handleApplyClick} className="bg-[#ff6b35] hover:bg-[#ff8c5a] h-14 text-lg">
                    Apply Now
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="tour" className="space-y-6 mt-0">
                {!user ? (
                  <div className="text-center py-12">
                    <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-[#1a1f35] mb-2">Sign In Required</h3>
                    <p className="text-gray-600 mb-6">Please sign in to schedule a property tour</p>
                    <Button onClick={() => base44.auth.redirectToLogin()} className="bg-[#ff6b35] hover:bg-[#ff8c5a]">
                      Sign In
                    </Button>
                  </div>
                ) : !verifiedFee ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <Shield className="w-6 h-6 text-blue-600 mt-1" />
                        <div>
                          <h3 className="font-bold text-lg text-blue-900 mb-2">Application Fee Required</h3>
                          <p className="text-blue-700 mb-4">
                            To maintain quality and ensure serious applicants, we require an application fee before scheduling tours.
                            This fee covers background checks and administrative processing.
                          </p>
                          <ul className="text-sm text-blue-600 space-y-1 ml-5 list-disc">
                            <li>One-time fee per application</li>
                            <li>Instant processing available</li>
                            <li>Secure payment via Zelle or Chime</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <ApplicationFeePayment apartment={apartment} applicantInfo={{ email: user.email }} onPaymentVerified={() => {}} />
                  </div>
                ) : (
                  <div>
                    <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 mb-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                        <div>
                          <h3 className="font-bold text-green-900">Application Fee Verified</h3>
                          <p className="text-sm text-green-700">You can now schedule a tour for this property</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-gray-600">Virtual tour and scheduling features coming soon!</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="apply" className="space-y-6 mt-0">
                {!user ? (
                  <div className="text-center py-12">
                    <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-[#1a1f35] mb-2">Sign In Required</h3>
                    <p className="text-gray-600 mb-6">Please sign in to apply for this apartment</p>
                    <Button onClick={() => base44.auth.redirectToLogin()} className="bg-[#ff6b35] hover:bg-[#ff8c5a]">
                      Sign In
                    </Button>
                  </div>
                ) : !verifiedFee ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-xl p-6">
                      <div className="flex items-start gap-3">
                        <Shield className="w-6 h-6 text-blue-600 mt-1" />
                        <div>
                          <h3 className="font-bold text-xl text-blue-900 mb-2">Why We Require an Application Fee</h3>
                          <p className="text-blue-700 mb-4">
                            The application fee ensures a serious rental process and covers:
                          </p>
                          <ul className="text-blue-700 space-y-2 ml-5 list-disc">
                            <li><strong>Comprehensive Background Check</strong> - Criminal history and rental verification</li>
                            <li><strong>Credit Report</strong> - Full credit analysis and financial screening</li>
                            <li><strong>Employment Verification</strong> - Direct confirmation with employers</li>
                            <li><strong>Administrative Processing</strong> - Professional review and processing of your application</li>
                          </ul>
                          <div className="mt-4 p-4 bg-white rounded-lg">
                            <p className="text-sm text-blue-900"><strong>✓ Secure Payment</strong> - Your payment is protected</p>
                            <p className="text-sm text-blue-900"><strong>✓ Fast Processing</strong> - Get approved within 24-48 hours</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ApplicationFeePayment apartment={apartment} applicantInfo={{ email: user.email }} onPaymentVerified={() => {}} />
                  </div>
                ) : (
                  <div>
                    <div className="bg-green-50 border-2 border-green-300 rounded-xl p-6 mb-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                        <div>
                          <h3 className="font-bold text-green-900">Application Fee Verified!</h3>
                          <p className="text-sm text-green-700">You can now complete your rental application</p>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => setShowApplyModal(true)} className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a] h-14 text-lg">
                      Complete Application Form
                    </Button>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      {showApplyModal && (
        <ApplyModal apartment={apartment} isOpen={showApplyModal} onClose={() => setShowApplyModal(false)} />
      )}
    </>
  );
}