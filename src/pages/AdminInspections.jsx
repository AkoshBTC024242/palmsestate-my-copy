import React from "react";
import InspectionManager from "../components/admin/InspectionManager";

export default function AdminInspections() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#1a1f35] mb-2">Property Inspections</h1>
          <p className="text-gray-600">Manage move-in and move-out inspections</p>
        </div>

        <InspectionManager />
      </div>
    </div>
  );
}