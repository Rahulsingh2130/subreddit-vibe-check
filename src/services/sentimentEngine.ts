import type { 
  SentimentResult, 
  SentimentClassification, 
  EmotionType, 
  RedditPostData, 
  AnalyzedPost, 
  SubredditVibeSummary 
} from '../types/reddit';

// AFINN-165 & VADER hybrid lexicon dictionary with weights (-5 to +5)
const LEXICON: Record<string, number> = {
  // Ultra Positive (+4 to +5)
  'outstanding': 5, 'spectacular': 5, 'flawless': 5, 'triumph': 5, 'euphoria': 5,
  'breakthrough': 4, 'revolutionary': 4, 'phenomenal': 4, 'brilliant': 4, 'breathtaking': 4,
  'masterpiece': 4, 'victorious': 4, 'excellence': 4, 'wholesome': 4, 'skyrocket': 4,
  'bullish': 4, 'surging': 4, 'booming': 4, 'legendary': 4, 'miracle': 4,

  // High Positive (+2 to +3)
  'amazing': 3, 'awesome': 3, 'excellent': 3, 'fantastic': 3, 'great': 3,
  'love': 3, 'loved': 3, 'loves': 3, 'best': 3, 'wonderful': 3, 'happy': 3,
  'superb': 3, 'impressive': 3, 'success': 3, 'successful': 3, 'win': 3,
  'winner': 3, 'winning': 3, 'growth': 3, 'innovative': 3, 'innovation': 3,
  'solution': 3, 'progress': 3, 'inspired': 3, 'inspiring': 3, 'excited': 3,
  'exciting': 3, 'glorious': 3, 'celebrate': 3, 'celebrating': 3, 'hero': 3,
  'reward': 3, 'benefit': 3, 'praise': 3, 'rejoice': 3, 'profit': 3,

  // Moderate Positive (+1 to +2)
  'good': 2, 'nice': 2, 'better': 2, 'positive': 2, 'pretty': 2,
  'cool': 2, 'smart': 2, 'clean': 2, 'helpful': 2, 'solid': 2,
  'recommend': 2, 'enjoy': 2, 'enjoyed': 2, 'promising': 2, 'strong': 2,
  'safe': 2, 'smooth': 2, 'gain': 2, 'gains': 2, 'support': 2,
  'kind': 2, 'friend': 2, 'hope': 2, 'hopeful': 2, 'fair': 2,
  'boost': 2, 'boosted': 2, 'like': 1, 'liked': 1, 'fine': 1,
  'clear': 1, 'stable': 1, 'steady': 1, 'useful': 1, 'valid': 1,

  // Ultra Negative (-4 to -5)
  'catastrophe': -5, 'devastating': -5, 'atrocious': -5, 'disaster': -5, 'disastrous': -5,
  'horrible': -5, 'horrific': -4, 'terrible': -4, 'nightmare': -4, 'tragic': -4,
  'tragedy': -4, 'outrageous': -4, 'scam': -4, 'corrupt': -4, 'corruption': -4,
  'bankruptcy': -4, 'bankrupt': -4, 'collapse': -4, 'fraud': -4, 'lawsuit': -4,

  // High Negative (-2 to -3)
  'awful': -3, 'bad': -2, 'worst': -3, 'hate': -3, 'hated': -3,
  'fail': -3, 'failed': -3, 'failure': -3, 'crisis': -3, 'danger': -3,
  'dangerous': -3, 'threat': -3, 'threatened': -3, 'scandal': -3, 'crash': -3,
  'crashed': -3, 'plunge': -3, 'plunged': -3, 'dump': -3, 'destroyed': -3,
  'destruction': -3, 'ruined': -3, 'death': -3, 'dead': -3, 'dying': -3,
  'crime': -3, 'illegal': -3, 'abuse': -3, 'attack': -3, 'attacked': -3,
  'exploit': -3, 'vulnerability': -3, 'warning': -2, 'warns': -2, 'damage': -3,

  // Moderate Negative (-1 to -2)
  'poor': -2, 'sad': -2, 'angry': -2, 'annoying': -2, 'annoyed': -2,
  'upset': -2, 'worry': -2, 'worried': -2, 'concern': -2, 'concerned': -2,
  'problem': -2, 'issue': -2, 'risk': -2, 'risky': -2, 'loss': -2,
  'losses': -2, 'wrong': -2, 'broken': -2, 'slow': -1, 'weak': -2,
  'hard': -1, 'difficult': -2, 'decline': -2, 'dropped': -2, 'drop': -1,
  'delay': -1, 'delayed': -1, 'doubt': -1, 'doubtful': -2, 'fear': -2,
};

// Intensifier modifiers
const INTENSIFIERS: Record<string, number> = {
  'very': 1.5, 'extremely': 2.0, 'super': 1.6, 'insanely': 2.0,
  'incredibly': 1.8, 'massively': 1.8, 'hugely': 1.7, 'absolutely': 1.9,
  'totally': 1.5, 'completely': 1.6, 'deeply': 1.5, 'really': 1.4,
};

// Negation words (inverts sentiment of following word)
const NEGATIONS = new Set([
  'not', 'no', 'never', 'neither', 'nor', 'cannot', "can't", "don't",
  "doesn't", "didn't", "won't", "wouldn't", "shouldn't", "isn't", "aren't",
  "wasn't", "weren't", 'without', 'lack', 'lacking'
]);

// Emoji Sentiment Map
const EMOJI_LEXICON: Record<string, { weight: number; emotion: EmotionType }> = {
  '🚀': { weight: 4, emotion: 'joy' },
  '🔥': { weight: 3, emotion: 'joy' },
  '❤️': { weight: 4, emotion: 'wholesome' },
  '💖': { weight: 4, emotion: 'wholesome' },
  '🎉': { weight: 4, emotion: 'joy' },
  '🏆': { weight: 4, emotion: 'joy' },
  '✨': { weight: 3, emotion: 'wholesome' },
  '😊': { weight: 3, emotion: 'wholesome' },
  '😍': { weight: 4, emotion: 'wholesome' },
  '📈': { weight: 3, emotion: 'joy' },
  '💪': { weight: 3, emotion: 'joy' },
  '👍': { weight: 2, emotion: 'wholesome' },
  '💯': { weight: 3, emotion: 'joy' },

  '💀': { weight: -3, emotion: 'anxiety' },
  '🤡': { weight: -3, emotion: 'frustration' },
  '📉': { weight: -3, emotion: 'anxiety' },
  '😡': { weight: -4, emotion: 'frustration' },
  '🤬': { weight: -4, emotion: 'frustration' },
  '😭': { weight: -2, emotion: 'anxiety' },
  '💩': { weight: -3, emotion: 'frustration' },
  '💔': { weight: -4, emotion: 'anxiety' },
  '⚠️': { weight: -2, emotion: 'anxiety' },
  '🚨': { weight: -3, emotion: 'anxiety' },
};

// Emotion Lexicons
const EMOTION_LEXICONS: Record<EmotionType, string[]> = {
  joy: ['breakthrough', 'amazing', 'huge', 'win', 'surging', 'bullish', 'rocket', 'moon', 'profit', 'victory', 'record', 'celebrate', 'unbelievable', 'hype', 'boom'],
  wholesome: ['wholesome', 'love', 'kind', 'heartwarming', 'happy', 'help', 'inspiring', 'hero', 'family', 'sweet', 'thank', 'cute', 'peace', 'beautiful'],
  curiosity: ['how', 'why', 'what', 'guide', 'study', 'research', 'future', 'discovery', 'new', 'exploring', 'question', 'analysis', 'tech', 'ai', 'framework'],
  neutral: ['update', 'announced', 'report', 'released', 'statement', 'official', 'summary', 'data', 'details', 'meeting', 'verdict', 'change', 'launch'],
  frustration: ['scam', 'corrupt', 'outrage', 'terrible', 'banned', 'lawsuit', 'worst', 'ruined', 'fail', 'fraud', 'boycott', 'greedy', 'stupid', 'lies'],
  anxiety: ['crash', 'warning', 'risk', 'collapse', 'fear', 'threat', 'bankruptcy', 'panic', 'plunge', 'loss', 'danger', 'layoffs', 'crisis', 'down']
};

export function analyzeTitle(title: string): SentimentResult {
  if (!title || typeof title !== 'string') {
    return createNeutralResult();
  }

  const cleanTitle = title.trim();
  const words = cleanTitle
    .toLowerCase()
    .replace(/[^\w\s'$%-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  let rawScore = 0;
  const positiveWords: string[] = [];
  const negativeWords: string[] = [];

  const emotionScores: Record<EmotionType, number> = {
    joy: 0,
    wholesome: 0,
    curiosity: 0,
    neutral: 0,
    frustration: 0,
    anxiety: 0,
  };

  for (const [emoji, data] of Object.entries(EMOJI_LEXICON)) {
    if (cleanTitle.includes(emoji)) {
      rawScore += data.weight;
      emotionScores[data.emotion] += Math.abs(data.weight);
      if (data.weight > 0) positiveWords.push(emoji);
      else negativeWords.push(emoji);
    }
  }

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    let multiplier = 1.0;
    if (i > 0 && INTENSIFIERS[words[i - 1]]) {
      multiplier = INTENSIFIERS[words[i - 1]];
    }

    let isNegated = false;
    if (i > 0 && NEGATIONS.has(words[i - 1])) isNegated = true;
    if (i > 1 && NEGATIONS.has(words[i - 2])) isNegated = true;

    if (word in LEXICON) {
      let wordScore = LEXICON[word] * multiplier;
      if (isNegated) wordScore = -wordScore * 0.8;

      rawScore += wordScore;

      if (wordScore > 0) {
        positiveWords.push(word);
      } else if (wordScore < 0) {
        negativeWords.push(word);
      }
    }

    for (const [emotion, emotionWords] of Object.entries(EMOTION_LEXICONS) as [EmotionType, string[]][]) {
      if (emotionWords.includes(word)) {
        emotionScores[emotion] += 1;
      }
    }
  }

  const letters = cleanTitle.replace(/[^A-Za-z]/g, '');
  if (letters.length > 15) {
    const upperCount = letters.split('').filter(c => c === c.toUpperCase()).length;
    if (upperCount / letters.length > 0.6) {
      rawScore *= 1.25;
      emotionScores.frustration += 1;
    }
  }

  const exclamations = (cleanTitle.match(/!/g) || []).length;
  if (exclamations > 0) {
    rawScore *= (1 + Math.min(exclamations * 0.1, 0.4));
  }

  const wordCount = Math.max(words.length, 1);
  const comparative = Math.max(-1, Math.min(1, rawScore / Math.sqrt(wordCount + 2)));
  const compound = Math.round(comparative * 100);

  let classification: SentimentClassification = 'neutral';
  if (compound >= 40) classification = 'very_positive';
  else if (compound >= 10) classification = 'positive';
  else if (compound <= -40) classification = 'very_negative';
  else if (compound <= -10) classification = 'negative';

  let dominantEmotion: EmotionType = 'neutral';
  let maxEmotionScore = -1;

  for (const [emotion, score] of Object.entries(emotionScores) as [EmotionType, number][]) {
    if (score > maxEmotionScore) {
      maxEmotionScore = score;
      dominantEmotion = emotion;
    }
  }

  if (maxEmotionScore === 0) {
    if (classification === 'very_positive' || classification === 'positive') dominantEmotion = 'joy';
    else if (classification === 'very_negative' || classification === 'negative') dominantEmotion = 'frustration';
    else dominantEmotion = 'neutral';
  }

  return {
    score: Math.round(rawScore * 10) / 10,
    comparative: Math.round(comparative * 100) / 100,
    compound,
    classification,
    positiveWords: Array.from(new Set(positiveWords)),
    negativeWords: Array.from(new Set(negativeWords)),
    dominantEmotion,
    emotionScores
  };
}

function createNeutralResult(): SentimentResult {
  return {
    score: 0,
    comparative: 0,
    compound: 0,
    classification: 'neutral',
    positiveWords: [],
    negativeWords: [],
    dominantEmotion: 'neutral',
    emotionScores: { joy: 0, wholesome: 0, curiosity: 0, neutral: 1, frustration: 0, anxiety: 0 }
  };
}

export function aggregateSubredditVibe(
  subredditName: string,
  posts: RedditPostData[],
  dataSource: 'live' | 'proxy' | 'oauth' | 'fallback' = 'live'
): SubredditVibeSummary {
  const analyzedPosts: AnalyzedPost[] = posts.map(post => ({
    post,
    sentiment: analyzeTitle(post.title)
  }));

  const totalPosts = analyzedPosts.length;
  if (totalPosts === 0) {
    return createEmptySummary(subredditName, dataSource);
  }

  let totalCompound = 0;
  let positiveCount = 0;
  let neutralCount = 0;
  let negativeCount = 0;
  let totalKarma = 0;
  let totalComments = 0;

  const emotionCounts: Record<EmotionType, number> = {
    joy: 0, wholesome: 0, curiosity: 0, neutral: 0, frustration: 0, anxiety: 0
  };

  const posWordMap: Record<string, number> = {};
  const negWordMap: Record<string, number> = {};

  let topPositivePost: AnalyzedPost | undefined;
  let topNegativePost: AnalyzedPost | undefined;
  let mostDiscussedPost: AnalyzedPost | undefined;

  for (const item of analyzedPosts) {
    const { post, sentiment } = item;
    totalCompound += sentiment.compound;
    totalKarma += post.score;
    totalComments += post.num_comments;

    if (sentiment.classification === 'very_positive' || sentiment.classification === 'positive') {
      positiveCount++;
    } else if (sentiment.classification === 'very_negative' || sentiment.classification === 'negative') {
      negativeCount++;
    } else {
      neutralCount++;
    }

    emotionCounts[sentiment.dominantEmotion] = (emotionCounts[sentiment.dominantEmotion] || 0) + 1;

    sentiment.positiveWords.forEach(w => {
      posWordMap[w] = (posWordMap[w] || 0) + 1;
    });
    sentiment.negativeWords.forEach(w => {
      negWordMap[w] = (negWordMap[w] || 0) + 1;
    });

    if (!topPositivePost || sentiment.compound > topPositivePost.sentiment.compound) {
      topPositivePost = item;
    }
    if (!topNegativePost || sentiment.compound < topNegativePost.sentiment.compound) {
      topNegativePost = item;
    }
    if (!mostDiscussedPost || post.num_comments > mostDiscussedPost.post.num_comments) {
      mostDiscussedPost = item;
    }
  }

  const averageScore = Math.round(totalCompound / totalPosts);
  const positiveRatio = Math.round((positiveCount / totalPosts) * 100);
  const neutralRatio = Math.round((neutralCount / totalPosts) * 100);
  const negativeRatio = Math.round((negativeCount / totalPosts) * 100);

  const topPositiveWords = Object.entries(posWordMap)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topNegativeWords = Object.entries(negWordMap)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const { vibeStatus, vibeDescription, vibeBadgeColor } = getVibeDescriptor(
    averageScore,
    positiveRatio,
    negativeRatio
  );

  return {
    subreddit: subredditName.toLowerCase(),
    displayName: `r/${subredditName}`,
    totalPosts,
    averageScore,
    positiveRatio,
    neutralRatio,
    negativeRatio,
    vibeStatus,
    vibeDescription,
    vibeBadgeColor,
    emotions: emotionCounts,
    topPositiveWords,
    topNegativeWords,
    totalKarma,
    totalComments,
    analyzedPosts,
    topPositivePost,
    topNegativePost,
    mostDiscussedPost,
    fetchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    dataSource
  };
}

function getVibeDescriptor(
  avgScore: number,
  posRatio: number,
  negRatio: number
) {
  if (avgScore >= 45) {
    return {
      vibeStatus: '🔥 Euphoric & Hyper-Bullish',
      vibeDescription: `Subreddit is bursting with positive energy! ${posRatio}% of posts convey overwhelming optimism, excitement, or celebrating major milestones.`,
      vibeBadgeColor: '#10b981'
    };
  } else if (avgScore >= 20) {
    return {
      vibeStatus: '✨ Wholesome & Optimistic',
      vibeDescription: `A strongly positive community pulse. Key discussions lean towards constructive progress, wins, and uplifting community shares.`,
      vibeBadgeColor: '#06b6d4'
    };
  } else if (avgScore >= 5) {
    return {
      vibeStatus: '🌱 Mildly Positive & Chill',
      vibeDescription: `The subreddit maintains a pleasant, balanced vibe with moderate excitement and polite discussion.`,
      vibeBadgeColor: '#3b82f6'
    };
  } else if (avgScore >= -10) {
    return {
      vibeStatus: '⚖️ Objective & Balanced',
      vibeDescription: `Mainly neutral news, technical discussions, and balanced commentary without extreme emotional spikes.`,
      vibeBadgeColor: '#8b5cf6'
    };
  } else if (avgScore >= -35) {
    return {
      vibeStatus: '⚡ Heated & Skeptical',
      vibeDescription: `Noticeable tension and skepticism. ${negRatio}% of hot titles highlight concerns, controversies, or disagreements.`,
      vibeBadgeColor: '#f59e0b'
    };
  } else {
    return {
      vibeStatus: '💀 High Outrage & Meltdown',
      vibeDescription: `Subreddit sentiment is severely negative! Hot titles are dominated by frustration, scandals, crashes, or community anger.`,
      vibeBadgeColor: '#ef4444'
    };
  }
}

function createEmptySummary(subreddit: string, dataSource: 'live' | 'proxy' | 'oauth' | 'fallback'): SubredditVibeSummary {
  return {
    subreddit: subreddit.toLowerCase(),
    displayName: `r/${subreddit}`,
    totalPosts: 0,
    averageScore: 0,
    positiveRatio: 0,
    neutralRatio: 100,
    negativeRatio: 0,
    vibeStatus: '❓ No Data Available',
    vibeDescription: 'Unable to process posts for this subreddit.',
    vibeBadgeColor: '#6b7280',
    emotions: { joy: 0, wholesome: 0, curiosity: 0, neutral: 0, frustration: 0, anxiety: 0 },
    topPositiveWords: [],
    topNegativeWords: [],
    totalKarma: 0,
    totalComments: 0,
    analyzedPosts: [],
    fetchedAt: new Date().toLocaleTimeString(),
    dataSource
  };
}
