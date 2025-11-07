// Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import AuthLayout from '../components/AuthLayout';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      const user = userCredential.user;
      
      console.log('✅ Signup successful:', user);
      
      localStorage.setItem('isAdmin', 'true');
      localStorage.setItem('adminEmail', user.email);
      localStorage.setItem('adminUID', user.uid);
      localStorage.setItem('adminName', formData.fullName);
      
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
       
    } catch (error) {
      console.error('❌ Signup error:', error);
      let errorMessage = 'Signup failed. Please try again.';
      
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
      minHeight: '500px',
      backgroundColor: 'rgba(60, 126, 226, 0.15)',
      borderRadius: '30px',
      padding: '50px 40px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      border: '1px solid rgba(60, 126, 226, 0.3)',
      margin: '0 auto'
    },
    formContainer: {
      backgroundColor: 'white',
      borderRadius: '20px',
      padding: '60px 50px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '650px',
      margin: '0 auto'
    },
    formHeader: {
      fontSize: '34px',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '35px',
      textAlign: 'center'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '30px'
    },
    inputRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '30px',
      width: '100%'
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
      justifyContent: 'center',
      marginTop: '25px',
      width: '100%'
    },
    button: {
      width: '100%',
      maxWidth: '400px',
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
    loginLink: {
      textAlign: 'center',
      fontSize: '16px',
      color: '#6b7280',
      marginTop: '25px',
      width: '100%'
    },
    link: {
      color: '#3C7EE2',
      fontWeight: '600',
      textDecoration: 'none',
      fontSize: '16px',
      transition: 'color 0.2s ease'
    },
    successMessage: {
      backgroundColor: '#d1fae5',
      border: '1px solid #a7f3d0',
      color: '#065f46',
      padding: '16px',
      borderRadius: '10px',
      marginBottom: '25px',
      fontSize: '15px',
      textAlign: 'center'
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
          {/* Signup Form in White Container */}
          <div style={styles.formContainer}>
            {/* Create Account Header inside the form container */}
            <h2 style={styles.formHeader}>Create Account</h2>

            {isSuccess && (
              <div style={styles.successMessage}>
                ✅ Account created successfully! Redirecting to login...
              </div>
            )}

            {error && !isSuccess && (
              <div style={styles.errorMessage}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.inputRow}>
                <label style={styles.label}>Full Name</label>
                <div style={styles.inputGroup}>
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
              </div>

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

              <div style={styles.inputRow}>
                <label style={styles.label}>Confirm Password</label>
                <div style={styles.inputGroup}>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={formData.confirmPassword}
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

              {/* Submit Button - Centered */}
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
                  {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
                </button>
              </div>

              {/* Login Link - Centered */}
              <div style={styles.loginLink}>
                <Link 
                  to="/login" 
                  style={styles.link}
                  onMouseOver={(e) => Object.assign(e.target.style, styles.linkHover)}
                  onMouseOut={(e) => Object.assign(e.target.style, styles.link)}
                >
                  Back to login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Signup;
