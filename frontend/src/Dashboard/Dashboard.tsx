import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBooks } from '../hooks/useBooks';
import type{ Book } from '..//types';
import { Navbar } from '../Layout/Navbar';
import { StatsCard } from './StatsCard';
import { BookCard } from './BookCard';
import { BookModal } from './BookModal';

export const Dashboard: React.FC = () => {
 useAuth();
  const { books, stats, loading, fetchDashboard, fetchBooks, addBook, updateBook, deleteBook } = useBooks();
  const [statusFilter, setStatusFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    tags: '',
    status: 'Want to Read' as const,
  });

  useEffect(() => {
    fetchDashboard();
  }, []);

  useEffect(() => {
    fetchBooks(statusFilter, tagFilter);
  }, [statusFilter, tagFilter]);

  const filteredBooks = books.filter(book => {
    const searchLower = searchTerm.toLowerCase().trim();
    if (!searchLower) return true;
    return (
      book.title.toLowerCase().includes(searchLower) ||
      book.author.toLowerCase().includes(searchLower) ||
      book.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = bookForm.tags.split(',').map(t => t.trim()).filter(Boolean);
    await addBook({
      title: bookForm.title,
      author: bookForm.author,
      tags: tagsArray,
      status: bookForm.status,
    });
    setBookForm({ title: '', author: '', tags: '', status: 'Want to Read' });
    fetchDashboard();
  };

  const handleUpdateBook = async (formData: any) => {
    if (!editingBook) return;
    const tagsArray = formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    await updateBook(editingBook._id, {
      title: formData.title,
      author: formData.author,
      tags: tagsArray,
      status: formData.status,
    });
    setIsModalOpen(false);
    setEditingBook(null);
    fetchDashboard();
  };

  const handleDeleteBook = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    await deleteBook(id);
    fetchDashboard();
  };

  return (
    <div className="min-h-screen shimmer-bg">
      <Navbar />
      <main className="container py-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <StatsCard label="Total Books" value={stats.totalBooks} icon="📚" delay="0ms" />
          <StatsCard label="Want to Read" value={stats.wantToRead} icon="📖" color="#d97706" delay="100ms" />
          <StatsCard label="Reading" value={stats.reading} icon="📘" color="#7c3aed" delay="200ms" />
          <StatsCard label="Completed" value={stats.completed} icon="✅" color="#059669" delay="300ms" />
        </div>

        {/* Add Book Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-semibold text-lg text-gray-800 mb-4">➕ Add New Book</h3>
          <form onSubmit={handleAddBook}>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Book Title"
                value={bookForm.title}
                onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Author"
                value={bookForm.author}
                onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Tags (comma separated)"
                value={bookForm.tags}
                onChange={(e) => setBookForm({ ...bookForm, tags: e.target.value })}
              />
            </div>
            <div className="flex gap-3 mt-4">
              <select
                value={bookForm.status}
                onChange={(e) => setBookForm({ ...bookForm, status: e.target.value as any })}
                style={{ width: 'auto', minWidth: '160px' }}
              >
                <option value="Want to Read">📖 Want to Read</option>
                <option value="Reading">📘 Reading</option>
                <option value="Completed">✅ Completed</option>
              </select>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? '...' : 'Add Book'}
              </button>
            </div>
          </form>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '140px' }}
          >
            <option value="">All Status</option>
            <option value="Want to Read">📖 Want to Read</option>
            <option value="Reading">📘 Reading</option>
            <option value="Completed">✅ Completed</option>
          </select>
          <input
            type="text"
            placeholder="Filter by tag"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '140px' }}
          />
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by title, author, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={() => { setStatusFilter(''); setTagFilter(''); setSearchTerm(''); }}
            className="btn-secondary"
          >
            Clear All
          </button>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-500 mb-4">
          Showing {filteredBooks.length} of {books.length} books
          {searchTerm && ` (filtered by "${searchTerm}")`}
        </div>

        {/* Book List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin" style={{ fontSize: '2rem' }}>⟳</div>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
            <p className="text-gray-500">
              {searchTerm ? `No books found matching "${searchTerm}"` : 'No books found. Start your collection by adding a book above!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {filteredBooks.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                onEdit={(book) => { setEditingBook(book); setIsModalOpen(true); }}
                onDelete={handleDeleteBook}
              />
            ))}
          </div>
        )}
      </main>

      <BookModal
        isOpen={isModalOpen}
        book={editingBook}
        onClose={() => { setIsModalOpen(false); setEditingBook(null); }}
        onSave={handleUpdateBook}
        loading={loading}
      />
    </div>
  );
};