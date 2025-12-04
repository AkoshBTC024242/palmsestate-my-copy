import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, FileText, MessageSquare, TrendingUp } from "lucide-react";
import PropertyMetrics from "../components/owner/PropertyMetrics";
import DocumentManager from "../components/owner/DocumentManager";
import OwnerMessaging from "../components/owner/OwnerMessaging";
import OnboardingWalkthrough from "../components/shared/OnboardingWalkthrough";

export default function PropertyOwnerPortal() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (error) {
        base44.auth.redirectToLogin(window.location.pathname);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const { data: inquiries = [] } = useQuery({
    queryKey: ['owner-inquiries', user?.email],
    queryFn: () => base44.entities.PropertyOwnerInquiry.filter({ email: user.email }),
    enabled: !!user,
    initialData: []
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['owner-documents', user?.email],
    queryFn: () => base44.entities.OwnerDocument.filter({ owner_email: user.email }),
    enabled: !!user,
    initialData: []
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff6b35] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <OnboardingWalkthrough userEmail={user?.email} userType="owner" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1a1f35] mb-2">Property Owner Portal</h1>
          <p className="text-gray-600">Welcome back, {user?.full_name || user?.email}</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Inquiries</p>
                  <p className="text-3xl font-bold text-[#1a1f35]">{inquiries.length}</p>
                </div>
                <div className="w-12 h-12 bg-[#ff6b35]/10 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-[#ff6b35]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Documents</p>
                  <p className="text-3xl font-bold text-[#1a1f35]">{documents.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Active Inquiries</p>
                  <p className="text-3xl font-bold text-[#1a1f35]">
                    {inquiries.filter(i => i.status === 'new' || i.status === 'in_discussion').length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Manage Your Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="metrics" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="metrics">Performance Metrics</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
              </TabsList>

              <TabsContent value="metrics" className="mt-6">
                <PropertyMetrics userEmail={user?.email} />
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                <DocumentManager userEmail={user?.email} />
              </TabsContent>

              <TabsContent value="messages" className="mt-6">
                <OwnerMessaging userEmail={user?.email} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}