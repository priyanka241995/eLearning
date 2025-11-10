const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  completedTopics: [{
    topicName: String,
    completedAt: Date
  }],
  quizScores: [{
    topic: String,
    score: Number,
    totalQuestions: Number,
    date: Date
  }],
  currentTopic: String,
  percentageComplete: {
    type: Number,
    default: 0
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Progress', progressSchema);
