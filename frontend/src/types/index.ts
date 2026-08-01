export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Book {
  _id: string;
  title: string;
  author: string;
  tags: string[];
  status: 'Want to Read' | 'Reading' | 'Completed';
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  totalBooks: number;
  wantToRead: number;
  reading: number;
  completed: number;
  books: Book[];
}

export interface AuthForm {
  name: string;
  email: string;
  password: string;
}

export interface BookForm {
  title: string;
  author: string;
  tags: string;
  status: 'Want to Read' | 'Reading' | 'Completed';
}