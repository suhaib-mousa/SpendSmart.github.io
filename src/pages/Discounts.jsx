import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Discounts.css';

function Discounts() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  return (
    <div className="discounts-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <h1>Discover Amazing Deals</h1>
              <p>Find the best discounts and offers in Jordan, all in one place.</p>
              <div className="search-box">
                <input type="text" placeholder="Search for discounts..." />
                <button><i className="fas fa-search"></i></button>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <img src="/src/media/disc.png" alt="Discounts Hero" className="hero-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">Browse by Category</h2>
          <div className="row">
            <div className="col-md-3 col-6" data-aos="fade-up" data-aos-delay="100">
              <div className="category-card">
                <i className="fas fa-utensils"></i>
                <h3>Restaurants</h3>
                <span>150+ Deals</span>
              </div>
            </div>
            <div className="col-md-3 col-6" data-aos="fade-up" data-aos-delay="200">
              <div className="category-card">
                <i className="fas fa-tshirt"></i>
                <h3>Fashion</h3>
                <span>200+ Deals</span>
              </div>
            </div>
            <div className="col-md-3 col-6" data-aos="fade-up" data-aos-delay="300">
              <div className="category-card">
                <i className="fas fa-mobile-alt"></i>
                <h3>Electronics</h3>
                <span>80+ Deals</span>
              </div>
            </div>
            <div className="col-md-3 col-6" data-aos="fade-up" data-aos-delay="400">
              <div className="category-card">
                <i className="fas fa-spa"></i>
                <h3>Beauty</h3>
                <span>120+ Deals</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Deals Section */}
      <section className="featured-deals">
        <div className="container">
          <h2 className="section-title" data-aos="fade-up">Featured Deals</h2>
          <div className="row">
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
              <div className="deal-card">
                <div className="deal-image">
                  <img src="/src/media/camping.png" alt="Restaurant Deal" />
                  <span className="discount-badge">-50%</span>
                </div>
                <div className="deal-content">
                  <h3>Camping Equipment</h3>
                  <p>Get 50% off on all camping equipment</p>
                  <div className="deal-meta">
                    <span className="location"><i className="fas fa-map-marker-alt"></i> Amman</span>
                    <span className="expires">Expires in 3 days</span>
                  </div>
                  <Link to="/deal/1" className="btn btn-primary">View Deal</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
              <div className="deal-card">
                <div className="deal-image">
                  <img src="/src/media/businessman-1026415_640.jpg" alt="Fashion Deal" />
                  <span className="discount-badge">-30%</span>
                </div>
                <div className="deal-content">
                  <h3>Business Attire</h3>
                  <p>30% off on all business wear</p>
                  <div className="deal-meta">
                    <span className="location"><i className="fas fa-map-marker-alt"></i> Irbid</span>
                    <span className="expires">Expires in 5 days</span>
                  </div>
                  <Link to="/deal/2" className="btn btn-primary">View Deal</Link>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
              <div className="deal-card">
                <div className="deal-image">
                  <img src="/src/media/teamwork-7423959_640.jpg" alt="Electronics Deal" />
                  <span className="discount-badge">-25%</span>
                </div>
                <div className="deal-content">
                  <h3>Team Building Activities</h3>
                  <p>25% discount on group activities</p>
                  <div className="deal-meta">
                    <span className="location"><i className="fas fa-map-marker-alt"></i> Aqaba</span>
                    <span className="expires">Expires in 7 days</span>
                  </div>
                  <Link to="/deal/3" className="btn btn-primary">View Deal</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content" data-aos="fade-up">
            <h2>Never Miss a Deal!</h2>
            <p>Subscribe to our newsletter and get the best deals delivered to your inbox.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Discounts;