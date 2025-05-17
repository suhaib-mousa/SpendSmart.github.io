import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Discounts.css';
import { getDeals, getDealReviews, getUserReview, createReview, updateReview, deleteReview } from '../services/api';
import { toast } from 'react-hot-toast';

function Discounts() {
  const [deals, setDeals] = useState([]);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [dealReviews, setDealReviews] = useState([]);
  const [userReview, setUserReview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedPriceRange, setPriceRange] = useState('');
  const [selectedDiscount, setDiscount] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true
    });
    fetchDeals();
    
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (selectedDeal) {
      document.body.classList.add('modal-open');
      fetchDealReviews(selectedDeal._id);
      if (user) {
        fetchUserReview(selectedDeal._id);
      }
    } else {
      document.body.classList.remove('modal-open');
      setUserReview(null);
      setRating(0);
      setReviewComment('');
      setIsEditing(false);
    }
    
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [selectedDeal, user]);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const data = await getDeals();
      setDeals(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch deals');
      console.error('Error fetching deals:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDealReviews = async (dealId) => {
    try {
      const data = await getDealReviews(dealId);
      setDealReviews(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      toast.error('Failed to load reviews');
    }
  };

  const fetchUserReview = async (dealId) => {
    try {
      const data = await getUserReview(dealId);
      if (data) {
        setUserReview(data);
        setRating(data.rating);
        setReviewComment(data.comment);
      } else {
        setUserReview(null);
        setRating(0);
        setReviewComment('');
      }
    } catch (err) {
      console.error('Error fetching user review:', err);
    }
  };

  const handleDealClick = (deal) => {
    setSelectedDeal(deal);
    setIsEditing(false);
  };

  const closeModal = () => {
    setSelectedDeal(null);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setRating(userReview.rating);
    setReviewComment(userReview.comment);
  };

  const handleDeleteReview = async () => {
    if (!window.confirm('Are you sure you want to delete your review?')) {
      return;
    }

    try {
      await deleteReview(userReview._id);
      toast.success('Review deleted successfully');
      setUserReview(null);
      setRating(0);
      setReviewComment('');
      await fetchDealReviews(selectedDeal._id);
      await fetchDeals();
    } catch (err) {
      console.error('Error deleting review:', err);
      toast.error('Failed to delete review');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      sessionStorage.setItem('pendingReviewDeal', selectedDeal._id);
      navigate('/login');
      return;
    }

    if (!rating) {
      toast.error('Please select a rating');
      return;
    }

    if (!reviewComment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }

    try {
      const reviewData = {
        deal: selectedDeal._id,
        rating,
        comment: reviewComment.trim()
      };

      if (userReview) {
        await updateReview(userReview._id, reviewData);
        toast.success('Review updated successfully');
      } else {
        await createReview(reviewData);
        toast.success('Review submitted successfully');
      }

      await fetchDealReviews(selectedDeal._id);
      await fetchDeals();
      await fetchUserReview(selectedDeal._id);
      setIsEditing(false);
    } catch (err) {
      console.error('Error submitting review:', err);
      toast.error(err.response?.data?.message || 'Failed to submit review');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    if (userReview) {
      setRating(userReview.rating);
      setReviewComment(userReview.comment);
    } else {
      setRating(0);
      setReviewComment('');
    }
  };

  // Get unique locations for filter
  const locations = [...new Set(deals.map(deal => deal.location))];

  // Filter deals based on search and filters
  const filteredDeals = deals.filter(deal => {
    // Skip filtering for non-authenticated users
    if (!user) {
      return true;
    }

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

  // Limit deals for non-authenticated users
  const displayedDeals = user ? filteredDeals : filteredDeals.slice(0, 4);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="discounts-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6" data-aos="fade-right">
              <h1>Find the Best Deals</h1>
              <p>Discover amazing discounts and offers across Jordan</p>
              {user && (
                <div className="search-box">
                  <input 
                    type="text" 
                    placeholder="Search for deals, locations, or categories..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <img src="/Media/disc.png" alt="Discover Deals" className="hero-image" />
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section - Only show for authenticated users */}
      {user && (
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
      )}

      {/* All Deals Section */}
      <section className="all-deals-section">
        <div className="container">
          {!user && (
            <div className="alert alert-info text-center mb-4" role="alert">
              <h4 className="alert-heading mb-2">Limited Preview</h4>
              <p className="mb-0">
                <Link to="/login" className="alert-link">Log in</Link> or <Link to="/signup" className="alert-link">sign up</Link> to see all available deals and unlock advanced features!
              </p>
            </div>
          )}

          <div className="row">
            {displayedDeals.map((deal, index) => (
              <div className="col-lg-3 col-md-6 mb-4" key={deal._id} data-aos="fade-up" data-aos-delay={index * 100}>
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
            
            {displayedDeals.length === 0 && (
              <div className="col-12 text-center py-5">
                <h3>No deals found matching your criteria</h3>
                <p>Try adjusting your filters or search term</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Deal Modal */}
      {selectedDeal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-backdrop show" onClick={closeModal}></div>
          <div className="modal-dialog modal-xl">
            <div className="modal-content">
              <div className="expanded-card bg-white rounded-lg shadow-lg">
                <div className="relative overflow-hidden">
                  <img src={selectedDeal.image} alt={selectedDeal.title} className="w-full h-64 object-cover" />
                  <div className="absolute top-0 right-0 p-4">
                    <span className="discount-badge">{selectedDeal.discount} OFF</span>
                  </div>
                  <button onClick={closeModal} className="close absolute top-4 right-4 bg-light rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">{selectedDeal.title}</h2>
                    {selectedDeal.isNew && <div className="badge-new">NEW</div>}
                    
                    <div>
                      <div className="star-rating">
                        <div className="empty-stars">★★★★★</div>
                        <div className="filled-stars" style={{width: `${selectedDeal.rating * 20}%`}}>★★★★★</div>
                      </div>
                      <span className="ml-1">({selectedDeal.numReviews} reviews)</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="category-badge">{selectedDeal.category?.name || 'Uncategorized'}</span>
                    <span className="location-badge">{selectedDeal.location}</span>
                    <span className="text-gray-500 text-sm py-1 px-2 bg-gray-100 rounded-md">
                      Expires on {new Date(selectedDeal.validUntil).toLocaleDateString()}
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
                    
                    {user && (
                      <div className="review-form bg-gray-50 p-4 rounded-lg mb-4">
                        {!userReview || isEditing ? (
                          <form onSubmit={handleReviewSubmit}>
                            <h4 className="font-medium mb-3">
                              {userReview ? 'Edit Your Review' : 'Add Your Review'}
                            </h4>
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
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="3"
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                required
                              ></textarea>
                            </div>
                            <div className="flex gap-3">
                              <input type="submit" className="btn btn-primary mx-2"
                                value={userReview ? 'Update Review' : 'Submit Review'}
                              />
                              {isEditing && (
                                <div 
                                  type="button" 
                                  className="btn btn-secondary"
                                  onClick={handleCancelEdit}
                                >
                                  Cancel
                                </div>
                              )}
                            </div>
                          </form>
                        ) : (
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium mb-3">Your Review</h4>
                              <div className='d-flex float-end'>
                                <div 
                                  onClick={handleEditClick}
                                  className="btn btn-sm btn-outline-primary me-2"
                                >
                                  <i className='fa fa-edit'></i>
                                </div>
                                <div 
                                  onClick={handleDeleteReview}
                                  className="btn btn-sm btn-outline-danger"
                                >
                                  <i className='fa fa-trash'></i>
                                </div>
                              </div>
                            </div>
                            <div className="star-rating mb-2">
                              <div className="empty-stars">★★★★★</div>
                              <div 
                                className="filled-stars"
                                style={{width: `${userReview.rating * 20}%`}}
                              >
                                ★★★★★
                              </div>
                            </div>
                            <p>{userReview.comment}</p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="other-reviews">
                      <h4 className="font-medium mb-3">
                        {user ? 'Other Reviews' : 'Reviews'}
                      </h4>
                      {dealReviews.length > 0 ? (
                        dealReviews.map((review) => (
                          (!user || review.user !== user.id) && (
                            <div key={review._id} className="review-item p-3 bg-gray-50 rounded-lg mb-3">
                              <div className="flex justify-between items-start">
                                <div className="font-medium">{review.name}</div>
                                <div className="text-gray-500 text-sm">
                                  {new Date(review.date).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="my-1">
                                <div className="star-rating">
                                  <div className="empty-stars">★★★★★</div>
                                  <div 
                                    className="filled-stars"
                                    style={{width: `${review.rating * 20}%`}}
                                  >
                                    ★★★★★
                                  </div>
                                </div>
                              </div>
                              <p className="text-gray-700 mt-2">{review.comment}</p>
                            </div>
                          )
                        ))
                      ) : (
                        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                      )}
                    </div>

                    {!user && (
                      <div className="text-center mt-4">
                        <p className="mb-3">Please log in to leave a review</p>
                        <Link to="/login" className="btn btn-primary">
                          Log In
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Discounts;