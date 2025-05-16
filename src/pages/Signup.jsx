import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';

function Signup() {
  return (
    <div className="auth-container">
      <div className="auth-cta-side">
        <div className="auth-cta-content">
          <h2 className="auth-cta-title">Already Signed up?</h2>
          <p className="auth-cta-text">
            Log in to your account so you can access personalized discounts and savings tips
          </p>
          <Link to="/login">
            <button className="cta-button">LOG IN</button>
          </Link>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-logo">
          <Link to="/">
            <i className="fa-solid fa-wallet"> SpendSmart</i>
          </Link>
        </div>
        
        <div className="auth-form-container">
          <div className="auth-title">
            <h1>Sign Up for an Account</h1>
            <p>Join our community and start your savings journey!</p>
          </div>

          <form className="auth-form">
            <div className="row">
              <div className="col-6">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    placeholder=" "
                  />
                  <label className="form-label" htmlFor="firstName">First name</label>
                </div>
              </div>
              <div className="col-6">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    placeholder=" "
                  />
                  <label className="form-label" htmlFor="lastName">Last name</label>
                </div>
              </div>
            </div>

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

            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder=" "
              />
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            </div>

            <div className="auth-links">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
            </div>

            <button type="submit" className="submit-button">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;