import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Discounts() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Available Discounts</h1>
        <p className="text-lg text-gray-600">Find the best deals and save money on your purchases</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-xl font-semibold mb-4">Retail Discounts</h2>
          <p className="text-gray-600">Latest deals from your favorite stores</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-up" data-aos-delay="200">
          <h2 className="text-xl font-semibold mb-4">Restaurant Offers</h2>
          <p className="text-gray-600">Special deals and promotions at local restaurants</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-up" data-aos-delay="300">
          <h2 className="text-xl font-semibold mb-4">Service Discounts</h2>
          <p className="text-gray-600">Save on services and subscriptions</p>
        </div>
      </div>
    </div>
  );
}

export default Discounts;