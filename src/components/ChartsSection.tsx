import React from 'react';
import type { SubredditVibeSummary, EmotionType } from '../types/reddit';
import { PieChart, Smile, Sparkles, AlertTriangle, TrendingUp, Tag, HelpCircle, Frown } from 'lucide-react';

interface ChartsSectionProps {
  summary: SubredditVibeSummary;
}

const EMOTION_CONFIG: Record<EmotionType, { label: string; icon: any; color: string }> = {
  joy: { label: 'Joy & Hype 🔥', icon: Sparkles, color: '#10b981' },
  wholesome: { label: 'Wholesome ✨', icon: Smile, color: '#06b6d4' },
  curiosity: { label: 'Curious & Tech 🤔', icon: HelpCircle, color: '#3b82f6' },
  neutral: { label: 'Neutral News ⚖️', icon: Tag, color: '#8b5cf6' },
  frustration: { label: 'Frustration / Outrage ⚡', icon: AlertTriangle, color: '#f59e0b' },
  anxiety: { label: 'Anxiety / Doom 💀', icon: Frown, color: '#ef4444' },
};

export const ChartsSection: React.FC<ChartsSectionProps> = ({ summary }) => {
  const {
    positiveRatio,
    neutralRatio,
    negativeRatio,
    emotions,
    topPositiveWords,
    topNegativeWords,
    analyzedPosts
  } = summary;

  // SVG Donut Calculations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const posOffset = 0;
  const posLength = (positiveRatio / 100) * circumference;

  const neuOffset = -posLength;
  const neuLength = (neutralRatio / 100) * circumference;

  const negOffset = -(posLength + neuLength);
  const negLength = (negativeRatio / 100) * circumference;

  // Scatter Plot Data
  const scatterPoints = analyzedPosts.map(item => ({
    title: item.post.title,
    score: item.post.score,
    compound: item.sentiment.compound,
    id: item.post.id
  }));

  const maxKarma = Math.max(...scatterPoints.map(p => p.score), 1000);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
      gap: '20px',
      margin: '28px 0'
    }}>
      {/* Chart 1: Donut Chart - Sentiment Split */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <PieChart size={18} color="var(--neon-cyan)" /> Sentiment Ratio Breakdown
        </h3>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '20px'
        }}>
          {/* SVG Donut */}
          <div style={{ position: 'relative', width: '160px', height: '160px' }}>
            <svg width="160" height="160" viewBox="0 0 160 160">
              <g transform="rotate(-90 80 80)">
                {/* Positive segment */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="var(--neon-emerald)"
                  strokeWidth="20"
                  strokeDasharray={`${posLength} ${circumference - posLength}`}
                  strokeDashoffset={posOffset}
                />
                {/* Neutral segment */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="var(--neon-violet)"
                  strokeWidth="20"
                  strokeDasharray={`${neuLength} ${circumference - neuLength}`}
                  strokeDashoffset={neuOffset}
                />
                {/* Negative segment */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  fill="none"
                  stroke="var(--neon-rose)"
                  strokeWidth="20"
                  strokeDasharray={`${negLength} ${circumference - negLength}`}
                  strokeDashoffset={negOffset}
                />
              </g>
            </svg>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>50</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Posts</span>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--neon-emerald)' }} />
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Positive: <strong style={{ color: '#fff' }}>{positiveRatio}%</strong>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--neon-violet)' }} />
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Neutral: <strong style={{ color: '#fff' }}>{neutralRatio}%</strong>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--neon-rose)' }} />
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Negative: <strong style={{ color: '#fff' }}>{negativeRatio}%</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart 2: Emotion Breakdown Bars */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={18} color="var(--neon-violet)" /> Emotion Classification
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {(Object.keys(EMOTION_CONFIG) as EmotionType[]).map((emoKey) => {
            const cfg = EMOTION_CONFIG[emoKey];
            const count = emotions[emoKey] || 0;
            const pct = Math.round((count / Math.max(summary.totalPosts, 1)) * 100);
            return (
              <div key={emoKey}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{cfg.label}</span>
                  <span style={{ color: '#fff', fontWeight: 700 }}>{count} ({pct}%)</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: cfg.color, borderRadius: 'var(--radius-full)' }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart 3: Top Positive & Negative Keyword Drivers */}
      <div className="glass-panel" style={{ padding: '24px', gridColumn: 'span 1' }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Tag size={18} color="var(--neon-amber)" /> Top Sentiment Keywords
        </h3>

        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--neon-emerald)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Positive Drivers (+)
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {topPositiveWords.length > 0 ? (
              topPositiveWords.map((item, idx) => (
                <span key={idx} className="badge badge-positive" style={{ fontSize: '0.78rem' }}>
                  {item.word} ({item.count})
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No strong positive keywords</span>
            )}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.78rem', color: 'var(--neon-rose)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Negative Drivers (-)
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {topNegativeWords.length > 0 ? (
              topNegativeWords.map((item, idx) => (
                <span key={idx} className="badge badge-negative" style={{ fontSize: '0.78rem' }}>
                  {item.word} ({item.count})
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No strong negative keywords</span>
            )}
          </div>
        </div>
      </div>

      {/* Chart 4: Upvote Karma vs Sentiment Scatter Map */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <TrendingUp size={18} color="var(--neon-emerald)" /> Karma vs Sentiment Correlation Map
        </h3>

        <div style={{
          position: 'relative',
          height: '180px',
          borderBottom: '1px stroke rgba(255,255,255,0.1)',
          borderLeft: '1px stroke rgba(255,255,255,0.1)',
          padding: '10px'
        }}>
          {/* Axis Labels */}
          <div style={{ position: 'absolute', top: 0, left: '6px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>High Karma</div>
          <div style={{ position: 'absolute', bottom: '6px', left: '6px', fontSize: '0.7rem', color: 'var(--neon-rose)' }}>-100 Negative</div>
          <div style={{ position: 'absolute', bottom: '6px', right: '6px', fontSize: '0.7rem', color: 'var(--neon-emerald)' }}>+100 Positive</div>

          {/* Scatter dots */}
          <svg width="100%" height="100%" viewBox="0 0 300 160" preserveAspectRatio="none">
            {/* Center Zero Line */}
            <line x1="150" y1="0" x2="150" y2="160" stroke="rgba(255,255,255,0.1)" strokeDasharray="4" />

            {scatterPoints.map((pt, idx) => {
              // Map compound (-100 to 100) -> SVG X (10 to 290)
              const cx = 150 + (pt.compound / 100) * 130;
              // Map karma (0 to maxKarma) -> SVG Y (150 down to 10)
              const cy = 150 - (pt.score / Math.max(maxKarma, 1)) * 140;
              const color = pt.compound >= 10 ? '#10b981' : pt.compound <= -10 ? '#f43f5e' : '#8b5cf6';

              return (
                <circle
                  key={idx}
                  cx={cx}
                  cy={cy}
                  r="5"
                  fill={color}
                  opacity="0.8"
                >
                  <title>{`${pt.title}\nKarma: ${pt.score}\nVibe: ${pt.compound}`}</title>
                </circle>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};
