import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './components/AuthContext.tsx'
import { OAuthCallback } from './components/OAuthCallback.tsx'

const isAuthCallback = window.location.pathname === '/auth/callback' || 
                       window.location.pathname === '/auth/callback/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      {isAuthCallback ? <OAuthCallback /> : <App />}
    </AuthProvider>
  </StrictMode>,
)
