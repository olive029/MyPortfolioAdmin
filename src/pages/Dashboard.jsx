// Dashboard.jsx - With inline styles
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, orderBy, query, addDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');

  // New state for modal and form
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Character limits
  const nameCharLimit = 35;
  const messageCharLimit = 100;

  // Modal handlers
  const openModal = () => setShowModal(true);
  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', email: '', phone: '', message: '' });
    setFormErrors({});
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Apply character limits
    if (name === 'name' && value.length > nameCharLimit) return;
    if (name === 'message' && value.length > messageCharLimit) return;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Full name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.message.trim()) errors.message = 'Enquiry message is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      // Add new enquiry to Firestore
      const newEnquiry = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || '',
        message: formData.message,
        timestamp: new Date()
      };
      
      const docRef = await addDoc(collection(db, 'enquiries'), newEnquiry);
      console.log('Enquiry submitted successfully:', docRef.id);
      
      // Add the new enquiry to the local state
      setEnquiries(prev => [{
        id: docRef.id,
        ...newEnquiry
      }, ...prev]);
      
      closeModal();
      
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setFormErrors({ submit: 'Failed to submit enquiry. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch enquiries from Firestore
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        console.log('Fetching enquiries from Firestore...');
        
        let enquiriesQuery;
        
        if (sortBy === 'date') {
          enquiriesQuery = query(
            collection(db, 'enquiries'), 
            orderBy('timestamp', 'desc')
          );
        } else {
          enquiriesQuery = query(
            collection(db, 'enquiries'), 
            orderBy('name', 'asc')
          );
        }
        
        const enquirySnapshot = await getDocs(enquiriesQuery);
        console.log('Found', enquirySnapshot.docs.length, 'enquiries');
        
        const enquiriesList = enquirySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setEnquiries(enquiriesList);
      } catch (error) {
        console.error('Error fetching enquiries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnquiries();
  }, [sortBy]);

  // Filter enquiries based on search query
  const filteredEnquiries = enquiries.filter(enquiry => 
    enquiry.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enquiry.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enquiry.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date - improved error handling
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Today';
    
    try {
      const now = new Date();
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      
      if (isNaN(date.getTime())) return 'Today';
      
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) return 'Today';
      if (diffDays === 2) return 'Yesterday';
      if (diffDays <= 7) {
        return date.toLocaleDateString('en-US', { weekday: 'long' });
      }
      
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Today';
    }
  };

  // Format time - improved error handling
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      
      if (isNaN(date.getTime())) return '';
      
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).toUpperCase();
    } catch (error) {
      console.error('Time formatting error:', error);
      return '';
    }
  };

  // Inline styles for Dashboard
  const styles = {
    pageContainer: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#f9fafb'
    },
    topNav: {
      width: '100%',
      backgroundColor: 'rgba(60, 126, 226, 0.2)',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      borderBottom: '1px solid rgba(60, 126, 226, 0.1)',
      padding: '16px 24px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000
    },
    topNavContent: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      maxWidth: '100%'
    },
    logoContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    logoTitle: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#111827',
      letterSpacing: '-0.025em'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    userAvatar: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    avatar: {
      width: '40px',
      height: '40px',
      backgroundColor: '#3C7EE2',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '16px',
      fontWeight: '600'
    },
    userText: {
      textAlign: 'left'
    },
    userName: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#111827',
      margin: 0,
      lineHeight: '1.2'
    },
    userEmail: {
      fontSize: '14px',
      color: '#111827',
      fontWeight: '500',
      margin: 0,
      lineHeight: '1.2'
    },
    logoutContainer: {
      backgroundColor: 'white',
      padding: '8px 16px',
      borderRadius: '6px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    logoutButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: 0,
      color: '#374151',
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      textDecoration: 'none'
    },
    mainContainer: {
      display: 'flex',
      flex: 1,
      overflow: 'hidden',
      marginTop: '73px'
    },
    sidebar: {
      width: '220px',
      backgroundColor: 'rgba(60, 126, 226, 0.2)',
      boxShadow: '4px 0 6px -1px rgba(0, 0, 0, 0.1), 2px 0 4px -1px rgba(0, 0, 0, 0.06)',
      borderRight: '1px solid rgba(60, 126, 226, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0,
      top: '73px',
      bottom: 0,
      zIndex: 900
    },
    sidebarContent: {
      padding: '32px 20px 20px 20px',
      flex: 1
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '16px',
      color: '#3C7EE2',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: 'none',
      marginBottom: '8px',
      width: '100%',
      boxSizing: 'border-box',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    navItemHover: {
      boxShadow: '0 6px 10px -1px rgba(0, 0, 0, 0.15), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    navText: {
      fontWeight: '700',
      fontSize: '16px',
      color: '#3C7EE2'
    },
    mainContent: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      marginLeft: '220px'
    },
    header: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '32px 24px 24px 24px',
      marginTop: '0'
    },
    welcomeText: {
      fontSize: '32px',
      fontWeight: '800',
      color: '#111827',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '16px',
      fontWeight: '600'
    },
    mainArea: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      padding: '24px'
    },
    controlsContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      gap: '16px',
      flexShrink: 0
    },
    filtersContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
      flex: 1
    },
    filterGroup: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    filterLabel: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#374151',
      whiteSpace: 'nowrap'
    },
    filterButtons: {
      display: 'flex',
      gap: '12px'
    },
    filterButton: {
      padding: '14px 28px',
      fontSize: '16px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      color: '#374151',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontWeight: '600',
      minWidth: '140px',
      textAlign: 'center',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    filterButtonActive: {
      backgroundColor: '#3C7EE2',
      color: 'white',
      borderColor: '#3C7EE2'
    },
    searchInput: {
      width: '100%',
      maxWidth: '320px',
      padding: '14px 18px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      fontWeight: '500'
    },
    newButtonContainer: {
      display: 'flex',
      justifyContent: 'flex-end'
    },
    newButton: {
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '14px 28px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s',
      minWidth: '140px'
    },
    newButtonHover: {
      backgroundColor: '#059669'
    },

    // Modal Styles - White background, no blue header
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000
    },
    modalContainer: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '0',
      width: '700px',
      maxWidth: '90vw',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
    },
    modalHeader: {
      padding: '30px 30px 20px 30px',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: 'white'
    },
    modalTitle: {
      fontSize: '32px',
      fontWeight: '800',
      color: '#111827',
      margin: 0,
      textAlign: 'center'
    },
    modalBody: {
      padding: '30px',
      backgroundColor: 'white'
    },
    formRow: {
      display: 'flex',
      gap: '20px',
      marginBottom: '25px',
      alignItems: 'flex-start'
    },
    formGroup: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    formLabel: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#374151',
      minWidth: '150px',
      textAlign: 'right'
    },
    formInputContainer: {
      flex: 1
    },
    formInput: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'all 0.2s',
      backgroundColor: 'white'
    },
    formInputFocus: {
      borderColor: '#3C7EE2',
      boxShadow: '0 0 0 3px rgba(60, 126, 226, 0.1)'
    },
    textArea: {
      resize: 'vertical',
      minHeight: '120px',
      fontFamily: 'inherit'
    },
    charCount: {
      fontSize: '12px',
      color: '#6b7280',
      textAlign: 'right',
      marginTop: '4px'
    },
    charCountWarning: {
      color: '#dc2626'
    },
    modalFooter: {
      padding: '20px 30px 30px 30px',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-between',
      gap: '20px'
    },
    cancelButton: {
      padding: '12px 35px',
      backgroundColor: '#dc2626',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.2s',
      minWidth: '140px',
      textAlign: 'center'
    },
    cancelButtonHover: {
      backgroundColor: '#b91c1c'
    },
    submitButton: {
      padding: '12px 35px',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.2s',
      minWidth: '140px',
      textAlign: 'center'
    },
    submitButtonHover: {
      backgroundColor: '#059669'
    },
    submitButtonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },

    // UPDATED Table Styles - Much wider to fit all headers without scrolling
    tableSection: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      minHeight: 0
    },
    tableContainer: {
      backgroundColor: 'rgba(60, 126, 226, 0.1)',
      borderRadius: '12px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(60, 126, 226, 0.2)',
      overflow: 'hidden',
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    tableWrapper: {
      flex: 1,
      overflow: 'auto'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '1600px', // Increased from 1400px to 1600px for better fit
      tableLayout: 'fixed' // Use fixed layout for consistent column widths
    },
    tableHeader: {
      backgroundColor: 'rgba(60, 126, 226, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    },
    tableHeaderCell: {
      padding: '24px 20px',
      textAlign: 'left',
      fontSize: '16px',
      fontWeight: '700',
      color: 'white',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      borderBottom: '2px solid rgba(60, 126, 226, 0.3)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    tableRow: {
      borderBottom: '1px solid rgba(60, 126, 226, 0.1)',
      transition: 'background-color 0.2s',
      backgroundColor: 'white'
    },
    tableCell: {
      padding: '22px 20px',
      fontSize: '15px',
      verticalAlign: 'top',
      lineHeight: '1.5',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    // UPDATED Column width definitions - Much wider percentages to fill the space
    nameCell: {
      fontWeight: '600',
      color: '#111827',
      whiteSpace: 'nowrap',
      width: '20%', // Increased from 18%
      minWidth: '200px'
    },
    dateCell: {
      color: '#6b7280',
      whiteSpace: 'nowrap',
      fontWeight: '500',
      width: '15%', // Increased from 14%
      minWidth: '150px'
    },
    emailCell: {
      color: '#3C7EE2',
      fontWeight: '600',
      whiteSpace: 'nowrap',
      width: '25%', // Increased from 22%
      minWidth: '250px'
    },
    messageCell: {
      color: '#6b7280',
      fontWeight: '500',
      width: '30%', // Increased from 36% but better distributed
      minWidth: '300px',
      wordWrap: 'break-word',
      whiteSpace: 'normal'
    },
    timeCell: {
      color: '#6b7280',
      whiteSpace: 'nowrap',
      fontWeight: '500',
      width: '12%', // Kept similar
      minWidth: '120px'
    },
    actionsHeaderCell: {
      width: '8%', // Kept similar
      minWidth: '80px',
      textAlign: 'center'
    },
    actionsCell: {
      color: '#6b7280',
      whiteSpace: 'nowrap',
      width: '8%', // Kept similar
      minWidth: '80px',
      textAlign: 'center'
    },
    actionButton: {
      color: '#9ca3af',
      backgroundColor: 'transparent',
      border: 'none',
      padding: '8px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '20px',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto'
    },
    noDataCell: {
      padding: '80px 24px',
      textAlign: 'center',
      color: '#6b7280',
      fontWeight: '500',
      backgroundColor: 'white',
      fontSize: '16px'
    },
    footerContainer: {
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      padding: '24px',
      marginTop: 'auto',
      flexShrink: 0
    },
    footerText: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#6b7280',
      fontWeight: '500',
      margin: 0
    },
    lineClamp3: {
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      lineHeight: '1.5'
    },
    loadingContainer: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      padding: '60px',
      textAlign: 'center',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    loadingText: {
      color: '#6b7280',
      fontWeight: '500',
      fontSize: '16px'
    }
  };

  // State for hover effects
  const [navHover, setNavHover] = useState(false);
  const [newButtonHover, setNewButtonHover] = useState(false);
  const [cancelButtonHover, setCancelButtonHover] = useState(false);
  const [submitButtonHover, setSubmitButtonHover] = useState(false);

  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      {/* Full Width Top Navigation Bar */}
      <div style={styles.topNav}>
        <div style={styles.topNavContent}>
          {/* Logo */}
          <div style={styles.logoContainer}>
            <span style={styles.logoTitle}>MyPortfolioAdmin</span>
          </div>

          {/* User Info & Logout */}
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              <div style={styles.avatar}>
                <span>{user.name ? user.name.charAt(0).toUpperCase() : 'O'}</span>
              </div>
              <div style={styles.userText}>
                <p style={styles.userName}>{user.name}</p>
                <p style={styles.userEmail}>{user.email}</p>
              </div>
            </div>
            {/* White container only for signout */}
            <div style={styles.logoutContainer}>
              <button 
                onClick={logout}
                style={styles.logoutButton}
              >
                <span>⏻ Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div style={styles.mainContainer}>
        {/* Sidebar - Fixed to the left side */}
        <div style={styles.sidebar}>
          <div style={styles.sidebarContent}>
            {/* Navigation - Positioned lower */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div 
                style={{
                  ...styles.navItem,
                  ...(navHover ? styles.navItemHover : {})
                }}
                onMouseEnter={() => setNavHover(true)}
                onMouseLeave={() => setNavHover(false)}
              >
                <span style={{ fontSize: '20px' }}>📨</span>
                <span style={styles.navText}>ENQUIRY MANAGEMENT</span>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div style={styles.mainContent}>
          {/* Header - Aligned with nav item */}
          <header style={styles.header}>
            <h1 style={styles.welcomeText}>ENQUIRIES</h1>
            <p style={styles.subtitle}>Manage and review all incoming enquiries</p>
          </header>

          {/* Main Content Area */}
          <main style={styles.mainArea}>
            {/* Controls Container */}
            <div style={styles.controlsContainer}>
              {/* Left side - Filters and Search */}
              <div style={styles.filtersContainer}>
                {/* Sort By */}
                <div style={styles.filterGroup}>
                  <span style={styles.filterLabel}>Sort By:</span>
                  <div style={styles.filterButtons}>
                    <button
                      onClick={() => setSortBy('name')}
                      style={{
                        ...styles.filterButton,
                        ...(sortBy === 'name' ? styles.filterButtonActive : {})
                      }}
                    >
                      Name A-Z
                    </button>
                    <button
                      onClick={() => setSortBy('date')}
                      style={{
                        ...styles.filterButton,
                        ...(sortBy === 'date' ? styles.filterButtonActive : {})
                      }}
                    >
                      Date
                    </button>
                  </div>
                </div>
                
                {/* Search */}
                <div style={{ flex: 1, maxWidth: '320px' }}>
                  <input
                    type="text"
                    placeholder="Search enquiries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={styles.searchInput}
                  />
                </div>
              </div>

              {/* Right side - NEW button */}
              <div style={styles.newButtonContainer}>
                <button 
                  style={{
                    ...styles.newButton,
                    ...(newButtonHover ? styles.newButtonHover : {})
                  }}
                  onMouseEnter={() => setNewButtonHover(true)}
                  onMouseLeave={() => setNewButtonHover(false)}
                  onClick={openModal}
                >
                  <span style={{ fontSize: '18px' }}>+</span>
                  NEW
                </button>
              </div>
            </div>

            {/* Table Section - Takes remaining space */}
            <div style={styles.tableSection}>
              {/* Loading State */}
              {loading ? (
                <div style={styles.loadingContainer}>
                  <p style={styles.loadingText}>Loading enquiries...</p>
                </div>
              ) : (
                /* Enquiries Table - Much wider to fit all headers */
                <div style={styles.tableContainer}>
                  <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                      <thead style={styles.tableHeader}>
                        <tr>
                          <th style={{...styles.tableHeaderCell, ...styles.nameCell}}>NAME</th>
                          <th style={{...styles.tableHeaderCell, ...styles.dateCell}}>DATE</th>
                          <th style={{...styles.tableHeaderCell, ...styles.emailCell}}>EMAIL</th>
                          <th style={{...styles.tableHeaderCell, ...styles.messageCell}}>ENQUIRY MESSAGE</th>
                          <th style={{...styles.tableHeaderCell, ...styles.timeCell}}>TIME</th>
                          <th style={{...styles.tableHeaderCell, ...styles.actionsHeaderCell}}>ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEnquiries.length > 0 ? (
                          filteredEnquiries.map((enquiry) => (
                            <tr 
                              key={enquiry.id} 
                              style={styles.tableRow}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(60, 126, 226, 0.05)'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            >
                              <td style={{ ...styles.tableCell, ...styles.nameCell }}>
                                {enquiry.name || 'N/A'}
                              </td>
                              <td style={{ ...styles.tableCell, ...styles.dateCell }}>
                                {formatDate(enquiry.timestamp)}
                              </td>
                              <td style={{ ...styles.tableCell, ...styles.emailCell }}>
                                {enquiry.email || 'N/A'}
                              </td>
                              <td style={{ ...styles.tableCell, ...styles.messageCell }}>
                                <div style={styles.lineClamp3}>
                                  {enquiry.message || 'No message provided'}
                                </div>
                              </td>
                              <td style={{ ...styles.tableCell, ...styles.timeCell }}>
                                {formatTime(enquiry.timestamp)}
                              </td>
                              <td style={{ ...styles.tableCell, ...styles.actionsCell }}>
                                <button 
                                  style={styles.actionButton}
                                  onMouseEnter={(e) => e.target.style.color = '#374151'}
                                  onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
                                >
                                  <span>⋯</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="6" style={styles.noDataCell}>
                              {searchQuery ? 'No enquiries match your search.' : 'No enquiries found.'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Footer pushed to bottom */}
      <div style={styles.footerContainer}>
        <div style={styles.footerText}>
          <p>© 2025 All rights reserved.</p>
        </div>
      </div>

      {/* New Enquiry Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContainer} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header - No blue background */}
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New Enquiry</h2>
            </div>
            
            {/* Modal Body */}
            <div style={styles.modalBody}>
              <form onSubmit={handleSubmit}>
                {/* Full Name Row - Side by side */}
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Full Name</label>
                    <div style={styles.formInputContainer}>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        style={styles.formInput}
                        placeholder="Enter name..."
                        onFocus={(e) => Object.assign(e.target.style, styles.formInputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, styles.formInput)}
                      />
                      <div style={styles.charCount}>
                        {formData.name.length}/{nameCharLimit}
                      </div>
                      {formErrors.name && (
                        <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                          {formErrors.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Email Row - Side by side */}
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Email</label>
                    <div style={styles.formInputContainer}>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        style={styles.formInput}
                        placeholder="Enter email address"
                        onFocus={(e) => Object.assign(e.target.style, styles.formInputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, styles.formInput)}
                      />
                      {formErrors.email && (
                        <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                          {formErrors.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Phone Row - Side by side */}
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Phone (Optional)</label>
                    <div style={styles.formInputContainer}>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        style={styles.formInput}
                        placeholder="Enter phone number"
                        onFocus={(e) => Object.assign(e.target.style, styles.formInputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, styles.formInput)}
                      />
                    </div>
                  </div>
                </div>

                {/* Enquiry Message Row - Side by side */}
                <div style={styles.formRow}>
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>Enquiry Message</label>
                    <div style={styles.formInputContainer}>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        style={{ ...styles.formInput, ...styles.textArea }}
                        placeholder="Enter the enquiry message.."
                        onFocus={(e) => Object.assign(e.target.style, styles.formInputFocus)}
                        onBlur={(e) => Object.assign(e.target.style, styles.formInput)}
                      />
                      <div style={{
                        ...styles.charCount,
                        ...(formData.message.length >= messageCharLimit ? styles.charCountWarning : {})
                      }}>
                        {formData.message.length}/{messageCharLimit}
                      </div>
                      {formErrors.message && (
                        <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '4px' }}>
                          {formErrors.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Error */}
                {formErrors.submit && (
                  <div style={{ 
                    backgroundColor: '#fee2e2', 
                    color: '#dc2626', 
                    padding:'12px', 
                    borderRadius: '8px', 
                    fontSize: '14px', 
                    marginBottom: '16px',
                    textAlign: 'center'
                  }}>
                    {formErrors.submit}
                  </div>
                )}
              </form>
            </div>
            
            {/* Modal Footer - Buttons on left and right */}
            <div style={styles.modalFooter}>
              <button
                type="button"
                onClick={closeModal}
                style={{
                  ...styles.cancelButton,
                  ...(cancelButtonHover ? styles.cancelButtonHover : {})
                }}
                onMouseEnter={() => setCancelButtonHover(true)}
                onMouseLeave={() => setCancelButtonHover(false)}
                disabled={submitting}
              >
                CANCEL
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                style={{
                  ...styles.submitButton,
                  ...(submitButtonHover ? styles.submitButtonHover : {}),
                  ...(submitting ? styles.submitButtonDisabled : {})
                }}
                onMouseEnter={() => !submitting && setSubmitButtonHover(true)}
                onMouseLeave={() => setSubmitButtonHover(false)}
                disabled={submitting}
              >
                {submitting ? 'SUBMITTING...' : 'SUBMIT'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;