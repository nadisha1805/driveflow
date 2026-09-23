import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('driveflow_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user from local storage:', error);
        localStorage.removeItem('driveflow_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simple validation
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // In a real app, this would be an API call
    // We'll simulate fetching a user or checking credentials
    
    // For demo purposes, we will accept any valid-looking login 
    // unless they use 'fail@test.com'
    if (email === 'fail@test.com') {
      throw new Error('Invalid credentials');
    }

    const userData = {
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      name: email.split('@')[0],
      email,
      phone: '555-0198',
    };

    setUser(userData);
    localStorage.setItem('driveflow_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (name, email, password) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    if (!name || !email || !password) {
      throw new Error('All fields are required');
    }

    const userData = {
      id: 'u_' + Math.random().toString(36).substr(2, 9),
      name,
      email,
      phone: '',
    };

    setUser(userData);
    localStorage.setItem('driveflow_user', JSON.stringify(userData));
    return userData;
  };

  const updateProfile = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('driveflow_user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('driveflow_user');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
