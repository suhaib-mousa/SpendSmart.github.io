// Add these console logs to the fetchUserReview function
const fetchUserReview = async (dealId) => {
  try {
    console.log('Fetching user review for deal:', dealId);
    const token = localStorage.getItem('token');
    console.log('Token:', token ? 'exists' : 'missing');
    
    if (!token) {
      console.log('No token found, skipping review fetch');
      return;
    }

    const response = await fetch(`http://localhost:5000/api/reviews/user/${dealId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Review fetch response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('User review data:', data);
      if (data) {
        setUserReview(data);
        setRating(data.rating);
        setReviewComment(data.comment);
      }
    } else {
      console.log('Failed to fetch user review:', await response.text());
    }
  } catch (err) {
    console.error('Error fetching user review:', err);
  }
};

// Add these console logs to the handleReviewSubmit function
const handleReviewSubmit = async (e) => {
  e.preventDefault();
  console.log('Submitting review...');
  console.log('User:', user);
  console.log('Rating:', rating);
  console.log('Comment:', reviewComment);

  if (!user) {
    console.log('No user logged in, redirecting to login');
    sessionStorage.setItem('pendingReviewDeal', selectedDeal._id);
    navigate('/login');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    console.log('Token for review submission:', token ? 'exists' : 'missing');

    const response = await fetch('http://localhost:5000/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        deal: selectedDeal._id,
        rating,
        comment: reviewComment
      })
    });

    console.log('Review submission response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Review submission error:', errorText);
      throw new Error('Failed to submit review');
    }

    const savedReview = await response.json();
    console.log('Saved review:', savedReview);
    
    await fetchDealReviews(selectedDeal._id);
    await fetchDeals();
    
    setUserReview(savedReview);
    setIsEditing(false);
    
    if (!userReview) {
      setRating(0);
      setReviewComment('');
    }
  } catch (err) {
    console.error('Error submitting review:', err);
  }
};