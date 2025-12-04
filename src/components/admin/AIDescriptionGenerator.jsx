import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function AIDescriptionGenerator({ apartmentData, onDescriptionGenerated }) {
  const [generating, setGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState("");

  const generateDescription = async () => {
    setGenerating(true);
    try {
      const prompt = `You are a professional real estate copywriter. Create a compelling, detailed property description for the following apartment listing. Make it engaging, highlight key features, and appeal to potential tenants.

Property Details:
- Title: ${apartmentData.title || 'Modern Apartment'}
- Bedrooms: ${apartmentData.bedrooms}
- Bathrooms: ${apartmentData.bathrooms}
- Size: ${apartmentData.size_sqft} sqft
- Monthly Rent: $${apartmentData.monthly_rent}
- Location: ${apartmentData.location || apartmentData.city || 'Prime location'}
- State: ${apartmentData.state || ''}
- Amenities: ${apartmentData.amenities?.join(', ') || 'Various amenities'}
- Parking: ${apartmentData.parking ? 'Yes' : 'No'}
- Pets Allowed: ${apartmentData.pets_allowed ? 'Yes' : 'No'}
- Furnishing: ${apartmentData.furnishing || 'Unfurnished'}

Write a description that is 3-4 paragraphs, professional yet warm, and emphasizes the lifestyle and benefits of living here. Focus on what makes this property special and desirable.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt
      });

      setGeneratedDescription(result);
      if (onDescriptionGenerated) {
        onDescriptionGenerated(result);
      }
      toast.success("Description generated!");
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Failed to generate description");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#ff6b35]" />
          <span className="font-semibold text-gray-700">AI Description Generator</span>
        </div>
        <Button
          type="button"
          onClick={generateDescription}
          disabled={generating}
          variant="outline"
          className="border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35]/10"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate with AI
            </>
          )}
        </Button>
      </div>

      {generatedDescription && (
        <div className="bg-[#ff6b35]/5 border border-[#ff6b35]/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Generated Description:</span>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={generateDescription}
              className="text-[#ff6b35]"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Regenerate
            </Button>
          </div>
          <Textarea
            value={generatedDescription}
            onChange={(e) => {
              setGeneratedDescription(e.target.value);
              if (onDescriptionGenerated) {
                onDescriptionGenerated(e.target.value);
              }
            }}
            rows={6}
            className="text-sm"
          />
          <p className="text-xs text-gray-500 mt-2">
            You can edit the generated description before saving
          </p>
        </div>
      )}
    </div>
  );
}