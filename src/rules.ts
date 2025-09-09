import { ModerationRule, CategoryType } from './types';

export const MODERATION_RULES: ModerationRule[] = [
  // Hate Speech Rules
  {
    category: 'hate_speech',
    patterns: [
      /\b(kill|murder|eliminate)\s+(all\s+)?(jews|muslims|christians|blacks|whites|gays|lgbtq)\b/gi,
      /\b(hitler|nazi|kkk)\s+(was\s+)?(right|good|correct)\b/gi,
      /\b(racial|ethnic)\s+(cleansing|genocide|purge)\b/gi,
      /\bhate\s+(all\s+)?(people|jews|muslims|christians|blacks|whites|gays|lgbtq)/gi,
      /\b(they\s+are\s+|all\s+.*\s+are\s+)subhuman\b/gi,
    ],
    keywords: [
      'n*gger', 'f*ggot', 'k*ke', 'ch*nk', 'sp*c', 'w*tback', 'n1gger', 'n!gger',
      'subhuman', 'inferior race', 'master race', 'white supremacy',
      'ethnic cleansing', 'final solution', 'hate all people'
    ],
    severity: 'critical',
    weight: 0.4
  },

  // Violence and Threats
  {
    category: 'violence',
    patterns: [
      /\b(kill|murder|assassinate|execute|shoot|stab|bomb)\s+(you|him|her|them|everyone)\b/gi,
      /\bi\s+(will|gonna|going\s+to)\s+(kill|hurt|harm|destroy)\b/gi,
      /\b(death\s+threat|bomb\s+threat|school\s+shooting)\b/gi,
      /\b(detailed\s+)?(instructions|guide|tutorial)\s+(to\s+)?(make|build|create)\s+(bomb|explosive|weapon)\b/gi,
    ],
    keywords: [
      'death threat', 'kill yourself', 'commit suicide', 'school shooting',
      'mass shooting', 'terrorist attack', 'bomb making', 'assassination',
      'murder plot', 'violence against', 'harm children'
    ],
    severity: 'critical',
    weight: 0.35
  },

  // Harassment and Bullying
  {
    category: 'harassment',
    patterns: [
      /\b(ugly|fat|stupid|worthless|loser)\s+(piece\s+of\s+)?(shit|garbage|trash)\b/gi,
      /\byou\s+(should|deserve\s+to)\s+(die|kill\s+yourself|be\s+dead)\b/gi,
      /\b(doxxing|dox|personal\s+information|home\s+address)\b/gi,
    ],
    keywords: [
      'kill yourself', 'kys', 'worthless', 'nobody likes you',
      'doxxing', 'personal info', 'home address', 'phone number leak',
      'cyberbullying', 'harassment campaign', 'targeted abuse'
    ],
    severity: 'high',
    weight: 0.25
  },

  // Self-harm content
  {
    category: 'self_harm',
    patterns: [
      /\b(cutting|self\s+harm|suicide\s+methods|ways\s+to\s+die)\b/gi,
      /\b(how\s+to\s+)?(commit\s+suicide|kill\s+myself|end\s+my\s+life)\b/gi,
      /\b(pro\s+ana|pro\s+mia|eating\s+disorder\s+tips)\b/gi,
    ],
    keywords: [
      'suicide methods', 'self harm', 'cutting tips', 'pro ana',
      'pro mia', 'starving myself', 'want to die', 'end my life',
      'suicide pact', 'hanging methods', 'overdose guide'
    ],
    severity: 'critical',
    weight: 0.3
  },

  // Spam and Scams
  {
    category: 'spam',
    patterns: [
      /\b(click\s+here|free\s+money|get\s+rich\s+quick|nigerian\s+prince)\b/gi,
      /\b(crypto|bitcoin|nft)\s+(guaranteed|sure\s+thing|100%\s+profit)\b/gi,
      /\b(limited\s+time|act\s+now|don't\s+miss\s+out).*(offer|deal|opportunity)\b/gi,
    ],
    keywords: [
      'free money', 'get rich quick', 'nigerian prince', 'crypto scam',
      'pyramid scheme', 'mlm opportunity', 'work from home scam',
      'investment opportunity', 'guaranteed returns', 'click here now'
    ],
    severity: 'medium',
    weight: 0.15
  },

  // Adult Content
  {
    category: 'adult_content',
    patterns: [
      /\b(explicit|graphic|xxx|porn|nude|naked)\s+(content|images|videos)\b/gi,
      /\b(sexual|erotic)\s+(services|massage|escort)\b/gi,
    ],
    keywords: [
      'explicit content', 'adult services', 'nude photos', 'porn videos',
      'sexual services', 'escort services', 'erotic massage',
      'xxx content', 'adult entertainment'
    ],
    severity: 'medium',
    weight: 0.2
  },

  // Misinformation patterns
  {
    category: 'misinformation',
    patterns: [
      /\b(vaccines|covid).*(cause|causes).*(autism|death|infertility)\b/gi,
      /\b(election|voting).*(rigged|stolen|fraud|fake)\b/gi,
      /\b(climate\s+change|global\s+warming).*(hoax|fake|conspiracy)\b/gi,
    ],
    keywords: [
      'vaccine autism', 'covid hoax', 'election fraud', 'stolen election',
      'climate hoax', 'flat earth', 'chemtrails', '5g causes covid',
      'microchip vaccine', 'fake news media', 'deep state conspiracy'
    ],
    severity: 'high',
    weight: 0.25
  }
];

// Severity thresholds for overall content scoring
export const SEVERITY_THRESHOLDS = {
  low: 20,      // 0-19: acceptable, 20-39: low severity
  medium: 40,   // 40-59: medium severity
  high: 70,     // 60-79: high severity
  critical: 80  // 80+: critical severity
};
