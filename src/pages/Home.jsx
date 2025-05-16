import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Home() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  return (
    <div className="container mx-auto px-4">
      <section className="hero py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="text-content" data-aos="fade-right">
            <h1 className="text-5xl font-bold mb-6">Spend Smart, Live Better</h1>
            <p className="text-xl mb-8">Take control of your finances with Jordan's premier budget management and discount discovery platform.</p>
            <div className="flex gap-4">
              <Link to="/budget" className="btn btn-primary">Start Saving Now</Link>
              <Link to="/discounts" className="btn btn-outline">Explore Discounts</Link>
            </div>
          </div>
          <div className="hero-image" data-aos="fade-left">
            <img src="/Media/Media/Hero.png" alt="SpendSmart Hero" className="w-full" />
          </div>
        </div>
      </section>

      <section className="features py-16">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-4xl font-bold mb-4">Why SpendSmart</h2>
          <p className="text-xl">Empowering you to make smarter financial decisions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-2xl font-semibold mb-4">Budget Analysis</h3>
            <p>Track your expenses and optimize your spending habits</p>
          </div>
          <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-2xl font-semibold mb-4">Smart Savings</h3>
            <p>Discover the best deals and discounts in your area</p>
          </div>
          <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
            <h3 className="text-2xl font-semibold mb-4">Financial Tips</h3>
            <p>Learn from expert advice and improve your financial health</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;