// src/pages/AdminDashboard.jsx - SIMPLE TEST VERSION
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please sign in to access the admin dashboard.</p>
          <Link to="/signin" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Access Required</h2>
          <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
          <p className="text-sm text-gray-500 mb-4">
            Logged in as: {user.email}
          </p>
          <Link to="/dashboard" className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700">
            Go to User Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.email}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Admin
              </span>
              <Link to="/dashboard" className="text-blue-600 hover:text-blue-800">
                User View
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Stats Cards */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Properties</h3>
            <p className="text-3xl font-bold text-blue-600">12</p>
            <p className="text-sm text-gray-500 mt-2">Active listings</p>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Applications</h3>
            <p className="text-3xl font-bold text-orange-600">24</p>
            <p className="text-sm text-gray-500 mt-2">Pending review</p>
          </div>
          
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Users</h3>
            <p className="text-3xl font-bold text-green-600">156</p>
            <p className="text-sm text-gray-500 mt-2">Registered accounts</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link 
              to="/admin/properties" 
              className="bg-blue-50 hover:bg-blue-100 p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-blue-600 font-semibold">Manage Properties</div>
            </Link>
            <Link 
              to="/admin/applications" 
              className="bg-orange-50 hover:bg-orange-100 p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-orange-600 font-semibold">View Applications</div>
            </Link>
            <Link 
              to="/admin/users" 
              className="bg-green-50 hover:bg-green-100 p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-green-600 font-semibold">Manage Users</div>
            </Link>
            <Link 
              to="/admin/settings" 
              className="bg-purple-50 hover:bg-purple-100 p-4 rounded-lg text-center transition-colors"
            >
              <div className="text-purple-600 font-semibold">Settings</div>
            </Link>
          </div>
        </div>

        {/* Debug Info */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Debug Information</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">User ID:</span> {user.id}</p>
            <p><span className="font-medium">Email:</span> {user.email}</p>
            <p><span className="font-medium">Is Admin:</span> {isAdmin ? 'Yes' : 'No'}</p>
            <p><span className="font-medium">User Role:</span> {user.role || 'Not set'}</p>
            <p><span className="font-medium">Admin Check:</span> {user.isAdmin ? 'True' : 'False'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
