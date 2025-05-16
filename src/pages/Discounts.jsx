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
              <h1>Find the Best Deals</h1>
              <p>Discover amazing discounts and offers across Jordan</p>
              <div className="search-box">
                <input type="text" placeholder="Search for stores, categories, or locations..." />
                <button type="submit">Search</button>
              </div>
              <div className="popular-searches">
                <span>Popular:</span>
                <Link to="/category/restaurants">Restaurants</Link>
                <Link to="/category/fashion">Fashion</Link>
                <Link to="/category/electronics">Electronics</Link>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <img src="/media/disc.png" alt="Discover Deals" className="hero-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Trending Deals */}
      <section className="trending-deals">
        <div className="container">
          <div className="section-header">
            <h2>Trending Deals</h2>
            <Link to="/all-deals" className="view-all">View All</Link>
          </div>
          <div className="row">
            <div className="col-lg-3 col-md-6" data-aos="fade-up">
              <div className="deal-card">
                <div className="deal-image">
                  <img src="/media/camping.png" alt="Camping Deal" />
                  <div className="deal-tag">50% OFF</div>
                </div>
                <div className="deal-details">
                  <h3>Adventure Gear</h3>
                  <p className="location">Amman, Jordan</p>
                  <div className="deal-meta">
                    <span className="price">
                      <span className="original">100 JD</span>
                      <span className="current">50 JD</span>
                    </span>
                    <span className="saved">Save 50 JD</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="100">
              <div className="deal-card">
                <div className="deal-image">
                  <img src="/media/businessman-1026415_640.jpg" alt="Fashion Deal" />
                  <div className="deal-tag">30% OFF</div>
                </div>
                <div className="deal-details">
                  <h3>Business Attire</h3>
                  <p className="location">Irbid, Jordan</p>
                  <div className="deal-meta">
                    <span className="price">
                      <span className="original">200 JD</span>
                      <span className="current">140 JD</span>
                    </span>
                    <span className="saved">Save 60 JD</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="200">
              <div className="deal-card">
                <div className="deal-image">
                  <img src="/media/teamwork-7423959_640.jpg" alt="Activities Deal" />
                  <div className="deal-tag">25% OFF</div>
                </div>
                <div className="deal-details">
                  <h3>Team Activities</h3>
                  <p className="location">Aqaba, Jordan</p>
                  <div className="deal-meta">
                    <span className="price">
                      <span className="original">80 JD</span>
                      <span className="current">60 JD</span>
                    </span>
                    <span className="saved">Save 20 JD</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-6" data-aos="fade-up" data-aos-delay="300">
              <div className="deal-card">
                <div className="deal-image">
                  <img src="/media/disc.png" alt="Electronics Deal" />
                  <div className="deal-tag">40% OFF</div>
                </div>
                <div className="deal-details">
                  <h3>Electronics</h3>
                  <p className="location">Zarqa, Jordan</p>
                  <div className="deal-meta">
                    <span className="price">
                      <span className="original">500 JD</span>
                      <span className="current">300 JD</span>
                    </span>
                    <span className="saved">Save 200 JD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="container">
          <h2>Browse Categories</h2>
          <div className="row">
            {['Restaurants', 'Fashion', 'Electronics', 'Beauty', 'Travel', 'Entertainment', 'Sports', 'Home'].map((category, index) => (
              <div className="col-lg-3 col-md-4 col-6" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <Link to={`/category/${category.toLowerCase()}`} className="category-card">
                  <i className={`fas fa-${getCategoryIcon(category)}`}></i>
                  <h3>{category}</h3>
                  <span>{Math.floor(Math.random() * 100) + 50}+ Deals</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content" data-aos="fade-up">
            <h2>Never Miss a Deal</h2>
            <p>Subscribe to our newsletter and get the best deals delivered to your inbox</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function getCategoryIcon(category) {
  const icons = {
    Restaurants: 'utensils',
    Fashion: 'tshirt',
    Electronics: 'mobile-alt',
    Beauty: 'spa',
    Travel: 'plane',
    Entertainment: 'film',
    Sports: 'basketball-ball',
    Home: 'home'
  };
  return icons[category] || 'tag';
}

export default Discounts;