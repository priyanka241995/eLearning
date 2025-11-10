
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'],
    required: true
  },
  topics: [{
    name: String,
    content: String,
    videoUrl: String,
    order: Number,
    exercises: [{
      question: String,
      options: [String],
      correctAnswer: String,
      difficulty: String
    }]
  }],
  duration: String,
  totalTopics: Number,
  rating: {
    type: Number,
    default: 0
  },
  enrolledStudents: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);
