const Book = require('../models/Book');

// @desc    Get dashboard stats
// @route   GET /api/dashboard
// @access  Private
const getDashboard = async (req, res) => {
  try {
    const userId = req.userId;
    const books = await Book.find({ userId });
    
    const totalBooks = books.length;
    const wantToRead = books.filter(b => b.status === 'Want to Read').length;
    const reading = books.filter(b => b.status === 'Reading').length;
    const completed = books.filter(b => b.status === 'Completed').length;
    
    res.json({
      totalBooks,
      wantToRead,
      reading,
      completed,
      books,
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// @desc    Get all books with filters
// @route   GET /api/books
// @access  Private
const getBooks = async (req, res) => {
  try {
    const { status, tag } = req.query;
    const filter = { userId: req.userId };
    if (status) filter.status = status;
    if (tag) filter.tags = tag;
    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error('Get Books Error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// @desc    Add a new book
// @route   POST /api/books
// @access  Private
const addBook = async (req, res) => {
  try {
    const { title, author, tags, status } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required.' });
    }
    
    const book = new Book({
      title,
      author,
      tags: tags || [],
      status: status || 'Want to Read',
      userId: req.userId,
    });
    
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error('Add Book Error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Private
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, tags, status } = req.body;
    
    const book = await Book.findOne({ _id: id, userId: req.userId });
    if (!book) {
      return res.status(404).json({ error: 'Book not found or not owned by you.' });
    }
    
    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (tags !== undefined) book.tags = tags;
    if (status !== undefined) book.status = status;
    
    await book.save();
    res.json(book);
  } catch (error) {
    console.error('Update Book Error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findOneAndDelete({ _id: id, userId: req.userId });
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found or not owned by you.' });
    }
    
    res.json({ message: 'Book deleted successfully.' });
  } catch (error) {
    console.error('Delete Book Error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
};

module.exports = {
  getDashboard,
  getBooks,
  addBook,
  updateBook,
  deleteBook,
};