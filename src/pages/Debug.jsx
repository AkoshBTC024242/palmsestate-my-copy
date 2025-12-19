import { useEffect, useState } from 'react';
import { testConnection, fetchProperties } from '../lib/supabase';

function Debug() {
  const [connectionResult, setConnectionResult] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    runDebug();
  }, []);

  const runDebug = async () => {
    try {
      // Test connection
      const connection = await testConnection();
      setConnectionResult(connection);

      // Fetch properties
      const data = await fetchProperties();
      setProperties(data);
    } catch (error) {
      console.error('Debug error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Testing connection...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Database Debug</h1>
      
      <div className="mb-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Connection Status</h2>
        <pre className="text-sm bg-white p-4 rounded">
          {JSON.stringify(connectionResult, null, 2)}
        </pre>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Properties Found: {properties.length}</h2>
        <div className="space-y-4">
          {properties.map((property) => (
            <div key={property.id} className="bg-white p-4 rounded border">
              <p><strong>ID:</strong> {property.id}</p>
              <p><strong>Title:</strong> {property.title}</p>
              <p><strong>Location:</strong> {property.location}</p>
              <p><strong>Price:</strong> ${property.price_per_week}</p>
              <p><strong>Image URL:</strong> {property.image_url}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={runDebug}
        className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
      >
        Run Debug Again
      </button>
    </div>
  );
}

export default Debug;