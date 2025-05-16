import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

function Budget() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12" data-aos="fade-up">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Budget Analysis</h1>
        <p className="text-lg text-gray-600">Take control of your finances with our smart budgeting tools</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-xl font-semibold mb-4">Income Tracking</h2>
          <p className="text-gray-600">Monitor your income sources and analyze your earning patterns</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-up" data-aos-delay="200">
          <h2 className="text-xl font-semibold mb-4">Expense Management</h2>
          <p className="text-gray-600">Track and categorize your expenses to understand your spending habits</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6" data-aos="fade-up" data-aos-delay="300">
          <h2 className="text-xl font-semibold mb-4">Savings Goals</h2>
          <p className="text-gray-600">Set and track your savings goals with our interactive tools</p>
        </div>
      </div>
    </div>
  );
}

export default Budget;