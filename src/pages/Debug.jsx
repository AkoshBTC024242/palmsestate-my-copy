import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { testConnection, fetchProperties } from '../lib/supabase';

function Debug() {
  const { user, session, isAuthenticated } = useAuth();
  const [connectionResult, setConnectionResult] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localStorageData, setLocalStorageData] = useState({});

  useEffect(() => {
    runDebug();
    checkLocalStorage();
  }, []);

  const runDebug = async () => {
    try {
      console.log('🔧 Starting debug...');
      
      // Test connection
      const connection = await testConnection();
      setConnectionResult(connection);
      
      // Fetch properties
      const data = await fetchProperties();
      setProperties(data);
      
    } catch (error) {
      console.error('Debug error:', error);
      setConnectionResult({
        success: false,
        error: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const checkLocalStorage = () => {
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.includes('supabase') || key.includes('auth') || key.includes('palmsestate')) {
        try {
          items[key] = JSON.parse(localStorage.getItem(key));
        } catch {
          items[key] = localStorage.getItem(key);
        }
      }
    }
    setLocalStorageData(items);
  };

  const clearStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
    checkLocalStorage();
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-2xl font-bold mb-4">Testing Connection...</h1>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Database & Auth Debug</h1>
        
        {/* Environment Info */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Environment</h2>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">URL Set:</span>{' '}
                <span className={`px-2 py-1 rounded text-xs ${connectionResult?.url ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {connectionResult?.url ? '✅ Yes' : '❌ No'}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Key Set:</span>{' '}
                <span className={`px-2 py-1 rounded text-xs ${connectionResult?.keyPresent ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {connectionResult?.keyPresent ? '✅ Yes' : '❌ No'}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Mode:</span>{' '}
                <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                  {import.meta.env.MODE}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Auth Status</h2>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">User Logged In:</span>{' '}
                <span className={`px-2 py-1 rounded text-xs ${isAuthenticated ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {isAuthenticated ? '✅ Yes' : '❌ No'}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium">User Email:</span>{' '}
                <span className="font-mono text-sm">{user?.email || 'Not logged in'}</span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Session Active:</span>{' '}
                <span className={`px-2 py-1 rounded text-xs ${session ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {session ? '✅ Yes' : '❌ No'}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Connection Result */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Connection Result</h2>
              <button
                onClick={runDebug}
                className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded hover:bg-primary-700 transition-colors"
              >
                Test Again
              </button>
            </div>
            
            <div className={`p-4 rounded-lg mb-4 ${connectionResult?.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="font-medium">
                Status:{' '}
                <span className={connectionResult?.success ? 'text-green-700' : 'text-red-700'}>
                  {connectionResult?.success ? '✅ Connection Successful' : '❌ Connection Failed'}
                </span>
              </p>
              {connectionResult?.error && (
                <p className="text-sm text-red-600 mt-2">{connectionResult.error}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Auth Details</h3>
                <pre className="text-xs bg-gray-50 p-3 rounded border border-gray-200 overflow-auto max-h-40">
                  {JSON.stringify(connectionResult?.auth || {}, null, 2)}
                </pre>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Database Details</h3>
                <pre className="text-xs bg-gray-50 p-3 rounded border border-gray-200 overflow-auto max-h-40">
                  {JSON.stringify(connectionResult?.database || {}, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Properties Display */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">
              Properties Found: <span className="text-primary-600">{properties.length}</span>
            </h2>
            
            {properties.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No properties could be loaded</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.map((property) => (
                  <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                    <p className="font-medium text-gray-900">{property.title}</p>
                    <p className="text-sm text-gray-600">{property.location}</p>
                    <p className="text-sm text-gray-700 mt-2">${property.price_per_week}/week</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {property.bedrooms} beds • {property.bathrooms} baths • {property.square_feet} sq ft
                    </p>
                    <p className="text-xs text-gray-500 mt-2 truncate">
                      Image: {property.image_url?.substring(0, 50)}...
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Local Storage Info */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Local Storage</h2>
              <button
                onClick={clearStorage}
                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 transition-colors"
              >
                Clear All Storage
              </button>
            </div>
            
            <div className="space-y-3">
              {Object.keys(localStorageData).length === 0 ? (
                <p className="text-gray-600">No auth data in localStorage</p>
              ) : (
                Object.entries(localStorageData).map(([key, value]) => (
                  <div key={key} className="border border-gray-200 rounded p-3">
                    <p className="font-medium text-sm text-gray-800">{key}</p>
                    <pre className="text-xs bg-gray-50 p-2 rounded mt-1 overflow-auto max-h-32">
                      {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => window.location.href = '/properties'}
            className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Test Properties Page
          </button>
          <button
            onClick={() => window.location.href = '/signin'}
            className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Test Sign In
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-900 transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}

export default Debug;