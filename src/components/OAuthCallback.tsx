import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { getOAuthConfig, exchangeCodeForToken } from '../services/authService';
import { AlertCircle, Loader } from 'lucide-react';

export const OAuthCallback: React.FC = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get('code');
        const errorParam = params.get('error');

        if (errorParam) {
          throw new Error(`Reddit OAuth error: ${errorParam}`);
        }

        if (!code) {
          throw new Error('No authorization code received from Reddit');
        }

        const config = getOAuthConfig();
        if (!config) {
          throw new Error('OAuth configuration not found. Please log in again.');
        }

        const token = await exchangeCodeForToken(code, config);
        await login(config, token);

        window.location.href = '/';
      } catch (err: any) {
        console.error('OAuth callback error:', err);
        setError(err.message || 'Failed to complete authentication');
        setIsLoading(false);
      }
    };

    handleCallback();
  }, [login]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
        <div className="text-center">
          <Loader className="animate-spin mx-auto mb-4 text-orange-600" size={40} />
          <p className="text-gray-600">Completing authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-blue-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md">
        <div className="flex items-center gap-3 mb-4 text-red-600">
          <AlertCircle size={24} />
          <h2 className="text-lg font-bold">Authentication Error</h2>
        </div>
        <p className="text-gray-700 mb-4">{error}</p>
        <a
          href="/"
          className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};
