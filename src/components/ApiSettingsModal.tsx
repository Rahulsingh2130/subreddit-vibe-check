import React, { useState } from 'react';
import { X, Settings, Key, Save } from 'lucide-react';
import type { ApiConfig } from '../types/reddit';
import { getStoredApiConfig, saveApiConfig } from '../services/redditApi';

interface ApiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: (config: ApiConfig) => void;
}

export const ApiSettingsModal: React.FC<ApiSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const [config, setConfig] = useState<ApiConfig>(getStoredApiConfig());

  if (!isOpen) return null;

  const handleSave = () => {
    saveApiConfig(config);
    onConfigSaved(config);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={22} color="var(--neon-cyan)" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Reddit API & Fetch Settings</h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {/* OAuth Credentials */}
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--neon-emerald)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Key size={16} /> Optional: Reddit OAuth Credentials (Step 1)
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              If you created a Reddit developer app at reddit.com/prefs/apps, enter your Client ID & Secret here for high-limit live API calls.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reddit Client ID</label>
                <input
                  type="text"
                  value={config.redditClientId}
                  onChange={(e) => setConfig({ ...config, redditClientId: e.target.value })}
                  placeholder="e.g. wXyZ12345678"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Reddit Client Secret</label>
                <input
                  type="password"
                  value={config.redditClientSecret}
                  onChange={(e) => setConfig({ ...config, redditClientSecret: e.target.value })}
                  placeholder="e.g. secret_key_here..."
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    color: '#fff',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>
          </div>

          {/* User Agent */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
              Custom User-Agent Header
            </label>
            <input
              type="text"
              value={config.redditUserAgent}
              onChange={(e) => setConfig({ ...config, redditUserAgent: e.target.value })}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Snapshot Data Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
            <div>
              <strong style={{ fontSize: '0.88rem', color: '#fff', display: 'block' }}>Force High-Speed Offline Snapshot Mode</strong>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Use instant 50-post cached datasets for zero-latency testing.</span>
            </div>
            <input
              type="checkbox"
              checked={config.useFallbackData}
              onChange={(e) => setConfig({ ...config, useFallbackData: e.target.checked })}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <button onClick={handleSave} className="btn btn-primary">
            <Save size={16} /> Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
