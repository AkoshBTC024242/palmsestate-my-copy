import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, Save, Settings } from "lucide-react";
import { toast } from "sonner";

export default function FeeSettings() {
  const [applicationFee, setApplicationFee] = useState(85);
  const [inspectionFee, setInspectionFee] = useState(150);
  const queryClient = useQueryClient();

  const { data: settings = [] } = useQuery({
    queryKey: ['system-settings'],
    queryFn: () => base44.entities.SystemSettings.list(),
    initialData: [],
    onSuccess: (data) => {
      const appFee = data.find(s => s.setting_key === 'application_fee');
      const inspFee = data.find(s => s.setting_key === 'inspection_fee');
      if (appFee) setApplicationFee(Number(appFee.setting_value));
      if (inspFee) setInspectionFee(Number(inspFee.setting_value));
    }
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ key, value, description }) => {
      const existing = settings.find(s => s.setting_key === key);
      if (existing) {
        return await base44.entities.SystemSettings.update(existing.id, {
          setting_value: String(value),
          description
        });
      } else {
        return await base44.entities.SystemSettings.create({
          setting_key: key,
          setting_value: String(value),
          description,
          category: 'fees'
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast.success("Fee settings updated successfully!");
    }
  });

  const handleSave = () => {
    updateSettingMutation.mutate({
      key: 'application_fee',
      value: applicationFee,
      description: 'Application fee amount'
    });
    updateSettingMutation.mutate({
      key: 'inspection_fee',
      value: inspectionFee,
      description: 'Inspection fee amount'
    });
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Settings className="w-6 h-6 text-[#ff6b35]" />
          Fee Management
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-base font-semibold flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#ff6b35]" />
              Application Fee
            </Label>
            <Input
              type="number"
              value={applicationFee}
              onChange={(e) => setApplicationFee(Number(e.target.value))}
              className="text-lg font-semibold"
              min="0"
              step="5"
            />
            <p className="text-xs text-gray-500">Fee charged for rental application processing</p>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#ff6b35]" />
              Inspection Fee
            </Label>
            <Input
              type="number"
              value={inspectionFee}
              onChange={(e) => setInspectionFee(Number(e.target.value))}
              className="text-lg font-semibold"
              min="0"
              step="5"
            />
            <p className="text-xs text-gray-500">Fee charged for property inspection</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={updateSettingMutation.isPending}
            className="bg-[#ff6b35] hover:bg-[#ff8c5a]"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateSettingMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}