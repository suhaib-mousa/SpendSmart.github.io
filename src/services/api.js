import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDeals = async () => {
  try {
    const response = await api.get('/deals');
    return response.data;
  } catch (error) {
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

export const createReview = async (reviewData) => {
  try {
    const response = await api.post('/reviews', reviewData);
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