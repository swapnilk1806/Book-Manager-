require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
const MongoDB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/personal_book_manager";

mongoose
  .connect(MongoDB_URL)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  });

// ------------------- Models -------------------
// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Book Schema
const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  tags: { type: [String], default: [] },
  status: { 
    type: String, 
    enum: ['Want to Read', 'Reading', 'Completed'], 
    default: 'Want to Read' 
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);

// ------------------- JWT Middleware -------------------
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

// ------------------- Auth Routes -------------------
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
    res.status(201).json({ 
      message: 'User created successfully', 
      token,
      user: { id: user._id, name, email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '7d' });
    res.json({ 
      message: 'Login successful', 
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// ------------------- Book Routes (Protected) -------------------

// GET /api/dashboard - Dashboard stats
app.get('/api/dashboard', authenticate, async (req, res) => {
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
});

// GET /api/books - Get all books with filters
app.get('/api/books', authenticate, async (req, res) => {
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
});

// POST /api/books - Add a new book
app.post('/api/books', authenticate, async (req, res) => {
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
});

// PUT /api/books/:id - Update a book
app.put('/api/books/:id', authenticate, async (req, res) => {
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
});

// DELETE /api/books/:id - Delete a book
app.delete('/api/books/:id', authenticate, async (req, res) => {
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
});

// ------------------- Start Server -------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API URL: http://localhost:${PORT}/api`);
});