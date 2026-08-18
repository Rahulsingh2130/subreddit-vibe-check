import React, { useState } from 'react';
import { Search, Sparkles, TrendingUp, Cpu, Gamepad2, Globe, Atom, Heart, Trophy, Coins } from 'lucide-react';

interface HeroSearchProps {
  currentSubreddit: string;
  onSearch: (subreddit: string) => void;
  isLoading: boolean;
}

const CATEGORIES = [
  { label: 'Technology', value: 'technology', icon: Cpu, color: '#06b6d4' },
  { label: 'WallStreetBets', value: 'wallstreetbets', icon: TrendingUp, color: '#10b981' },
  { label: 'Gaming', value: 'gaming', icon: Gamepad2, color: '#8b5cf6' },
  { label: 'World News', value: 'worldnews', icon: Globe, color: '#3b82f6' },
  { label: 'Science', value: 'science', icon: Atom, color: '#a855f7' },
  { label: 'Wholesome', value: 'wholesomememes', icon: Heart, color: '#ec4899' },
  { label: 'Sports', value: 'sports', icon: Trophy, color: '#f59e0b' },
  { label: 'Crypto', value: 'cryptocurrency', icon: Coins, color: '#eab308' },
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  currentSubreddit,
  onSearch,
  isLoading
}) => {
  const [inputValue, setInputValue] = useState(currentSubreddit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handleCategoryClick = (sub: string) => {
    setInputValue(sub);
    onSearch(sub);
  };

  return (
    <div style={{
      padding: '40px 0 20px 0',
      textAlign: 'center',
      position: 'relative'
    }}>
      {/* Title & Headline */}
      <div style={{ maxWidth: '780px', margin: '0 auto 28px auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.25)',
          color: 'var(--neon-cyan)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '16px'
        }}>
          <Sparkles size={14} /> Analyze Sentiment Across 50 Top Hot Posts
        </div>
        <h2 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          lineHeight: 1.15,
          marginBottom: '12px'
        }}>
          Check the <span className="text-gradient">Vibe & Sentiment</span> of Any Subreddit
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>
          Instantly evaluate emotional intensity, community sentiment index, top keywords, and hot discussions.
        </p>
      </div>

      {/* Main Search Bar */}
      <form onSubmit={handleSubmit} style={{
        maxWidth: '620px',
        margin: '0 auto 24px auto',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-input)',
          border: '1px solid var(--border-glow)',
          borderRadius: 'var(--radius-xl)',
          padding: '8px 10px 8px 20px',
          boxShadow: 'var(--shadow-glow-cyan)',
          transition: 'all 0.3s ease'
        }}>
          <span style={{
            color: 'var(--neon-cyan)',
            fontWeight: 700,
            fontSize: '1.1rem',
            marginRight: '4px',
            userSelect: 'none'
          }}>
            r/
          </span>
          <input
            id="subreddit-search-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="enter subreddit (e.g. technology, wallstreetbets, gaming)..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: '1.05rem',
              fontWeight: 500,
              fontFamily: 'var(--font-body)'
            }}
          />
          <button
            id="subreddit-search-submit"
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            {isLoading ? (
              <>
                <span className="animate-spin-slow">⏳</span> Analyzing...
              </>
            ) : (
              <>
                <Search size={18} /> Run Vibe Check
              </>
            )}
          </button>
        </div>
      </form>

      {/* Popular Presets Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        maxWidth: '850px',
        margin: '0 auto'
      }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Popular Presets:
        </span>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const isActive = currentSubreddit.toLowerCase() === cat.value;
          return (
            <button
              key={cat.value}
              id={`preset-btn-${cat.value}`}
              onClick={() => handleCategoryClick(cat.value)}
              style={{
                background: isActive ? `rgba(${cat.color}, 0.25)` : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${isActive ? cat.color : 'rgba(255, 255, 255, 0.08)'}`,
                color: isActive ? '#fff' : 'var(--text-secondary)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={14} color={cat.color} /> {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
