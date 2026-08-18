import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthToken, OAuthConfig } from '../services/authService';
import {
  getStoredAuthToken,
  saveAuthToken,
  clearAuthToken,
  getCurrentUser
} from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  token: AuthToken | null;
  username: string | null;
  login: (config: OAuthConfig, token: AuthToken) => Promise<void>;
  logout: () => void;
  setAuthToken: (token: AuthToken) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<AuthToken | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredAuthToken();
    if (storedToken) {
      setToken(storedToken);
      fetchUsername(storedToken.accessToken);
    }
    setIsLoading(false);
  }, []);

  const fetchUsername = async (accessToken: string) => {
    try {
      const user = await getCurrentUser(accessToken);
      setUsername(user.name);
    } catch (err) {
      console.error('Failed to fetch username:', err);
      clearAuthToken();
      setToken(null);
    }
  };

  const login = async (_config: OAuthConfig, newToken: AuthToken) => {
    saveAuthToken(newToken);
    setToken(newToken);
    await fetchUsername(newToken.accessToken);
  };

  const logout = () => {
    clearAuthToken();
    setToken(null);
    setUsername(null);
  };

  const setAuthToken = (newToken: AuthToken) => {
    saveAuthToken(newToken);
    setToken(newToken);
  };

  const value: AuthContextType = {
    isAuthenticated: !!token,
    isLoading,
    token,
    username,
    login,
    logout,
    setAuthToken
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
