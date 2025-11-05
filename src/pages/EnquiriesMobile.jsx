import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

const EnquiriesMobile = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Styles
  const styles = {
    // Main container
    mainArea: {
      marginTop: '60px',
      minHeight: 'calc(100vh - 60px)',
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    },
    
    // Blue background container
    mainContentContainer: {
      backgroundColor: 'rgba(60, 126, 226, 0.1)',
      padding: '20px 16px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      minHeight: 'calc(100vh - 60px)'
    },

    // Top Navigation
    topNav: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '60px',
      backgroundColor: 'rgba(60, 126, 226, 0.2)',
      padding: '0 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      zIndex: 1000,
      borderBottom: '1px solid rgba(60, 126, 226, 0.1)'
    },

    menuButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#111827',
      padding: '8px',
      borderRadius: '4px'
    },

    navTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#111827'
    },

    userSection: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center'
    },

    userButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#111827',
      padding: '8px',
      borderRadius: '4px'
    },

    // Dropdown Menu
    dropdownMenu: {
      position: 'absolute',
      top: '50px',
      right: '0',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      padding: '8px 0',
      minWidth: '150px',
      zIndex: 1001,
      border: '1px solid #e5e7eb'
    },

    dropdownItem: {
      padding: '12px 16px',
      border: 'none',
      background: 'none',
      width: '100%',
      textAlign: 'left',
      cursor: 'pointer',
      fontSize: '16px',
      color: '#374151',
      transition: 'background-color 0.2s'
    },

    // Drawer Styles
    drawerOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999
    },

    drawer: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '280px',
      height: '100vh',
      backgroundColor: 'white',
      boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
      zIndex: 1000,
      padding: '20px',
      transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.3s ease-in-out'
    },

    drawerHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e5e7eb'
    },

    drawerTitle: {
      fontSize: '20px',
      fontWeight: '700',
      color: '#111827'
    },

    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      color: '#dc2626',
      padding: '4px',
      borderRadius: '4px'
    },

    drawerItem: {
      padding: '16px 0',
      borderBottom: '1px solid #e5e7eb',
      fontSize: '16px',
      color: '#374151',
      cursor: 'pointer',
      transition: 'color 0.2s'
    },

    // Page Content
    pageHeader: {
      marginBottom: '10px'
    },

    pageTitle: {
      fontSize: '24px',
      fontWeight: '800',
      color: '#111827',
      margin: '0 0 5px 0'
    },

    pageSubtitle: {
      fontSize: '16px',
      color: '#6b7280',
      fontWeight: '500',
      margin: 0
    },

    // Controls
    mobileControls: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      marginBottom: '20px'
    },

    filterButtons: {
      display: 'flex',
      gap: '8px'
    },

    filterButton: {
      padding: '10px 16px',
      fontSize: '14px',
      borderRadius: '8px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      color: '#374151',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.2s'
    },

    newButton: {
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '10px 16px',
      fontSize: '14px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },

    // Enquiry Cards
    cardsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    },

    enquiryCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s'
    },

    cardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '12px'
    },

    userInfo: {
      flex: 1
    },

    userName: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#111827',
      margin: '0 0 4px 0'
    },

    userEmail: {
      fontSize: '14px',
      color: '#3C7EE2',
      margin: 0,
      textDecoration: 'none'
    },

    dateBadge: {
      backgroundColor: 'rgba(60, 126, 226, 0.1)',
      color: '#3C7EE2',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600'
    },

    enquiryMessage: {
      fontSize: '14px',
      color: '#374151',
      lineHeight: '1.5',
      margin: '12px 0',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },

    // Loading State
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px'
    },

    loadingText: {
      fontSize: '16px',
      color: '#6b7280'
    },

    // Empty State
    emptyState: {
      textAlign: 'center',
      padding: '40px 20px',
      color: '#6b7280'
    },

    emptyStateText: {
      fontSize: '16px',
      margin: 0
    },

    // Pagination
    pagination: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: '20px',
      padding: '16px 0'
    },

    paginationButton: {
      padding: '8px 16px',
      border: '1px solid #d1d5db',
      backgroundColor: 'white',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s'
    },

    pageInfo: {
      fontSize: '14px',
      color: '#6b7280',
      fontWeight: '500'
    },

    // Footer
    footer: {
      textAlign: 'center',
      padding: '20px 0',
      color: '#6b7280',
      fontSize: '14px',
      borderTop: '1px solid #e5e7eb',
      marginTop: 'auto'
    }
  };

  // Fetch enquiries from Firebase
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'contactMessages'));
        const enquiriesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEnquiries(enquiriesData);
      } catch (error) {
        console.error('Error fetching enquiries:', error);
      }
    };

    fetchEnquiries();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.user-section')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <>
      {/* Top Navigation */}
      <div style={styles.topNav}>
        <button 
          style={styles.menuButton}
          onClick={() => setDrawerOpen(true)}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.1)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          ☰
        </button>
        
        <div style={styles.navTitle}>MyPortfolio Admin</div>
        
        <div className="user-section" style={styles.userSection}>
          <button 
            style={styles.userButton}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0,0,0,0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ⚙️
          </button>
          
          {dropdownOpen && (
            <div style={styles.dropdownMenu}>
              <button 
                style={styles.dropdownItem}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Your Profile
              </button>
              <button 
                style={styles.dropdownItem}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div 
          style={styles.drawerOverlay}
          onClick={() => setDrawerOpen(false)}
        />
      )}
      <div style={styles.drawer}>
        <div style={styles.drawerHeader}>
          <div style={styles.drawerTitle}>Menu</div>
          <button 
            style={styles.closeButton}
            onClick={() => setDrawerOpen(false)}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(220, 38, 38, 0.1)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ✕
          </button>
        </div>
        <div 
          style={styles.drawerItem}
          onMouseEnter={(e) => e.target.style.color = '#3C7EE2'}
          onMouseLeave={(e) => e.target.style.color = '#374151'}
        >
          Dashboard
        </div>
        <div 
          style={styles.drawerItem}
          onMouseEnter={(e) => e.target.style.color = '#3C7EE2'}
          onMouseLeave={(e) => e.target.style.color = '#374151'}
        >
          Enquiries
        </div>
        <div 
          style={styles.drawerItem}
          onMouseEnter={(e) => e.target.style.color = '#3C7EE2'}
          onMouseLeave={(e) => e.target.style.color = '#374151'}
        >
          Projects
        </div>
        <div 
          style={styles.drawerItem}
          onMouseEnter={(e) => e.target.style.color = '#3C7EE2'}
          onMouseLeave={(e) => e.target.style.color = '#374151'}
        >
          Settings
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.mainArea}>
        <div style={styles.mainContentContainer}>
          {/* Page Header */}
          <div style={styles.pageHeader}>
            <h1 style={styles.pageTitle}>MyPortfolio Admin</h1>
            <h2 style={styles.pageSubtitle}>ENQUIRIES</h2>
          </div>

          {/* Controls */}
          <div style={styles.mobileControls}>
            <div style={styles.filterButtons}>
              <button 
                style={styles.filterButton}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                Date
              </button>
            </div>
            <button 
              style={styles.newButton}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              +New
            </button>
          </div>

          {/* Enquiry Cards */}
          <div style={styles.cardsContainer}>
            {enquiries.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyStateText}>No enquiries found</p>
              </div>
            ) : (
              enquiries.map((enquiry) => (
                <div 
                  key={enquiry.id} 
                  style={styles.enquiryCard}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div style={styles.cardHeader}>
                    <div style={styles.userInfo}>
                      <h3 style={styles.userName}>{enquiry.name}</h3>
                      <a href={`mailto:${enquiry.email}`} style={styles.userEmail}>
                        {enquiry.email}
                      </a>
                    </div>
                    <div style={styles.dateBadge}>{enquiry.date}</div>
                  </div>
                  <p style={styles.enquiryMessage}>{enquiry.message}</p>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div style={styles.pagination}>
            <button 
              style={styles.paginationButton}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              &lt; 1 &gt;
            </button>
            <div style={styles.pageInfo}>1-{enquiries.length}/{enquiries.length}</div>
          </div>

          {/* Footer */}
          <footer style={styles.footer}>
            © 2025 All rights reserved.
          </footer>
        </div>
      </div>
    </>
  );
};

export default EnquiriesMobile;