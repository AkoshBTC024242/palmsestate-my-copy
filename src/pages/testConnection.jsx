import { useEffect, useState } from 'react';
import { testSupabaseConnection } from '../lib/supabase';
import { Check, X, AlertCircle, Loader, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

function TestConnection() {
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const [details, setDetails] = useState(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        const result = await testSupabaseConnection();
        
        if (result) {
          setStatus('success');
          setMessage('Supabase connection successful!');
          
          // Get environment info (safely)
          const envInfo = {
            urlSet: !!import.meta.env.VITE_SUPABASE_URL,
            keySet: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
            urlLength: import.meta.env.VITE_SUPABASE_URL?.length || 0,
            keyLength: import.meta.env.VITE_SUPABASE_ANON_KEY?.length || 0,
          };
          
          setDetails(envInfo);
        } else {
          setStatus('error');
          setMessage('Failed to connect to Supabase');
        }
      } catch (error) {
        setStatus('error');
        setMessage(error.message || 'Unknown error occurred');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Database className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-gray-800 mb-2">
            Connection Test
          </h1>
          <p className="text-gray-600">
            Testing Supabase integration for Palms Estate
          </p>
        </div>

        <div className={`rounded-2xl border p-6 mb-6 ${
          status === 'loading' ? 'border-amber-200 bg-amber-50' :
          status === 'success' ? 'border-green-200 bg-green-50' :
          'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-start">
            {status === 'loading' && (
              <Loader className="w-6 h-6 text-amber-600 mr-3 animate-spin" />
            )}
            {status === 'success' && (
              <Check className="w-6 h-6 text-green-600 mr-3" />
            )}
            {status === 'error' && (
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
            )}
            
            <div className="flex-1">
              <h3 className={`font-sans font-semibold ${
                status === 'loading' ? 'text-amber-800' :
                status === 'success' ? 'text-green-800' :
                'text-red-800'
              }`}>
                {status === 'loading' && 'Testing connection...'}
                {status === 'success' && 'Connection Successful!'}
                {status === 'error' && 'Connection Failed'}
              </h3>
              <p className={`mt-1 ${
                status === 'loading' ? 'text-amber-700' :
                status === 'success' ? 'text-green-700' :
                'text-red-700'
              }`}>
                {message}
              </p>
              
              {details && (
                <div className="mt-4 pt-4 border-t border-current/20">
                  <h4 className="text-sm font-medium mb-2">Environment Details:</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Supabase URL:</span>
                      <span className={details.urlSet ? 'text-green-600' : 'text-red-600'}>
                        {details.urlSet ? '✅ Set' : '❌ Missing'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>API Key:</span>
                      <span className={details.keySet ? 'text-green-600' : 'text-red-600'}>
                        {details.keySet ? '✅ Set' : '❌ Missing'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h3 className="font-sans font-semibold text-gray-800 mb-4">Next Steps:</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${
                status === 'success' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
              }`}>
                {status === 'success' ? '✓' : '1'}
              </div>
              <span className={status === 'success' ? 'text-green-700' : 'text-gray-600'}>
                Test Supabase Connection
              </span>
            </div>
            
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full mr-3 bg-gray-100 text-gray-400 flex items-center justify-center">
                2
              </div>
              <span className="text-gray-600">Create Database Tables</span>
            </div>
            
            <div className="flex items-center">
              <div className="w-6 h-6 rounded-full mr-3 bg-gray-100 text-gray-400 flex items-center justify-center">
                3
              </div>
              <span className="text-gray-600">Implement Authentication</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Link
              to="/"
              className="block w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white font-sans font-semibold py-3 px-6 rounded-xl text-center hover:shadow-lg transition-all duration-300"
            >
              Return to Home
            </Link>
            
            {status === 'error' && (
              <button
                onClick={() => window.location.reload()}
                className="block w-full bg-gray-100 text-gray-700 font-sans font-medium py-3 px-6 rounded-xl text-center hover:bg-gray-200 transition-colors"
              >
                Retry Connection Test
              </button>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Not set'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default TestConnection;