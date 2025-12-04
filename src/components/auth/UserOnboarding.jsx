import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { toast } from "sonner";

export default function UserOnboarding() {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        // Show modal if user doesn't have a full name
        if (!currentUser.full_name) {
          setShowModal(true);
        }
      } catch (error) {
        console.log("User not logged in");
      } finally {
        setLoading(false);
      }
    };
    
    checkUser();
  }, []);

  const updateNameMutation = useMutation({
    mutationFn: async (name) => {
      return await base44.auth.updateMe({ full_name: name });
    },
    onSuccess: () => {
      toast.success("Welcome! Your profile has been updated.");
      setShowModal(false);
      window.location.reload(); // Reload to update user context
    },
    onError: () => {
      toast.error("Failed to update profile. Please try again.");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    updateNameMutation.mutate(fullName.trim());
  };

  if (loading || !showModal) return null;

  return (
    <Dialog open={showModal} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Welcome to Palms Estate!</DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <p className="text-center text-gray-600 mb-6">
            Let's get started by setting up your profile
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-base">
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="h-12 text-base"
                required
                autoFocus
              />
              <p className="text-xs text-gray-500">
                This name will be used on your applications and lease agreements
              </p>
            </div>

            <Button
              type="submit"
              disabled={updateNameMutation.isPending}
              className="w-full bg-[#ff6b35] hover:bg-[#ff8c5a] h-12 text-base font-semibold"
            >
              {updateNameMutation.isPending ? "Saving..." : "Continue"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}