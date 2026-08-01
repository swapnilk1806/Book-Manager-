import { useState } from 'react';
import type { Book, DashboardStats } from '../types';
import { api } from '../services/api';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalBooks: 0,
    wantToRead: 0,
    reading: 0,
    completed: 0,
    books: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get<DashboardStats>('/dashboard');
      console.log('Dashboard data:', res.data); // Debug log
      setStats(res.data);
      setBooks(res.data.books || []);
    } catch (err: any) {
      console.error('Error fetching dashboard:', err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch dashboard');
      if (err.response?.status === 401) {
        // Handle unauthorized - logout user
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async (statusFilter?: string, tagFilter?: string) => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (tagFilter) params.tag = tagFilter;
      const res = await api.get<Book[]>('/books', { params });
      console.log('Books data:', res.data); // Debug log
      setBooks(res.data);
    } catch (err: any) {
      console.error('Error fetching books:', err);
      setError(err.response?.data?.error || err.message || 'Failed to fetch books');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (bookData: any) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post<Book>('/books', bookData);
      setBooks([res.data, ...books]);
      return res.data;
    } catch (err: any) {
      console.error('Error adding book:', err);
      setError(err.response?.data?.error || err.message || 'Failed to add book');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateBook = async (id: string, bookData: any) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.put<Book>(`/books/${id}`, bookData);
      setBooks(books.map(b => b._id === id ? res.data : b));
      return res.data;
    } catch (err: any) {
      console.error('Error updating book:', err);
      setError(err.response?.data?.error || err.message || 'Failed to update book');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id: string) => {
    setLoading(true);
    setError('');
    try {
      await api.delete(`/books/${id}`);
      setBooks(books.filter(b => b._id !== id));
    } catch (err: any) {
      console.error('Error deleting book:', err);
      setError(err.response?.data?.error || err.message || 'Failed to delete book');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    books,
    stats,
    loading,
    error,
    fetchDashboard,
    fetchBooks,
    addBook,
    updateBook,
    deleteBook,
  };
};