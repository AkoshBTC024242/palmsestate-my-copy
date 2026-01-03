// src/pages/SignIn.jsx - DEBUG VERSION
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState([]);
  const { signIn, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const addDebug = (message) => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    setDebugInfo(prev => [...prev, `${timestamp}: ${message}`]);
    console.log(`[DEBUG] ${message}`);
  };

  useEffect(() => {
    addDebug('SignIn component mounted');
    addDebug(`Current location: ${location.pathname}`);
    addDebug(`Current user: ${user ? user.email : 'No user'}`);
    addDebug(`Is admin: ${isAdmin}`);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setDebugInfo([]);

    addDebug(`Starting sign in with email: ${email}`);

    try {
      addDebug('Calling signIn function...');
      const result = await signIn(email, password);
      addDebug(`Sign in result: ${JSON.stringify(result)}`);

      if (result.success) {
        addDebug('✅ Sign in successful!');
        addDebug(`Result user: ${result.user?.email}`);
        addDebug(`Result isAdmin: ${result.isAdmin}`);
        
        // Check current auth state
        addDebug(`Current auth user after signIn: ${user?.email}`);
        addDebug(`Current isAdmin after signIn: ${isAdmin}`);
        
        // Determine redirect path
        const shouldRedirectToAdmin = result.isAdmin || email.toLowerCase().includes('admin');
        const redirectPath = shouldRedirectToAdmin ? '/admin' : '/dashboard';
        
        addDebug(`Redirecting to: ${redirectPath}`);
        addDebug(`Should go to admin? ${shouldRedirectToAdmin}`);
        
        // Show success message with redirect info
        setError(`✅ Login successful! Redirecting to ${redirectPath}...`);
        
        // Method 1: Try React Router navigation first
        setTimeout(() => {
          addDebug('Attempting React Router navigation...');
          navigate(redirectPath, { replace: true });
          
          // Method 2: Fallback - hard redirect after 2 seconds
          setTimeout(() => {
            addDebug('Fallback: attempting hard redirect...');
            window.location.href = redirectPath;
          }, 2000);
        }, 500);
        
      } else {
        addDebug(`❌ Sign in failed: ${result.error}`);
        setError(result.error || 'Invalid email or password. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      addDebug(`❌ Sign in error: ${error.message}`);
      console.error('Sign in error:', error);
      setError(error.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const testManualRedirect = (path) => {
    addDebug(`Testing manual redirect to: ${path}`);
    window.location.href = path;
  };

  const testAuthState = () => {
    addDebug(`=== AUTH STATE CHECK ===`);
    addDebug(`Current user: ${JSON.stringify(user)}`);
    addDebug(`Is authenticated: ${!!user}`);
    addDebug(`Is admin: ${isAdmin}`);
    addDebug(`User email: ${user?.email}`);
    addDebug(`User role: ${user?.role}`);
    addDebug(`User isAdmin prop: ${user?.isAdmin}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sign In Form */}
          <div className="lg:col-span-2">
            <div className="max-w-md mx-auto">
              <div>
                <div className="mx-auto h-16 w-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                  Welcome Back
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                  Sign in to access your Palms Estate dashboard
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className={`rounded-md p-4 ${error.includes('✅') ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {error.includes('✅') ? (
                          <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm font-medium ${error.includes('✅') ? 'text-green-800' : 'text-red-800'}`}>
                          {error}
                        </p>
                        {error.includes('✅') && (
                          <div className="mt-2 space-y-2">
                            <p className="text-xs text-green-600">
                              If redirect doesn't work in 3 seconds, click below:
                            </p>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() => testManualRedirect('/admin')}
                                className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200"
                              >
                                Go to Admin
                              </button>
                              <button
                                type="button"
                                onClick={() => testManualRedirect('/dashboard')}
                                className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded hover:bg-orange-200"
                              >
                                Go to Dashboard
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="rounded-md shadow-sm -space-y-px">
                  <div>
                    <label htmlFor="email-address" className="sr-only">Email address</label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="appearance-none rounded-t-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="appearance-none rounded-b-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <Link to="/signup" className="font-medium text-orange-600 hover:text-orange-500 transition-colors">
                      Don't have an account? Sign up
                    </Link>
                  </div>
                  <div className="text-sm">
                    <a href="/" className="font-medium text-gray-600 hover:text-gray-500">
                      Back to Home
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Debug Panel */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 text-gray-100 rounded-xl shadow-lg p-6 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Debug Console</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={testAuthState}
                    className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
                  >
                    Check Auth
                  </button>
                  <button
                    onClick={() => setDebugInfo([])}
                    className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded"
                  >
                    Clear
                  </button>
                </div>
              </div>
              
              <div className="bg-black rounded-lg p-3 h-96 overflow-y-auto font-mono text-xs">
                {debugInfo.length > 0 ? (
                  debugInfo.map((line, index) => (
                    <div key={index} className="mb-1">
                      <span className="text-green-400">$</span> {line}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">
                    <p>Debug information will appear here.</p>
                    <p className="mt-2">Try signing in to see what happens.</p>
                  </div>
                )}
              </div>

              {/* Quick Test Buttons */}
              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium text-gray-300 mb-2">Quick Tests:</div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setEmail('koshbtc@gmail.com');
                      setPassword('testpassword123');
                    }}
                    className="text-xs bg-blue-900 hover:bg-blue-800 text-blue-100 px-3 py-2 rounded text-left"
                  >
                    Load Admin Creds
                  </button>
                  <button
                    onClick={() => {
                      setEmail('user@example.com');
                      setPassword('password123');
                    }}
                    className="text-xs bg-orange-900 hover:bg-orange-800 text-orange-100 px-3 py-2 rounded text-left"
                  >
                    Load User Creds
                  </button>
                  <button
                    onClick={() => testManualRedirect('/admin')}
                    className="text-xs bg-purple-900 hover:bg-purple-800 text-purple-100 px-3 py-2 rounded"
                  >
                    Go to /admin
                  </button>
                  <button
                    onClick={() => testManualRedirect('/dashboard')}
                    className="text-xs bg-green-900 hover:bg-green-800 text-green-100 px-3 py-2 rounded"
                  >
                    Go to /dashboard
                  </button>
                </div>
              </div>

              {/* Current State */}
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="text-sm font-medium text-gray-300 mb-2">Current State:</div>
                <div className="text-xs space-y-1">
                  <div className="flex">
                    <span className="text-gray-400 w-24">User:</span>
                    <span className={user ? 'text-green-400' : 'text-red-400'}>
                      {user ? user.email : 'Not logged in'}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-400 w-24">Is Admin:</span>
                    <span className={isAdmin ? 'text-green-400' : 'text-red-400'}>
                      {isAdmin ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-400 w-24">Location:</span>
                    <span>{location.pathname}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
