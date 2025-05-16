import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isTipsPage = location.pathname === '/tips';

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
            <Link to="/login" className="btn btn-outline-primary me-2">
              Log In
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;