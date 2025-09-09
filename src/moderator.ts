import {
  ContentAnalysisResult,
  ContentInput,
  ContentCategory,
  CategoryType,
  ModerationRule
} from './types';
import { MODERATION_RULES, SEVERITY_THRESHOLDS } from './rules';

export class ContentModerator {
  private rules: ModerationRule[];

  constructor(customRules?: ModerationRule[]) {
    this.rules = customRules || MODERATION_RULES;
  }

  /**
   * Main method to analyze content and determine if it's problematic
   */
  public analyzeContent(input: ContentInput): ContentAnalysisResult {
    const text = this.preprocessText(input.text);
    const categories = this.detectCategories(text);
    const overallScore = this.calculateOverallScore(categories);
    const severity = this.determineSeverity(overallScore);
    const isProblematic = overallScore >= SEVERITY_THRESHOLDS.low;
    const reasons = this.generateReasons(categories);
    const confidence = this.calculateConfidence(categories, text);

    return {
      isProblematic,
      severity,
      categories,
      score: Math.round(overallScore),
      reasons,
      confidence: Math.round(confidence * 100) / 100
    };
  }

  /**
   * Preprocess text to normalize for analysis
   */
  private preprocessText(text: string): string {
    let processed = text.toLowerCase();

    // Handle common obfuscation patterns
    processed = processed
      .replace(/h[@#$%^&*]t[e3]/g, 'hate') // h@te, h*te, etc.
      .replace(/sp[e3]{2,}ch/g, 'speech') // speeeech variations
      .replace(/[0-9]/g, 'o') // Replace numbers with 'o'
      .replace(/[@#$%^&*!]/g, 'a') // Replace symbols often used to obfuscate
      .replace(/[^\w\s]/g, ' ') // Replace remaining special chars with spaces
      .replace(/\s+/g, ' ') // Normalize whitespace
      .replace(/(.)\1{3,}/g, '$1$1') // Reduce repeated characters (aaaa -> aa)
      .trim();

    return processed;
  }

  /**
   * Detect which categories of problematic content are present
   */
  private detectCategories(text: string): ContentCategory[] {
    const categories: ContentCategory[] = [];

    for (const rule of this.rules) {
      const matches: string[] = [];
      let totalScore = 0;

      // Check keyword matches
      for (const keyword of rule.keywords) {
        const normalizedKeyword = keyword.replace(/\*/g, '[a-z]'); // Handle wildcards
        const regex = new RegExp(normalizedKeyword, 'gi');
        const keywordMatches = text.match(regex);
        if (keywordMatches) {
          matches.push(...keywordMatches);
          totalScore += keywordMatches.length * 10; // Base score per keyword match
        }
      }

      // Check pattern matches
      for (const pattern of rule.patterns) {
        const patternMatches = text.match(pattern);
        if (patternMatches) {
          matches.push(...patternMatches);
          totalScore += patternMatches.length * 20; // Higher score for pattern matches
        }
      }

      if (matches.length > 0) {
        // Apply severity multiplier
        const severityMultiplier = this.getSeverityMultiplier(rule.severity);
        const categoryScore = Math.min(100, totalScore * severityMultiplier);

        categories.push({
          type: rule.category,
          severity: rule.severity,
          matches: [...new Set(matches)], // Remove duplicates
          score: Math.round(categoryScore)
        });
      }
    }

    return categories.sort((a, b) => b.score - a.score); // Sort by score descending
  }

  /**
   * Calculate overall problematic score based on detected categories
   */
  private calculateOverallScore(categories: ContentCategory[]): number {
    if (categories.length === 0) return 0;

    let totalScore = 0;
    let totalWeight = 0;

    for (const category of categories) {
      const rule = this.rules.find(r => r.category === category.type);
      if (rule) {
        totalScore += category.score * rule.weight;
        totalWeight += rule.weight;
      }
    }

    // Normalize by total weight and apply category count bonus
    const baseScore = totalWeight > 0 ? (totalScore / totalWeight) : 0;
    const categoryBonus = Math.min(20, categories.length * 5); // Bonus for multiple categories

    return Math.min(100, baseScore + categoryBonus);
  }

  /**
   * Determine severity level based on overall score
   */
  private determineSeverity(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score >= SEVERITY_THRESHOLDS.critical) return 'critical';
    if (score >= SEVERITY_THRESHOLDS.high) return 'high';
    if (score >= SEVERITY_THRESHOLDS.medium) return 'medium';
    return 'low';
  }

  /**
   * Generate human-readable reasons for flagging
   */
  private generateReasons(categories: ContentCategory[]): string[] {
    const reasons: string[] = [];

    for (const category of categories) {
      const categoryName = category.type.replace('_', ' ');
      const matchCount = category.matches.length;

      if (matchCount > 0) {
        reasons.push(
          `Contains ${categoryName} (${matchCount} ${matchCount === 1 ? 'match' : 'matches'})`
        );
      }
    }

    return reasons;
  }

  /**
   * Calculate confidence in the analysis
   */
  private calculateConfidence(categories: ContentCategory[], text: string): number {
    if (categories.length === 0) return 1.0; // High confidence in clean content

    let confidenceScore = 0;
    let factors = 0;

    // Factor 1: Number of matches
    const totalMatches = categories.reduce((sum, cat) => sum + cat.matches.length, 0);
    confidenceScore += Math.min(0.4, totalMatches * 0.1);
    factors++;

    // Factor 2: Severity of matches
    const avgSeverity = categories.reduce((sum, cat) =>
      sum + this.getSeverityMultiplier(cat.severity), 0) / categories.length;
    confidenceScore += avgSeverity * 0.3;
    factors++;

    // Factor 3: Text length (more context = higher confidence)
    const textLength = text.length;
    const lengthFactor = Math.min(0.3, textLength / 1000); // Max 0.3 for 1000+ chars
    confidenceScore += lengthFactor;
    factors++;

    return Math.min(1.0, confidenceScore);
  }

  /**
   * Get severity multiplier for scoring
   */
  private getSeverityMultiplier(severity: 'low' | 'medium' | 'high' | 'critical'): number {
    switch (severity) {
      case 'low': return 1.0;
      case 'medium': return 1.5;
      case 'high': return 2.0;
      case 'critical': return 3.0;
      default: return 1.0;
    }
  }

  /**
   * Add custom rule to the moderator
   */
  public addRule(rule: ModerationRule): void {
    this.rules.push(rule);
  }

  /**
   * Get statistics about the current rule set
   */
  public getRuleStats(): { [key in CategoryType]?: number } {
    const stats: { [key in CategoryType]?: number } = {};

    for (const rule of this.rules) {
      stats[rule.category] = (stats[rule.category] || 0) + 1;
    }

    return stats;
  }
}
