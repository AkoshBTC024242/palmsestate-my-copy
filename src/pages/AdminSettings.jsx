import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, DollarSign, Mail, Bell } from "lucide-react";
import FeeSettings from "../components/admin/FeeSettings";
import AutomatedEmailSystem from "../components/admin/AutomatedEmailSystem";

export default function AdminSettings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] rounded-xl flex items-center justify-center shadow-lg">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#1a1f35]">Admin Settings</h1>
              <p className="text-gray-600">Manage system settings and configurations</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="fees" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-white shadow-lg">
            <TabsTrigger value="fees" className="data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white">
              <DollarSign className="w-4 h-4 mr-2" />
              Fee Management
            </TabsTrigger>
            <TabsTrigger value="emails" className="data-[state=active]:bg-[#ff6b35] data-[state=active]:text-white">
              <Bell className="w-4 h-4 mr-2" />
              Email System
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fees" className="space-y-6">
            <FeeSettings />
          </TabsContent>

          <TabsContent value="emails" className="space-y-6">
            <AutomatedEmailSystem />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}