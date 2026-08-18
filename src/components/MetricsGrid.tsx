import React from 'react';
import type { SubredditVibeSummary } from '../types/reddit';
import { ThumbsUp, MinusCircle, ThumbsDown, Flame, MessageSquare } from 'lucide-react';

interface MetricsGridProps {
  summary: SubredditVibeSummary;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ summary }) => {
  const {
    positiveRatio,
    neutralRatio,
    negativeRatio,
    totalKarma,
    totalComments
  } = summary;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toLocaleString();
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      margin: '24px 0'
    }}>
      {/* Card 1: Positive Ratio */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Positive Titles</span>
          <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--neon-emerald)' }}>
            <ThumbsUp size={18} />
          </div>
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--neon-emerald)', fontFamily: 'var(--font-heading)' }}>
          {positiveRatio}%
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-full)', marginTop: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${positiveRatio}%`, height: '100%', background: 'var(--neon-emerald)', borderRadius: 'var(--radius-full)' }} />
        </div>
      </div>

      {/* Card 2: Neutral Ratio */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Neutral / Objective</span>
          <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--neon-violet)' }}>
            <MinusCircle size={18} />
          </div>
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--neon-violet)', fontFamily: 'var(--font-heading)' }}>
          {neutralRatio}%
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-full)', marginTop: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${neutralRatio}%`, height: '100%', background: 'var(--neon-violet)', borderRadius: 'var(--radius-full)' }} />
        </div>
      </div>

      {/* Card 3: Negative Ratio */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Negative Titles</span>
          <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(244, 63, 94, 0.15)', color: 'var(--neon-rose)' }}>
            <ThumbsDown size={18} />
          </div>
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--neon-rose)', fontFamily: 'var(--font-heading)' }}>
          {negativeRatio}%
        </div>
        <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-full)', marginTop: '10px', overflow: 'hidden' }}>
          <div style={{ width: `${negativeRatio}%`, height: '100%', background: 'var(--neon-rose)', borderRadius: 'var(--radius-full)' }} />
        </div>
      </div>

      {/* Card 4: Total Engagement */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Hot Posts Karma & Comments</span>
          <div style={{ padding: '6px', borderRadius: 'var(--radius-sm)', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--neon-cyan)' }}>
            <Flame size={18} />
          </div>
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--neon-cyan)', fontFamily: 'var(--font-heading)' }}>
          {formatNumber(totalKarma)}
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MessageSquare size={12} /> {formatNumber(totalComments)} total comments
        </div>
      </div>
    </div>
  );
};
