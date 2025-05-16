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
  const [rating, setRating] = useState(0);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
  }, []);

  useEffect(() => {
    if (selectedDeal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedDeal]);

  const handleDealClick = (deal) => {
    setSelectedDeal(deal);
    // Reset review form
    setRating(0);
    setReviewName('');
    setReviewComment('');
  };

  const closeModal = () => {
    setSelectedDeal(null);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    // Here you would typically submit the review to a backend
    console.log('Review submitted:', { name: reviewName, rating, comment: reviewComment });
    // Clear form
    setRating(0);
    setReviewName('');
    setReviewComment('');
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
                    {deal.isNew && <div className="badge-new">NEW</div>}
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

      {/* Expanded Deal Modal */}
      {selectedDeal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="expanded-card bg-white rounded-lg shadow-lg">
                <div className="relative overflow-hidden">
                  <img src={selectedDeal.image} alt={selectedDeal.title} className="w-full h-64 object-cover" />
                  <div className="absolute top-0 right-0 p-4">
                    <span className="discount-badge">{selectedDeal.discount} OFF</span>
                  </div>
                  <button onClick={closeModal} className="absolute top-4 left-4 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                    <i className="fas fa-times"></i>
                  </button>
                  {selectedDeal.isNew && <div className="badge-new">NEW</div>}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">{selectedDeal.title}</h2>
                    <div>
                      <div className="star-rating">
                        <div className="empty-stars">★★★★★</div>
                        <div className="filled-stars" style={{width: `${selectedDeal.rating * 20}%`}}>★★★★★</div>
                      </div>
                      <span className="ml-1">({selectedDeal.rating})</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="category-badge">{selectedDeal.category}</span>
                    <span className="location-badge">{selectedDeal.location}</span>
                    <span className="text-gray-500 text-sm py-1 px-2 bg-gray-100 rounded-md">
                      Expires on {selectedDeal.validUntil}
                    </span>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">About This Discount</h3>
                    <p className="text-gray-700 mb-4">{selectedDeal.description}</p>
                    <div className="flex items-center text-gray-700">
                      <i className="fas fa-map-marker-alt mr-2 text-red-500"></i>
                      <span>{selectedDeal.address}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mb-6">
                    <h3 className="text-lg font-semibold mb-4">Reviews & Feedback</h3>
                    <div className="feedback-list mb-6">
                      {selectedDeal.reviews?.map((review, index) => (
                        <div key={index} className="review-item p-3 bg-gray-50 rounded-lg mb-3">
                          <div className="flex justify-between items-start">
                            <div className="font-medium">{review.name}</div>
                            <div className="text-gray-500 text-sm">{review.date}</div>
                          </div>
                          <div className="my-1">
                            <div className="star-rating">
                              <div className="empty-stars">★★★★★</div>
                              <div className="filled-stars" style={{width: `${review.rating * 20}%`}}>★★★★★</div>
                            </div>
                          </div>
                          <p className="text-gray-700 mt-2">{review.comment}</p>
                        </div>
                      ))}
                    </div>

                    <div className="review-form bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Add Your Review</h4>
                      <form onSubmit={handleReviewSubmit}>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-medium mb-1">Your Name</label>
                          <input
                            type="text"
                            className="name-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-medium mb-1">Rating</label>
                          <div className="star-input-container flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`star-input ${rating >= star ? 'active' : ''}`}
                                onClick={() => setRating(star)}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="block text-gray-700 text-sm font-medium mb-1">Your Review</label>
                          <textarea
                            className="comment-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows="3"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            required
                          ></textarea>
                        </div>
                        <button type="submit" className="submit-review btn-primary w-full py-2 rounded-md">
                          Submit Review
                        </button>
                      </form>
                    </div>
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
    validUntil: "2025-12-31",
    category: "Outdoor",
    rating: 4.5,
    isNew: true,
    description: "Get the best deals on camping and hiking gear. Perfect for your next outdoor adventure.",
    address: "King Hussein Business Park, Amman",
    reviews: [
      {
        name: "Ahmad Ibrahim",
        date: "Apr 15, 2025",
        rating: 5,
        comment: "Great quality gear at an amazing price!"
      },
      {
        name: "Layla Hassan",
        date: "Mar 22, 2025",
        rating: 4,
        comment: "Good selection and helpful staff."
      }
    ]
  },
  {
    title: "Business Attire",
    location: "Irbid, Jordan",
    originalPrice: 200,
    currentPrice: 140,
    discount: "30%",
    image: "/Media/businessman-1026415_640.jpg",
    validUntil: "2025-12-31",
    category: "Fashion",
    rating: 4.2,
    description: "Professional business wear for men and women. Suits, shirts, and accessories.",
    address: "University Street, Irbid",
    reviews: [
      {
        name: "Omar Khalil",
        date: "Apr 10, 2025",
        rating: 4,
        comment: "Great quality suits at reasonable prices"
      }
    ]
  },
  {
    title: "Team Activities",
    location: "Aqaba, Jordan",
    originalPrice: 80,
    currentPrice: 60,
    discount: "25%",
    image: "/Media/teamwork-7423959_640.jpg",
    validUntil: "2025-12-31",
    category: "Activities",
    rating: 4.8,
    description: "Team building activities and water sports in Aqaba.",
    address: "South Beach, Aqaba",
    reviews: [
      {
        name: "Sarah Ahmed",
        date: "Apr 5, 2025",
        rating: 5,
        comment: "Amazing experience for our team!"
      }
    ]
  },
  {
    title: "Electronics",
    location: "Zarqa, Jordan",
    originalPrice: 500,
    currentPrice: 300,
    discount: "40%",
    image: "/Media/disc.png",
    validUntil: "2025-12-31",
    category: "Technology",
    rating: 4.3,
    isNew: true,
    description: "Latest electronics and gadgets at discounted prices.",
    address: "New Zarqa, Main Street",
    reviews: [
      {
        name: "Mohammed Ali",
        date: "Apr 1, 2025",
        rating: 4,
        comment: "Good deals on smartphones and laptops"
      }
    ]
  },
  {
    title: "Outdoor Adventures",
    location: "Petra, Jordan",
    originalPrice: 150,
    currentPrice: 90,
    discount: "40%",
    image: "/Media/Untitled design(1).png",
    validUntil: "2025-12-31",
    category: "Activities",
    rating: 4.7,
    description: "Guided tours and adventures in Petra.",
    address: "Petra Visitor Center",
    reviews: [
      {
        name: "John Smith",
        date: "Mar 28, 2025",
        rating: 5,
        comment: "Unforgettable experience in Petra!"
      }
    ]
  },
  {
    title: "Family Fun",
    location: "Dead Sea, Jordan",
    originalPrice: 120,
    currentPrice: 84,
    discount: "30%",
    image: "/Media/Untitled design(3).png",
    validUntil: "2025-12-31",
    category: "Activities",
    rating: 4.6,
    description: "Family activities and resort access at the Dead Sea.",
    address: "Dead Sea Tourist Beach",
    reviews: [
      {
        name: "Rania Mahmoud",
        date: "Mar 25, 2025",
        rating: 5,
        comment: "Perfect family day out"
      }
    ]
  },
  {
    title: "Wellness & Spa",
    location: "Amman, Jordan",
    originalPrice: 200,
    currentPrice: 140,
    discount: "30%",
    image: "/Media/Untitled design(4).png",
    validUntil: "2025-12-31",
    category: "Wellness",
    rating: 4.4,
    description: "Luxury spa treatments and wellness packages.",
    address: "Rainbow Street, Amman",
    reviews: [
      {
        name: "Lina Kamal",
        date: "Mar 20, 2025",
        rating: 4,
        comment: "Relaxing spa experience"
      }
    ]
  },
  {
    title: "Cultural Tours",
    location: "Jerash, Jordan",
    originalPrice: 90,
    currentPrice: 63,
    discount: "30%",
    image: "/Media/Untitled design(5).png",
    validUntil: "2025-12-31",
    category: "Culture",
    rating: 4.9,
    description: "Guided tours of ancient Jerash with expert historians.",
    address: "Jerash Archaeological Site",
    reviews: [
      {
        name: "David Wilson",
        date: "Mar 15, 2025",
        rating: 5,
        comment: "Fascinating historical tour"
      }
    ]
  }
];

export default Discounts;