// src/components/TestEmail.jsx
import { useState } from 'react';
import { testEmailService, canSendEmails } from '../lib/emailService';

export default function TestEmail() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [config, setConfig] = useState(null);

  const checkConfig = async () => {
    const config = await canSendEmails();
    setConfig(config);
    console.log('Email config:', config);
  };

  const handleTest = async () => {
    setLoading(true);
    setResult(null);
    try {
      const testResult = await testEmailService();
      setResult(testResult);
      console.log('Test result:', testResult);
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Test Email Service</h2>
      
      <button
        onClick={checkConfig}
        className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
      >
        Check Email Configuration
      </button>
      
      {config && (
        <div className={`p-3 mb-4 rounded ${config.hasEmailService ? 'bg-green-100' : 'bg-red-100'}`}>
          <p className={config.hasEmailService ? 'text-green-800' : 'text-red-800'}>
            {config.message}
          </p>
          <p className="text-sm mt-1">From: {config.fromEmail}</p>
        </div>
      )}
      
      <button
        onClick={handleTest}
        disabled={loading}
        className="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50"
      >
        {loading ? 'Sending Test Email...' : 'Send Test Email'}
      </button>
      
      {result && (
        <div className={`mt-4 p-3 rounded ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
          <p className={result.success ? 'text-green-800' : 'text-red-800'}>
            {result.success ? '✅ Test successful!' : '❌ Test failed'}
          </p>
          <p className="text-sm mt-1">{result.message}</p>
          {result.error && (
            <p className="text-sm mt-1 text-red-600">{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}