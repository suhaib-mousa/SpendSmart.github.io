import React from 'react';
import { Link } from 'react-router-dom';

function Discounts({ user, deals, handleDealClick }) {
  return (
    // All Deals Section
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
            {deals.map((deal, index) => (
              <div 
                className="col-lg-3 col-md-6 mb-4" 
                key={deal._id} 
                data-aos="fade-up" 
                data-aos-delay={index * 100}
              >
                <div className={`deal-card ${!user && index >= 4 ? 'blurred' : ''}`} onClick={() => handleDealClick(deal)}>
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

          {!user && deals.length > 4 && (
            <div className="deals-overlay-message">
              <h3>Want to See More?</h3>
              <p>Sign up now to unlock all available deals and exclusive discounts!</p>
              <div>
                <Link to="/login" className="btn btn-primary">Log In</Link>
                <Link to="/signup" className="btn btn-outline-primary">Sign Up</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Discounts;