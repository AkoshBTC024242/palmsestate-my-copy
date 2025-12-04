import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, Clock, FileText, DollarSign, Calendar, 
  Mail, User, Home, ArrowRight, AlertCircle, Shield
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AdminOnboarding() {
  const { data: approvedApplications = [] } = useQuery({
    queryKey: ['approved-applications'],
    queryFn: () => base44.entities.RentalApplication.filter({ status: 'approved' }, '-created_date'),
    initialData: []
  });

  const { data: allLeases = [] } = useQuery({
    queryKey: ['all-leases'],
    queryFn: () => base44.entities.LeaseAgreement.list('-created_date'),
    initialData: []
  });

  const { data: inspections = [] } = useQuery({
    queryKey: ['move-in-inspections'],
    queryFn: () => base44.entities.PropertyInspection.filter({ inspection_type: 'move_in' }, '-created_date'),
    initialData: []
  });

  // Build onboarding status for each approved applicant
  const onboardingStatuses = approvedApplications.map(app => {
    const lease = allLeases.find(l => l.application_id === app.id);
    const inspection = inspections.find(i => i.lease_id === lease?.id);
    
    const steps = [
      {
        label: "Application Approved",
        status: "completed",
        date: app.updated_date,
        icon: CheckCircle2
      },
      {
        label: "Lease Generated",
        status: lease ? "completed" : "pending",
        date: lease?.created_date,
        icon: FileText
      },
      {
        label: "Lease Signed",
        status: lease?.status === 'signed' || lease?.status === 'active' ? "completed" : 
                lease ? "in_progress" : "pending",
        date: lease?.tenant_signed_date,
        icon: FileText
      },
      {
        label: "Security Deposit",
        status: lease?.status === 'active' ? "completed" : 
                lease?.status === 'signed' ? "in_progress" : "pending",
        date: null,
        icon: DollarSign
      },
      {
        label: "Move-In Inspection",
        status: inspection?.status === 'completed' ? "completed" :
                inspection ? "in_progress" : "pending",
        date: inspection?.inspection_date,
        icon: Home
      }
    ];

    const completedSteps = steps.filter(s => s.status === 'completed').length;
    const totalSteps = steps.length;
    const progressPercentage = (completedSteps / totalSteps) * 100;

    return {
      ...app,
      lease,
      inspection,
      steps,
      completedSteps,
      totalSteps,
      progressPercentage,
      currentStep: steps.find(s => s.status === 'in_progress') || steps.find(s => s.status === 'pending')
    };
  });

  const activeOnboarding = onboardingStatuses.filter(o => o.completedSteps < o.totalSteps);
  const completedOnboarding = onboardingStatuses.filter(o => o.completedSteps === o.totalSteps);

  const statusColors = {
    completed: { bg: "bg-green-100", text: "text-green-800", icon: CheckCircle2 },
    in_progress: { bg: "bg-blue-100", text: "text-blue-800", icon: Clock },
    pending: { bg: "bg-gray-100", text: "text-gray-600", icon: AlertCircle }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-gray-800 border-b border-gray-700 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-7 h-7 text-white" />
                </div>
                Tenant Onboarding
              </h1>
              <p className="text-gray-300 mt-2 ml-17 text-lg">Track approved applicants through move-in process</p>
            </div>
            <Link to={createPageUrl("AdminPanel")}>
              <Button variant="outline" className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600">
                <Home className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Active Onboarding</p>
                  <p className="text-4xl font-bold">{activeOnboarding.length}</p>
                </div>
                <Clock className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm mb-1">Completed</p>
                  <p className="text-4xl font-bold">{completedOnboarding.length}</p>
                </div>
                <CheckCircle2 className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm mb-1">Total Approved</p>
                  <p className="text-4xl font-bold">{approvedApplications.length}</p>
                </div>
                <User className="w-12 h-12 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 h-14 bg-slate-800 shadow-lg rounded-2xl p-1 border border-gray-700">
            <TabsTrigger 
              value="active" 
              className="rounded-xl data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white text-gray-300"
            >
              Active Onboarding ({activeOnboarding.length})
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="rounded-xl data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white text-gray-300"
            >
              Completed ({completedOnboarding.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {activeOnboarding.length === 0 ? (
              <Card className="border-gray-700 bg-slate-800">
                <CardContent className="p-16 text-center">
                  <Clock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No active onboarding processes</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {activeOnboarding.map((onboarding) => (
                  <Card key={onboarding.id} className="border-2 border-gray-700 bg-slate-800 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-slate-700 to-gray-700 border-b border-gray-600">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-white text-2xl mb-2">{onboarding.full_name}</CardTitle>
                          <div className="flex items-center gap-4 text-gray-300">
                            <span className="flex items-center gap-1">
                              <Home className="w-4 h-4" />
                              {onboarding.apartment_title}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {onboarding.email}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm mb-1">Progress</p>
                          <p className="text-3xl font-bold text-[#ff6b35]">
                            {onboarding.completedSteps}/{onboarding.totalSteps}
                          </p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6">
                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Onboarding Progress</span>
                          <span>{Math.round(onboarding.progressPercentage)}%</span>
                        </div>
                        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] transition-all duration-500"
                            style={{ width: `${onboarding.progressPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Current Step Highlight */}
                      {onboarding.currentStep && (
                        <div className="bg-blue-900/30 border-2 border-blue-500 rounded-lg p-4 mb-6">
                          <p className="text-blue-300 text-sm font-semibold mb-1">Current Step:</p>
                          <p className="text-white text-lg flex items-center gap-2">
                            <onboarding.currentStep.icon className="w-5 h-5" />
                            {onboarding.currentStep.label}
                          </p>
                        </div>
                      )}

                      {/* Steps Timeline */}
                      <div className="space-y-4">
                        {onboarding.steps.map((step, index) => {
                          const StepIcon = step.icon;
                          const colors = statusColors[step.status];
                          
                          return (
                            <div key={index} className="flex items-start gap-4">
                              <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                                <StepIcon className={`w-6 h-6 ${colors.text}`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold text-white">{step.label}</h4>
                                  <Badge className={`${colors.bg} ${colors.text} border-0`}>
                                    {step.status.replace('_', ' ')}
                                  </Badge>
                                </div>
                                {step.date && (
                                  <p className="text-sm text-gray-400 mt-1">
                                    {format(new Date(step.date), 'MMM d, yyyy h:mm a')}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700">
                        <Link to={createPageUrl("AdminApplicants")} className="flex-1">
                          <Button className="w-full bg-blue-600 hover:bg-blue-700">
                            View Application
                          </Button>
                        </Link>
                        {onboarding.lease && (
                          <Link to={createPageUrl("TenantPortal")} className="flex-1">
                            <Button className="w-full bg-purple-600 hover:bg-purple-700">
                              View Lease
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed">
            {completedOnboarding.length === 0 ? (
              <Card className="border-gray-700 bg-slate-800">
                <CardContent className="p-16 text-center">
                  <CheckCircle2 className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No completed onboarding yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {completedOnboarding.map((onboarding) => (
                  <Card key={onboarding.id} className="border-2 border-green-500/30 bg-slate-800">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-lg">{onboarding.full_name}</h3>
                            <p className="text-gray-400 text-sm">{onboarding.apartment_title}</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mb-4">
                        <p className="text-green-400 text-sm font-semibold">✅ All steps completed</p>
                      </div>
                      <p className="text-gray-400 text-sm">
                        Approved: {format(new Date(onboarding.updated_date), 'MMM d, yyyy')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}