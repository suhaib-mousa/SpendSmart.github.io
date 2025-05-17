import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';

function ForgotPassword() {
  return (
    <div className="auth-container">
      <div className="login auth-form-side">
        <div className="auth-logo">
          <Link to="/">
            <i className="fa-solid fa-wallet"> SpendSmart</i>
          </Link>
        </div>
        
        <div className="auth-form-container">
          <div className="auth-title">
            <h1>Forgot Password</h1>
            <p>Enter your email address below to reset your password.</p>
          </div>

          <form className="auth-form">
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder=" "
              />
              <label className="form-label" htmlFor="email">Email address</label>
            </div>

            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>

      <div className="signup auth-cta-side">
        <div className="auth-cta-content">
          <h2 className="auth-cta-title">Don't Have an Account Yet?</h2>
          <p className="auth-cta-text">
            Sign up today and unlock smarter ways to save on every purchase!
          </p>
          <Link to="/signup">
            <button className="cta-button">SIGN UP</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;