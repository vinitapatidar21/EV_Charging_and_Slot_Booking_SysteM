
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '@/contexts/AuthContext';

const Layout = () => {
  const { isAuthenticated, currentUser, logout } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar isLoggedIn={isAuthenticated} user={currentUser} onLogout={logout} />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
