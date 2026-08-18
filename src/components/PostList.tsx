import React, { useState, useMemo } from 'react';
import type { AnalyzedPost, SentimentClassification } from '../types/reddit';
import { Search, ArrowUpDown, ExternalLink, ThumbsUp, MessageSquare, X } from 'lucide-react';

interface PostListProps {
  posts: AnalyzedPost[];
}

export const PostList: React.FC<PostListProps> = ({ posts }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'sentiment_desc' | 'sentiment_asc' | 'karma_desc' | 'comments_desc'>('default');
  const [selectedPost, setSelectedPost] = useState<AnalyzedPost | null>(null);

  // Filter & Sort Logic
  const filteredPosts = useMemo(() => {
    return posts.filter(item => {
      // Classification filter
      if (activeFilter !== 'all') {
        if (activeFilter === 'positive' && !(item.sentiment.classification === 'positive' || item.sentiment.classification === 'very_positive')) return false;
        if (activeFilter === 'neutral' && item.sentiment.classification !== 'neutral') return false;
        if (activeFilter === 'negative' && !(item.sentiment.classification === 'negative' || item.sentiment.classification === 'very_negative')) return false;
      }
      // Search term filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        return item.post.title.toLowerCase().includes(query) || item.post.author.toLowerCase().includes(query);
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'sentiment_desc') return b.sentiment.compound - a.sentiment.compound;
      if (sortBy === 'sentiment_asc') return a.sentiment.compound - b.sentiment.compound;
      if (sortBy === 'karma_desc') return b.post.score - a.post.score;
      if (sortBy === 'comments_desc') return b.post.num_comments - a.post.num_comments;
      return 0;
    });
  }, [posts, activeFilter, searchTerm, sortBy]);

  const getSentimentBadge = (cls: SentimentClassification, score: number) => {
    let bg = 'var(--neon-violet)';
    let text = 'Neutral';

    if (cls === 'very_positive') { bg = '#10b981'; text = 'Very Positive'; }
    else if (cls === 'positive') { bg = '#06b6d4'; text = 'Positive'; }
    else if (cls === 'very_negative') { bg = '#ef4444'; text = 'Extreme Outrage'; }
    else if (cls === 'negative') { bg = '#f97316'; text = 'Negative'; }

    return (
      <span style={{
        background: `${bg}22`,
        color: bg,
        border: `1px solid ${bg}55`,
        padding: '3px 10px',
        borderRadius: 'var(--radius-full)',
        fontSize: '0.78rem',
        fontWeight: 700,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}>
        {score > 0 ? `+${score}` : score} • {text}
      </span>
    );
  };

  return (
    <div style={{ margin: '36px 0' }}>
      {/* Header Controls Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
            Top 50 Hot Posts Analyzed ({filteredPosts.length})
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Real-time title sentiment breakdown & emotion classification
          </p>
        </div>

        {/* Search Inside Posts */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 12px',
            minWidth: '220px'
          }}>
            <Search size={14} color="var(--text-muted)" style={{ marginRight: '8px' }} />
            <input
              id="posts-search-input"
              type="text"
              placeholder="Search titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '0.85rem',
                width: '100%'
              }}
            />
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={14} color="var(--text-muted)" />
            <select
              id="posts-sort-select"
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              style={{
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="default">Default Order</option>
              <option value="sentiment_desc">Most Positive First</option>
              <option value="sentiment_asc">Most Negative First</option>
              <option value="karma_desc">Highest Upvotes (Karma)</option>
              <option value="comments_desc">Most Discussed (Comments)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sentiment Filter Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '20px',
        overflowX: 'auto',
        paddingBottom: '4px'
      }}>
        {[
          { key: 'all', label: 'All Posts (50)' },
          { key: 'positive', label: '🟢 Positive Vibes' },
          { key: 'neutral', label: '🟣 Neutral' },
          { key: 'negative', label: '🔴 Negative / Skeptical' }
        ].map(tab => (
          <button
            key={tab.key}
            id={`filter-tab-${tab.key}`}
            onClick={() => setActiveFilter(tab.key)}
            style={{
              background: activeFilter === tab.key ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: `1px solid ${activeFilter === tab.key ? 'var(--neon-cyan)' : 'var(--border-subtle)'}`,
              color: activeFilter === tab.key ? '#fff' : 'var(--text-secondary)',
              padding: '6px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Posts List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((item, index) => {
            const { post, sentiment } = item;
            return (
              <div
                key={post.id}
                id={`post-card-${post.id}`}
                className="glass-panel"
                onClick={() => setSelectedPost(item)}
                style={{
                  padding: '18px 22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
              >
                {/* Left Side: Rank & Title info */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', flex: 1 }}>
                  <span style={{
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    color: 'var(--text-muted)',
                    minWidth: '28px'
                  }}>
                    #{index + 1}
                  </span>

                  <div>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      lineHeight: 1.4,
                      marginBottom: '8px',
                      color: 'var(--text-primary)'
                    }}>
                      {post.title}
                    </h4>

                    {/* Meta info */}
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '14px',
                      fontSize: '0.78rem',
                      color: 'var(--text-muted)'
                    }}>
                      <span>by <strong>u/{post.author}</strong></span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--neon-emerald)' }}>
                        <ThumbsUp size={12} /> {post.score.toLocaleString()} karma
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--neon-cyan)' }}>
                        <MessageSquare size={12} /> {post.num_comments.toLocaleString()} comments
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side: Sentiment Badge & Direct Link */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  flexShrink: 0
                }}>
                  {getSentimentBadge(sentiment.classification, sentiment.compound)}

                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      color: 'var(--text-muted)',
                      padding: '6px',
                      borderRadius: 'var(--radius-sm)',
                      display: 'inline-flex'
                    }}
                    title="Open Post on Reddit"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            );
          })
        ) : (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No posts match the selected filter.
          </div>
        )}
      </div>

      {/* Single Post Deep Analysis Modal */}
      {selectedPost && (
        <div className="modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <span className="badge badge-neutral" style={{ marginBottom: '8px' }}>
                  Post Deep Sentiment Inspection
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{selectedPost.post.title}</h3>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', margin: '20px 0' }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Vibe Index Score</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: selectedPost.sentiment.compound >= 0 ? 'var(--neon-emerald)' : 'var(--neon-rose)' }}>
                  {selectedPost.sentiment.compound > 0 ? `+${selectedPost.sentiment.compound}` : selectedPost.sentiment.compound}
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '14px', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Dominant Emotion</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, textTransform: 'capitalize', color: 'var(--neon-cyan)', marginTop: '4px' }}>
                  {selectedPost.sentiment.dominantEmotion}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--neon-emerald)', display: 'block', marginBottom: '6px' }}>
                Detected Positive Lexicon Words:
              </strong>
              {selectedPost.sentiment.positiveWords.length > 0 ? (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {selectedPost.sentiment.positiveWords.map((w, i) => (
                    <span key={i} className="badge badge-positive">{w}</span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None</span>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <strong style={{ fontSize: '0.85rem', color: 'var(--neon-rose)', display: 'block', marginBottom: '6px' }}>
                Detected Negative Lexicon Words:
              </strong>
              {selectedPost.sentiment.negativeWords.length > 0 ? (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {selectedPost.sentiment.negativeWords.map((w, i) => (
                    <span key={i} className="badge badge-negative">{w}</span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>None</span>
              )}
            </div>

            <div style={{ textAlign: 'right' }}>
              <a
                href={selectedPost.post.permalink}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}
              >
                View Discussion on Reddit <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
