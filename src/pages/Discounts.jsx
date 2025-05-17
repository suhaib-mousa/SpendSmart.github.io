import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../styles/Discounts.css';
import { getDeals, getDealReviews, getUserReview, createReview, updateReview } from '../services/api';

function Discounts() {
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
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
    
    // Get user from localStorage
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
    }
  };

  const fetchUserReview = async (dealId) => {
    try {
      console.log('Fetching user review for deal:', dealId);
      const data = await getUserReview(dealId);
      console.log('User review data:', data);
      if (data) {
        setUserReview(data);
        setRating(data.rating);
        setReviewComment(data.comment);
      }
    } catch (err) {
      console.error('Error fetching user review:', err);
    }
  };

  const handleDealClick = (deal) => {
    setSelectedDeal(deal);
    setRating(0);
    setReviewComment('');
    setIsEditing(false);
  };

  const closeModal = () => {
    setSelectedDeal(null);
    setUserReview(null);
    setRating(0);
    setReviewComment('');
    setIsEditing(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting review...');

    if (!user) {
      console.log('No user logged in, redirecting to login');
      sessionStorage.setItem('pendingReviewDeal', selectedDeal._id);
      navigate('/login');
      return;
    }

    try {
      const reviewData = {
        deal: selectedDeal._id,
        rating,
        comment: reviewComment
      };

      if (userReview) {
        await updateReview(userReview._id, reviewData);
      } else {
        await createReview(reviewData);
      }

      await fetchDealReviews(selectedDeal._id);
      await fetchDeals();
      await fetchUserReview(selectedDeal._id);
      
      setIsEditing(false);
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  // Rest of your component code (render method, etc.)
  // ... (keep all the existing JSX and other code)

  return (
    // ... your existing JSX
  );
}

export default Discounts;