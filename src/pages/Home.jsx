import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Home.css';

function Home() {
  const [user, setUser] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 800
    });

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
              <h1 className="display-4">{t('home.hero.title')}</h1>
              <p>{t('home.hero.subtitle')}</p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/budget" className="btn btn-primary btn-lg me-2 mb-2 mb-md-0">
                  {t('home.hero.start_saving')}
                </Link>
                <Link to="/discounts" className="btn btn-outline-primary btn-lg">
                  {t('home.hero.explore_discounts')}
                </Link>
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
            <h2>{t('home.why_section.title')}</h2>
            <p>{t('home.why_section.subtitle')}</p>
          </div>
          <div className="row">
            <div className="col-md-4" data-aos="fade-up" data-aos-duration="800" data-aos-delay="100">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-dollar-sign"></i>
                </div>
                <h3>{t('home.why_section.features.budget.title')}</h3>
                <p>{t('home.why_section.features.budget.description')}</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-duration="800" data-aos-delay="200">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-percent"></i>
                </div>
                <h3>{t('home.why_section.features.discounts.title')}</h3>
                <p>{t('home.why_section.features.discounts.description')}</p>
              </div>
            </div>
            <div className="col-md-4" data-aos="fade-up" data-aos-duration="800" data-aos-delay="300">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h3>{t('home.why_section.features.tips.title')}</h3>
                <p>{t('home.why_section.features.tips.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-title" data-aos="fade-up" data-aos-duration="800">
            <h2>{t('home.features.title')}</h2>
            <p>{t('home.features.subtitle')}</p>
          </div>

          {/* Personalized Budgeting Tools */}
          <div className="feature-item">
            <div className="row align-items-center">
              <div className="col-lg-6" data-aos="fade-right" data-aos-duration="1000">
                <div className="feature-badge">
                  <i className="fas fa-chart-line"></i> {t('home.features.budgeting.title')}
                </div>
                <h3>{t('home.features.budgeting.title')}</h3>
                <p>{t('home.features.budgeting.description')}</p>
                <Link to="/budget" className="btn btn-outline-primary">
                  {t('home.features.budgeting.learn_more')} <i className="fas fa-chevron-right ms-1"></i>
                </Link>
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
                  <i className="fas fa-shield-alt"></i> {t('home.features.recommendations.title')}
                </div>
                <h3>{t('home.features.recommendations.title')}</h3>
                <p>{t('home.features.recommendations.description')}</p>
                <Link to="/planner" className="btn btn-outline-primary">
                  {t('home.features.recommendations.learn_more')} <i className="fas fa-chevron-right ms-1"></i>
                </Link>
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
                  <i className="fas fa-tag"></i> {t('home.features.database.title')}
                </div>
                <h3>{t('home.features.database.title')}</h3>
                <p>{t('home.features.database.description')}</p>
                <Link to="/discounts" className="btn btn-outline-primary">
                  {t('home.features.database.learn_more')} <i className="fas fa-chevron-right ms-1"></i>
                </Link>
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
                  <i className="fas fa-users"></i> {t('home.features.community.title')}
                </div>
                <h3>{t('home.features.community.title')}</h3>
                <p>{t('home.features.community.description')}</p>
                <Link to="/discounts" className="btn btn-outline-primary">
                  {t('home.features.community.learn_more')} <i className="fas fa-chevron-right ms-1"></i>
                </Link>
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
                  <i className="fas fa-book-open"></i> {t('home.features.education.title')}
                </div>
                <h3>{t('home.features.education.title')}</h3>
                <p>{t('home.features.education.description')}</p>
                <Link to="/tips" className="btn btn-outline-primary">
                  {t('home.features.education.learn_more')} <i className="fas fa-chevron-right ms-1"></i>
                </Link>
              </div>
              <div className="col-lg-6" data-aos="fade-left" data-aos-duration="1000">
                <img src="/Media/tip.png" alt="Educational Resources" className="img-fluid feature-img" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section - Only show if not authenticated */}
      {!user && (
        <section className="cta">
          <div className="container">
            <div data-aos="fade-up" data-aos-duration="1000">
              <h2>{t('home.cta.title')}</h2>
              <p>{t('home.cta.subtitle')}</p>
              <div className="d-flex justify-content-center flex-wrap gap-2">
                <Link to="/signup" className="btn btn-primary btn-lg me-2 mb-2 mb-md-0">
                  {t('home.cta.signup')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export default Home;