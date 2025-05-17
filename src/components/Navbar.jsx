import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { logout } from '../services/auth';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const isTipsPage = location.pathname === '/tips';

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    toast.success('Successfully logged out!');
    navigate('/');
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
              <Link className="nav-link active" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Budgeting
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link className="dropdown-item" to="/budget">
                    Budget Analysis
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/planner">
                    Financial Planner
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/discounts">
                Discounts
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/tips">
                Tips
              </Link>
            </li>
          </ul>
          <div className="ms-lg-4 mt-3 mt-lg-0">
            {user ? (
              <div className="d-flex align-items-center">
                <span className="me-3">Welcome, {user.firstName}!</span>
                <button onClick={handleLogout} className="btn btn-outline-primary">
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary me-2">
                  Log In
                </Link>
                <Link to="/signup" className="btn btn-primary">
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