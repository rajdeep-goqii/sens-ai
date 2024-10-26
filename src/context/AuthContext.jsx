// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call
    try {
      // In a real app, this would be an API call
      if (email && password) {
        const dummyToken = `dummy-token-${Math.random().toString(36).substring(7)}`;
        const dummyUser = {
          id: Math.random().toString(36).substring(7),
          name: email.split('@')[0],
          email,
        };

        // Store token and user data
        localStorage.setItem('token', dummyToken);
        localStorage.setItem('user', JSON.stringify(dummyUser));
        setUser(dummyUser);
        return { success: true };
      }
      throw new Error('Invalid credentials');
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      // Simulate API call
      if (name && email && password) {
        const dummyToken = `dummy-token-${Math.random().toString(36).substring(7)}`;
        const dummyUser = {
          id: Math.random().toString(36).substring(7),
          name,
          email,
        };

        // Store token and user data
        localStorage.setItem('token', dummyToken);
        localStorage.setItem('user', JSON.stringify(dummyUser));
        setUser(dummyUser);
        return { success: true };
      }
      throw new Error('Invalid input');
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};