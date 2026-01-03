// src/pages/SignIn.jsx - WITH DEBUGGING
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('🔐 Signing in...', email);
      const result = await signIn(email, password);
      console.log('✅ Sign in result:', result);

      if (result.success) {
        // Show success message
        setError('✅ Login successful! Redirecting...');
        
        // Determine redirect path
        const isAdmin = result.isAdmin || email.includes('admin') || email === 'koshbtc@gmail.com';
        const redirectPath = isAdmin ? '/admin' : '/dashboard';
        
        console.log('👤 Is Admin:', isAdmin);
        console.log('🚀 Redirecting to:', redirectPath);
        
        // Wait 1 second then redirect
        setTimeout(() => {
          console.log('🔄 Performing redirect...');
          window.location.href = redirectPath;
        }, 1000);
      } else {
        setError(result.error || 'Invalid email or password. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('❌ Sign in error:', error);
      setError(error.message || 'An unexpected error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
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
                    <p className="text-xs text-green-600 mt-1">
                      If redirect doesn't work, click: 
                      <a href={email.includes('admin') || email === 'koshbtc@gmail.com' ? '/admin' : '/dashboard'} 
                         className="ml-1 underline">
                        {email.includes('admin') || email === 'koshbtc@gmail.com' ? '/admin' : '/dashboard'}
                      </a>
                    </p>
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
          </div>
          
          {/* Debug Links */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-600 mb-2">Test Links:</p>
            <div className="space-y-1">
              <a href="/admin" className="block text-xs text-blue-600 hover:text-blue-800 hover:underline">
                ↗ Go to Admin Dashboard
              </a>
              <a href="/dashboard" className="block text-xs text-blue-600 hover:text-blue-800 hover:underline">
                ↗ Go to User Dashboard
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
