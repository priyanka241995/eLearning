const express = require('express');
const axios = require('axios');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Search route - integrates Google and YouTube
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const results = [];

    // Google Custom Search
    if (process.env.GOOGLE_API_KEY && process.env.GOOGLE_CX) {
      try {
        const googleResponse = await axios.get('https://www.googleapis.com/customsearch/v1', {
          params: {
            key: process.env.GOOGLE_API_KEY,
            cx: process.env.GOOGLE_CX,
            q: `${q} data structures algorithms tutorial`,
            num: 5
          }
        });

        if (googleResponse.data.items) {
          googleResponse.data.items.forEach(item => {
            results.push({
              title: item.title,
              description: item.snippet,
              link: item.link,
              source: 'Google',
              type: 'article'
            });
          });
        }
      } catch (error) {
        console.error('Google Search error:', error.message);
      }
    }

    // YouTube Search
    if (process.env.YOUTUBE_API_KEY) {
      try {
        const youtubeResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
          params: {
            key: process.env.YOUTUBE_API_KEY,
            q: `${q} DSA tutorial`,
            part: 'snippet',
            maxResults: 5,
            type: 'video',
            order: 'viewCount'
          }
        });

        if (youtubeResponse.data.items) {
          youtubeResponse.data.items.forEach(item => {
            results.push({
              title: item.snippet.title,
              description: item.snippet.description,
              link: `https://www.youtube.com/watch?v=${item.id.videoId}`,
              thumbnail: item.snippet.thumbnails.medium.url,
              source: 'YouTube',
              type: 'video'
            });
          });
        }
      } catch (error) {
        console.error('YouTube Search error:', error.message);
      }
    }

    // If no API keys are set, return mock data
    if (results.length === 0) {
      results.push(
        {
          title: `${q} - GeeksforGeeks Tutorial`,
          description: `Complete guide to ${q} with examples and practice problems`,
          link: 'https://www.geeksforgeeks.org',
          source: 'Mock Data',
          type: 'article'
        },
        {
          title: `${q} Explained - YouTube`,
          description: `Visual explanation of ${q} concepts`,
          link: 'https://www.youtube.com',
          source: 'Mock Data',
          type: 'video'
        }
      );
    }

    res.json({ results, count: results.length });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
});

module.exports = router;