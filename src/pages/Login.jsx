import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';

function Login() {
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
            <h1>Log in to Your Account</h1>
            <p>Log in to your account so you can start saving today.</p>
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

            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder=" "
              />
              <label className="form-label" htmlFor="password">Password</label>
            </div>

            <div className="auth-links">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="submit-button">
              Log In
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

export default Login;