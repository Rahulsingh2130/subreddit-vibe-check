import React, { useState, useEffect } from 'react';
import type { SubredditVibeSummary } from '../types/reddit';
import { fetchSubredditVibe } from '../services/redditApi';
import { VibeGauge } from './VibeGauge';
import { Swords, Trophy } from 'lucide-react';

interface VibeBattleProps {
  initialSubredditA?: string;
}

export const VibeBattle: React.FC<VibeBattleProps> = ({ initialSubredditA = 'technology' }) => {
  const [subAInput, setSubAInput] = useState<string>(initialSubredditA);
  const [subBInput, setSubBInput] = useState<string>('wallstreetbets');

  const [dataA, setDataA] = useState<SubredditVibeSummary | null>(null);
  const [dataB, setDataB] = useState<SubredditVibeSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const runBattle = async () => {
    setIsLoading(true);
    try {
      const [resA, resB] = await Promise.all([
        fetchSubredditVibe(subAInput),
        fetchSubredditVibe(subBInput)
      ]);
      setDataA(resA);
      setDataB(resB);
    } catch (e) {
      console.error('Battle error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runBattle();
  }, []);

  const getWinner = () => {
    if (!dataA || !dataB) return null;
    if (dataA.averageScore > dataB.averageScore) {
      return { winner: dataA, loser: dataB, delta: dataA.averageScore - dataB.averageScore };
    } else if (dataB.averageScore > dataA.averageScore) {
      return { winner: dataB, loser: dataA, delta: dataB.averageScore - dataA.averageScore };
    }
    return { winner: null, delta: 0 };
  };

  const result = getWinner();

  return (
    <div style={{ padding: '30px 0' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 32px auto' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(244, 63, 94, 0.12)',
          border: '1px solid rgba(244, 63, 94, 0.3)',
          color: 'var(--neon-rose)',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '12px'
        }}>
          <Swords size={16} /> Subreddit Sentiment Showdown
        </div>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 800 }}>
          The <span className="text-gradient-rose">Vibe Battle</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Compare the community sentiment index, positivity ratio, and mood delta of two subreddits side-by-side.
        </p>
      </div>

      {/* Battle Controls */}
      <div className="glass-panel" style={{
        padding: '24px',
        maxWidth: '850px',
        margin: '0 auto 36px auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          gap: '16px',
          alignItems: 'center'
        }}>
          {/* Input A */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--neon-cyan)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Subreddit A
            </label>
            <input
              id="battle-input-a"
              type="text"
              value={subAInput}
              onChange={(e) => setSubAInput(e.target.value)}
              placeholder="e.g. technology"
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                color: '#fff',
                fontWeight: 600,
                outline: 'none'
              }}
            />
          </div>

          {/* VS Icon */}
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'var(--gradient-rose)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '0.9rem',
            color: '#fff',
            marginTop: '20px'
          }}>
            VS
          </div>

          {/* Input B */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--neon-violet)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Subreddit B
            </label>
            <input
              id="battle-input-b"
              type="text"
              value={subBInput}
              onChange={(e) => setSubBInput(e.target.value)}
              placeholder="e.g. wallstreetbets"
              style={{
                width: '100%',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                color: '#fff',
                fontWeight: 600,
                outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            id="battle-run-btn"
            onClick={runBattle}
            disabled={isLoading}
            className="btn btn-primary"
            style={{ background: 'var(--gradient-rose)', padding: '10px 32px' }}
          >
            {isLoading ? 'Running Battle...' : '⚔️ Fight! Compare Vibes'}
          </button>
        </div>
      </div>

      {/* Winner Banner */}
      {result && result.winner && (
        <div className="glass-panel" style={{
          padding: '20px',
          maxWidth: '850px',
          margin: '0 auto 36px auto',
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))',
          borderColor: 'var(--neon-emerald)',
          textAlign: 'center'
        }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--neon-emerald)', fontWeight: 800, fontSize: '1.2rem' }}>
            <Trophy size={24} /> Battle Winner: {result.winner.displayName}!
          </div>
          <p style={{ marginTop: '6px', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            {result.winner.displayName} is <strong style={{ color: '#fff' }}>+{result.delta} points</strong> more positive in vibe score than {result.loser?.displayName}.
          </p>
        </div>
      )}

      {/* Gauges Side by Side */}
      {dataA && dataB && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          <div>
            <h3 style={{ textAlign: 'center', color: 'var(--neon-cyan)', marginBottom: '12px', fontWeight: 800 }}>
              Subreddit A: {dataA.displayName}
            </h3>
            <VibeGauge summary={dataA} />
          </div>

          <div>
            <h3 style={{ textAlign: 'center', color: 'var(--neon-violet)', marginBottom: '12px', fontWeight: 800 }}>
              Subreddit B: {dataB.displayName}
            </h3>
            <VibeGauge summary={dataB} />
          </div>
        </div>
      )}
    </div>
  );
};
