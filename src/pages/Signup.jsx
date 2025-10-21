// Signup.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  // Inline styles - same as Login page
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      position: 'relative'    
    },
    header: {
      textAlign: 'center',
      marginBottom: '50px'
    },
    mainTitle: {
      fontSize: '52px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '8px'
    },
    contentContainer: {
      display: 'flex',
      gap: '80px',
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: '900px',
      width: '100%',
      backgroundColor: 'rgba(60, 126, 226, 0.15)', // 15% opacity of #3C7EE2
      borderRadius: '25px',
      padding: '60px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(60, 126, 226, 0.3)'
    },
    formContainer: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '50px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      minWidth: '450px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '30px'
    },
    inputRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '25px'
    },
    label: {
      fontSize: '16px',
      fontWeight: '500',
      color: '#374151',
      minWidth: '150px' // Wider for longer labels
    },
    input: {
      flex: 1,
      padding: '16px 20px',
      border: '1px solid #d1d5db',
      borderRadius: '10px',
      fontSize: '16px',
      outline: 'none',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      minWidth: '300px' // Same width as sign up button
    },
    inputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    button: {
      width: '100%',
      backgroundColor: '#3C7EE2',
      color: 'white',
      padding: '18px',
      border: 'none',
      borderRadius: '10px',
      fontSize: '17px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '25px',
      minWidth: '300px'
    },
    loginLink: {
      textAlign: 'center',
      fontSize: '15px',
      color: '#6b7280',
      marginTop: '25px'
    },
    link: {
      color: '#3C7EE2',
      fontWeight: '600',
      textDecoration: 'none'
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Main Header - Outside container */}
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>MyPortfolioAdmin</h1>
      </div>

      {/* Main Content Container - Light Blue (15% opacity) */}
      <div style={styles.contentContainer}>
        {/* Signup Form in White Container - Centered */}
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Full Name Input - Side by side */}
            <div style={styles.inputRow}>
              <label style={styles.label}>Full Name</label>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={handleChange}
                style={styles.input}
                placeholder="Your full name"
                required
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>

            {/* Email Input - Side by side */}
            <div style={styles.inputRow}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
                placeholder="your@email.com"
                required
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>

            {/* Password Input - Side by side */}
            <div style={styles.inputRow}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                placeholder="******"
                required
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>

            {/* Confirm Password Input - Side by side */}
            <div style={styles.inputRow}>
              <label style={styles.label}>Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                style={styles.input}
                placeholder="******"
                required
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>

            {/* Submit Button - Full width blue */}
            <button
              type="submit"
              style={styles.button}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2D6CD0'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3C7EE2'}
            >
              SIGN UP
            </button>

            {/* Login Link */}
            <div style={styles.loginLink}>
              <Link to="/login" style={styles.link}>
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;