import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Wrench, MessageSquare, Home, LogOut, CreditCard, RefreshCw, Send } from "lucide-react";
import LeaseView from "../components/tenant/LeaseView";
import AILeaseAnalyzer from "../components/admin/AILeaseAnalyzer";
import MaintenanceRequests from "../components/tenant/MaintenanceRequests";
import TenantMessages from "../components/tenant/TenantMessages";
import RentPayment from "../components/tenant/RentPayment";
import DirectMessaging from "../components/tenant/DirectMessaging";
import LeaseRenewal from "../components/tenant/LeaseRenewal";
import PaymentHistory from "../components/tenant/PaymentHistory";
import OnboardingWalkthrough from "../components/shared/OnboardingWalkthrough";
import PropertyInspectionForm from "../components/tenant/PropertyInspectionForm";

export default function TenantPortal() {
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

  const { data: leases = [] } = useQuery({
    queryKey: ['tenant-leases', user?.email],
    queryFn: () => base44.entities.LeaseAgreement.filter({ tenant_email: user?.email }, '-created_date'),
    enabled: !!user?.email,
    initialData: []
  });

  const { data: maintenanceRequests = [] } = useQuery({
    queryKey: ['tenant-maintenance', user?.email],
    queryFn: () => base44.entities.MaintenanceRequest.filter({ tenant_email: user?.email }, '-created_date'),
    enabled: !!user?.email,
    initialData: []
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['tenant-messages', user?.email],
    queryFn: () => base44.entities.TenantMessage.filter({ tenant_email: user?.email }, '-created_date'),
    enabled: !!user?.email,
    initialData: []
  });

  const { data: inspections = [] } = useQuery({
    queryKey: ['tenant-inspections', user?.email],
    queryFn: () => base44.entities.PropertyInspection.filter({ tenant_email: user?.email }, '-created_date'),
    enabled: !!user?.email,
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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <OnboardingWalkthrough userEmail={user?.email} userType="tenant" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1a1f35]">Tenant Portal</h1>
            <p className="text-gray-600 mt-1">Welcome, {user.full_name}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => base44.auth.logout()}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Leases</p>
                  <p className="text-2xl font-bold">{leases.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Wrench className="w-6 h-6 text-[#ff6b35]" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Maintenance</p>
                  <p className="text-2xl font-bold">{maintenanceRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Messages</p>
                  <p className="text-2xl font-bold">{messages.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Home className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Active Leases</p>
                  <p className="text-2xl font-bold">
                    {leases.filter(l => l.status === 'active' || l.status === 'signed').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="leases" className="w-full">
              <TabsList className="flex flex-wrap w-full gap-2 h-auto p-2 bg-gray-100 rounded-lg mb-6">
                <TabsTrigger value="leases" className="flex items-center gap-1 px-4 py-2">
                  <FileText className="w-4 h-4" />
                  <span className="hidden sm:inline">Leases</span>
                </TabsTrigger>
                <TabsTrigger value="payment-history" className="flex items-center gap-1 px-4 py-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="hidden sm:inline">Payment History</span>
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex items-center gap-1 px-4 py-2">
                  <CreditCard className="w-4 h-4" />
                  <span className="hidden sm:inline">Pay Rent</span>
                </TabsTrigger>
                <TabsTrigger value="renewal" className="flex items-center gap-1 px-4 py-2">
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline">Renewal</span>
                </TabsTrigger>
                <TabsTrigger value="maintenance" className="flex items-center gap-1 px-4 py-2">
                  <Wrench className="w-4 h-4" />
                  <span className="hidden sm:inline">Maintenance</span>
                </TabsTrigger>
                <TabsTrigger value="messaging" className="flex items-center gap-1 px-4 py-2">
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Direct Msg</span>
                </TabsTrigger>
                <TabsTrigger value="messages" className="flex items-center gap-1 px-4 py-2">
                  <MessageSquare className="w-4 h-4" />
                  <span className="hidden sm:inline">Legacy</span>
                </TabsTrigger>
                <TabsTrigger value="inspections" className="flex items-center gap-1 px-4 py-2">
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Inspections</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="leases">
                <LeaseView leases={leases} />
              </TabsContent>

              <TabsContent value="payment-history">
                <PaymentHistory userEmail={user.email} />
              </TabsContent>

              <TabsContent value="payments">
                <RentPayment userEmail={user.email} userName={user.full_name} />
              </TabsContent>

              <TabsContent value="renewal">
                <LeaseRenewal userEmail={user.email} />
              </TabsContent>

              <TabsContent value="maintenance">
                <MaintenanceRequests userEmail={user.email} userName={user.full_name} />
              </TabsContent>

              <TabsContent value="messaging">
                <DirectMessaging userEmail={user.email} userName={user.full_name} />
              </TabsContent>

              <TabsContent value="messages">
                <TenantMessages userEmail={user.email} userName={user.full_name} />
              </TabsContent>

              <TabsContent value="inspections">
                {leases.filter(l => l.status === 'active' || l.status === 'signed').length > 0 ? (
                  <div className="space-y-6">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                      <p className="text-sm text-blue-900">
                        <strong>Note:</strong> Document your property's condition for move-in or move-out
                      </p>
                    </div>
                    {leases.filter(l => l.status === 'active' || l.status === 'signed').map(lease => (
                      <PropertyInspectionForm key={lease.id} lease={lease} type="move_in" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No active leases for inspection</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}