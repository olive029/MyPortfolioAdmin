// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';

// Layout component for auth routes
const AuthLayout = () => {
  return (
    <div>
      <Outlet /> {/* This renders the child routes */}
    </div>
  );
};

function App() {
  return (
    <HelmetProvider>
      <Router>
        <Routes>
          {/* Nested auth routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="dashboard/*" element={<Dashboard />} />
          </Route>
          
          {/* Redirects */}
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<Login />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
}

export default App;
