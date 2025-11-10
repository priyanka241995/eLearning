const express = require('express');
const Course = require('../models/Course');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Get all courses
router.get('/', authenticateToken, async (req, res) => {
  try {
    const courses = await Course.find().select('-topics.exercises');
    res.json({ courses });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

// Get single course with full details
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.json({ course });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course' });
  }
});

// Seed initial courses (run once)
router.post('/seed', async (req, res) => {
  try {
    const courses = [
      {
        title: "DSA for Beginners",
        description: "Start your journey with fundamental data structures and algorithms. Perfect for beginners!",
        level: "Beginner",
        duration: "8 weeks",
        totalTopics: 15,
        rating: 4.8,
        topics: [
          { name: "Introduction to DSA", order: 1 },
          { name: "Arrays Basics", order: 2 },
          { name: "Strings", order: 3 },
          { name: "Basic Sorting", order: 4 },
          { name: "Linear Search", order: 5 }
        ]
      },
      {
        title: "Intermediate DSA",
        description: "Level up with advanced data structures like trees, graphs, and complex algorithms",
        level: "Intermediate",
        duration: "10 weeks",
        totalTopics: 20,
        rating: 4.7,
        topics: [
          { name: "Linked Lists", order: 1 },
          { name: "Stacks & Queues", order: 2 },
          { name: "Binary Trees", order: 3 },
          { name: "Binary Search Trees", order: 4 },
          { name: "Hashing", order: 5 }
        ]
      },
      {
        title: "Advanced DSA",
        description: "Master complex algorithms including Dynamic Programming, Graphs, and advanced problem-solving",
        level: "Advanced",
        duration: "12 weeks",
        totalTopics: 25,
        rating: 4.9,
        topics: [
          { name: "Graph Algorithms", order: 1 },
          { name: "Dynamic Programming", order: 2 },
          { name: "Greedy Algorithms", order: 3 },
          { name: "Backtracking", order: 4 },
          { name: "Advanced Trees", order: 5 }
        ]
      },
      {
        title: "Interview Preparation",
        description: "Ace your coding interviews with curated problems and patterns",
        level: "All Levels",
        duration: "6 weeks",
        totalTopics: 30,
        rating: 4.8,
        topics: [
          { name: "Array Patterns", order: 1 },
          { name: "Two Pointers", order: 2 },
          { name: "Sliding Window", order: 3 },
          { name: "Common Interview Questions", order: 4 }
        ]
      }
    ];

    await Course.deleteMany({});
    await Course.insertMany(courses);

    res.json({ message: 'Courses seeded successfully!', count: courses.length });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding courses', error: error.message });
  }
});

module.exports = router;

