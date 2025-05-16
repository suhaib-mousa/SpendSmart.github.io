import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Discounts.css';

function Discounts() {
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPriceRange, setPriceRange] = useState('');
  const [selectedDiscount, setDiscount] = useState('');

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  const handleDealClick = (deal) => {
    setSelectedDeal(deal);
  };

  const closeModal = () => {
    setSelectedDeal(null);
  };

  // Get unique locations for filter
  const locations = [...new Set(deals.map(deal => deal.location))];

  // Filter deals based on search and filters
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deal.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = !selectedLocation || deal.location === selectedLocation;
    
    const matchesPriceRange = () => {
      if (!selectedPriceRange) return true;
      const price = deal.currentPrice;
      switch(selectedPriceRange) {
        case 'under50': return price < 50;
        case '50to100': return price >= 50 && price <= 100;
        case '100to200': return price > 100 && price <= 200;
        case 'over200': return price > 200;
        default: return true;
      }
    };

    const matchesDiscount = () => {
      if (!selectedDiscount) return true;
      const discountPercent = parseInt(deal.discount);
      switch(selectedDiscount) {
        case 'under25': return discountPercent < 25;
        case '25to50': return discountPercent >= 25 && discountPercent <= 50;
        case 'over50': return discountPercent > 50;
        default: return true;
      }
    };

    return matchesSearch && matchesLocation && matchesPriceRange() && matchesDiscount();
  });

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
                <input 
                  type="text" 
                  placeholder="Search for deals, locations, or categories..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <img src="/Media/disc.png" alt="Discover Deals" className="hero-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="row g-3">
            <div className="col-md-3">
              <select 
                className="form-select" 
                value={selectedLocation} 
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select" 
                value={selectedPriceRange} 
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="">Price Range</option>
                <option value="under50">Under 50 JD</option>
                <option value="50to100">50-100 JD</option>
                <option value="100to200">100-200 JD</option>
                <option value="over200">Over 200 JD</option>
              </select>
            </div>
            <div className="col-md-3">
              <select 
                className="form-select" 
                value={selectedDiscount} 
                onChange={(e) => setDiscount(e.target.value)}
              >
                <option value="">Discount Range</option>
                <option value="under25">Under 25%</option>
                <option value="25to50">25-50%</option>
                <option value="over50">Over 50%</option>
              </select>
            </div>
            <div className="col-md-3">
              <button 
                className="btn btn-outline-primary w-100"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLocation('');
                  setPriceRange('');
                  setDiscount('');
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* All Deals Section */}
      <section className="all-deals-section">
        <div className="container">
          <div className="row">
            {filteredDeals.map((deal, index) => (
              <div className="col-lg-3 col-md-6 mb-4" key={index} data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="deal-card" onClick={() => handleDealClick(deal)}>
                  <div className="deal-image">
                    <img src={deal.image} alt={deal.title} />
                    <div className="deal-tag">{deal.discount} OFF</div>
                  </div>
                  <div className="deal-details">
                    <h3>{deal.title}</h3>
                    <p className="location">{deal.location}</p>
                    <div className="deal-meta">
                      <span className="price">
                        <span className="original">{deal.originalPrice} JD</span>
                        <span className="current">{deal.currentPrice} JD</span>
                      </span>
                      <span className="saved">Save {deal.originalPrice - deal.currentPrice} JD</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {filteredDeals.length === 0 && (
              <div className="col-12 text-center py-5">
                <h3>No deals found matching your criteria</h3>
                <p>Try adjusting your filters or search term</p>
              </div>
            )}
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

      {/* Deal Modal */}
      {selectedDeal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedDeal.title}</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <img src={selectedDeal.image} alt={selectedDeal.title} className="img-fluid rounded" />
                  </div>
                  <div className="col-md-6">
                    <h4>Deal Details</h4>
                    <p><strong>Location:</strong> {selectedDeal.location}</p>
                    <p><strong>Original Price:</strong> {selectedDeal.originalPrice} JD</p>
                    <p><strong>Discounted Price:</strong> {selectedDeal.currentPrice} JD</p>
                    <p><strong>You Save:</strong> {selectedDeal.originalPrice - selectedDeal.currentPrice} JD</p>
                    <p><strong>Discount:</strong> {selectedDeal.discount}</p>
                    <p className="text-muted">Valid until: {selectedDeal.validUntil}</p>
                    <button className="btn btn-primary w-100 mt-3">Get This Deal</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" onClick={closeModal}></div>
        </div>
      )}
    </div>
  );
}

const deals = [
  {
    title: "Adventure Gear",
    location: "Amman, Jordan",
    originalPrice: 100,
    currentPrice: 50,
    discount: "50%",
    image: "/Media/camping.png",
    validUntil: "2025-12-31"
  },
  {
    title: "Business Attire",
    location: "Irbid, Jordan",
    originalPrice: 200,
    currentPrice: 140,
    discount: "30%",
    image: "/Media/businessman-1026415_640.jpg",
    validUntil: "2025-12-31"
  },
  {
    title: "Team Activities",
    location: "Aqaba, Jordan",
    originalPrice: 80,
    currentPrice: 60,
    discount: "25%",
    image: "/Media/teamwork-7423959_640.jpg",
    validUntil: "2025-12-31"
  },
  {
    title: "Electronics",
    location: "Zarqa, Jordan",
    originalPrice: 500,
    currentPrice: 300,
    discount: "40%",
    image: "/Media/disc.png",
    validUntil: "2025-12-31"
  },
  {
    title: "Outdoor Adventures",
    location: "Petra, Jordan",
    originalPrice: 150,
    currentPrice: 90,
    discount: "40%",
    image: "/Media/Untitled design(1).png",
    validUntil: "2025-12-31"
  },
  {
    title: "Family Fun",
    location: "Dead Sea, Jordan",
    originalPrice: 120,
    currentPrice: 84,
    discount: "30%",
    image: "/Media/Untitled design(3).png",
    validUntil: "2025-12-31"
  },
  {
    title: "Wellness & Spa",
    location: "Amman, Jordan",
    originalPrice: 200,
    currentPrice: 140,
    discount: "30%",
    image: "/Media/Untitled design(4).png",
    validUntil: "2025-12-31"
  },
  {
    title: "Cultural Tours",
    location: "Jerash, Jordan",
    originalPrice: 90,
    currentPrice: 63,
    discount: "30%",
    image: "/Media/Untitled design(5).png",
    validUntil: "2025-12-31"
  }
];

export default Discounts;