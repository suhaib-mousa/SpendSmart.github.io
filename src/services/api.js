import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 10000,
});

// Add auth token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    
    if (!error.response) {
      throw new Error(
        'Unable to reach the server. Please check if the server is running and try again.'
      );
    }
    
    throw error;
  }
);

export const getDeals = async () => {
  try {
    const response = await api.get('/deals');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error(
          'Network error: Unable to connect to the server. Please ensure the server is running at http://localhost:5000'
        );
      }
      if (error.response.status === 403) {
        throw new Error('Access forbidden. Please check your CORS configuration.');
      }
      throw new Error(`Error fetching deals: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }
};

export const getDealReviews = async (dealId) => {
  try {
    const response = await api.get(`/reviews/deal/${dealId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserReview = async (dealId) => {
  try {
    const response = await api.get(`/reviews/user/${dealId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createReview = async (reviewData) => {
  try {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateReview = async (reviewId, reviewData) => {
  try {
    const response = await api.patch(`/reviews/${reviewId}`, reviewData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/categories');
    return response.data;
  } catch (error) {
    throw error;
  }
};