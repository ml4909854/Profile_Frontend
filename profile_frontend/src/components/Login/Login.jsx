import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('token'));
    };

    // Custom login/logout event listeners
    window.addEventListener('login', handleStorageChange);
    window.addEventListener('logout', handleStorageChange);

    return () => {
      window.removeEventListener('login', handleStorageChange);
      window.removeEventListener('logout', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('logout')); // notify others
    navigate('/login');
  };

  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <>
            <Link to="/profile">Profile</Link>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        )}
      </nav>
      <Outlet />
    </>
  );
};

export default Layout;
