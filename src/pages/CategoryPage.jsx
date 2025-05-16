import React from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/CategoryPage.css';

function CategoryPage() {
  const { categoryName } = useParams();
  
  return (
    <div className="category-page">
      <div className="container py-5">
        <div className="category-header">
          <h1 className="mb-4">{categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Deals</h1>
          <Link to="/discounts" className="back-link">
            <i className="fas fa-arrow-left"></i> Back to All Deals
          </Link>
        </div>
        
        <div className="alert alert-info">
          <i className="fas fa-info-circle"></i> Showing deals for {categoryName}
        </div>
        
        <div className="deals-grid">
          {/* Placeholder for deals */}
          <div className="no-deals-message">
            <i className="fas fa-search"></i>
            <p>Loading deals for {categoryName}...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;