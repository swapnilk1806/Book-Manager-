import React, { useState, useEffect } from 'react';
import type { Book, BookForm } from '../types/index';

interface BookModalProps {
  isOpen: boolean;
  book: Book | null;
  onClose: () => void;
  onSave: (data: BookForm) => void;
  loading: boolean;
}

export const BookModal: React.FC<BookModalProps> = ({ isOpen, book, onClose, onSave, loading }) => {
  const [form, setForm] = useState<BookForm>({
    title: '',
    author: '',
    tags: '',
    status: 'Want to Read',
  });

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title,
        author: book.author,
        tags: book.tags.join(', '),
        status: book.status,
      });
    }
  }, [book]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>✏️ Edit Book</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Book Title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1">Author</label>
              <input
                type="text"
                name="author"
                placeholder="Author"
                value={form.author}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1">Tags</label>
              <input
                type="text"
                name="tags"
                placeholder="Tags (comma separated)"
                value={form.tags}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1">Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="Want to Read">📖 Want to Read</option>
                <option value="Reading">📘 Reading</option>
                <option value="Completed">✅ Completed</option>
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? '...' : 'Update Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};