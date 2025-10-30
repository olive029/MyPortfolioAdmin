// context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { 
  onAuthStateChanged, 
  signOut, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0]
        };
        setUser(userData);
        
        // Sync with localStorage
        localStorage.setItem('isAdmin', 'true');
        localStorage.setItem('adminEmail', user.email);
        localStorage.setItem('adminUID', user.uid);
        localStorage.setItem('adminName', userData.name);
      } else {
        setUser(null);
        // Clear localStorage on logout
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminUID');
        localStorage.removeItem('adminName');
        localStorage.removeItem('rememberMe');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Login method
  const login = async (email, password, rememberMe = false) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Signup method
  const signup = async (email, password, fullName = '') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};