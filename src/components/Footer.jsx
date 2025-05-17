import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <footer className="py-3 my-4 text-center">
          <ul className="nav justify-content-center border-bottom pb-3 mb-3">
            <li className="nav-item"><Link to="/" className="nav-link px-2 text-muted">Home</Link></li>
            <li className="nav-item"><Link to="/discounts" className="nav-link px-2 text-muted">Discounts</Link></li>
            <li className="nav-item"><Link to="/budget" className="nav-link px-2 text-muted">Budget Analysis</Link></li>
            <li className="nav-item"><Link to="/planner" className="nav-link px-2 text-muted">Financial Planner</Link></li>
            <li className="nav-item"><Link to="/tips" className="nav-link px-2 text-muted">Tips</Link></li>
          </ul>
          <p className="text-center text-muted">© 2025 University Of Jordan, SpendSmart</p>
        </footer>
      </div>
    </footer>
  );
};

export default Footer;
