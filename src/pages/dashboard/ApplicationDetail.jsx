// src/pages/dashboard/ApplicationDetail.jsx - WITH SUPABASE
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

function ApplicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [application, setApplication] = useState(null);
  const [property, setProperty] = useState(null);

  useEffect(() => {
    console.log('Starting to load application details...');
    
    if (!id) {
      setError('No application ID provided');
      setLoading(false);
      return;
    }
    
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }
    
    loadApplicationDetails();
  }, [id, user]);

  const loadApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Loading application with ID:', id);
      console.log('For user ID:', user.id);
      
      // Load application from Supabase
      const { data: appData, error: appError } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      console.log('Supabase response - data:', appData);
      console.log('Supabase response - error:', appError);

      if (appError) {
        console.error('Supabase error details:', {
          code: appError.code,
          message: appError.message,
          details: appError.details,
          hint: appError.hint
        });
        
        if (appError.code === 'PGRST116') {
          setError('Application not found. It may have been deleted or you do not have permission to view it.');
        } else {
          setError(`Database error: ${appError.message}`);
        }
        setLoading(false);
        return;
      }

      if (!appData) {
        setError('Application not found in database.');
        setLoading(false);
        return;
      }

      console.log('Application loaded successfully:', appData);
      setApplication(appData);

      // Try to load property if property_id exists
      if (appData.property_id) {
        console.log('Loading property with ID:', appData.property_id);
        try {
          const { data: propertyData, error: propertyError } = await supabase
            .from('properties')
            .select('*')
            .eq('id', appData.property_id)
            .single();

          if (propertyError) {
            console.warn('Could not load property:', propertyError.message);
            // This is not critical, we can continue without property details
          } else if (propertyData) {
            console.log('Property loaded successfully:', propertyData);
            setProperty(propertyData);
          }
        } catch (propError) {
          console.warn('Error loading property:', propError);
        }
      }

    } catch (catchError) {
      console.error('Unexpected error in loadApplicationDetails:', catchError);
      setError(`Unexpected error: ${catchError.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      submitted: { 
        color: 'bg-blue-100 text-blue-800',
        label: 'Submitted',
        description: 'Application submitted and awaiting review'
      },
      pre_approved: { 
        color: 'bg-amber-100 text-amber-800',
        label: 'Pre-Approved',
        description: 'Initial approval pending fee payment'
      },
      paid_under_review: { 
        color: 'bg-purple-100 text-purple-800',
        label: 'Under Review',
        description: 'Fee paid, under final review'
      },
      approved: { 
        color: 'bg-green-100 text-green-800',
        label: 'Approved',
        description: 'Application approved'
      },
      rejected: { 
        color: 'bg-red-100 text-red-800',
        label: 'Rejected',
        description: 'Application not approved'
      },
      payment_pending: {
        color: 'bg-orange-100 text-orange-800',
        label: 'Payment Pending',
        description: 'Waiting for payment'
      }
    };
    return configs[status] || configs.submitted;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading application #{id}...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your application details.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Application</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/dashboard/applications')}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
            >
              Back to Applications
            </button>
            <button
              onClick={loadApplicationDetails}
              className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Try Again
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-900 mb-2">Debug Information:</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>Application ID from URL: {id}</p>
            <p>User ID: {user?.id || 'Not authenticated'}</p>
            <p>Timestamp: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Application Not Found</h3>
          <p className="text-gray-600 mb-6">The application #{id} could not be loaded.</p>
          <button
            onClick={() => navigate('/dashboard/applications')}
            className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  const status = getStatusConfig(application.status);
  const applicantName = application.first_name && application.last_name 
    ? `${application.first_name} ${application.last_name}`
    : application.full_name || user?.email?.split('@')[0] || 'Applicant';

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard/applications')}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <span className="mr-1">←</span> Back to Applications
        </button>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Application Details</h1>
            <p className="text-gray-600 mt-1">
              Reference: <span className="font-medium">#{application.reference_number || application.id.slice(-8)}</span>
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
              {status.label}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Application Status Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Application Status</h2>
            <p className="text-gray-700 mb-4">{status.description}</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Applied On</span>
                <span className="font-medium">{formatDate(application.created_at)}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">{formatDate(application.updated_at)}</span>
              </div>
              
              {application.application_fee && (
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-600">Application Fee</span>
                  <span className="font-medium">${application.application_fee}</span>
                </div>
              )}
            </div>
          </div>

          {/* Property Details */}
          {property ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{property.title || `Property #${property.id}`}</h3>
                  {property.location && (
                    <p className="text-gray-600 mb-4">{property.location}</p>
                  )}
                  
                  <div className="space-y-2">
                    {property.property_type && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{property.property_type}</span>
                      </div>
                    )}
                    {property.price_per_week && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price:</span>
                        <span className="font-medium">${property.price_per_week}/week</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {property.main_image_url && (
                  <div className="relative h-48 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={property.main_image_url}
                      alt={property.title || 'Property'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : application.property_id ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <p className="text-gray-600">
                Property ID: <span className="font-medium">{application.property_id}</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">Property details could not be loaded.</p>
            </div>
          ) : null}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Applicant Information */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Applicant Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                <p className="font-medium">{applicantName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-medium">{application.email || user?.email || 'Not provided'}</p>
              </div>
              {application.phone && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Phone</p>
                  <p className="font-medium">{application.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard/applications')}
                className="w-full text-left p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium">Back to Applications</span>
              </button>
              
              {application.property_id && (
                <button
                  onClick={() => navigate(`/properties/${application.property_id}`)}
                  className="w-full text-left p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium">View Property</span>
                </button>
              )}
              
              {application.status === 'pre_approved' && (
                <button
                  onClick={() => navigate(`/dashboard/applications/${id}/payment`)}
                  className="w-full text-left p-3 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors"
                >
                  <span className="font-medium">Pay Application Fee</span>
                </button>
              )}
            </div>
          </div>

          {/* Support */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-gray-900 mb-3">Need Help?</h3>
            <p className="text-gray-700 text-sm mb-4">
              Contact our support team for assistance with your application.
            </p>
            <a
              href="mailto:support@palmsestate.org"
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              support@palmsestate.org
            </a>
          </div>
        </div>
      </div>

      {/* Debug Info (remove in production) */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <details className="text-sm">
          <summary className="cursor-pointer font-medium text-gray-700">Debug Information</summary>
          <div className="mt-2 space-y-1">
            <p>Application ID: {id}</p>
            <p>User ID: {user?.id}</p>
            <p>Application Status: {application.status}</p>
            <p>Property ID: {application.property_id}</p>
            <p>Property Loaded: {property ? 'Yes' : 'No'}</p>
          </div>
        </details>
      </div>
    </div>
  );
}

export default ApplicationDetail;
