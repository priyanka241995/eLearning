const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected Successfully'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

// Import Routes
const authRoutes = require('./routes/auth');
const searchRoutes = require('./routes/search');
const courseRoutes = require('./routes/courses');
const progressRoutes = require('./routes/progress');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/progress', progressRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ message: 'DEPTH API is running!' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 DEPTH Server running on port ${PORT}`);
});
