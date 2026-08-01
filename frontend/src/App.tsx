import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Login } from './components/Login';
import {  } from "./components/Login";
import { Signup } from './components/Signup';
import { Dashboard } from './Dashboard/Dashboard';
import './styles/globals.css';

const AppContent: React.FC = () => {
  const { token } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (!token) {
    return isLogin ? (
      <Login onSwitch={() => setIsLogin(false)} />
    ) : (
      <Signup onSwitch={() => setIsLogin(true)} />
    );
  }

  return <Dashboard />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;