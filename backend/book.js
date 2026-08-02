const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const Book = require("../models/Book");
const {
  getDashboard,
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} = require("../controllers/bookController");

// All routes require authentication
router.use(authenticate);

// Dashboard
router.get("/dashboard", getDashboard);

// Books
router.get("/books", getBooks);
router.post("/books", addBook);
router.put("/books/:id", updateBook);
router.delete("/books/:id", deleteBook);

// Seed 20 Books
router.post("/books/seed", async (req, res) => {
  try {
    const books = [
      { title: "The Alchemist", author: "Paulo Coelho", tags: ["Fiction"], status: "Completed" },
      { title: "Atomic Habits", author: "James Clear", tags: ["Self-Help"], status: "Reading" },
      { title: "Clean Code", author: "Robert C. Martin", tags: ["Programming"], status: "Want to Read" },
      { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", tags: ["Finance"], status: "Completed" },
      { title: "Deep Work", author: "Cal Newport", tags: ["Productivity"], status: "Reading" },
      { title: "The Pragmatic Programmer", author: "Andrew Hunt", tags: ["Programming"], status: "Want to Read" },
      { title: "Think and Grow Rich", author: "Napoleon Hill", tags: ["Success"], status: "Completed" },
      { title: "The Psychology of Money", author: "Morgan Housel", tags: ["Finance"], status: "Reading" },
      { title: "Eloquent JavaScript", author: "Marijn Haverbeke", tags: ["JavaScript"], status: "Completed" },
      { title: "You Don't Know JS", author: "Kyle Simpson", tags: ["JavaScript"], status: "Want to Read" },
      { title: "Design Patterns", author: "Erich Gamma", tags: ["Programming"], status: "Reading" },
      { title: "Head First Java", author: "Kathy Sierra", tags: ["Java"], status: "Completed" },
      { title: "Node.js Design Patterns", author: "Mario Casciaro", tags: ["Node.js"], status: "Reading" },
      { title: "MongoDB: The Definitive Guide", author: "Kristina Chodorow", tags: ["MongoDB"], status: "Want to Read" },
      { title: "React Up & Running", author: "Stoyan Stefanov", tags: ["React"], status: "Completed" },
      { title: "Refactoring", author: "Martin Fowler", tags: ["Programming"], status: "Reading" },
      { title: "Cracking the Coding Interview", author: "Gayle McDowell", tags: ["DSA"], status: "Want to Read" },
      { title: "The Lean Startup", author: "Eric Ries", tags: ["Startup"], status: "Completed" },
      { title: "The Power of Habit", author: "Charles Duhigg", tags: ["Habits"], status: "Reading" },
      { title: "The 7 Habits of Highly Effective People", author: "Stephen Covey", tags: ["Leadership"], status: "Completed" },
    ];

    const booksWithUserId = books.map((book) => ({
      ...book,
      userId: req.user.userId, // From JWT middleware
    }));

    await Book.insertMany(booksWithUserId);

    res.status(201).json({
      message: "20 books inserted successfully",
      count: booksWithUserId.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;