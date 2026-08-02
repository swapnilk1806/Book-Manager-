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


app.post("/books/seed", async (req, res) => {
  try {
    const books = [
      { title: "The Alchemist", author: "Paulo Coelho", tags: ["Fiction", "Adventure"], status: "Completed" },
      { title: "Atomic Habits", author: "James Clear", tags: ["Self-Help", "Productivity"], status: "Reading" },
      { title: "Clean Code", author: "Robert C. Martin", tags: ["Programming"], status: "Want to Read" },
      { title: "Rich Dad Poor Dad", author: "Robert T. Kiyosaki", tags: ["Finance"], status: "Completed" },
      { title: "Deep Work", author: "Cal Newport", tags: ["Productivity"], status: "Reading" },
      { title: "The Pragmatic Programmer", author: "Andrew Hunt", tags: ["Programming"], status: "Want to Read" },
      { title: "Think and Grow Rich", author: "Napoleon Hill", tags: ["Success"], status: "Completed" },
      { title: "The Psychology of Money", author: "Morgan Housel", tags: ["Finance"], status: "Reading" },
      { title: "Eloquent JavaScript", author: "Marijn Haverbeke", tags: ["JavaScript"], status: "Completed" },
      { title: "You Don't Know JS", author: "Kyle Simpson", tags: ["JavaScript"], status: "Want to Read" },
      { title: "Design Patterns", author: "Erich Gamma", tags: ["Programming"], status: "Reading" },
      { title: "Refactoring", author: "Martin Fowler", tags: ["Programming"], status: "Completed" },
      { title: "Cracking the Coding Interview", author: "Gayle Laakmann McDowell", tags: ["DSA"], status: "Reading" },
      { title: "Head First Java", author: "Kathy Sierra", tags: ["Java"], status: "Want to Read" },
      { title: "MongoDB: The Definitive Guide", author: "Kristina Chodorow", tags: ["MongoDB"], status: "Completed" },
      { title: "Node.js Design Patterns", author: "Mario Casciaro", tags: ["Node.js"], status: "Reading" },
      { title: "React Up & Running", author: "Stoyan Stefanov", tags: ["React"], status: "Want to Read" },
      { title: "The Lean Startup", author: "Eric Ries", tags: ["Business", "Startup"], status: "Completed" },
      { title: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey", tags: ["Leadership"], status: "Reading" },
      { title: "The Power of Habit", author: "Charles Duhigg", tags: ["Habits"], status: "Want to Read" }
    ];

    await Book.insertMany(books);

    res.status(201).json({
      success: true,
      message: "20 books added successfully",
      count: books.length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API URL: http://localhost:${PORT}/api`);
});