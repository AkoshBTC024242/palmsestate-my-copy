import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Download, Brain } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import AILeaseAnalyzer from "./AILeaseAnalyzer";

export default function LeaseGenerator({ application, apartment, isOpen, onClose }) {
  const [formData, setFormData] = useState({
    lease_start_date: application.move_in_date || "",
    lease_end_date: "",
    security_deposit: apartment.monthly_rent || 0,
    terms: `
═══════════════════════════════════════════════════════════
                    PALMS REAL ESTATE
             RESIDENTIAL LEASE AGREEMENT
═══════════════════════════════════════════════════════════

Agreement Date: ${format(new Date(), 'MMMM d, yyyy')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LANDLORD INFORMATION:
  Company: Palms Estate
  Address: Property Management Office
  Phone: (828) 623-9765
  Email: devbreed@hotmail.com

TENANT INFORMATION:
  Name: ${application.full_name}
  Email: ${application.email}
  Phone: ${application.phone}

PROPERTY INFORMATION:
  Property: ${apartment.title}
  Address: ${apartment.address || apartment.location}
  Bedrooms: ${apartment.bedrooms} | Bathrooms: ${apartment.bathrooms}
  Size: ${apartment.size_sqft} sqft

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LEASE TERMS AND CONDITIONS:

1. LEASE PERIOD
   Start Date: [START_DATE]
   End Date: [END_DATE]
   This lease constitutes a binding agreement for the period specified.

2. RENT PAYMENT
   Monthly Rent: $${apartment.monthly_rent?.toLocaleString()}
   Due Date: 1st day of each month
   Payment Method: As agreed upon between parties
   Late Fee: 5% after 5 days past due date

3. SECURITY DEPOSIT
   Amount: $[DEPOSIT]
   Purpose: Covers damages beyond normal wear and tear
   Return: Within 30 days of lease termination, subject to property inspection

4. UTILITIES AND SERVICES
   Tenant Responsible For: Electricity, Gas, Water, Internet, Cable
   Landlord Responsible For: Property Taxes, HOA Fees (if applicable)

5. PROPERTY MAINTENANCE
   • Tenant shall maintain premises in clean and sanitary condition
   • Tenant must report any damage or needed repairs within 24 hours
   • Landlord responsible for major repairs and structural maintenance
   • Tenant responsible for minor repairs and routine maintenance

6. PET POLICY
   ${apartment.pets_allowed ? '✓ Pets Allowed: Yes (with prior written consent and additional deposit)' : '✗ Pets Allowed: No'}

7. PARKING
   ${apartment.parking ? '✓ Parking Space: One space included' : '✗ Parking: Not included'}

8. PROPERTY CONDITION
   Furnishing Status: ${apartment.furnishing || 'Unfurnished'}
   Condition at Move-in: Property delivered in clean, habitable condition

9. SUBLETTING AND ASSIGNMENT
   • Subletting requires prior written consent from landlord
   • Unauthorized subletting may result in lease termination

10. LEASE TERMINATION
    • Either party may terminate with 30 days written notice
    • Early termination may result in forfeiture of security deposit
    • Property must be returned in same condition as received

11. TENANT OBLIGATIONS
    • Comply with all building rules and regulations
    • Not disturb neighbors or engage in illegal activities
    • Maintain rental insurance (recommended)
    • Allow landlord access for inspections with 24-hour notice

12. LANDLORD OBLIGATIONS
    • Maintain property in habitable condition
    • Make necessary repairs in timely manner
    • Respect tenant's quiet enjoyment of property
    • Comply with all applicable housing laws

ADDITIONAL TERMS:
• No modifications to property without written consent
• Smoking policy: As per building regulations
• Maximum occupancy: As permitted by law
• Tenant to arrange for renter's insurance

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

ACKNOWLEDGMENT AND SIGNATURES:

By signing below, both parties acknowledge that they have read, understood,
and agree to all terms and conditions outlined in this lease agreement.

LANDLORD:
_________________________________
Palms Estate Representative
Date: _____________


TENANT:
_________________________________
${application.full_name}
Date: _____________

═══════════════════════════════════════════════════════════
         This is a legally binding document
    Keep a copy for your records
═══════════════════════════════════════════════════════════
`
  });

  const [showAnalyzer, setShowAnalyzer] = useState(false);
  const [generatedLease, setGeneratedLease] = useState(null);
  const queryClient = useQueryClient();

  const generateLeaseMutation = useMutation({
    mutationFn: async (data) => {
      // Generate lease document content
      const leaseContent = data.terms
        .replace('[START_DATE]', format(new Date(data.lease_start_date), 'MMMM d, yyyy'))
        .replace('[END_DATE]', format(new Date(data.lease_end_date), 'MMMM d, yyyy'))
        .replace('[DEPOSIT]', data.security_deposit.toLocaleString());

      // Create lease record
      const lease = await base44.entities.LeaseAgreement.create({
        application_id: application.id,
        apartment_id: apartment.id,
        tenant_name: application.full_name,
        tenant_email: application.email,
        apartment_title: apartment.title,
        apartment_address: apartment.address || apartment.location,
        monthly_rent: apartment.monthly_rent,
        lease_start_date: data.lease_start_date,
        lease_end_date: data.lease_end_date,
        security_deposit: data.security_deposit,
        lease_document_url: leaseContent,
        status: "sent",
        terms: leaseContent,
        approval_date: new Date().toISOString()
      });

      // Send email to tenant with lease
      await base44.integrations.Core.SendEmail({
        from_name: "Palms Estate",
        to: application.email,
        subject: "🏠 Your Lease Agreement - Palms Estate",
        body: `Dear ${application.full_name},

Congratulations! Your lease agreement for ${apartment.title} is ready for review and signing.

═══════════════════════════════════════════
LEASE DETAILS:
═══════════════════════════════════════════

Property: ${apartment.title}
Address: ${apartment.address || apartment.location}
Monthly Rent: $${apartment.monthly_rent?.toLocaleString()}
Security Deposit: $${data.security_deposit?.toLocaleString()}

Lease Period:
  Start: ${format(new Date(data.lease_start_date), 'MMMM d, yyyy')}
  End: ${format(new Date(data.lease_end_date), 'MMMM d, yyyy')}

═══════════════════════════════════════════

Please log in to your tenant portal to review and digitally sign your lease agreement.

NEXT STEPS:
1. Review the complete lease agreement carefully
2. Sign the lease digitally in your tenant portal
3. Arrange for security deposit payment
4. Schedule your move-in date

If you have any questions about the lease terms, please contact us:
📞 Phone: (828) 623-9765
📧 Email: devbreed@hotmail.com

We look forward to welcoming you to your new home!

Best regards,
Palms Estate Team`
      });

      // Send copy to admin
      await base44.integrations.Core.SendEmail({
        from_name: "Palms Estate",
        to: "devbreed@hotmail.com",
        subject: `Lease Generated - ${apartment.title} - ${application.full_name}`,
        body: `Lease agreement has been generated and sent to tenant.

Tenant: ${application.full_name}
Email: ${application.email}
Property: ${apartment.title}
Lease Period: ${format(new Date(data.lease_start_date), 'MMM d, yyyy')} - ${format(new Date(data.lease_end_date), 'MMM d, yyyy')}
Monthly Rent: $${apartment.monthly_rent?.toLocaleString()}
Security Deposit: $${data.security_deposit?.toLocaleString()}

The lease has been sent to the tenant for review and signature.`
      });

      // Update application status
      await base44.entities.RentalApplication.update(application.id, {
        status: "approved"
      });

      return lease;
    },
    onSuccess: (lease) => {
      queryClient.invalidateQueries({ queryKey: ['rental-applications'] });
      queryClient.invalidateQueries({ queryKey: ['leases'] });
      setGeneratedLease(lease);
      setShowAnalyzer(true);
      toast.success("Lease generated! Running AI analysis...");
    },
    onError: () => {
      toast.error("Failed to generate lease");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    generateLeaseMutation.mutate({
      ...formData,
      security_deposit: parseFloat(formData.security_deposit)
    });
  };

  const handleDownload = () => {
    const content = formData.terms
      .replace('[START_DATE]', format(new Date(formData.lease_start_date), 'MMMM d, yyyy'))
      .replace('[END_DATE]', format(new Date(formData.lease_end_date), 'MMMM d, yyyy'))
      .replace('[DEPOSIT]', formData.security_deposit.toLocaleString());

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Lease_${apartment.title.replace(/\s+/g, '_')}_${application.full_name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (showAnalyzer && generatedLease) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {
        setShowAnalyzer(false);
        setGeneratedLease(null);
        onClose();
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              AI Lease Analysis
            </DialogTitle>
          </DialogHeader>
          <AILeaseAnalyzer 
            lease={generatedLease} 
            onAnalysisComplete={() => {
              setShowAnalyzer(false);
              setGeneratedLease(null);
              onClose();
            }}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#ff6b35]" />
            Generate Lease Agreement
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <p><strong>Tenant:</strong> {application.full_name}</p>
            <p><strong>Property:</strong> {apartment.title}</p>
            <p><strong>Monthly Rent:</strong> ${apartment.monthly_rent?.toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Lease Start Date *</Label>
              <Input
                type="date"
                value={formData.lease_start_date}
                onChange={(e) => setFormData({...formData, lease_start_date: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Lease End Date *</Label>
              <Input
                type="date"
                value={formData.lease_end_date}
                onChange={(e) => setFormData({...formData, lease_end_date: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Security Deposit ($) *</Label>
            <Input
              type="number"
              value={formData.security_deposit}
              onChange={(e) => setFormData({...formData, security_deposit: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Lease Agreement Template</Label>
            <Textarea
              value={formData.terms}
              onChange={(e) => setFormData({...formData, terms: e.target.value})}
              rows={15}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleDownload}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-2" />
              Preview & Download
            </Button>
            <Button
              type="submit"
              disabled={generateLeaseMutation.isPending}
              className="flex-1 bg-[#ff6b35] hover:bg-[#ff8c5a]"
            >
              {generateLeaseMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating & Sending...
                </>
              ) : (
                "Generate & Send Lease"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}