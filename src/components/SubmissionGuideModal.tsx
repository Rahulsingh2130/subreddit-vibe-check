import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Mail, Copy, ExternalLink, ShieldCheck, Eye } from 'lucide-react';

interface SubmissionGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'subreddit_vibe_check_submission_details';

export const SubmissionGuideModal: React.FC<SubmissionGuideModalProps> = ({ isOpen, onClose }) => {
  const [candidateName, setCandidateName] = useState<string>('Full Stack Internship Candidate');
  const [redditUsername, setRedditUsername] = useState<string>('RedditVibeMaster_2026');
  const [guerrillaEmail, setGuerrillaEmail] = useState<string>('sportsorca_eval@guerrillamail.com');
  const [projectLink, setProjectLink] = useState<string>(window.location.href);
  const [githubLink, setGithubLink] = useState<string>('https://github.com/yourusername/subreddit-vibe-check');

  const [copied, setCopied] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.candidateName) setCandidateName(parsed.candidateName);
        if (parsed.redditUsername) setRedditUsername(parsed.redditUsername);
        if (parsed.guerrillaEmail) setGuerrillaEmail(parsed.guerrillaEmail);
        if (parsed.projectLink) setProjectLink(parsed.projectLink);
        if (parsed.githubLink) setGithubLink(parsed.githubLink);
      }
    } catch (e) {
      console.warn('Could not parse saved submission details');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        candidateName,
        redditUsername,
        guerrillaEmail,
        projectLink,
        githubLink
      }));
    } catch (e) {
      // Ignore
    }
  }, [candidateName, redditUsername, guerrillaEmail, projectLink, githubLink]);

  if (!isOpen) return null;

  const emailSubject = "Full Stack Developer Internship Assignment Submission - The Subreddit Vibe Check";
  const emailBody = `Dear SportsOrca Team,

Please find my submission details for the Full Stack Developer Internship take-home assignment "The Subreddit Vibe Check":

a) Reddit Username: ${redditUsername}
b) Email Used (Guerrilla Mail): ${guerrillaEmail}
c) Project Link (Live Hosted App): ${projectLink}
d) Source Code (GitHub Repository): ${githubLink}

Project Technical Highlights:
- Core Functionality: Fetches top 50 "Hot" posts using the /r/{subreddit}/hot API endpoint.
- Client-Side Sentiment Analysis: Multi-dimensional VADER & AFINN sentiment engine calculating Vibe Index (-100 to +100), 6-vector emotion classification, and keyword drivers.
- Resilient Architecture: Supports direct Reddit API, OAuth token authorization, high-speed CORS proxies, and offline snapshot fallbacks for 100% uptime.
- UI/UX: Radial animated SVG gauge, interactive post filters, upvote vs sentiment scatter map, and Subreddit Vibe Battle comparison mode.

Deadline: August 19th, 11:59 PM IST

Best regards,
${candidateName}`;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenMailto = () => {
    const mailtoUrl = `mailto:sportsorcateam@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: 'var(--radius-md)', background: 'var(--gradient-primary)', color: '#fff' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                Edit & Verify SportsOrca Submission Details
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Recipient: <strong style={{ color: 'var(--neon-emerald)' }}>sportsorcateam@gmail.com</strong> • Deadline: <strong>August 19th, 11:59 PM IST</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Requirements Checklist */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <CheckCircle size={18} color="var(--neon-emerald)" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: 'var(--neon-emerald)', fontSize: '0.85rem' }}>Step 1: Account Setup</strong>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Guerrilla Mail & Reddit verified.</p>
            </div>
          </div>

          <div style={{
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <CheckCircle size={18} color="var(--neon-cyan)" style={{ flexShrink: 0 }} />
            <div>
              <strong style={{ color: 'var(--neon-cyan)', fontSize: '0.85rem' }}>Step 2: Core Functionality</strong>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Top 50 Hot Posts & Sentiment Dashboard.</p>
            </div>
          </div>
        </div>

        {/* Step 3 Form Controls */}
        <div style={{
          background: 'var(--bg-input)',
          border: '1px solid var(--border-glow)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--neon-cyan)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Mail size={16} /> Customize Submission Form Fields
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                Your Name / Signature
              </label>
              <input
                id="submission-field-name"
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="e.g. Rahul Kumar Singh"
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
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                a) Reddit Username (Step 1)
              </label>
              <input
                id="submission-field-reddit-user"
                type="text"
                value={redditUsername}
                onChange={(e) => setRedditUsername(e.target.value)}
                placeholder="e.g. RedditVibeMaster_2026"
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
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                b) Guerrilla Mail Address (Step 1)
              </label>
              <input
                id="submission-field-guerrilla-email"
                type="text"
                value={guerrillaEmail}
                onChange={(e) => setGuerrillaEmail(e.target.value)}
                placeholder="e.g. user@guerrillamail.com"
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
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                c) Project Hosted Link (Step 3)
              </label>
              <input
                id="submission-field-project-link"
                type="text"
                value={projectLink}
                onChange={(e) => setProjectLink(e.target.value)}
                placeholder="e.g. https://subreddit-vibe-check.vercel.app"
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

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                d) Source Code Repository URL (Step 3)
              </label>
              <input
                id="submission-field-github-link"
                type="text"
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
                placeholder="e.g. https://github.com/yourname/subreddit-vibe-check"
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

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px' }}>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn btn-secondary"
              style={{ fontSize: '0.82rem' }}
            >
              <Eye size={14} /> {showPreview ? 'Hide Email Preview' : 'Show Email Preview'}
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                id="btn-copy-submission-email"
                onClick={handleCopyEmail}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem' }}
              >
                <Copy size={14} /> {copied ? 'Copied Email!' : 'Copy Submission Email'}
              </button>

              <button
                id="btn-send-submission-email"
                onClick={handleOpenMailto}
                className="btn btn-primary"
                style={{ fontSize: '0.85rem' }}
              >
                <Mail size={14} /> Send to sportsorcateam@gmail.com <ExternalLink size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Live Email Preview Box */}
        {showPreview && (
          <div style={{
            background: 'rgba(7, 9, 14, 0.95)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            lineHeight: 1.5,
            whiteSpace: 'pre-wrap',
            color: 'var(--text-secondary)',
            maxHeight: '220px',
            overflowY: 'auto'
          }}>
            <span style={{ color: 'var(--neon-cyan)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
              Subject: {emailSubject}
            </span>
            {emailBody}
          </div>
        )}
      </div>
    </div>
  );
};
