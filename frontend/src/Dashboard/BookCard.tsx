import React from 'react';
import type { Book } from '../types/index';

interface BookCardProps {
  book: Book;
  onEdit: (book: Book) => void;
  onDelete: (id: string) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete }) => {
  const statusConfig = {
    'Want to Read': { className: 'status-want', icon: '📖' },
    'Reading': { className: 'status-reading', icon: '📘' },
    'Completed': { className: 'status-completed', icon: '✅' },
  }[book.status];

  return (
    <div className="book-card animate-fadeInUp">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="book-title line-clamp-1">{book.title}</div>
          <div className="book-author">by {book.author}</div>
        </div>
        <span className={`status-badge ${statusConfig.className}`}>
          {statusConfig.icon} {book.status}
        </span>
      </div>
      <div className="flex flex-wrap gap-1 mt-3">
        {book.tags.map((tag, idx) => (
          <span key={idx} className="book-tag">#{tag}</span>
        ))}
      </div>
      <div className="book-actions">
        <button onClick={() => onEdit(book)} className="book-action-btn edit">
          ✏️ Edit
        </button>
        <button onClick={() => onDelete(book._id)} className="book-action-btn delete">
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};