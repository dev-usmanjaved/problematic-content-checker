# Content Moderation System

A TypeScript-based content moderation system designed to flag problematic social media content before it gets posted.

## 🎯 Overview

This system analyzes text content and identifies potentially problematic material across multiple categories including hate speech, violence, harassment, spam, misinformation, and more. It provides severity scoring, confidence levels, and detailed analysis results.

## ⚠️ Content Assumptions & Scope

**This system is designed to detect content that violates typical social media community guidelines. Due to the 2-hour time constraint for this takehome assignment, the following assumptions are made about what constitutes problematic content:**

### Content Categories Considered Problematic:

**🔴 Critical Severity:**
- **Hate Speech**: Racial slurs, ethnic targeting, religious hatred, supremacist content
- **Violence & Threats**: Death threats, bomb threats, assassination plans, weapon instructions
- **Self-Harm**: Suicide methods, self-injury instructions, pro-eating disorder content

**🟠 High Severity:**
- **Harassment**: Cyberbullying, doxxing, targeted personal attacks
- **Misinformation**: Vaccine myths, election fraud claims, dangerous conspiracy theories

**🟡 Medium Severity:**
- **Spam**: Get-rich-quick schemes, crypto scams, excessive promotional content
- **Adult Content**: Explicit material, adult services advertising

**🔵 Context-Dependent:**
- **Privacy Violations**: Sharing personal information without consent
- **Illegal Content**: Drug trafficking, weapons sales (jurisdiction-dependent)

### Language Assumptions:
- **Primary Language**: English (with some l33t speak/obfuscation detection)
- **Cultural Context**: Western social media norms and community standards
- **Keyword-Based**: Rule-based system using patterns and known problematic terms

### What This System Does NOT Cover:
- Non-English languages
- Complex contextual nuance or sarcasm
- Images, videos, or audio content
- Cultural context outside Western social media norms
- Legal compliance for specific jurisdictions

**⚖️ Important Note**: Content moderation involves subjective judgments. This system provides automated flagging to assist human moderators, not replace human judgment. Different platforms and cultures may have varying standards for what constitutes problematic content.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd problematic-content-checker

# Install dependencies
npm install

# Build the project
npm run build

# Start the server
npm start
```

### Development Mode

```bash
# Run in development mode with hot reload
npm run dev
```

### Running Tests

```bash
# Run all tests
npm test
```

## 📡 API Endpoints

### POST /moderate
Analyze a single piece of content for problematic material.

**Request:**
```json
{
  "text": "Content to analyze",
  "metadata": {
    "author": "username",
    "platform": "twitter",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "isProblematic": true,
    "severity": "high",
    "score": 75,
    "confidence": 0.85,
    "categories": [
      {
        "type": "hate_speech",
        "severity": "critical",
        "matches": ["hate speech example"],
        "score": 90
      }
    ],
    "reasons": [
      "Contains hate speech (2 matches)"
    ]
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### POST /moderate/batch
Analyze multiple pieces of content at once.

**Request:**
```json
{
  "items": [
    {"text": "First content to analyze"},
    {"text": "Second content to analyze"}
  ]
}
```

### GET /examples
View example content and expected results for testing.

### GET /stats
Get statistics about the current moderation rules.

### GET /health
Health check endpoint.

## 🧠 Algorithm Details

### Content Categories

The system detects 9 categories of problematic content:

1. **Hate Speech** - Racial slurs, ethnic targeting, supremacist content
2. **Violence** - Threats, bomb-making instructions, assassination plans
3. **Harassment** - Cyberbullying, doxxing, targeted abuse
4. **Self-harm** - Suicide methods, cutting instructions, pro-eating disorder content
5. **Spam** - Get-rich-quick schemes, crypto scams, clickbait
6. **Adult Content** - Explicit material, adult services
7. **Misinformation** - Vaccine myths, election fraud claims, conspiracy theories
8. **Illegal Content** - Drug trafficking, weapons sales
9. **Privacy Violation** - Personal information sharing, doxxing

### Scoring System

- **Score Range**: 0-100 (higher = more problematic)
- **Severity Levels**:
  - Low: 20-39 (minor issues)
  - Medium: 40-59 (moderate concerns)
  - High: 60-79 (serious violations)
  - Critical: 80+ (immediate action required)

### Detection Methods

1. **Keyword Matching**: Identifies known problematic terms
2. **Pattern Recognition**: Uses regex to detect harmful phrases and structures
3. **Text Preprocessing**: Normalizes text to catch obfuscated content
4. **Multi-factor Scoring**: Combines severity, frequency, and context
5. **Confidence Assessment**: Evaluates certainty of the analysis

### Key Features

- **Obfuscation Resistance**: Handles l33t speak, symbol substitution, repeated characters
- **Context Awareness**: Considers text length and multiple violations
- **Extensible Rules**: Easy to add new categories and patterns
- **Batch Processing**: Efficient analysis of multiple items
- **Confidence Scoring**: Indicates reliability of the assessment

## 🔧 Configuration

### Adding Custom Rules

```typescript
import { ContentModerator, ModerationRule } from './src/moderator';

const customRule: ModerationRule = {
  category: 'spam',
  patterns: [/buy\s+now\s+limited\s+time/gi],
  keywords: ['limited offer', 'act fast'],
  severity: 'medium',
  weight: 0.2
};

const moderator = new ContentModerator();
moderator.addRule(customRule);
```

### Environment Variables

```bash
PORT=3000  # Server port (default: 3000)
```

## 📊 Example Usage

### Clean Content
```bash
curl -X POST http://localhost:3000/moderate \
  -H "Content-Type: application/json" \
  -d '{"text": "I love spending time with my family!"}'
```

**Result**: Not flagged (score: 0)

### Problematic Content
```bash
curl -X POST http://localhost:3000/moderate \
  -H "Content-Type: application/json" \
  -d '{"text": "I hate all people of that religion, they should die"}'
```

**Result**: Flagged as hate speech + violence (score: 85+, severity: critical)

## 🧪 Testing

The system includes comprehensive tests covering:

- All content categories
- Edge cases (empty text, special characters, long content)
- Multiple violation detection
- Confidence scoring
- Custom rule addition
- API endpoint functionality

Run tests with detailed output:
```bash
npm test -- --verbose
```

## 🏗️ Architecture

```
src/
├── types.ts          # TypeScript interfaces and types
├── rules.ts          # Moderation rules and patterns
├── moderator.ts      # Core content analysis engine
├── index.ts          # Express server and API endpoints
└── __tests__/        # Test suites
```

## ⚡ Performance

- **Single Analysis**: ~1-5ms per content piece
- **Batch Processing**: Optimized for multiple items
- **Memory Usage**: Minimal, rules loaded once at startup
- **Scalability**: Stateless design allows horizontal scaling

## 🔒 Privacy & Security

- **No Data Storage**: Content is analyzed in memory only
- **No Logging**: Sensitive content is not logged
- **Stateless**: No user data persistence
- **Rate Limiting**: Can be added for production use

## 🚧 Limitations & Future Improvements

### Current Limitations
- English language only
- Rule-based approach (no ML)
- Limited context understanding
- No image/video analysis

### Potential Improvements
- Multi-language support
- Machine learning integration
- Image/video content analysis
- Real-time learning from feedback
- Advanced NLP for context understanding
- Integration with external threat databases

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

## 📞 Support

For questions or issues, please open a GitHub issue or contact the development team.

---

**Note**: This system is designed for demonstration purposes. For production use, consider additional features like rate limiting, authentication, logging, and integration with machine learning models for improved accuracy.
