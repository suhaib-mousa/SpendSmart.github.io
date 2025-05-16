import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';

function Signup() {
  return (
    <div className="auth-container">
      <div className="row">
        <div className="col blu m-0 px-2 d-flex flex-column justify-content-center align-items-center position-relative">
          <Link to="/">
            <i className="fa-solid fa-wallet" style={{ color: '#f0f3fa' }}> Spend Smart</i>
          </Link>
          <h4 style={{ color: '#f0f3fa', textAlign: 'center' }} className="mx-3">
            Already Signed up?
          </h4>
          <br />
          <p style={{ color: '#f0f3fa', textAlign: 'center' }} className="mx-3">
            Log in to your account so you can access personalized discounts and savings tips
          </p>
          <br />
          <p>
            <Link to="/login">
              <button className="LogIn-btn">LOG IN</button>
            </Link>
          </p>
        </div>

        <div className="col mt-5 me-5" style={{ fontFamily: 'sans-serif' }}>
          <form>
            <div>
              <h3 className="h3 mb-2 mt-5 fw-normal text-center">Sign Up for an Account</h3>
              <p className="mb-3 text-body-secondary text-center">
                Join our community and start your savings journey!
              </p>
            </div>
            <div className="row mb-3">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="First name"
                  aria-label="First name"
                  style={{ height: '50px' }}
                />
              </div>
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last name"
                  aria-label="Last name"
                  style={{ height: '50px' }}
                />
              </div>
            </div>

            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="floatingConfirmPassword"
                placeholder="Confirm Password"
              />
              <label htmlFor="floatingConfirmPassword">Confirm Password</label>
            </div>

            <div className="form-check text-start my-3">
              <input
                className="form-check-input"
                type="checkbox"
                value="remember-me"
                id="flexCheckDefault"
              />
              <label className="form-check-label" htmlFor="flexCheckDefault">
                Remember me
              </label>
            </div>
            <button className="btn w-100 py-3" type="submit">
              Sign up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;