// Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;
      
      console.log('✅ Login successful:', user);
      
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminEmail', user.email);
      localStorage.setItem('adminUID', user.uid);
      
      navigate('/dashboard');
       
    } catch (error) {
      console.error('❌ Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
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
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password.';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      position:'fixed',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      minHeight: '100vh',
      width: '100%',
      padding: '30px 20px'
    },
    header: {
      textAlign: 'center',
      marginBottom: '40px',
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
      width: '100%',
      maxWidth: '1200px',
      minHeight: '450px',
      backgroundColor: 'rgba(60, 126, 226, 0.15)',
      borderRadius: '30px',
      padding: '40px 50px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(60, 126, 226, 0.3)',
      margin: '0 auto'
    },
    formContainer: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '50px 30px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '650px',
      margin: '0 auto'
    },
    formHeader: {
      fontSize: '40px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '30px',
      textAlign: 'center'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '25px'
    },
    inputRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '30px',
      width: '100%',
      marginBottom: '5px'
    },
    label: {
      fontSize: '17px',
      fontWeight: '600',
      color: '#374151',
      width: '160px',
      textAlign: 'left',
      flexShrink: 0
    },
    inputGroup: {
      flex: 1,
      display: 'flex',
      minWidth: '380px'
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
    buttonContainer: {
      display: 'flex',
      justifyContent: 'flex-start',
      marginTop: '15px',
      width: '100%',
      marginLeft: '190px'
    },
    button: {
      width: '400px',
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
      marginTop: '15px',
      marginLeft: '190px',
      width: '380px'
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
      <div style={styles.container}>
        {/* Header at the top center */}
        <div style={styles.header}>
          <h1 style={styles.mainTitle}>MyPortfolioAdmin</h1>
        </div>

        {/* Main Content Container */}
        <div style={styles.contentContainer}>
          {/* Login Form in White Container */}
          <div style={styles.formContainer}>
            {/* Login Header inside the form container */}
            <h2 style={styles.formHeader}>SIGN IN</h2>

            {error && (
              <div style={styles.errorMessage}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputRow}>
                <label style={styles.label}>Email</label>
                <div style={styles.inputGroup}>
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
              </div>

              <div style={styles.inputRow}>
                <label style={styles.label}>Password</label>
                <div style={styles.inputGroup}>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="••••••"
                    required
                    disabled={loading}
                    onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                    onBlur={(e) => Object.assign(e.target.style, styles.input)}
                  />
                </div>
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
                  {loading ? 'SIGNING IN...' : 'SIGN  IN'}
                </button>
              </div>

              {/* Signup Link - Aligned with button */}
              <div style={styles.signupLink}>
                <span style={{ color: '#6b7280' }}>
                  Don't have an account?{' '}
                </span>
                <Link 
                  to="/signup" 
                  style={styles.link}
                  onMouseOver={(e) => Object.assign(e.target.style, styles.linkHover)}
                  onMouseOut={(e) => Object.assign(e.target.style, styles.link)}
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
