const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth');
const {
  getDashboard,
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');

// All routes require authentication
router.use(authenticate);

// Dashboard route
router.get('/dashboard', getDashboard);

// Book routes
router.get('/books', getBooks);
router.post('/books', addBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

module.exports = router;