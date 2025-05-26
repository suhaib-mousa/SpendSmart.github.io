import axios from 'axios';
import {
  getDeals,
  getDealReviews,
  getUserReview,
  createReview,
  updateReview,
  deleteReview,
  getCategories,
  getTips,
  savePlannerEntry,
  getPlannerHistory,
  saveBudgetAnalysis,
  getBudgetHistory
} from './api';

jest.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDeals', () => {
    test('fetches deals successfully', async () => {
      const mockDeals = [{ id: 1, title: 'Test Deal' }];
      axios.get.mockResolvedValueOnce({ data: mockDeals });

      const result = await getDeals();
      expect(result).toEqual(mockDeals);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/deals');
    });

    test('handles network error', async () => {
      axios.get.mockRejectedValueOnce(new Error('Network error'));
      await expect(getDeals()).rejects.toThrow('Network error');
    });
  });

  describe('getDealReviews', () => {
    test('fetches reviews for a deal', async () => {
      const mockReviews = [{ id: 1, comment: 'Great deal!' }];
      axios.get.mockResolvedValueOnce({ data: mockReviews });

      const result = await getDealReviews('deal-1');
      expect(result).toEqual(mockReviews);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/reviews/deal/deal-1');
    });
  });

  describe('getUserReview', () => {
    test('fetches user review for a deal', async () => {
      const mockReview = { id: 1, comment: 'My review' };
      axios.get.mockResolvedValueOnce({ data: mockReview });

      const result = await getUserReview('deal-1');
      expect(result).toEqual(mockReview);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/reviews/user/deal-1');
    });
  });

  describe('createReview', () => {
    test('creates a new review', async () => {
      const mockReview = { dealId: 'deal-1', comment: 'New review' };
      axios.post.mockResolvedValueOnce({ data: mockReview });

      const result = await createReview(mockReview);
      expect(result).toEqual(mockReview);
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/reviews', mockReview);
    });
  });

  describe('savePlannerEntry', () => {
    test('saves planner entry successfully', async () => {
      const mockEntry = {
        monthlyIncome: 5000,
        expenses: { housing: 1500 }
      };
      axios.post.mockResolvedValueOnce({ data: mockEntry });

      const result = await savePlannerEntry(mockEntry);
      expect(result).toEqual(mockEntry);
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/planner', mockEntry);
    });
  });

  describe('getPlannerHistory', () => {
    test('fetches planner history', async () => {
      const mockHistory = [{ id: 1, monthlyIncome: 5000 }];
      axios.get.mockResolvedValueOnce({ data: mockHistory });

      const result = await getPlannerHistory();
      expect(result).toEqual(mockHistory);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/planner');
    });
  });

  describe('saveBudgetAnalysis', () => {
    test('saves budget analysis', async () => {
      const mockAnalysis = {
        totalIncome: 5000,
        savingsGoal: 1000
      };
      axios.post.mockResolvedValueOnce({ data: mockAnalysis });

      const result = await saveBudgetAnalysis(mockAnalysis);
      expect(result).toEqual(mockAnalysis);
      expect(axios.post).toHaveBeenCalledWith('http://localhost:5000/api/budget', mockAnalysis);
    });
  });

  describe('getBudgetHistory', () => {
    test('fetches budget history', async () => {
      const mockHistory = [{ id: 1, totalIncome: 5000 }];
      axios.get.mockResolvedValueOnce({ data: mockHistory });

      const result = await getBudgetHistory();
      expect(result).toEqual(mockHistory);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:5000/api/budget');
    });
  });
});