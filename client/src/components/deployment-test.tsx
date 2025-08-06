import { useEffect, useState } from 'react';

export function DeploymentTest() {
  const [status, setStatus] = useState('initializing');
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    console.log('🚀 DeploymentTest component mounted');
    
    async function testAPIs() {
      try {
        setStatus('testing');
        
        // Test health endpoint
        const healthResponse = await fetch('/api/health');
        const healthData = await healthResponse.json();
        console.log('Health check result:', healthData);
        
        // Test categories
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        console.log('Categories loaded:', categoriesData.length);
        
        setData({
          health: healthData,
          categoriesCount: categoriesData.length,
          categories: categoriesData.slice(0, 3)
        });
        setStatus('success');
        
      } catch (error) {
        console.error('API test failed:', error);
        setStatus('error');
        setData({ error: error.message });
      }
    }
    
    testAPIs();
  }, []);

  if (status === 'initializing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">MTS Digital Services</h2>
          <p>Initializing React App...</p>
        </div>
      </div>
    );
  }

  if (status === 'testing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">MTS Digital Services</h2>
          <p>Testing Backend Connection...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto p-6">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-4">
            <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
            <p className="text-sm">Error: {data?.error}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-green-500/20 border border-green-500 rounded-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-4">✅ MTS Digital Services</h1>
          <p className="text-green-200">React App Successfully Initialized!</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Backend Status</h2>
          <div className="text-white space-y-2">
            <p>Categories: {data.categoriesCount}</p>
            <p>Products: {data.health.productsCount}</p>
            <p>Environment: {data.health.environment}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {data.categories.map((category: any) => (
            <div key={category.id} className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
              <h3 className="font-bold text-white mb-2">{category.name}</h3>
              <p className="text-gray-300 text-sm">{category.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Continue to Full App
          </button>
        </div>
      </div>
    </div>
  );
}