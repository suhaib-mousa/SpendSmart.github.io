// Mock axios before importing anything
jest.mock('axios', () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn()
      },
      response: {
        use: jest.fn()
      }
    }
  };
  
  return {
    create: jest.fn(() => mockAxiosInstance),
    isAxiosError: jest.fn(),
    __mockInstance: mockAxiosInstance
  };
});

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
} from '../../src/services/api';

import axios from 'axios';

const mockAxiosInstance = axios.__mockInstance;

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getDeals', () => {
    test('fetches deals successfully', async () => {
      const mockDeals = [{ id: 1, title: 'Test Deal' }];
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockDeals });

      const result = await getDeals();
      expect(result).toEqual(mockDeals);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/deals');
    });

    test('handles network error', async () => {
      mockAxiosInstance.get.mockRejectedValueOnce(new Error('Network error'));
      await expect(getDeals()).rejects.toThrow('Network error');
    });
  });

  describe('getDealReviews', () => {
    test('fetches reviews for a deal', async () => {
      const mockReviews = [{ id: 1, comment: 'Great deal!' }];
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockReviews });

      const result = await getDealReviews('deal-1');
      expect(result).toEqual(mockReviews);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/reviews/deal/deal-1');
    });
  });

  describe('getUserReview', () => {
    test('fetches user review for a deal', async () => {
      const mockReview = { id: 1, comment: 'My review' };
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockReview });

      const result = await getUserReview('deal-1');
      expect(result).toEqual(mockReview);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/reviews/user/deal-1');
    });
  });

  describe('createReview', () => {
    test('creates a new review', async () => {
      const mockReview = { dealId: 'deal-1', comment: 'New review' };
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockReview });

      const result = await createReview(mockReview);
      expect(result).toEqual(mockReview);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/reviews', mockReview);
    });
  });

  describe('updateReview', () => {
    test('updates an existing review', async () => {
      const mockReview = { id: 1, comment: 'Updated review' };
      mockAxiosInstance.patch.mockResolvedValueOnce({ data: mockReview });

      const result = await updateReview('1', mockReview);
      expect(result).toEqual(mockReview);
      expect(mockAxiosInstance.patch).toHaveBeenCalledWith('/reviews/1', mockReview);
    });
  });

  describe('deleteReview', () => {
    test('deletes a review', async () => {
      const mockResponse = { success: true };
      mockAxiosInstance.delete.mockResolvedValueOnce({ data: mockResponse });

      const result = await deleteReview('1');
      expect(result).toEqual(mockResponse);
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/reviews/1');
    });
  });

  describe('getCategories', () => {
    test('fetches categories', async () => {
      const mockCategories = [{ id: 1, name: 'Food' }];
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockCategories });

      const result = await getCategories();
      expect(result).toEqual(mockCategories);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/categories');
    });
  });

  describe('getTips', () => {
    test('fetches tips', async () => {
      const mockTips = [{ id: 1, title: 'Save money tip' }];
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockTips });

      const result = await getTips();
      expect(result).toEqual(mockTips);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/tips');
    });
  });

  describe('savePlannerEntry', () => {
    test('saves planner entry successfully', async () => {
      const mockEntry = {
        monthlyIncome: 5000,
        expenses: { housing: 1500 }
      };
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockEntry });

      const result = await savePlannerEntry(mockEntry);
      expect(result).toEqual(mockEntry);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/planner', mockEntry);
    });
  });

  describe('getPlannerHistory', () => {
    test('fetches planner history', async () => {
      const mockHistory = [{ id: 1, monthlyIncome: 5000 }];
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockHistory });

      const result = await getPlannerHistory();
      expect(result).toEqual(mockHistory);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/planner');
    });
  });

  describe('saveBudgetAnalysis', () => {
    test('saves budget analysis', async () => {
      const mockAnalysis = {
        totalIncome: 5000,
        savingsGoal: 1000
      };
      mockAxiosInstance.post.mockResolvedValueOnce({ data: mockAnalysis });

      const result = await saveBudgetAnalysis(mockAnalysis);
      expect(result).toEqual(mockAnalysis);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/budget', mockAnalysis);
    });
  });

  describe('getBudgetHistory', () => {
    test('fetches budget history', async () => {
      const mockHistory = [{ id: 1, totalIncome: 5000 }];
      mockAxiosInstance.get.mockResolvedValueOnce({ data: mockHistory });

      const result = await getBudgetHistory();
      expect(result).toEqual(mockHistory);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/budget');
    });
  });
});