import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { resetPassword } from '../services/auth';
import '../styles/Auth.css';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await resetPassword(token, password);
      toast.success('Password has been reset successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

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
            <h1>Reset Password</h1>
            <p>Enter your new password below.</p>
          </div>

          <form className="auth-form" onSubmit={handleResetPassword}>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className="form-label" htmlFor="password">New Password</label>
            </div>

            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder=" "
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <label className="form-label" htmlFor="confirmPassword">Confirm New Password</label>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>

      <div className="signup auth-cta-side">
        <div className="auth-cta-content">
          <h2 className="auth-cta-title">Remember Your Password?</h2>
          <p className="auth-cta-text">
            Return to the login page to access your account.
          </p>
          <Link to="/login">
            <button className="cta-button">LOG IN</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;