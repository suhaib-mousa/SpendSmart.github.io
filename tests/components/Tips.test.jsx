import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Tips from '../../src/pages/Tips';
import { getTips } from '../../src/services/api';

// Mock the API calls
jest.mock('../../src/services/api', () => ({
  getTips: jest.fn()
}));

// Mock AOS (Animate On Scroll)
jest.mock('aos', () => ({
  init: jest.fn(),
  refresh: jest.fn()
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

const mockTips = [
  {
    _id: '1',
    title: 'How to Save Money on Groceries',
    text: 'Plan your meals ahead of time and make a shopping list. This helps you avoid impulse purchases and ensures you only buy what you need.',
    link: 'https://example.com/groceries',
    image: 'https://example.com/grocery.jpg'
  },
  {
    _id: '2',
    title: 'Creating a Monthly Budget',
    text: 'Start by tracking your income and expenses for a month. Then allocate your income into different categories like housing, food, transportation, and savings.',
    link: 'https://example.com/budget',
    image: 'https://example.com/budget.jpg'
  }
];

const renderTips = () => {
  return render(
    <BrowserRouter>
      <Tips />
    </BrowserRouter>
  );
};

describe('Tips Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getTips.mockResolvedValue([mockTips[0], ...mockTips.slice(1)]);
  });

  test('shows loading state initially', () => {
    renderTips();
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('fetches and displays main tip in hero section', async () => {
    renderTips();
    
    await waitFor(() => {
      expect(getTips).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('How to Save Money on Groceries')).toBeInTheDocument();
      expect(screen.getByText('Plan your meals ahead of time and make a shopping list. This helps you avoid impulse purchases and ensures you only buy what you need.')).toBeInTheDocument();
    });
  });

  test('renders swiper component with tips', async () => {
    renderTips();
    
    await waitFor(() => {
      expect(getTips).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByTestId('swiper')).toBeInTheDocument();
      expect(screen.getAllByTestId('swiper-slide')).toHaveLength(2); // 1 tip slide + 1 empty slide
    });
  });

  test('renders tip link correctly', async () => {
    renderTips();
    
    await waitFor(() => {
      expect(getTips).toHaveBeenCalled();
    });

    await waitFor(() => {
      const link = screen.getByText('Discover Now');
      expect(link).toBeInTheDocument();
      expect(link.closest('a')).toHaveAttribute('href', 'https://example.com/groceries');
      expect(link.closest('a')).toHaveAttribute('target', '_blank');
    });
  });

  test('handles API errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    getTips.mockRejectedValueOnce(new Error('API Error'));
    
    renderTips();
    
    await waitFor(() => {
      expect(getTips).toHaveBeenCalled();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Failed to load tips')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    
    consoleErrorSpy.mockRestore();
  });

  test('handles empty tips array', async () => {
    getTips.mockResolvedValueOnce([]);
    
    renderTips();
    
    await waitFor(() => {
      expect(getTips).toHaveBeenCalled();
    });

    await waitFor(() => {
      // Should not crash and should render the swiper even with no tips
      expect(screen.getByTestId('swiper')).toBeInTheDocument();
    });
  });

  test('renders navigation buttons', async () => {
    renderTips();
    
    await waitFor(() => {
      expect(getTips).toHaveBeenCalled();
    });

    await waitFor(() => {
      // Check for swiper navigation elements
      const prevButton = document.querySelector('.swiper-button-prev');
      const nextButton = document.querySelector('.swiper-button-next');
      expect(prevButton).toBeTruthy();
      expect(nextButton).toBeTruthy();
    });
  });
}); 