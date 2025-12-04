import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle2, Mail, DollarSign, FileText, LogOut, User, Heart, Bell, MapPin, Bed, Bath, Maximize, Upload, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ApplicantDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingReceipt, setUploadingReceipt] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        base44.auth.redirectToLogin(window.location.href);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const { data: applicationFees = [] } = useQuery({
    queryKey: ['my-application-fees', user?.email],
    queryFn: () => base44.entities.ApplicationFee.filter({ applicant_email: user?.email }, '-created_date'),
    enabled: !!user?.email,
    initialData: []
  });

  const { data: applications = [] } = useQuery({
    queryKey: ['my-applications', user?.email],
    queryFn: () => base44.entities.RentalApplication.filter({ email: user?.email }, '-created_date'),
    enabled: !!user?.email,
    initialData: []
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['my-favorites', user?.email],
    queryFn: () => base44.entities.Favorite.filter({ user_email: user?.email }, '-created_date'),
    enabled: !!user?.email,
    initialData: []
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ['my-notifications', user?.email],
    queryFn: () => base44.entities.Notification.filter({ user_email: user?.email, read: false }, '-created_date'),
    enabled: !!user?.email,
    initialData: []
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: (id) => base44.entities.Favorite.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-favorites'] });
      toast.success("Removed from favorites");
    }
  });

  const uploadReceiptMutation = useMutation({
    mutationFn: async ({ feeId, file }) => {
      setUploadingReceipt(feeId);
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await base44.entities.ApplicationFee.update(feeId, {
        payment_proof_url: file_url,
        status: 'payment_pending_verification'
      });
      return file_url;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-application-fees'] });
      setUploadingReceipt(null);
      setReceiptFile(null);
      toast.success("Receipt uploaded successfully!");
    },
    onError: () => {
      setUploadingReceipt(null);
      toast.error("Failed to upload receipt");
    }
  });

  const handleLogout = () => {
    base44.auth.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#ff6b35] mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const statusConfig = {
    pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Awaiting Admin' },
    instructions_sent: { icon: Mail, color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Instructions Sent' },
    payment_pending_verification: { icon: DollarSign, color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Pending Verification' },
    verified: { icon: CheckCircle2, color: 'bg-green-100 text-green-800 border-green-200', label: 'Verified' },
    rejected: { icon: Clock, color: 'bg-red-100 text-red-800 border-red-200', label: 'Rejected' }
  };

  const pendingActions = applicationFees.filter(f => f.status === 'instructions_sent').length;
  const unreadNotifications = notifications.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#1a1f35] mb-2">Welcome Back!</h1>
                <p className="text-gray-600 text-lg">{user?.full_name || user?.email}</p>
                {pendingActions > 0 && (
                  <Badge className="mt-2 bg-orange-100 text-orange-800 border-orange-200">
                    {pendingActions} action{pendingActions > 1 ? 's' : ''} required
                  </Badge>
                )}
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2 border-2 hover:bg-red-50 hover:border-red-300"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-2xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-blue-700 font-medium mb-1">Application Fees</p>
                  <p className="text-3xl font-bold text-blue-900">{applicationFees.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-2xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <FileText className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-purple-700 font-medium mb-1">Applications</p>
                  <p className="text-3xl font-bold text-purple-900">{applications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-gradient-to-br from-pink-50 to-pink-100/50 hover:shadow-2xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-pink-700 font-medium mb-1">Favorites</p>
                  <p className="text-3xl font-bold text-pink-900">{favorites.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-green-100/50 hover:shadow-2xl transition-all">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-green-700 font-medium mb-1">Verified</p>
                  <p className="text-3xl font-bold text-green-900">
                    {applicationFees.filter(f => f.status === 'verified').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="fees" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-14 bg-white shadow-lg rounded-2xl p-1">
            <TabsTrigger value="fees" className="rounded-xl data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white text-xs sm:text-sm">
              Fees
            </TabsTrigger>
            <TabsTrigger value="applications" className="rounded-xl data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white text-xs sm:text-sm">
              Applications
            </TabsTrigger>
            <TabsTrigger value="favorites" className="rounded-xl data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white text-xs sm:text-sm">
              Favorites
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-xl data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white relative text-xs sm:text-sm">
              Alerts
              {unreadNotifications > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 h-5 min-w-5">
                  {unreadNotifications}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fees">
            <Card className="border-0 shadow-xl">
              <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <DollarSign className="w-6 h-6 text-[#ff6b35]" />
                  Application Fee Status
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {applicationFees.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg mb-2">No application fees yet</p>
                    <p className="text-sm text-gray-400 mb-6">Browse available apartments to get started</p>
                    <Link to={createPageUrl("Rentals")}>
                      <Button className="bg-[#ff6b35] hover:bg-[#ff8c5a]">Browse Apartments</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applicationFees.map((fee) => {
                      const config = statusConfig[fee.status] || statusConfig.pending;
                      const StatusIcon = config.icon;
                      const isUploadingThis = uploadingReceipt === fee.id;
                      
                      return (
                        <Card key={fee.id} className="border-2 hover:shadow-lg transition-all">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="font-bold text-xl text-[#1a1f35] mb-2">{fee.apartment_title}</h3>
                                <Badge className={`${config.color} border flex items-center gap-1 w-fit text-sm px-3 py-1`}>
                                  <StatusIcon className="w-4 h-4" />
                                  {config.label}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <p className="text-3xl font-bold text-green-600">${fee.amount || 85}</p>
                                <p className="text-xs text-gray-500 uppercase">{fee.payment_method}</p>
                              </div>
                            </div>

                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
                              <p className="text-sm text-gray-600 mb-1 font-medium">Tracking Code</p>
                              <p className="font-mono font-bold text-blue-600 text-lg">{fee.transaction_id}</p>
                            </div>

                            {(fee.payment_tag && fee.payment_tag !== 'Awaiting Tag') && (
                              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mb-4">
                                <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                  <DollarSign className="w-5 h-5" />
                                  Payment Details from Admin
                                </h4>
                                <div className="space-y-2">
                                  <div>
                                    <p className="text-xs text-blue-700 font-medium">Payment Tag</p>
                                    <p className="font-mono font-bold text-blue-900">{fee.payment_tag}</p>
                                  </div>
                                  {fee.payment_id && fee.payment_id !== 'Awaiting ID' && (
                                    <div>
                                      <p className="text-xs text-blue-700 font-medium">Payment ID</p>
                                      <p className="font-mono font-bold text-blue-900">{fee.payment_id}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {fee.status === 'instructions_sent' && !fee.payment_proof_url && (
                              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-5 mb-4">
                                <p className="text-sm text-blue-900 font-semibold mb-3 flex items-center gap-2">
                                  <Upload className="w-5 h-5" />
                                  Upload Your Payment Receipt
                                </p>
                                <form onSubmit={(e) => {
                                  e.preventDefault();
                                  if (receiptFile) {
                                    uploadReceiptMutation.mutate({ feeId: fee.id, file: receiptFile });
                                  }
                                }} className="space-y-3">
                                  <div>
                                    <Label className="text-sm font-semibold text-blue-900">Payment Receipt</Label>
                                    <Input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => setReceiptFile(e.target.files[0])}
                                      className="mt-1"
                                      disabled={isUploadingThis}
                                    />
                                  </div>
                                  <Button
                                    type="submit"
                                    disabled={!receiptFile || isUploadingThis}
                                    className="w-full bg-blue-600 hover:bg-blue-700"
                                  >
                                    {isUploadingThis ? (
                                      <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Uploading...
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="w-4 h-4 mr-2" />
                                        Submit Receipt
                                      </>
                                    )}
                                  </Button>
                                </form>
                              </div>
                            )}

                            {fee.status === 'payment_pending_verification' && (
                              <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4 mb-4">
                                <p className="text-sm text-purple-900 font-semibold flex items-center gap-2">
                                  <Clock className="w-5 h-5" />
                                  Payment pending verification by admin
                                </p>
                              </div>
                            )}

                            {fee.status === 'verified' && (
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-5 mb-4 shadow-sm">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                      <CheckCircle2 className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-sm text-green-900 font-bold">Payment Verified!</p>
                                      <p className="text-xs text-green-700">
                                        {fee.verified_date ? format(new Date(fee.verified_date), 'MMM d, yyyy h:mm a') : 'Recently'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-sm text-green-800 mb-4">
                                  🎉 Great news! Your payment has been verified. You can now proceed to complete your rental application.
                                </p>
                                <Link to={createPageUrl("Rentals")}>
                                  <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Complete Application Now
                                  </Button>
                                </Link>
                              </div>
                            )}

                            <p className="text-xs text-gray-500">
                              Submitted: {format(new Date(fee.created_date), 'MMM d, yyyy h:mm a')}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications">
            <Card className="border-0 shadow-xl">
              <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <FileText className="w-6 h-6 text-[#ff6b35]" />
                  My Applications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {applications.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">No rental applications yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {applications.map((app) => {
                      const appStatusColors = {
                        submitted: 'bg-blue-100 text-blue-800 border-blue-200',
                        under_review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                        documents_requested: 'bg-orange-100 text-orange-800 border-orange-200',
                        background_check: 'bg-purple-100 text-purple-800 border-purple-200',
                        partially_approved: 'bg-teal-100 text-teal-800 border-teal-200',
                        approved: 'bg-green-100 text-green-800 border-green-200',
                        rejected: 'bg-red-100 text-red-800 border-red-200'
                      };
                      
                      return (
                        <Card key={app.id} className="border-2 hover:shadow-lg transition-all">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="font-bold text-xl text-[#1a1f35] mb-2">{app.apartment_title}</h3>
                                <Badge className={`${appStatusColors[app.status] || 'bg-gray-100 text-gray-800'} border text-sm px-3 py-1 capitalize`}>
                                  {app.status?.replace(/_/g, ' ')}
                                </Badge>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500 mb-1">Tracking #</p>
                                <p className="font-mono font-bold text-blue-600">{app.tracking_number}</p>
                              </div>
                            </div>

                            {/* Application Details Grid */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <p className="text-gray-600 mb-1">Full Name</p>
                                  <p className="font-semibold text-[#1a1f35]">{app.full_name}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600 mb-1">Email</p>
                                  <p className="font-semibold text-[#1a1f35] truncate">{app.email}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600 mb-1">Phone</p>
                                  <p className="font-semibold text-[#1a1f35]">{app.phone}</p>
                                </div>
                                <div>
                                  <p className="text-gray-600 mb-1">Move-in Date</p>
                                  <p className="font-semibold text-[#1a1f35]">
                                    {app.move_in_date ? format(new Date(app.move_in_date), 'MMM d, yyyy') : 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Employment & Financial */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-4">
                              <div className="bg-white rounded-lg p-3 border">
                                <p className="text-gray-600 mb-1">Employment Status</p>
                                <p className="font-semibold text-[#1a1f35] capitalize">{app.employment_status?.replace(/-/g, ' ')}</p>
                              </div>
                              {app.employer_name && (
                                <div className="bg-white rounded-lg p-3 border">
                                  <p className="text-gray-600 mb-1">Employer</p>
                                  <p className="font-semibold text-[#1a1f35]">{app.employer_name}</p>
                                </div>
                              )}
                              {app.monthly_income && (
                                <div className="bg-white rounded-lg p-3 border">
                                  <p className="text-gray-600 mb-1">Monthly Income</p>
                                  <p className="font-semibold text-green-600">${app.monthly_income?.toLocaleString()}</p>
                                </div>
                              )}
                            </div>

                            {/* Additional Details */}
                            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                              <div className="bg-white rounded-lg p-3 border">
                                <p className="text-gray-600 mb-1">Number of Occupants</p>
                                <p className="font-semibold text-[#1a1f35]">{app.number_of_occupants || 1} person(s)</p>
                              </div>
                              <div className="bg-white rounded-lg p-3 border">
                                <p className="text-gray-600 mb-1">Pets</p>
                                <p className="font-semibold text-[#1a1f35]">{app.has_pets ? 'Yes' : 'No'}</p>
                              </div>
                            </div>

                            {app.admin_notes && (
                              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                <p className="text-sm font-semibold text-yellow-900 mb-1">📝 Admin Note:</p>
                                <p className="text-sm text-yellow-800">{app.admin_notes}</p>
                              </div>
                            )}

                            {app.status === 'approved' && (
                              <div className="mt-4 bg-green-50 border-2 border-green-300 rounded-lg p-4">
                                <p className="text-sm font-semibold text-green-900 mb-2 flex items-center gap-2">
                                  <CheckCircle2 className="w-5 h-5" />
                                  🎉 Congratulations! Application Approved
                                </p>
                                <p className="text-sm text-green-700">Our team will contact you shortly with next steps for lease signing and move-in.</p>
                              </div>
                            )}

                            <p className="text-xs text-gray-500 mt-4">
                              Submitted: {format(new Date(app.created_date), 'MMM d, yyyy h:mm a')}
                            </p>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
            <Card className="border-0 shadow-xl">
              <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Heart className="w-6 h-6 text-[#ff6b35]" />
                  Saved Properties
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {favorites.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg mb-2">No saved properties yet</p>
                    <p className="text-sm text-gray-400 mb-6">Save apartments you're interested in for quick access</p>
                    <Link to={createPageUrl("Rentals")}>
                      <Button className="bg-[#ff6b35] hover:bg-[#ff8c5a]">Browse Apartments</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map((fav) => (
                      <Card key={fav.id} className="border-2 hover:shadow-lg transition-all overflow-hidden">
                        {fav.apartment_image && (
                          <img src={fav.apartment_image} alt={fav.apartment_title} className="w-full h-48 object-cover" />
                        )}
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg text-[#1a1f35] mb-2">{fav.apartment_title}</h3>
                          <p className="text-2xl font-bold text-[#ff6b35] mb-3">${fav.monthly_rent?.toLocaleString()}/mo</p>
                          <div className="flex gap-2">
                            <Link to={createPageUrl("Rentals")} className="flex-1">
                              <Button variant="outline" className="w-full">View Details</Button>
                            </Link>
                            <Button
                              variant="outline"
                              onClick={() => removeFavoriteMutation.mutate(fav.id)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="border-0 shadow-xl">
              <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Bell className="w-6 h-6 text-[#ff6b35]" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {notifications.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Bell className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-lg">No new notifications</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {notifications.map((notif) => (
                      <Card key={notif.id} className="border-l-4 border-[#ff6b35]">
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-[#1a1f35] mb-1">{notif.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{notif.message}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(notif.created_date), 'MMM d, yyyy h:mm a')}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}