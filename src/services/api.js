import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    
    if (!error.response) {
      throw new Error(
        'Unable to reach the server. Please check if the server is running.'
      );
    }
    
    throw error;
  }
);

export const getDeals = async () => {
  try {
    const response = await api.get('/deals');
    console.log(response)
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
  const response = await api.get(`/reviews/deal/${dealId}`);
  return response.data;
};

export const getUserReview = async (dealId) => {
  const response = await api.get(`/reviews/user/${dealId}`);
  return response.data;
};

export const createReview = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

export const updateReview = async (reviewId, reviewData) => {
  const response = await api.patch(`/reviews/${reviewId}`, reviewData);
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

export const getTips = async () => {
  const response = await api.get('/tips');
  return response.data;
};

export const savePlannerEntry = async (plannerData) => {
  const response = await api.post('/planner', plannerData);
  return response.data;
};

export const getPlannerHistory = async () => {
  const response = await api.get('/planner');
  return response.data;
};

export const saveBudgetAnalysis = async (budgetData) => {
  const response = await api.post('/budget', budgetData);
  return response.data;
};

export const getBudgetHistory = async () => {
  const response = await api.get('/budget');
  return response.data;
};