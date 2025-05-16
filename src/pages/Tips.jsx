import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Tips() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Financial Tips</h1>
        <p className="text-lg text-gray-600">Expert advice to help you make better financial decisions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-right">
          <h2 className="text-xl font-semibold mb-4">Saving Tips</h2>
          <p className="text-gray-600">Learn effective strategies to save more money</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-left">
          <h2 className="text-xl font-semibold mb-4">Investment Tips</h2>
          <p className="text-gray-600">Smart investment strategies for beginners</p>
        </div>
      </div>
    </div>
  );
}

export default Tips;