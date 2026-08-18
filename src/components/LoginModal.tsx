import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { OAuthConfig } from '../services/authService';
import { getRedditAuthorizationUrl, saveOAuthConfig } from '../services/authService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved?: (config: OAuthConfig) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onConfigSaved }) => {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [redirectUri, setRedirectUri] = useState(
    typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : 'http://localhost:5173/auth/callback'
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!clientId || !clientSecret || !redirectUri) {
        throw new Error('Please fill in all fields');
      }

      const config: OAuthConfig = {
        clientId,
        clientSecret,
        redirectUri
      };

      saveOAuthConfig(config);
      onConfigSaved?.(config);

      const authUrl = getRedditAuthorizationUrl(config);
      window.location.href = authUrl;
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Login with Reddit</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reddit Client ID
            </label>
            <input
              type="text"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Your Reddit app client ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Get this from <a href="https://www.reddit.com/prefs/apps" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Reddit App Preferences</a>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Secret
            </label>
            <input
              type="password"
              value={clientSecret}
              onChange={(e) => setClientSecret(e.target.value)}
              placeholder="Your Reddit app client secret"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Redirect URI
            </label>
            <input
              type="text"
              value={redirectUri}
              onChange={(e) => setRedirectUri(e.target.value)}
              placeholder="http://localhost:5173/auth/callback"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Must match the redirect URI in your Reddit app settings
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-md transition"
          >
            {isLoading ? 'Redirecting...' : 'Login with Reddit'}
          </button>

          <p className="text-xs text-gray-600 text-center">
            Your credentials are stored locally and used only for authentication.
          </p>
        </form>
      </div>
    </div>
  );
};
