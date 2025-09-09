import express from 'express';
import { ContentModerator } from './moderator';
import { ContentInput } from './types';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Initialize content moderator
const moderator = new ContentModerator();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Main content moderation endpoint
app.post('/moderate', (req, res) => {
  try {
    const { text, metadata } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        error: 'Missing or invalid text field',
        message: 'Please provide a text field with string content to analyze'
      });
    }

    const input: ContentInput = {
      text,
      metadata: metadata || {}
    };

    const result = moderator.analyzeContent(input);

    res.json({
      success: true,
      analysis: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error analyzing content:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while analyzing the content'
    });
  }
});

// Batch moderation endpoint
app.post('/moderate/batch', (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Please provide an array of items to analyze'
      });
    }

    const results = items.map((item, index) => {
      try {
        if (!item.text || typeof item.text !== 'string') {
          return {
            index,
            error: 'Missing or invalid text field',
            success: false
          };
        }

        const input: ContentInput = {
          text: item.text,
          metadata: item.metadata || {}
        };

        const analysis = moderator.analyzeContent(input);
        return {
          index,
          analysis,
          success: true
        };
      } catch (error) {
        return {
          index,
          error: 'Error analyzing item',
          success: false
        };
      }
    });

    res.json({
      success: true,
      results,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in batch analysis:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred during batch analysis'
    });
  }
});

// Get moderation statistics
app.get('/stats', (req, res) => {
  try {
    const stats = moderator.getRuleStats();
    res.json({
      success: true,
      ruleStats: stats,
      totalRules: Object.values(stats).reduce((sum, count) => sum + count, 0),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while retrieving statistics'
    });
  }
});

// Example endpoint with test cases
app.get('/examples', (req, res) => {
  const examples = [
    {
      category: 'Clean Content',
      text: 'I love spending time with my family and friends. Today was a beautiful day!',
      expectedResult: 'Should not be flagged'
    },
    {
      category: 'Mild Spam',
      text: 'Click here for free money! Limited time offer, act now!',
      expectedResult: 'Should be flagged as spam (medium severity)'
    },
    {
      category: 'Hate Speech',
      text: 'I hate all people of that religion, they are subhuman',
      expectedResult: 'Should be flagged as hate speech (critical severity)'
    },
    {
      category: 'Violence Threat',
      text: 'I will kill you if you don\'t stop bothering me',
      expectedResult: 'Should be flagged as violence (critical severity)'
    },
    {
      category: 'Self-harm',
      text: 'I want to end my life, looking for suicide methods',
      expectedResult: 'Should be flagged as self-harm (critical severity)'
    }
  ];

  res.json({
    success: true,
    examples,
    note: 'Use POST /moderate to test these examples',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Content Moderation Server running on port ${port}`);
  console.log(`📊 Health check: http://localhost:${port}/health`);
  console.log(`🔍 Moderate content: POST http://localhost:${port}/moderate`);
  console.log(`📈 View examples: http://localhost:${port}/examples`);
  console.log(`📋 View stats: http://localhost:${port}/stats`);
});

export default app;
