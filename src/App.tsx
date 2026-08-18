import React, { useState, useEffect } from 'react';
import type { SubredditVibeSummary, ApiConfig } from './types/reddit';
import { fetchSubredditVibe } from './services/redditApi';
import { useAuth } from './components/AuthContext';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { VibeGauge } from './components/VibeGauge';
import { MetricsGrid } from './components/MetricsGrid';
import { ChartsSection } from './components/ChartsSection';
import { PostList } from './components/PostList';
import { VibeBattle } from './components/VibeBattle';
import { SubmissionGuideModal } from './components/SubmissionGuideModal';
import { ApiSettingsModal } from './components/ApiSettingsModal';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const App: React.FC = () => {
  const { token } = useAuth();
  const [currentSubreddit, setCurrentSubreddit] = useState<string>('technology');
  const [summaryData, setSummaryData] = useState<SubredditVibeSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [activeView, setActiveView] = useState<'dashboard' | 'battle'>('dashboard');
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const loadSubredditVibe = async (sub: string, customConfig?: ApiConfig) => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchSubredditVibe(sub, customConfig, token?.accessToken);
      setSummaryData(data);
      setCurrentSubreddit(data.subreddit);
    } catch (err: any) {
      console.error('Failed to load subreddit vibe:', err);
      setErrorMsg(err.message || 'Failed to fetch subreddit data. Please try another subreddit.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubredditVibe(currentSubreddit);
  }, []);

  const handleSearch = (newSub: string) => {
    loadSubredditVibe(newSub);
  };

  const handleExportReport = () => {
    if (!summaryData) return;
    const jsonStr = JSON.stringify(summaryData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${summaryData.subreddit}_vibe_check_report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Sticky Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onExportReport={handleExportReport}
        summaryData={summaryData || undefined}
      />

      {/* Main App Canvas */}
      <main className="container" style={{ flex: 1, paddingBottom: '60px' }}>
        {activeView === 'dashboard' ? (
          <>
            {/* Search Hero */}
            <HeroSearch
              currentSubreddit={currentSubreddit}
              onSearch={handleSearch}
              isLoading={isLoading}
            />

            {/* Error Alert */}
            {errorMsg && (
              <div className="glass-panel" style={{
                padding: '16px 20px',
                borderColor: 'var(--neon-rose)',
                background: 'rgba(244, 63, 94, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                margin: '20px 0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--neon-rose)' }}>
                  <AlertCircle size={20} />
                  <span style={{ fontWeight: 600 }}>{errorMsg}</span>
                </div>
                <button
                  onClick={() => loadSubredditVibe(currentSubreddit)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.82rem' }}
                >
                  <RefreshCw size={14} /> Retry
                </button>
              </div>
            )}

            {/* Loading Spinner Skeleton */}
            {isLoading && !summaryData && (
              <div className="glass-panel" style={{ padding: '60px', textAlign: 'center', margin: '30px 0' }}>
                <div className="animate-spin-slow" style={{ fontSize: '3rem', marginBottom: '16px' }}>💫</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Analyzing Top 50 Hot Posts...</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '6px' }}>
                  Parsing titles, evaluating VADER/AFINN sentiment scores, and computing emotion vectors.
                </p>
              </div>
            )}

            {/* Main Sentiment Dashboard */}
            {summaryData && (
              <div style={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 0.3s ease' }}>
                {/* Gauge Meter Hero */}
                <VibeGauge summary={summaryData} />

                {/* Key Metrics Grid */}
                <MetricsGrid summary={summaryData} />

                {/* Visual Charts Suite */}
                <ChartsSection summary={summaryData} />

                {/* 50 Hot Posts Explorer Feed */}
                <PostList posts={summaryData.analyzedPosts} />
              </div>
            )}
          </>
        ) : (
          /* Head to Head Vibe Battle Mode */
          <VibeBattle initialSubredditA={currentSubreddit} />
        )}
      </main>

      {/* Assignment Helper Modal */}
      <SubmissionGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* API & Preference Settings Modal */}
      <ApiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onConfigSaved={(cfg) => loadSubredditVibe(currentSubreddit, cfg)}
      />

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(7, 9, 14, 0.9)',
        padding: '24px 0',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)'
      }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
            Built for <strong style={{ color: 'var(--neon-cyan)' }}>SportsOrca Full Stack Developer Internship Take-Home Assignment</strong>
          </div>
          <div>
            Submission Email: <span style={{ color: 'var(--neon-emerald)' }}>sportsorcateam@gmail.com</span> • Deadline: <strong>August 19th, 11:59 PM IST</strong>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
