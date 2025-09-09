export interface ContentAnalysisResult {
  isProblematic: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  categories: ContentCategory[];
  score: number; // 0-100, higher = more problematic
  reasons: string[];
  confidence: number; // 0-1, how confident we are in the assessment
}

export interface ContentCategory {
  type: CategoryType;
  severity: 'low' | 'medium' | 'high' | 'critical';
  matches: string[];
  score: number;
}

export type CategoryType =
  | 'hate_speech'
  | 'harassment'
  | 'violence'
  | 'spam'
  | 'misinformation'
  | 'adult_content'
  | 'self_harm'
  | 'illegal_content'
  | 'privacy_violation';

export interface ContentInput {
  text: string;
  metadata?: {
    author?: string;
    timestamp?: Date;
    platform?: string;
    context?: string;
  };
}

export interface ModerationRule {
  category: CategoryType;
  patterns: RegExp[];
  keywords: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  weight: number; // How much this rule contributes to overall score
}
