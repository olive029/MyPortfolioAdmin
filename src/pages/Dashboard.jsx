// Dashboard.jsx - With inline styles
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');

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
      height: '100vh',
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
      padding: '32px 20px 20px 20px', // More top padding to position nav lower
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
      padding: '32px 24px 24px 24px', // More top padding to align with nav item
      marginTop: '0'
    },
    welcomeText: {
      fontSize: '28px',
      fontWeight: '800',
      color: '#111827',
      marginBottom: '4px'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '14px',
      fontWeight: '600'
    },
    mainArea: {
      flex: 1,
      overflow: 'auto',
      padding: '24px'
    },
    controlsContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '24px',
      gap: '16px'
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
      fontSize: '14px',
      fontWeight: '600',
      color: '#374151',
      whiteSpace: 'nowrap'
    },
    filterButtons: {
      display: 'flex',
      gap: '8px'
    },
    filterButton: {
      padding: '8px 16px',
      fontSize: '14px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      color: '#374151',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontWeight: '500'
    },
    filterButtonActive: {
      backgroundColor: '#3C7EE2',
      color: 'white',
      borderColor: '#3C7EE2'
    },
    searchInput: {
      width: '100%',
      maxWidth: '320px',
      padding: '10px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '14px',
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
      padding: '12px 24px',
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      transition: 'all 0.2s'
    },
    newButtonHover: {
      backgroundColor: '#059669'
    },
    loadingContainer: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      padding: '32px',
      textAlign: 'center'
    },
    loadingText: {
      color: '#6b7280',
      fontWeight: '500'
    },
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #e5e7eb'
    },
    tableHeaderCell: {
      padding: '16px 24px',
      textAlign: 'left',
      fontSize: '12px',
      fontWeight: '700',
      color: '#374151',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    tableRow: {
      borderBottom: '1px solid #e5e7eb',
      transition: 'background-color 0.2s'
    },
    tableCell: {
      padding: '16px 24px',
      fontSize: '14px'
    },
    nameCell: {
      fontWeight: '600',
      color: '#111827',
      whiteSpace: 'nowrap'
    },
    dateCell: {
      color: '#6b7280',
      whiteSpace: 'nowrap',
      fontWeight: '500'
    },
    emailCell: {
      color: '#3C7EE2',
      fontWeight: '600',
      whiteSpace: 'nowrap'
    },
    messageCell: {
      color: '#6b7280',
      maxWidth: '400px',
      fontWeight: '500'
    },
    timeCell: {
      color: '#6b7280',
      whiteSpace: 'nowrap',
      fontWeight: '500'
    },
    actionsCell: {
      color: '#6b7280',
      whiteSpace: 'nowrap'
    },
    actionButton: {
      color: '#9ca3af',
      backgroundColor: 'transparent',
      border: 'none',
      padding: '4px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '18px'
    },
    noDataCell: {
      padding: '32px 24px',
      textAlign: 'center',
      color: '#6b7280',
      fontWeight: '500'
    },
    footer: {
      marginTop: '48px',
      paddingTop: '32px',
      borderTop: '1px solid #e5e7eb'
    },
    footerText: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#6b7280',
      fontWeight: '500'
    },
    lineClamp2: {
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    }
  };

  // State for hover effects
  const [navHover, setNavHover] = useState(false);
  const [newButtonHover, setNewButtonHover] = useState(false);

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
                >
                  <span style={{ fontSize: '18px' }}>+</span>
                  NEW
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div style={styles.loadingContainer}>
                <p style={styles.loadingText}>Loading enquiries...</p>
              </div>
            ) : (
              /* Enquiries Table */
              <div style={styles.tableContainer}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={styles.table}>
                    <thead style={styles.tableHeader}>
                      <tr>
                        <th style={styles.tableHeaderCell}>NAME</th>
                        <th style={styles.tableHeaderCell}>DATE</th>
                        <th style={styles.tableHeaderCell}>EMAIL</th>
                        <th style={styles.tableHeaderCell}>ENQUIRY MESSAGE</th>
                        <th style={styles.tableHeaderCell}>TIME</th>
                        <th style={styles.tableHeaderCell}>ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEnquiries.length > 0 ? (
                        filteredEnquiries.map((enquiry) => (
                          <tr 
                            key={enquiry.id} 
                            style={styles.tableRow}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
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
                              <div style={styles.lineClamp2}>
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

            {/* Footer */}
            <div style={styles.footer}>
              <div style={styles.footerText}>
                <p>© 2025 All rights reserved.</p>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
