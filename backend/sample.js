// sample.js
// Run this file to insert sample book data into MongoDB
// Command: node sample.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// --------------------- Connect to MongoDB ---------------------
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/personal_book_manager";

mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    insertSampleData();
  })
  .catch((err) => {
    console.error('❌ MongoDB Error:', err.message);
    process.exit(1);
  });

// --------------------- Define Schemas (matching your backend) ---------------------
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

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

const User = mongoose.model('User', userSchema);
const Book = mongoose.model('Book', bookSchema);

// --------------------- Sample Books Data ---------------------
const sampleBooks = [
  // Classic Literature
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    tags: ['classic', 'fiction', 'social-justice'],
    status: 'Completed',
  },
  {
    title: '1984',
    author: 'George Orwell',
    tags: ['dystopian', 'classic', 'political'],
    status: 'Reading',
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    tags: ['classic', 'romance', 'literature'],
    status: 'Want to Read',
  },
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    tags: ['classic', 'american', 'literature'],
    status: 'Completed',
  },
  {
    title: 'Moby-Dick',
    author: 'Herman Melville',
    tags: ['classic', 'adventure', 'nautical'],
    status: 'Want to Read',
  },
  {
    title: 'War and Peace',
    author: 'Leo Tolstoy',
    tags: ['classic', 'historical', 'russian'],
    status: 'Reading',
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    tags: ['classic', 'fiction', 'coming-of-age'],
    status: 'Completed',
  },

  // Science Fiction & Fantasy
  {
    title: 'Dune',
    author: 'Frank Herbert',
    tags: ['sci-fi', 'fantasy', 'epic'],
    status: 'Reading',
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    tags: ['fantasy', 'adventure', 'classic'],
    status: 'Completed',
  },
  {
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    tags: ['fantasy', 'epic', 'adventure'],
    status: 'Completed',
  },
  {
    title: 'Foundation',
    author: 'Isaac Asimov',
    tags: ['sci-fi', 'classic', 'space-opera'],
    status: 'Want to Read',
  },
  {
    title: 'Neuromancer',
    author: 'William Gibson',
    tags: ['sci-fi', 'cyberpunk', 'classic'],
    status: 'Want to Read',
  },
  {
    title: 'The Left Hand of Darkness',
    author: 'Ursula K. Le Guin',
    tags: ['sci-fi', 'feminist', 'classic'],
    status: 'Reading',
  },
  {
    title: 'American Gods',
    author: 'Neil Gaiman',
    tags: ['fantasy', 'mythology', 'urban-fantasy'],
    status: 'Completed',
  },

  // Mystery & Thriller
  {
    title: 'The Girl with the Dragon Tattoo',
    author: 'Stieg Larsson',
    tags: ['mystery', 'thriller', 'crime'],
    status: 'Completed',
  },
  {
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    tags: ['thriller', 'mystery', 'historical'],
    status: 'Reading',
  },
  {
    title: 'Gone Girl',
    author: 'Gillian Flynn',
    tags: ['thriller', 'mystery', 'psychological'],
    status: 'Completed',
  },
  {
    title: 'The Silence of the Lambs',
    author: 'Thomas Harris',
    tags: ['thriller', 'crime', 'psychological'],
    status: 'Want to Read',
  },

  // Contemporary Fiction
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    tags: ['fiction', 'philosophical', 'inspirational'],
    status: 'Completed',
  },
  {
    title: 'Life of Pi',
    author: 'Yann Martel',
    tags: ['fiction', 'adventure', 'philosophical'],
    status: 'Reading',
  },
  {
    title: 'The Kite Runner',
    author: 'Khaled Hosseini',
    tags: ['fiction', 'historical', 'afghanistan'],
    status: 'Completed',
  },
  {
    title: 'A Thousand Splendid Suns',
    author: 'Khaled Hosseini',
    tags: ['fiction', 'historical', 'afghanistan'],
    status: 'Want to Read',
  },
  {
    title: 'The Book Thief',
    author: 'Markus Zusak',
    tags: ['fiction', 'historical', 'wwii'],
    status: 'Reading',
  },

  // Non-Fiction
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    tags: ['non-fiction', 'history', 'anthropology'],
    status: 'Completed',
  },
  {
    title: 'The Diary of a Young Girl',
    author: 'Anne Frank',
    tags: ['non-fiction', 'memoir', 'wwii'],
    status: 'Completed',
  },
  {
    title: 'Educated',
    author: 'Tara Westover',
    tags: ['non-fiction', 'memoir', 'inspirational'],
    status: 'Reading',
  },

  // Young Adult
  {
    title: "Harry Potter and the Sorcerer's Stone",
    author: 'J.K. Rowling',
    tags: ['ya', 'fantasy', 'magic'],
    status: 'Completed',
  },
  {
    title: 'The Hunger Games',
    author: 'Suzanne Collins',
    tags: ['ya', 'dystopian', 'sci-fi'],
    status: 'Reading',
  },
  {
    title: 'Twilight',
    author: 'Stephenie Meyer',
    tags: ['ya', 'romance', 'fantasy'],
    status: 'Want to Read',
  },
  {
    title: 'The Fault in Our Stars',
    author: 'John Green',
    tags: ['ya', 'romance', 'drama'],
    status: 'Completed',
  },
  {
    title: 'Divergent',
    author: 'Veronica Roth',
    tags: ['ya', 'dystopian', 'sci-fi'],
    status: 'Want to Read',
  },
];

// --------------------- Insert Data Function ---------------------
async function insertSampleData() {
  try {
    // Clear existing data (optional)
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create a test user
    const hashedPassword = await bcrypt.hash('123456', 10);
    const user = new User({
      name: 'Swapnil Kadam',
      email: 'swapnil@gmail.com',
      password: hashedPassword,
    });
    await user.save();
    console.log(`👤 Created user: ${user.name} (${user.email})`);

    // Insert books for the user
    const booksWithUser = sampleBooks.map((book) => ({
      ...book,
      userId: user._id,
    }));

    const insertedBooks = await Book.insertMany(booksWithUser);
    console.log(`📚 Inserted ${insertedBooks.length} books for user ${user.name}`);

    // Display summary
    const stats = {
      total: insertedBooks.length,
      wantToRead: insertedBooks.filter((b) => b.status === 'Want to Read').length,
      reading: insertedBooks.filter((b) => b.status === 'Reading').length,
      completed: insertedBooks.filter((b) => b.status === 'Completed').length,
    };

    console.log('\n📊 Summary:');
    console.log(`Total Books: ${stats.total}`);
    console.log(`📖 Want to Read: ${stats.wantToRead}`);
    console.log(`📘 Reading: ${stats.reading}`);
    console.log(`✅ Completed: ${stats.completed}`);

    // Show all books by category
    console.log('\n📚 Book List:');
    const categories = {
      'Classic Literature': insertedBooks.slice(0, 7),
      'Science Fiction & Fantasy': insertedBooks.slice(7, 14),
      'Mystery & Thriller': insertedBooks.slice(14, 18),
      'Contemporary Fiction': insertedBooks.slice(18, 23),
      'Non-Fiction': insertedBooks.slice(23, 26),
      'Young Adult': insertedBooks.slice(26, 31),
    };

    Object.entries(categories).forEach(([category, books]) => {
      console.log(`\n${category}:`);
      books.forEach((book, index) => {
        console.log(`  ${index + 1}. ${book.title} by ${book.author} (${book.status})`);
      });
    });

    console.log('\n✅ Sample data inserted successfully!');
    console.log(`\n🔑 Login credentials:`);
    console.log(`Email: swapnil@gmail.com`);
    console.log(`Password: 123456`);
    console.log(`\n🌐 Now start your backend and frontend to see the books!`);

    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
    await mongoose.connection.close();
  }
}