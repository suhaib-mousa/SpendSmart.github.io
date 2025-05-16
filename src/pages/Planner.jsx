import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Planner() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Financial Planner</h1>
        <p className="text-lg text-gray-600">Plan your financial future with our comprehensive tools</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-right">
          <h2 className="text-xl font-semibold mb-4">Investment Planning</h2>
          <p className="text-gray-600">Create and monitor your investment strategy</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-left">
          <h2 className="text-xl font-semibold mb-4">Retirement Planning</h2>
          <p className="text-gray-600">Plan for your retirement with our calculation tools</p>
        </div>
      </div>
    </div>
  );
}

export default Planner;