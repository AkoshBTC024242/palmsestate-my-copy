import React from 'react';
import { Outlet } from 'react-router-dom';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="p-8">
        <div className="text-white mb-4">Dashboard Layout Header</div>
        {children}
      </div>
    </div>
  );
}
