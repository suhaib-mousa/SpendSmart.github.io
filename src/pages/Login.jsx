import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Auth.css';

function Login() {
  return (
    <div className="auth-container">
      <div className="row d-flex justify-content-center align-items-center position-relative">
        <div className="col mt-5" style={{ fontFamily: 'sans-serif', width: '50%' }}>
          <div>
            <Link to="/">
              <i className="fa-solid fa-wallet"> Spend Smart</i>
            </Link>
          </div>

          <form>
            <div>
              <h3 className="h3 mb-2 fw-normal text-center">Log in to Your Account</h3>
              <p className="mx-3 text-body-secondary text-center">
                Log in to your account so you can start saving today..
              </p>
            </div>

            <div className="form-floating w-75 mx-5 my-2 med">
              <input
                type="email"
                className="form-control"
                id="floatingInput"
                placeholder="name@example.com"
              />
              <label htmlFor="floatingInput">Email address</label>
            </div>
            <div className="form-floating w-75 mx-5 my-2 med">
              <input
                type="password"
                className="form-control"
                id="floatingPassword"
                placeholder="Password"
              />
              <label htmlFor="floatingPassword">Password</label>
            </div>
            <div className="forgot-password ms-5 ps-2 med">
              <Link to="/forgot-password" style={{ textDecoration: 'none', color: 'var(--primary-blue)' }}>
                Forgot your password?
              </Link>
            </div>
            <button className="btn w-75 py-3 mx-5 my-2 med" type="submit">
              Log In
            </button>
          </form>
        </div>

        <div className="col blu m-0 px-2 d-flex flex-column justify-content-center align-items-center position-relative">
          <h4 style={{ color: '#f0f3fa', textAlign: 'center' }}>Don't Have an Account Yet?</h4>
          <br />
          <p style={{ color: '#f0f3fa', textAlign: 'center' }} className="mx-3">
            Sign up today and unlock smarter ways to save on every purchase!
          </p>
          <br />
          <p>
            <Link to="/signup">
              <button className="SignUp-btn">SIGN UP</button>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;