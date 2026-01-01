// src/pages/dashboard/ApplicationDetail.jsx - DEBUG VERSION
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

function ApplicationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState({});
  const [application, setApplication] = useState(null);

  useEffect(() => {
    console.log('=== ApplicationDetail DEBUG START ===');
    console.log('URL ID:', id);
    console.log('User:', user);
    
    const debug = {
      urlId: id,
      userExists: !!user,
      userId: user?.id,
      userEmail: user?.email,
      timestamp: new Date().toISOString()
    };
    
    setDebugInfo(debug);
    
    if (!id) {
      console.error('No ID in URL');
      setLoading(false);
      return;
    }
    
    if (!user) {
      console.error('No user authenticated');
      setLoading(false);
      return;
    }
    
    loadApplicationDetails();
  }, [id, user]);

  const loadApplicationDetails = async () => {
    try {
      setLoading(true);
      console.log('Starting to load application...');
      
      // First, let's check what auth state Supabase has
      const { data: authData, error: authError } = await supabase.auth.getSession();
      console.log('Supabase auth session:', authData);
      console.log('Supabase auth error:', authError);
      
      // Try without user_id filter first to see what happens
      console.log('Querying applications table for ID:', id);
      const queryStart = Date.now();
      
      const { data, error, status, statusText } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id)
        .single();

      const queryTime = Date.now() - queryStart;
      
      console.log('Query completed in', queryTime + 'ms');
      console.log('Query status:', status, statusText);
      console.log('Query data:', data);
      console.log('Query error:', error);
      
      if (error) {
        console.error('Full error object:', JSON.stringify(error, null, 2));
        
        // Try a different approach - get all applications and filter client-side
        console.log('Trying alternative query...');
        const { data: allApps, error: allError } = await supabase
          .from('applications')
          .select('*')
          .eq('id', id);
          
        console.log('Alternative query result:', allApps);
        console.log('Alternative query error:', allError);
        
        if (allApps && allApps.length > 0) {
          const app = allApps[0];
          console.log('Found application via alternative query:', app);
          
          // Check if this belongs to the user
          if (app.user_id === user.id) {
            setApplication(app);
          } else {
            console.error('Application belongs to different user. App user_id:', app.user_id, 'Current user_id:', user.id);
            setDebugInfo(prev => ({
              ...prev,
              error: 'Permission denied - application belongs to different user',
              appUserId: app.user_id,
              currentUserId: user.id
            }));
          }
        } else {
          setDebugInfo(prev => ({
            ...prev,
            error: error.message,
            errorCode: error.code,
            errorDetails: error.details
          }));
        }
      } else if (data) {
        console.log('Application loaded successfully:', data);
        setApplication(data);
        
        // Verify ownership
        if (data.user_id !== user.id) {
          console.warn('Application user_id mismatch:', {
            appUserId: data.user_id,
            currentUserId: user.id
          });
        }
      }
      
    } catch (catchError) {
      console.error('Unexpected error:', catchError);
      setDebugInfo(prev => ({
        ...prev,
        catchError: catchError.message,
        catchStack: catchError.stack
      }));
    } finally {
      setLoading(false);
      console.log('=== ApplicationDetail DEBUG END ===');
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading application #{id}...</p>
          <div className="mt-4 p-4 bg-gray-100 rounded text-left">
            <p className="text-sm text-gray-700">Debug Info:</p>
            <pre className="text-xs mt-2 overflow-auto">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Application Detail - Debug View</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Application Data</h2>
        {application ? (
          <div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600">Application ID</p>
                <p className="font-medium">{application.id}</p>
              </div>
              <div>
                <p className="text-gray-600">Status</p>
                <p className="font-medium">{application.status || 'Unknown'}</p>
              </div>
              <div>
                <p className="text-gray-600">User ID (in app)</p>
                <p className="font-medium">{application.user_id}</p>
              </div>
              <div>
                <p className="text-gray-600">Current User ID</p>
                <p className="font-medium">{user?.id}</p>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Full Application Data:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-60">
                {JSON.stringify(application, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No application data loaded.</p>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-yellow-800">Debug Information</h2>
        <pre className="bg-white p-4 rounded text-sm overflow-auto max-h-80">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/dashboard/applications')}
          className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900"
        >
          Back to Applications
        </button>
        <button
          onClick={loadApplicationDetails}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700"
        >
          Reload Data
        </button>
      </div>
    </div>
  );
}

export default ApplicationDetail;
