import type { RedditPostData } from '../types/reddit';

export const MOCK_SUBREDDITS_DATA: Record<string, RedditPostData[]> = {
  technology: Array.from({ length: 50 }, (_, i) => {
    const titles = [
      "Breakthrough Quantum Microchip Achieves Flawless 99.9% Quantum Coherence at Room Temperature",
      "EU Passes Landmark AI Safety Law Requiring Open-Source Transparency for Frontier Models",
      "New Battery Chemistry Promises 1,000-Mile EV Range with 10-Minute Supercharging",
      "Major Cyberattack Disrupts Global Cloud Services; Tech Giants Scramble to Patch Zero-Day",
      "Open-Source AI Models Outperform Proprietary Systems in Autonomous Code Generation",
      "Tech Layoffs Surge Again as Companies Double Down on Automated AI Workflows",
      "Revolutionary Solar Panel Coating Reaches Record-Breaking 38% Energy Conversion Efficiency",
      "Security Researchers Discover Critical Hardware Vulnerability Affecting Millions of Processors",
      "Next-Gen Neural Interfaces Allow Paralyzed Patient to Type 90 Words Per Minute",
      "Monopoly Lawsuit Against Major Tech Giant Moves Forward in Federal Court",
      "Autonomous Robot Successfully Performs Complex Surgery Without Human Intervention",
      "Web Browser Engine Update Boosts Page Loading Speeds by 40% Across All Devices",
      "Satellite Internet Array Achieves Gigabyte Speeds in Remote Desert Testing Facility",
      "Tech CEO Resigns Following Scandal Over Data Privacy Violations",
      "Revolutionary Graphene Sensor Can Detect Cancer Biomarkers in Seconds",
      "Social Media Platform Banned in Three Nations Following Spread of Deepfake Fraud",
      "Engineers Build Biodegradable Microchip Powered Entirely by Ambient Heat",
      "Cloud Infrastructure Failure Leaves Millions of Smart Home Devices Unresponsive",
      "New Encryption Algorithm Proved Unbreakable Against Quantum Supercomputers",
      "Robotics Startup Unveils Bipedal Helper Capable of Folding Laundry and Cooking Meals"
    ];
    return {
      id: `tech_${i + 1}`,
      title: `${titles[i % titles.length]} ${i >= titles.length ? `(Analysis #${i + 1})` : ''}`,
      author: `tech_guru_${(i * 7) % 89}`,
      score: 15000 - i * 240 + Math.floor(Math.random() * 500),
      num_comments: 1800 - i * 30 + Math.floor(Math.random() * 100),
      created_utc: Date.now() / 1000 - i * 3600,
      permalink: `/r/technology/comments/tech_${i + 1}`,
      url: `https://reddit.com/r/technology/comments/tech_${i + 1}`,
      subreddit: 'technology',
      upvote_ratio: 0.94 - (i % 10) * 0.02
    };
  }),

  wallstreetbets: Array.from({ length: 50 }, (_, i) => {
    const titles = [
      "NVDA Earnings Blowout! Revenue Up 250% YoY! WE ARE GOING TO THE MOON 🚀🚀🚀",
      "Turned $5k into $180k on Weekly Tech Calls! Loss Aversion is for Cowards 💎🙌",
      "Federal Reserve Unexpectedly Cuts Interest Rates by 50 bps! Stock Market Rallies To All-Time High!",
      "I lost my entire life savings ($95,000) on zero-day options in 15 minutes. AMA 💀",
      "Massive Short Squeeze Underway! Hedge Funds Are Losing Billions Today!",
      "Market Meltdown! Inflation Data Comes in Hot, Dow Drops 800 Points in Shock Selloff 📉",
      "Tech Giant Unveils $100 Billion Stock Buyback Program! Shares Skyrocket 18% After Hours!",
      "Scam Biotech Company Halts Trading After CEO Disappears with Funds 🤡",
      "Is this the biggest stock market bubble in human history? Analysis inside.",
      "YOLO update: Holding 5,000 shares of semiconductor stock until victory or bankruptcy!",
      "Crypto Exchange Collapse Triggering Massive Margin Calls Across Wall Street!",
      "Central Bank Inflation Warning Sparks Sudden Market Crash across Global Exchanges",
      "I bought the dip and doubled my portfolio in 48 hours! Bull Market Is BACK!",
      "Scandal Erupts as Insider Trading Probe Targets Top Hedge Fund Managers",
      "Retail Traders Unite to Squeeze Short Sellers Out of Retail Stock!"
    ];
    return {
      id: `wsb_${i + 1}`,
      title: `${titles[i % titles.length]} ${i >= titles.length ? `[Post #${i + 1}]` : ''}`,
      author: `diamond_hands_${(i * 13) % 99}`,
      score: 28000 - i * 450 + Math.floor(Math.random() * 800),
      num_comments: 3400 - i * 60 + Math.floor(Math.random() * 200),
      created_utc: Date.now() / 1000 - i * 2800,
      permalink: `/r/wallstreetbets/comments/wsb_${i + 1}`,
      url: `https://reddit.com/r/wallstreetbets/comments/wsb_${i + 1}`,
      subreddit: 'wallstreetbets',
      upvote_ratio: 0.89 - (i % 8) * 0.03
    };
  }),

  gaming: Array.from({ length: 50 }, (_, i) => {
    const titles = [
      "Open-World RPG Masterpiece Sells 10 Million Copies in First 24 Hours to Overwhelming Acclaim 🎉",
      "Indie Studio Spends 7 Years Creating Masterwork Game and Ships It Completely Bug-Free!",
      "Publisher Under Fire for Adding Aggressive Pay-to-Win Microtransactions in $70 Game 😡",
      "Unreal Engine 5.5 Tech Demo Looks Completely Indistinguishable from Real Life",
      "Classic 2000s RPG Remake Officially Announced with Original Voice Cast Returning!",
      "Game Developer Cancels Highly Anticipated Sequel After Devastating Studio Layoffs 😭",
      "Gamers Raise $5 Million for Children's Hospitals During 48-Hour Charity Livestream ✨",
      "Server Meltdown Leaves Millions of Players Unable to Connect on Launch Day 🤡",
      "Fan-Made Mod Adds Full Co-Op Campaign to Legendary Single-Player Game",
      "Esports World Championship Final Reaches Record 4 Million Concurrent Viewers!",
      "Developers Release Massive Free Expansion Pack Adding 40 Hours of Content",
      "Controversial Game Patch Destroys Character Balance, Player Base Outraged"
    ];
    return {
      id: `gaming_${i + 1}`,
      title: `${titles[i % titles.length]} ${i >= titles.length ? `#${i + 1}` : ''}`,
      author: `gamer_tag_${(i * 9) % 77}`,
      score: 22000 - i * 350 + Math.floor(Math.random() * 400),
      num_comments: 2100 - i * 40 + Math.floor(Math.random() * 150),
      created_utc: Date.now() / 1000 - i * 3200,
      permalink: `/r/gaming/comments/gaming_${i + 1}`,
      url: `https://reddit.com/r/gaming/comments/gaming_${i + 1}`,
      subreddit: 'gaming',
      upvote_ratio: 0.92 - (i % 7) * 0.02
    };
  }),

  worldnews: Array.from({ length: 50 }, (_, i) => {
    const titles = [
      "Global Climate Summit Reaches Historic Treaty to Cut Fossil Fuel Emissions by 60%",
      "Peace Talks Achieve Major Ceasefire Agreement After Months of High-Stakes Negotiations",
      "Major Earthquake Strikes Coastal Region; International Relief Teams Deployed Immediately",
      "Whistleblower Exposes Massive International Money Laundering Ring Involving Top Officials",
      "Scientists Discover Vast Clean Water Aquifer Capable of Supplying Millions in Arid Zone",
      "Economic Crisis Deepens as Central Inflation Spikes Across European Nations",
      "Historic Election Sees Record Voter Turnout and Peaceful Transition of Power",
      "Humanitarian Aid Convoy Reaches Blockaded City Bringing Vital Food and Medical Supplies",
      "Rising Sea Levels Force Coastal Island Communities to Relocate Under Emergency Order",
      "Scientists Announce Elimination of Wild Polio Strain Worldwide in Historic Health Triumph"
    ];
    return {
      id: `news_${i + 1}`,
      title: `${titles[i % titles.length]} ${i >= titles.length ? `(Report #${i + 1})` : ''}`,
      author: `world_observer_${(i * 11) % 65}`,
      score: 35000 - i * 550 + Math.floor(Math.random() * 600),
      num_comments: 4200 - i * 75 + Math.floor(Math.random() * 300),
      created_utc: Date.now() / 1000 - i * 2500,
      permalink: `/r/worldnews/comments/news_${i + 1}`,
      url: `https://reddit.com/r/worldnews/comments/news_${i + 1}`,
      subreddit: 'worldnews',
      upvote_ratio: 0.90 - (i % 6) * 0.03
    };
  }),

  wholesomememes: Array.from({ length: 50 }, (_, i) => {
    const titles = [
      "Stray Dog Rescued by Firefighters Learns to Trust Again and Finds Loving Forever Home ❤️",
      "Community Secretly Rallies to Pay Off Elderly Neighbor's Medical Bills and House Mortgage ✨",
      "Teacher Spends Weekend Building Custom Wheelchair Ramp for Student Returning to School",
      "Grandfather Learns Video Games at Age 82 Just to Play Online with His Grandchildren 🎉",
      "Local Bakery Gives Free Birthday Cakes to Children Whose Families Cannot Afford Them",
      "Anxious Rescue Cat Finally Purrs for the First Time After 6 Months of Gentle Patience",
      "Bus Driver Stops Every Morning to Hand-Feed Lost Injured Bird Until It Could Fly Again",
      "Stranger Leaves $500 Prepaid Coffee Card at University Library During Final Exams Week"
    ];
    return {
      id: `wholesome_${i + 1}`,
      title: `${titles[i % titles.length]} ${i >= titles.length ? `(Story #${i + 1})` : ''}`,
      author: `kind_heart_${(i * 5) % 50}`,
      score: 42000 - i * 600 + Math.floor(Math.random() * 700),
      num_comments: 1200 - i * 20 + Math.floor(Math.random() * 80),
      created_utc: Date.now() / 1000 - i * 3000,
      permalink: `/r/wholesomememes/comments/wholesome_${i + 1}`,
      url: `https://reddit.com/r/wholesomememes/comments/wholesome_${i + 1}`,
      subreddit: 'wholesomememes',
      upvote_ratio: 0.98 - (i % 5) * 0.01
    };
  })
};

export function getMockSubredditData(subredditName: string): RedditPostData[] {
  const norm = subredditName.toLowerCase().trim();
  if (MOCK_SUBREDDITS_DATA[norm]) {
    return MOCK_SUBREDDITS_DATA[norm];
  }

  return Array.from({ length: 50 }, (_, i) => {
    const adjectives = ['Amazing', 'Revolutionary', 'Disastrous', 'Breakthrough', 'Controversial', 'Wholesome', 'Shocking', 'Brilliant', 'Failed', 'Historic'];
    const topics = ['Community Discussion', 'Project Update', 'Major Announcement', 'Deep Dive Analysis', 'Expert Interview', 'Policy Change', 'User Showcase', 'Future Outlook'];
    const adj = adjectives[i % adjectives.length];
    const top = topics[i % topics.length];
    return {
      id: `${norm}_${i + 1}`,
      title: `${adj} ${top} in r/${norm}: Everything You Need to Know #${i + 1}`,
      author: `${norm}_user_${i + 1}`,
      score: 10000 - i * 180 + Math.floor(Math.random() * 300),
      num_comments: 500 - i * 8 + Math.floor(Math.random() * 50),
      created_utc: Date.now() / 1000 - i * 3600,
      permalink: `/r/${norm}/comments/${norm}_${i + 1}`,
      url: `https://reddit.com/r/${norm}/comments/${norm}_${i + 1}`,
      subreddit: norm,
      upvote_ratio: 0.90
    };
  });
}
