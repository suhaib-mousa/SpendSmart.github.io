import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { logout } from '../services/auth';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isTipsPage = location.pathname === '/tips';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    toast.success('Successfully logged out!');
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className={`navbar navbar-expand-lg sticky-top ${isTipsPage ? 'navbar-tips' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="fas fa-wallet"> Spend Smart</i>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} 
                to="/"
              >
                Home
              </Link>
            </li>
            <li className="nav-item dropdown" ref={dropdownRef}>
              <button
                className={`nav-link dropdown-toggle btn btn-link ${location.pathname.includes('/budget') || location.pathname.includes('/planner') ? 'active' : ''}`}
                onClick={toggleDropdown}
              >
                Budgeting
              </button>
              <ul className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                <li>
                  <Link
                    className={`dropdown-item ${location.pathname === '/budget' ? 'active' : ''}`}
                    to="/budget"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Budget Analysis
                  </Link>
                </li>
                <li>
                  <Link
                    className={`dropdown-item ${location.pathname === '/planner' ? 'active' : ''}`}
                    to="/planner"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Financial Planner
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/discounts' ? 'active' : ''}`}
                to="/discounts"
              >
                Discounts
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/tips' ? 'active' : ''}`}
                to="/tips"
              >
                Tips
              </Link>
            </li>
          </ul>
          <div className="ms-lg-4 mt-3 mt-lg-0">
            {user ? (
              <div className="d-flex align-items-center">
                <span className="me-3">Welcome, {user.firstName}!</span>
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline-primary"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`btn btn-outline-primary me-2 ${location.pathname === '/login' ? 'active' : ''}`}
                >
                  Log In
                </Link>
                <Link 
                  to="/signup" 
                  className={`btn btn-primary ${location.pathname === '/signup' ? 'active' : ''}`}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
