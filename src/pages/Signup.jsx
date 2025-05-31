import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { register } from '../services/auth';
import '../styles/Auth.css';

function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // إخفاء التمرير في الصفحة الرئيسية
    document.body.style.overflow = 'hidden';
    
    // تنظيف عند إغلاق المكون
    return () => {
      document.body.style.overflow = 'visible';
    };
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      await register({
        firstName,
        lastName,
        email,
        password
      });
      toast.success('Successfully signed up!');
      navigate('/login');
    } catch (error) {
      toast.error(error.message || 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* الجانب الأيسر - دعوة للتسجيل */}
      <div className="auth-cta-side">
        <div className="auth-logo">
          <Link to="/">
            <i className="fa-solid fa-wallet"> SpendSmart</i>
          </Link>
        </div>
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

      {/* الجانب الأيمن - نموذج التسجيل */}
      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-title">
            <h1>Sign Up for an Account</h1>
            <p>Join our community and start your savings journey!</p>
          </div>

          <form className="auth-form" onSubmit={handleSignup}>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="firstName"
                  placeholder=" "
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <label className="form-label" htmlFor="firstName">First name</label>
              </div>
              
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="lastName"
                  placeholder=" "
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                <label className="form-label" htmlFor="lastName">Last name</label>
              </div>
            </div>

            <div className="form-group">
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="form-label" htmlFor="email">Email address</label>
            </div>

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
              <label className="form-label" htmlFor="password">Password</label>
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
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing up...
                </>
              ) : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;