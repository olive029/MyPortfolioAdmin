// Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Form validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      // Firebase user creation
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;
      
      console.log('✅ Signup successful:', user);
      
      // Store user data in localStorage
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminEmail', user.email);
      localStorage.setItem('adminUID', user.uid);
      localStorage.setItem('adminName', formData.fullName);
      
      // Show success and redirect to login
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
       
    } catch (error) {
      console.error('❌ Signup error:', error);
      let errorMessage = 'Signup failed. Please try again.';
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled.';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Inline styles - same as Login page
  const styles = {
    // ... your existing styles remain the same ...
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
      backgroundColor: 'rgba(60, 126, 226, 0.15)',
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
      minWidth: '150px'
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
      minWidth: '300px'
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
          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => Object.assign(e.target.style, styles.input)}
              />
            </div>

            {/* Submit Button - Full width blue */}
            <button
              type="submit"
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
              onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#2D6CD0')}
              onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#3C7EE2')}
            >
              {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
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