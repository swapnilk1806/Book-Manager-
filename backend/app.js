require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/database');
const authRoutes = require('./src/routes/authRoutes');
const bookRoutes = require('./src/routes/bookRoutes');
const errorHandler = require('./src/utils/errorHandler');

const app = express();

require("dotenv").config();
// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', bookRoutes);  // This will handle /api/dashboard and /api/books

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API URL: http://localhost:${PORT}/api`);
});