import React from 'react';
import { useAuth  } from "../contexts/AuthContext";

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '1.5rem' }}>📚</span>
          <span style={{ fontWeight: 700, fontSize: '1.25rem', color: '#1a1a2e' }}>
            BookManager
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">👋 {user?.name}</span>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};