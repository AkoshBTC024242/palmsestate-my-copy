import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, AlertTriangle, CheckCircle2, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";

export default function AILeaseAnalyzer({ lease, onAnalysisComplete, hideFlaggedItems = false }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(lease?.ai_analysis || null);

  const analyzeLease = async () => {
    setAnalyzing(true);
    try {
      const leaseContent = `
Lease Agreement Details:
- Tenant: ${lease.tenant_name}
- Property: ${lease.apartment_title} at ${lease.apartment_address}
- Monthly Rent: $${lease.monthly_rent}
- Security Deposit: $${lease.security_deposit}
- Lease Period: ${lease.lease_start_date} to ${lease.lease_end_date}
- Additional Terms: ${lease.terms || 'None specified'}
      `.trim();

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a real estate legal assistant analyzing a lease agreement. Analyze the following lease and provide:

${leaseContent}

Provide your analysis in the following JSON format:
{
  "key_clauses": {
    "rent_amount": "Monthly rent amount",
    "lease_term": "Start and end dates",
    "security_deposit": "Security deposit amount and terms",
    "late_fees": "Late fee policy if mentioned",
    "pet_policy": "Pet policy if mentioned",
    "maintenance_responsibility": "Who is responsible for what",
    "termination_clause": "Early termination terms if any",
    "utilities": "Utility responsibility"
  },
  "summary": "A 2-3 sentence plain language summary of this lease agreement that a non-legal person can easily understand",
  "flagged_items": [
    {
      "clause": "Name of the clause",
      "concern": "Why this might be problematic",
      "severity": "low|medium|high"
    }
  ]
}

Look for potentially problematic items like:
- Unusually high late fees
- Unclear maintenance responsibilities
- Restrictive termination clauses
- Missing standard protections
- Ambiguous language`,
        response_json_schema: {
          type: "object",
          properties: {
            key_clauses: {
              type: "object",
              properties: {
                rent_amount: { type: "string" },
                lease_term: { type: "string" },
                security_deposit: { type: "string" },
                late_fees: { type: "string" },
                pet_policy: { type: "string" },
                maintenance_responsibility: { type: "string" },
                termination_clause: { type: "string" },
                utilities: { type: "string" }
              }
            },
            summary: { type: "string" },
            flagged_items: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  clause: { type: "string" },
                  concern: { type: "string" },
                  severity: { type: "string", enum: ["low", "medium", "high"] }
                }
              }
            }
          }
        }
      });

      const analysisData = {
        ...result,
        analyzed_at: new Date().toISOString()
      };

      await base44.entities.LeaseAgreement.update(lease.id, {
        ai_analysis: analysisData
      });

      setAnalysis(analysisData);
      toast.success("Lease analyzed successfully!");
      if (onAnalysisComplete) onAnalysisComplete(analysisData);
    } catch (error) {
      console.error("Analysis error:", error);
      toast.error("Failed to analyze lease");
    } finally {
      setAnalyzing(false);
    }
  };

  const severityConfig = {
    low: { color: "bg-yellow-100 text-yellow-800 border-yellow-300", icon: AlertTriangle },
    medium: { color: "bg-orange-100 text-orange-800 border-orange-300", icon: AlertTriangle },
    high: { color: "bg-red-100 text-red-800 border-red-300", icon: AlertTriangle }
  };

  if (!analysis) {
    return (
      <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
        <CardContent className="p-8 text-center">
          <Brain className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Lease Analysis</h3>
          <p className="text-sm text-gray-600 mb-4">
            Get instant insights, key clause extraction, and risk assessment for this lease agreement
          </p>
          <Button
            onClick={analyzeLease}
            disabled={analyzing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-4 h-4 mr-2" />
                Analyze Lease with AI
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="border-l-4 border-l-blue-600">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Plain Language Summary
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={analyzeLease}
              disabled={analyzing}
            >
              {analyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Re-analyze"
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
        </CardContent>
      </Card>

      {/* Key Clauses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Key Clauses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysis.key_clauses || {}).map(([key, value]) => (
              value && (
                <div key={key} className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm text-gray-900">{value}</p>
                </div>
              )
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Flagged Items */}
      {!hideFlaggedItems && analysis.flagged_items?.length > 0 && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Flagged Items for Review ({analysis.flagged_items.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {analysis.flagged_items.map((item, idx) => {
              const config = severityConfig[item.severity] || severityConfig.low;
              const Icon = config.icon;
              return (
                <div key={idx} className={`border-2 rounded-lg p-4 ${config.color}`}>
                  <div className="flex items-start gap-3">
                    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{item.clause}</h4>
                        <Badge className={config.color}>
                          {item.severity}
                        </Badge>
                      </div>
                      <p className="text-sm">{item.concern}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {!hideFlaggedItems && analysis.flagged_items?.length === 0 && (
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="font-semibold text-gray-900">No Issues Found</h3>
                <p className="text-sm text-gray-600">This lease appears to be standard with no unusual clauses detected.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}