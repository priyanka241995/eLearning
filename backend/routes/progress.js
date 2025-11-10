const express = require('express');
const User = require('../models/User');
const Progress = require('../models/Progress');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Get user progress
router.get('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ 
      progress: user.progress || 0,
      completedTopics: user.completedTopics || [],
      streak: user.streak || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching progress' });
  }
});

// Update progress when topic is completed
router.post('/update', authenticateToken, async (req, res) => {
  try {
    const { topicName, courseId } = req.body;
    const user = await User.findById(req.user.id);

    if (!user.completedTopics.includes(topicName)) {
      user.completedTopics.push(topicName);
      
      // Calculate progress (out of 10 main topics)
      const totalTopics = 10;
      user.progress = Math.round((user.completedTopics.length / totalTopics) * 100);
      
      await user.save();
    }

    res.json({ 
      progress: user.progress,
      completedTopics: user.completedTopics
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating progress' });
  }
});

// Submit quiz score
router.post('/quiz', authenticateToken, async (req, res) => {
  try {
    const { courseId, topic, score, totalQuestions } = req.body;

    let progress = await Progress.findOne({
      userId: req.user.id,
      courseId: courseId
    });

    if (!progress) {
      progress = new Progress({
        userId: req.user.id,
        courseId: courseId
      });
    }

    progress.quizScores.push({
      topic,
      score,
      totalQuestions,
      date: new Date()
    });

    await progress.save();

    res.json({ message: 'Quiz score saved', score });
  } catch (error) {
    res.status(500).json({ message: 'Error saving quiz score' });
  }
});

module.exports = router;

