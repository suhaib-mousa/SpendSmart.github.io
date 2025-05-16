import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Home.css';

function Home() {
  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800
    });
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
              <h1 className="display-4">Spend Smart, Live Better</h1>
              <p>Take control of your finances with Jordan's premier budget management and discount discovery platform.</p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/budget" className="btn btn-primary btn-lg me-2 mb-2 mb-md-0">Start Saving Now</Link>
                <Link to="/discounts" className="btn btn-outline-primary btn-lg">Explore Discounts</Link>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left" data-aos-duration="1000">
              <img src="/Media/Media/Hero.png" alt="SpendSmart Hero Image" className="img-fluid hero-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Why SpendSmart Section */}
      <section className="why-spendsmart" id="why">
        <div className="container">
          <div className="section-title" data-aos="fade-up" data-aos-duration="800">
            <h2>Why SpendSmart</h2>
            <p>SpendSmart empowers you to make smarter financial decisions with tools designed specifically for Jordan's market.</p>
          </div>
          <div className="row">
            <div className="col-md-4" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <h3>Take Control of Your Budget</h3>
                <p>Set financial goals, track expenses, and monitor your progress with our intuitive budgeting tools.</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-percent"></i>
                </div>
                <h3>Discover Discounts</h3>
                <p>Access the latest deals and discounts across Jordan, updated in real-time and tailored to your preferences.</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-duration="800" data-aos-delay="300">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>Financial Tips</h3>
                <p>Learn essential financial advice, tips, and strategies to help you make informed decisions and save money.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-title" data-aos="fade-up" data-aos-duration="800">
            <h2>Powerful Features</h2>
            <p>Discover all the tools SpendSmart offers to help you manage your finances and save money.</p>
          </div>

          {/* Personalized Budgeting Tools */}
          <div className="feature-item">
            <div className="row align-items-center">
              <div className="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                <div className="feature-badge">
                  <i className="fas fa-chart-line"></i> Budgeting Tools
                </div>
                <h3>Personalized Budgeting Tools</h3>
                <p>Create custom budgets based on your income and expenses. Set financial goals and track your progress with visual charts and reports. Get insights into your spending patterns and identify areas where you can save.</p>
                <Link to="/budget" className="btn btn-outline-primary">Learn More <i className="fas fa-chevron-right ms-1"></i></Link>
              </div>
              <div className="col-lg-6" data-aos="fade-left" data-aos-duration="1000">
                <img src="/Media/Media/budg.png" alt="Budgeting Tools" className="img-fluid feature-img" />
              </div>
            </div>
          </div>

          {/* Smart Recommendation System */}
          <div className="feature-item">
            <div className="row align-items-center flex-lg-row-reverse">
              <div className="col-lg-6" data-aos="fade-left" data-aos-duration="1000">
                <div className="feature-badge">
                  <i className="fas fa-shield-alt"></i> Smart Recommendations
                </div>
                <h3>Smart Recommendation System</h3>
                <p>Our AI-powered system analyzes your spending habits and suggests ways to save money. Get personalized recommendations for budget adjustments and discover deals that match your interests and needs.</p>
                <Link to="/planner" className="btn btn-outline-primary">Learn More <i className="fas fa-chevron-right ms-1"></i></Link>
              </div>
              <div className="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                <img src="/Media/disc.png" alt="Smart Recommendations" className="img-fluid feature-img" />
              </div>
            </div>
          </div>

          {/* Discount Database */}
          <div className="feature-item">
            <div className="row align-items-center">
              <div className="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                <div className="feature-badge">
                  <i className="fas fa-tag"></i> Discount Database
                </div>
                <h3>Comprehensive Discount Database</h3>
                <p>Browse and filter discounts by category, location, and expiration date. Find the best deals in Jordan for restaurants, retail, services, and more. Save your favorite deals and get notified when similar offers become available.</p>
                <Link to="/discounts" className="btn btn-outline-primary">Learn More <i className="fas fa-chevron-right ms-1"></i></Link>
              </div>
              <div className="col-lg-6" data-aos="fade-left" data-aos-duration="1000">
                <img src="/Media/disc.png" alt="Discount Database" className="img-fluid feature-img" />
              </div>
            </div>
          </div>

          {/* Community & Reviews */}
          <div className="feature-item" id="community">
            <div className="row align-items-center flex-lg-row-reverse">
              <div className="col-lg-6" data-aos="fade-left" data-aos-duration="1000">
                <div className="feature-badge">
                  <i className="fas fa-users"></i> Community
                </div>
                <h3>Community & Reviews</h3>
                <p>Connect with other budget-conscious individuals in Jordan. Share your experiences, tips, and reviews of local businesses. Learn from others' financial journeys and contribute your own insights to help the community.</p>
                <Link to="/discounts" className="btn btn-outline-primary">Learn More <i className="fas fa-chevron-right ms-1"></i></Link>
              </div>
              <div className="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                <img src="https://placehold.co/600x400/e6f2ff/0056b3?text=Community+%26+Reviews" alt="Community & Reviews" className="img-fluid feature-img" />
              </div>
            </div>
          </div>

          {/* Educational Resources */}
          <div className="feature-item" id="education">
            <div className="row align-items-center">
              <div className="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                <div className="feature-badge">
                  <i className="fas fa-book-open"></i> Education
                </div>
                <h3>Educational Resources</h3>
                <p>Access a wealth of articles, videos, and guides about budgeting, saving, and financial wellness. Learn practical tips for managing your finances in Jordan's economic environment. Stay updated on financial news and trends that affect your wallet.</p>
                <Link to="/tips" className="btn btn-outline-primary">Learn More <i className="fas fa-chevron-right ms-1"></i></Link>
              </div>
              <div className="col-lg-6" data-aos="fade-left" data-aos-duration="1000">
                <img src="/Media/tip.png" alt="Educational Resources" className="img-fluid feature-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta">
        <div className="container">
          <div data-aos="fade-up" data-aos-duration="1000">
            <h2>Ready to Start Saving?</h2>
            <p>Join thousands of users in Jordan who are taking control of their finances and discovering amazing deals with SpendSmart.</p>
            <div className="d-flex justify-content-center flex-wrap gap-2">
              <Link to="/signup" className="btn btn-primary btn-lg me-2 mb-2 mb-md-0">Sign Up for Free</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <footer className="py-3 my-4 text-center">
            <ul className="nav justify-content-center border-bottom pb-3 mb-3">
              <li className="nav-item"><Link to="/" className="nav-link px-2 text-muted">Home</Link></li>
              <li className="nav-item"><Link to="/discounts" className="nav-link px-2 text-muted">Discounts</Link></li>
              <li className="nav-item"><Link to="/budget" className="nav-link px-2 text-muted">Budget Analysis</Link></li>
              <li className="nav-item"><Link to="/planner" className="nav-link px-2 text-muted">Financial Planner</Link></li>
              <li className="nav-item"><Link to="/tips" className="nav-link px-2 text-muted">Tips</Link></li>
            </ul>
            <p className="text-center text-muted">© 2025 University Of Jordan, SpendSmart</p>
          </footer>
        </div>
      </footer>
    </>
  );
}

export default Home;