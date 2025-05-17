import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import { getDeals } from '../services/api';
import 'aos/dist/aos.css';

function Discounts() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });

    const fetchDeals = async () => {
      try {
        setLoading(true);
        const data = await getDeals();
        setDeals(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching deals:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();

    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleDealClick = (deal) => {
    // Handle deal click logic here
    console.log('Deal clicked:', deal);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  // Show only first 4 deals for non-authenticated users
  const visibleDeals = user ? deals : deals.slice(0, 4);
  const hiddenDeals = !user ? deals.slice(4) : [];

  return (
    <div className="discounts-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <h1>Find the Best Deals</h1>
              <p>Discover amazing discounts and offers across Jordan</p>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <img src="/Media/disc.png" alt="Discover Deals" className="hero-image" />
            </div>
          </div>
        </div>
      </section>

      {/* All Deals Section */}
      <section className="all-deals-section">
        <div className="container">
          {!user && (
            <div className="alert alert-info text-center mb-4" role="alert">
              <h4 className="alert-heading mb-2">Limited Preview</h4>
              <p className="mb-0">
                <Link to="/login" className="alert-link">Log in</Link> or <Link to="/signup" className="alert-link">sign up</Link> to see all available deals and unlock advanced features!
              </p>
            </div>
          )}

          <div className="deals-container">
            <div className="row">
              {/* Visible Deals */}
              {visibleDeals.map((deal, index) => (
                <div 
                  className="col-lg-3 col-md-6 mb-4" 
                  key={deal._id} 
                  data-aos="fade-up" 
                  data-aos-delay={index * 100}
                >
                  <div className="deal-card" onClick={() => handleDealClick(deal)}>
                    <div className="deal-image">
                      <img src={deal.image} alt={deal.title} />
                      <div className="deal-tag">{deal.discount} OFF</div>
                      {deal.isNew && <div className="badge-new">NEW</div>}
                    </div>
                    <div className="deal-details">
                      <h3>{deal.title}</h3>
                      <p className="location">{deal.location}</p>
                      <div className="deal-meta">
                        <span className="price">
                          <span className="original">{deal.originalPrice} JD</span>
                          <span className="current">{deal.currentPrice} JD</span>
                        </span>
                        <span className="saved">Save {deal.originalPrice - deal.currentPrice} JD</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Hidden Deals (Blurred) */}
              {!user && hiddenDeals.map((deal, index) => (
                <div 
                  className="col-lg-3 col-md-6 mb-4" 
                  key={deal._id} 
                  data-aos="fade-up" 
                  data-aos-delay={(index + 4) * 100}
                >
                  <div className="deal-card blurred">
                    <div className="deal-image">
                      <img src={deal.image} alt={deal.title} />
                      <div className="deal-tag">{deal.discount} OFF</div>
                      {deal.isNew && <div className="badge-new">NEW</div>}
                    </div>
                    <div className="deal-details">
                      <h3>{deal.title}</h3>
                      <p className="location">{deal.location}</p>
                      <div className="deal-meta">
                        <span className="price">
                          <span className="original">{deal.originalPrice} JD</span>
                          <span className="current">{deal.currentPrice} JD</span>
                        </span>
                        <span className="saved">Save {deal.originalPrice - deal.currentPrice} JD</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!user && hiddenDeals.length > 0 && (
              <div className="deals-overlay-message">
                <h3>Want to See More?</h3>
                <p>Sign up now to unlock all available deals and exclusive discounts!</p>
                <div>
                  <Link to="/login" className="btn btn-primary me-2">Log In</Link>
                  <Link to="/signup" className="btn btn-outline-primary">Sign Up</Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Discounts;