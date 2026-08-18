import React from 'react';
import type { SubredditVibeSummary } from '../types/reddit';

interface VibeGaugeProps {
  summary: SubredditVibeSummary;
}

export const VibeGauge: React.FC<VibeGaugeProps> = ({ summary }) => {
  const { averageScore, vibeStatus, vibeDescription, vibeBadgeColor, displayName, fetchedAt } = summary;

  // Convert -100 to +100 score to angle (-90deg to +90deg)
  const scoreClamped = Math.max(-100, Math.min(100, averageScore));
  const angle = (scoreClamped / 100) * 90;

  return (
    <div className="glass-panel glass-panel-glow" style={{
      padding: '32px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subreddit Header Tag */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)'
          }}>
            {displayName}
          </span>
          <span style={{
            fontSize: '0.75rem',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.06)',
            color: 'var(--text-secondary)'
          }}>
            50 Hot Posts Analyzed
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Updated {fetchedAt}
        </span>
      </div>

      {/* SVG Radial Semi-Circle Gauge */}
      <div style={{
        position: 'relative',
        width: '280px',
        height: '150px',
        margin: '0 auto 16px auto'
      }}>
        <svg width="280" height="150" viewBox="0 0 280 150">
          <defs>
            {/* Outer Arc Gradient */}
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />    {/* Red / Negative */}
              <stop offset="25%" stopColor="#f97316" />   {/* Orange */}
              <stop offset="50%" stopColor="#eab308" />   {/* Yellow / Neutral */}
              <stop offset="75%" stopColor="#06b6d4" />   {/* Cyan */}
              <stop offset="100%" stopColor="#10b981" />  {/* Emerald / Positive */}
            </linearGradient>

            {/* Glow Filter */}
            <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Track Arc */}
          <path
            d="M 30 140 A 110 110 0 0 1 250 140"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="18"
            strokeLinecap="round"
          />

          {/* Colored Gradient Arc */}
          <path
            d="M 30 140 A 110 110 0 0 1 250 140"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="18"
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
          />

          {/* Scale Labels */}
          <text x="20" y="148" fill="var(--neon-rose)" fontSize="11" fontWeight="700">-100</text>
          <text x="133" y="24" fill="var(--neon-amber)" fontSize="11" fontWeight="700">0</text>
          <text x="245" y="148" fill="var(--neon-emerald)" fontSize="11" fontWeight="700">+100</text>

          {/* Rotating Needle */}
          <g transform={`translate(140, 140) rotate(${angle})`}>
            {/* Needle line */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="-95"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              style={{ transition: 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            />
            {/* Needle center pin */}
            <circle cx="0" cy="0" r="10" fill="#0b0f19" stroke={vibeBadgeColor} strokeWidth="4" />
            <circle cx="0" cy="0" r="4" fill="#ffffff" />
          </g>
        </svg>

        {/* Floating Animated Score */}
        <div style={{
          position: 'absolute',
          bottom: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center'
        }}>
          <span style={{
            fontSize: '2.5rem',
            fontWeight: 900,
            fontFamily: 'var(--font-heading)',
            color: vibeBadgeColor,
            textShadow: `0 0 20px ${vibeBadgeColor}66`
          }}>
            {averageScore > 0 ? `+${averageScore}` : averageScore}
          </span>
          <span style={{
            display: 'block',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontWeight: 700
          }}>
            Vibe Index Score
          </span>
        </div>
      </div>

      {/* Vibe Status Badge */}
      <div style={{
        marginTop: '16px',
        padding: '8px 20px',
        borderRadius: 'var(--radius-full)',
        background: `${vibeBadgeColor}1a`,
        border: `1px solid ${vibeBadgeColor}55`,
        color: vibeBadgeColor,
        fontWeight: 700,
        fontSize: '1.05rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        boxShadow: `0 0 20px ${vibeBadgeColor}33`
      }}>
        {vibeStatus}
      </div>

      {/* Synthesis Description */}
      <p style={{
        marginTop: '14px',
        color: 'var(--text-secondary)',
        fontSize: '0.92rem',
        maxWidth: '560px',
        lineHeight: 1.5
      }}>
        {vibeDescription}
      </p>
    </div>
  );
};
