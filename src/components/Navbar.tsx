import React, { useState } from 'react';
import { Sparkles, Swords, FileText, Settings, Download, Activity, CheckCircle2, LogOut, LogIn } from 'lucide-react';
import type { SubredditVibeSummary } from '../types/reddit';
import { useAuth } from './AuthContext';
import { LoginModal } from './LoginModal';

interface NavbarProps {
  activeView: 'dashboard' | 'battle';
  setActiveView: (view: 'dashboard' | 'battle') => void;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
  onExportReport: () => void;
  summaryData?: SubredditVibeSummary;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  setActiveView,
  onOpenGuide,
  onOpenSettings,
  onExportReport,
  summaryData
}) => {
  const { isAuthenticated, username, logout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const getSourceBadge = () => {
    if (!summaryData) return null;
    switch (summaryData.dataSource) {
      case 'live':
        return (
          <span className="badge badge-positive" title="Connected directly to Reddit JSON API">
            <span className="pulse-dot pulse-emerald"></span> Live API
          </span>
        );
      case 'oauth':
        return (
          <span className="badge badge-positive" title="Authenticated via Reddit OAuth Credentials">
            <span className="pulse-dot pulse-emerald"></span> Reddit OAuth
          </span>
        );
      case 'proxy':
        return (
          <span className="badge badge-neutral" title="Fetched via High-Speed CORS Proxy">
            <span className="pulse-dot pulse-amber"></span> Proxy Mode
          </span>
        );
      case 'fallback':
      default:
        return (
          <span className="badge badge-neutral" title="Using High-Fidelity Subreddit Snapshot Dataset">
            <CheckCircle2 size={12} /> Snapshot Mode
          </span>
        );
    }
  };

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(7, 9, 14, 0.8)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px'
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--gradient-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-glow-cyan)'
          }}>
            <Sparkles size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }} className="text-gradient">
                Subreddit Vibe Check
              </h1>
              {getSourceBadge()}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Real-time Social Sentiment & Mood Analytics
            </p>
          </div>
        </div>

        {/* View Mode Nav Pills */}
        <div style={{
          display: 'flex',
          background: 'rgba(15, 21, 37, 0.9)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            id="nav-dashboard-tab"
            onClick={() => setActiveView('dashboard')}
            style={{
              background: activeView === 'dashboard' ? 'var(--gradient-primary)' : 'transparent',
              color: activeView === 'dashboard' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Activity size={16} /> Single Subreddit
          </button>
          <button
            id="nav-battle-tab"
            onClick={() => setActiveView('battle')}
            style={{
              background: activeView === 'battle' ? 'var(--gradient-rose)' : 'transparent',
              color: activeView === 'battle' ? '#fff' : 'var(--text-secondary)',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 600,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Swords size={16} /> Vibe Battle
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            id="btn-submission-guide"
            onClick={onOpenGuide}
            className="btn btn-secondary"
            style={{ borderColor: 'rgba(6, 182, 212, 0.4)', color: 'var(--neon-cyan)' }}
          >
            <FileText size={16} /> Submission Instructions
          </button>

          {summaryData && (
            <button
              id="btn-export-report"
              onClick={onExportReport}
              className="btn btn-secondary"
              title="Export Sentiment Report"
            >
              <Download size={16} /> Export
            </button>
          )}

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                color: 'var(--neon-emerald)',
                fontWeight: 600
              }}>
                ✓ {username}
              </div>
              <button
                onClick={logout}
                className="btn btn-secondary"
                title="Logout from Reddit"
                style={{ color: 'var(--neon-rose)' }}
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="btn btn-secondary"
              style={{ 
                background: 'var(--gradient-primary)',
                color: '#fff',
                border: 'none'
              }}
            >
              <LogIn size={16} /> Login with Reddit
            </button>
          )}

          <button
            id="btn-settings"
            onClick={onOpenSettings}
            className="btn btn-secondary btn-icon"
            title="API & Preference Settings"
          >
            <Settings size={18} />
          </button>
        </div>

        <LoginModal 
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />
      </div>
    </header>
  );
};
