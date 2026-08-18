export type SentimentClassification = 
  | 'very_positive' 
  | 'positive' 
  | 'neutral' 
  | 'negative' 
  | 'very_negative';

export type EmotionType = 
  | 'joy'          // Excitement, celebration, hype
  | 'wholesome'    // Uplifting, inspiring, heartwarming
  | 'curiosity'    // Informative, tech, research, question
  | 'neutral'      // Objective news, updates
  | 'frustration'  // Outrage, anger, rant
  | 'anxiety';     // Fear, risk, doom, concern

export interface RedditPostData {
  id: string;
  title: string;
  author: string;
  score: number;
  num_comments: number;
  created_utc: number;
  permalink: string;
  url: string;
  thumbnail?: string;
  subreddit: string;
  upvote_ratio?: number;
  over_18?: boolean;
  selftext?: string;
}

export interface SentimentResult {
  score: number;             // Raw lexicon sum score
  comparative: number;       // Normalized (-1.0 to +1.0)
  compound: number;          // Vibe Index (-100 to +100)
  classification: SentimentClassification;
  positiveWords: string[];
  negativeWords: string[];
  dominantEmotion: EmotionType;
  emotionScores: Record<EmotionType, number>;
}

export interface AnalyzedPost {
  post: RedditPostData;
  sentiment: SentimentResult;
}

export interface SubredditVibeSummary {
  subreddit: string;
  displayName: string;
  totalPosts: number;
  averageScore: number;       // -100 to +100 Index
  positiveRatio: number;      // 0 to 100%
  neutralRatio: number;       // 0 to 100%
  negativeRatio: number;      // 0 to 100%
  vibeStatus: string;         // E.g. "🔥 Bullish & Euphoric"
  vibeDescription: string;    // Human readable synthesis
  vibeBadgeColor: string;     // Hex / CSS color
  emotions: Record<EmotionType, number>; // Count of posts per emotion
  topPositiveWords: Array<{ word: string; count: number }>;
  topNegativeWords: Array<{ word: string; count: number }>;
  totalKarma: number;
  totalComments: number;
  analyzedPosts: AnalyzedPost[];
  topPositivePost?: AnalyzedPost;
  topNegativePost?: AnalyzedPost;
  mostDiscussedPost?: AnalyzedPost;
  fetchedAt: string;
  dataSource: 'live' | 'proxy' | 'oauth' | 'fallback';
}

export interface ComparisonResult {
  subredditA: SubredditVibeSummary;
  subredditB: SubredditVibeSummary;
  winner: string;
  scoreDifference: number;
  comparisonSummary: string;
}

export interface ApiConfig {
  redditClientId: string;
  redditClientSecret: string;
  redditUserAgent: string;
  useFallbackData: boolean;
}
