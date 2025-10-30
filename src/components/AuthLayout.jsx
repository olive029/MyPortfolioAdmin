// src/components/AuthLayout.jsx
import React from 'react';
import AnimatedBackground from './AnimatedBackground';

const AuthLayout = ({ children }) => {
  return (
    <div style={styles.pageContainer}>
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Auth Content */}
      <div style={styles.contentContainer}>
        {children}
      </div>
    </div>
  );
};

const styles = {
  
  contentContainer: {
    position: 'relative',
    zIndex: 1,
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  }
};

export default AuthLayout;