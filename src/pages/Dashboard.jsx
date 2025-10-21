import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real enquiries from Firestore
  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const enquiriesQuery = query(
          collection(db, 'enquiries'), 
          orderBy('timestamp', 'desc')
        );
        const enquirySnapshot = await getDocs(enquiriesQuery);
        const enquiriesList = enquirySnapshot.docs.map((doc, index) => ({
          id: doc.id,
          serial: (index + 1).toString().padStart(2, '0'), // 01, 02, 03...
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
  }, []);

  // Format timestamp to readable date and time
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return 'Invalid Time';
    }
  };

  const getRelativeDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const now = new Date();
    const date = new Date(timestamp);
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    
    return formatDate(timestamp);
  };

  // Get user initial for the circle
  const getUserInitial = () => {
    return user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  };
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Constant, doesn't disappear */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">MyPortfolio</h1>
              <span className="text-sm font-semibold text-blue-600">ADMIN</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 p-3 text-blue-600 bg-blue-50 rounded-lg">
              <span className="text-lg">📨</span>
              <span className="font-medium">Enquiry Management</span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ENQUIRIES</h1>
            </div>

            {/* Top Nav Right Side */}
            <div className="flex items-center gap-4">
              {/* Sign Out Button */}
              <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">Sort By:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortBy('name')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    sortBy === 'name' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Name A-Z
                </button>
                <button
                  onClick={() => setSortBy('date')}
                  className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                    sortBy === 'date' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Date
                </button>
              </div>
            </div>
            
            <div className="w-full md:w-auto">
              <input
                type="text"
                placeholder="Search enquiries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* NEW Section Header */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900"> + NEW</h2>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <p className="text-gray-600">Loading enquiries...</p>
            </div>
          ) : (
            /* Enquiries Table */
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        NAME
                      </th>
  
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        EMAIL
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ENQUIRY MESSAGE
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        TIME
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {enquiries.length > 0 ? (
                      enquiries.map((enquiry) => (
                        <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {enquiry.serial}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {enquiry.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {enquiry.note || 'Today'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {enquiry.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-md">
                            <div className="line-clamp-2">
                              {enquiry.message}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {enquiry.time || '2:30PM'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button className="text-gray-400 hover:text-gray-600">
                              [...]
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                          No enquiries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="text-center text-sm text-gray-600">
              <p>© 2025 All rights reserved.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
