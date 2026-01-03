/**
 * App Component
 * Root application component
 * Wraps content in Layout and provides placeholder for future features
 */

import { useEffect, useState } from 'react';
import Layout from './components/layout';
import apiService from './services/apiService';

function App() {
  const [healthStatus, setHealthStatus] = useState(null);

  // Check API health on mount
  useEffect(() => {
    apiService
      .checkHealth()
      .then((data) => setHealthStatus(data.status))
      .catch(() => setHealthStatus('error'));
  }, []);

  return (
    <Layout>
      <div className="flex flex-col items-center text-center gap-8 lg:gap-12 py-8 lg:py-12">
        <h2 className="text-3xl lg:text-5xl font-bold text-text-primary">
          Welcome to User Browser
        </h2>
        
        <p className="text-base lg:text-lg text-text-secondary max-w-2xl leading-relaxed">
          A scalable interface for browsing millions of alphabetically sorted usernames.
        </p>
        
        {healthStatus && (
          <div className={`flex items-center gap-2 px-6 py-3 bg-white rounded-lg shadow-sm ${
            healthStatus === 'ok' ? 'border-l-4 border-primary' : 'border-l-4 border-accent'
          }`}>
            <span className="text-sm font-semibold text-text-secondary">
              API Status:
            </span>
            <span className={`text-sm font-bold uppercase tracking-wide ${
              healthStatus === 'ok' ? 'text-primary' : 'text-accent'
            }`}>
              {healthStatus}
            </span>
          </div>
        )}

        <div className="mt-8 p-12 lg:p-16 bg-white border-2 border-dashed border-border rounded-xl max-w-3xl w-full">
          <p className="text-base text-text-muted italic">
            Alphabet navigation and user list will appear here.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default App;