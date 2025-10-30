// Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Firebase authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      console.log('✅ Login successful:', user);
      
      // Store login state
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminEmail', user.email);
      localStorage.setItem('adminUID', user.uid);
      
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      // Redirect to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('❌ Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      // Handle specific Firebase auth errors
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled.';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password.';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Inline styles
  const styles = {
    header: {
      textAlign: 'center',
      marginBottom: '50px',
      width: '100%'
    },
    mainTitle: {
      fontSize: '52px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '0',
      textAlign: 'center'
    },
    contentContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      maxWidth: '1200px',
      width: '100%',
      backgroundColor: 'rgba(60, 126, 226, 0.15)',
      borderRadius: '30px',
      padding: '80px 60px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(60, 126, 226, 0.3)'
    },
    formContainer: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '60px 50px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      width: '100%',
      minWidth: '550px',
      maxWidth: '600px'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '30px'
    },
    inputRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '30px',
      width: '100%'
    },
    label: {
      fontSize: '17px',
      fontWeight: '600',
      color: '#374151',
      width: '140px',
      textAlign: 'left',
      flexShrink: 0
    },
    inputGroup: {
      flex: 1,
      display: 'flex',
      minWidth: '350px'
    },
    input: {
      flex: 1,
      padding: '16px 18px',
      border: '1px solid #d1d5db',
      borderRadius: '10px',
      fontSize: '16px',
      outline: 'none',
      boxSizing: 'border-box',
      backgroundColor: 'white',
      minWidth: '100%',
      transition: 'all 0.2s ease'
    },
    inputFocus: {
      borderColor: '#3b82f6',
      boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
    },
    options: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '15px',
      marginLeft: '170px',
      width: '350px'
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer'
    },
    checkbox: {
      width: '20px',
      height: '20px',
      accentColor: '#2563eb'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-start',
      marginTop: '20px',
      marginLeft: '170px',
      width: '350px'
    },
    button: {
      width: '100%',
      backgroundColor: '#3C7EE2',
      color: 'white',
      padding: '16px',
      border: 'none',
      borderRadius: '10px',
      fontSize: '17px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    signupLink: {
      textAlign: 'left',
      fontSize: '16px',
      color: '#6b7280',
      marginTop: '25px',
      marginLeft: '170px',
      width: '350px'
    },
    link: {
      color: '#3C7EE2',
      fontWeight: '600',
      textDecoration: 'none',
      fontSize: '16px',
      transition: 'color 0.2s ease'
    },
    errorMessage: {
      backgroundColor: '#fee2e2',
      border: '1px solid #fecaca',
      color: '#dc2626',
      padding: '16px',
      borderRadius: '10px',
      marginBottom: '25px',
      fontSize: '15px',
      textAlign: 'center'
    },
    linkHover: {
      color: '#2563eb'
    }
  };

  return (
    <AuthLayout>
      {/* Header outside the container */}
      <div style={styles.header}>
        <h1 style={styles.mainTitle}>MyPortfolioAdmin</h1>
      </div>

      {/* Main Content Container */}
      <div style={styles.contentContainer}>
        {/* Login Form in White Container */}
        <div style={styles.formContainer}>
          {/* Error Message */}
          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Email Input */}
            <div style={styles.inputRow}>
              <label style={styles.label}>Email</label>
              <div style={styles.inputGroup}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={styles.input}
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                />
              </div>
            </div>

            {/* Password Input */}
            <div style={styles.inputRow}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputGroup}>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                  placeholder="••••••"
                  required
                  disabled={loading}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, styles.input)}
                />
              </div>
            </div>

            {/* Options - Remember Me */}
            <div style={styles.options}>
              <label style={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={styles.checkbox}
                  disabled={loading}
                />
                <span style={{ fontSize: '16px', color: '#374151' }}>Remember me</span>
              </label>
            </div>

            {/* Submit Button - Aligned with input fields */}
            <div style={styles.buttonContainer}>
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
                {loading ? 'SIGNING IN...' : 'SIGN IN'}
              </button>
            </div>

            {/* Signup Link - Aligned with input fields */}
            <div style={styles.signupLink}>
              <Link 
                to="/signup" 
                style={styles.link}
                onMouseOver={(e) => Object.assign(e.target.style, styles.linkHover)}
                onMouseOut={(e) => Object.assign(e.target.style, styles.link)}
              >
                Don't have an account?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;