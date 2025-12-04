import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Home, FileText, MessageSquare, Bell } from "lucide-react";

const tenantSteps = [
  {
    id: "welcome",
    title: "Welcome to Palms Real Estate!",
    description: "Let's get you started with a quick tour of the tenant portal.",
    icon: Home
  },
  {
    id: "browse",
    title: "Browse Properties",
    description: "Explore our available apartments using filters like budget, location, and amenities. Use AI Match for personalized recommendations!",
    icon: Home
  },
  {
    id: "apply",
    title: "Submit Applications",
    description: "Found your perfect home? Apply directly through our platform and track your application status.",
    icon: FileText
  },
  {
    id: "portal",
    title: "Tenant Portal",
    description: "Once approved, access your portal to pay rent, submit maintenance requests, and communicate with property management.",
    icon: MessageSquare
  },
  {
    id: "notifications",
    title: "Stay Updated",
    description: "You'll receive notifications for application updates, lease renewals, and important announcements.",
    icon: Bell
  }
];

const ownerSteps = [
  {
    id: "welcome",
    title: "Welcome Property Owner!",
    description: "Thank you for choosing Palms Real Estate. Let's explore what you can do.",
    icon: Home
  },
  {
    id: "inquiry",
    title: "Submit Property Inquiry",
    description: "Tell us about your property using the Property Owners page. We'll review and get back to you within 24 hours.",
    icon: FileText
  },
  {
    id: "metrics",
    title: "Track Performance",
    description: "Once your property is listed, view detailed metrics including views, inquiries, and application rates.",
    icon: Bell
  },
  {
    id: "documents",
    title: "Manage Documents",
    description: "Upload and organize important documents like contracts, invoices, and insurance papers.",
    icon: FileText
  },
  {
    id: "communicate",
    title: "Stay Connected",
    description: "Communicate with potential tenants and our management team through the messaging system.",
    icon: MessageSquare
  }
];

export default function OnboardingWalkthrough({ userEmail, userType = "tenant" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const queryClient = useQueryClient();

  const steps = userType === "owner" ? ownerSteps : tenantSteps;

  const { data: onboarding } = useQuery({
    queryKey: ['onboarding', userEmail],
    queryFn: async () => {
      const records = await base44.entities.UserOnboarding.filter({ user_email: userEmail });
      return records[0];
    },
    enabled: !!userEmail
  });

  const createOnboardingMutation = useMutation({
    mutationFn: () => base44.entities.UserOnboarding.create({
      user_email: userEmail,
      user_type: userType,
      completed_steps: [],
      onboarding_completed: false,
      first_login_date: new Date().toISOString()
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding', userEmail] });
    }
  });

  const completeOnboardingMutation = useMutation({
    mutationFn: () => base44.entities.UserOnboarding.update(onboarding.id, {
      onboarding_completed: true,
      completed_steps: steps.map(s => s.id)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboarding', userEmail] });
      setIsOpen(false);
    }
  });

  useEffect(() => {
    if (userEmail && onboarding === undefined) {
      // First time user - create onboarding record and show walkthrough
      createOnboardingMutation.mutate();
    } else if (onboarding && !onboarding.onboarding_completed) {
      setIsOpen(true);
    }
  }, [userEmail, onboarding]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboardingMutation.mutate();
    }
  };

  const handleSkip = () => {
    if (onboarding) {
      completeOnboardingMutation.mutate();
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;
  const StepIcon = steps[currentStep]?.icon || Home;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">👋</span>
            Getting Started
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <Progress value={progress} className="h-2" />

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#ff6b35]/10 rounded-full">
              <StepIcon className="w-10 h-10 text-[#ff6b35]" />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-[#1a1f35] mb-2">
                {steps[currentStep]?.title}
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                {steps[currentStep]?.description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button variant="ghost" onClick={handleSkip}>
              Skip Tutorial
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {currentStep + 1} of {steps.length}
              </span>
              <Button onClick={handleNext} className="bg-[#ff6b35] hover:bg-[#ff8c5a]">
                {currentStep < steps.length - 1 ? 'Next' : 'Get Started'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}