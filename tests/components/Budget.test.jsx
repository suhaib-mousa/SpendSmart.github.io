import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Budget from '../src/pages/Budget';
import { saveBudgetAnalysis, getBudgetHistory } from '../src/services/api';

// Mock the API calls
jest.mock('../src/services/api', () => ({
  saveBudgetAnalysis: jest.fn(),
  getBudgetHistory: jest.fn()
}));

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'en'
    }
  })
}));

const mockUser = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe'
};

const renderBudget = () => {
  return render(
    <BrowserRouter>
      <Budget />
    </BrowserRouter>
  );
};

describe('Budget Component', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders initial welcome message', () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    renderBudget();
    
    expect(screen.getByText(/SpendSmart/)).toBeInTheDocument();
    expect(screen.getByText(/Budget Analysis Assistant/)).toBeInTheDocument();
  });

  test('shows login prompt when user is not logged in', () => {
    renderBudget();
    expect(screen.getByText(/please log in/i)).toBeInTheDocument();
  });

  test('allows input when user is logged in', () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    renderBudget();
    
    const input = screen.getByPlaceholderText(/Type your answer here/i);
    expect(input).not.toBeDisabled();
  });

  test('processes user input correctly', async () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    renderBudget();
    
    const input = screen.getByPlaceholderText(/Type your answer here/i);
    const sendButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'John' } });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText(/monthly income/i)).toBeInTheDocument();
    });
  });

  test('validates numeric inputs', () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    renderBudget();
    
    const input = screen.getByPlaceholderText(/Type your answer here/i);
    const sendButton = screen.getByRole('button');

    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.click(sendButton);

    expect(screen.getByText(/please enter a valid number/i)).toBeInTheDocument();
  });

  test('saves budget analysis when completed', async () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    saveBudgetAnalysis.mockResolvedValueOnce({ success: true });
    
    renderBudget();
    
    // Complete the budget questionnaire
    const input = screen.getByPlaceholderText(/Type your answer here/i);
    const sendButton = screen.getByRole('button');

    // Name
    fireEvent.change(input, { target: { value: 'John' } });
    fireEvent.click(sendButton);

    // Income
    await waitFor(() => {
      fireEvent.change(input, { target: { value: '5000' } });
      fireEvent.click(sendButton);
    });

    // Savings goal
    await waitFor(() => {
      fireEvent.change(input, { target: { value: '1000' } });
      fireEvent.click(sendButton);
    });

    // Verify save was called
    await waitFor(() => {
      expect(saveBudgetAnalysis).toHaveBeenCalled();
    });
  });

  test('loads budget history for logged in user', async () => {
    localStorage.setItem('user', JSON.stringify(mockUser));
    const mockHistory = [
      {
        id: '1',
        totalIncome: 5000,
        savingsGoal: 1000,
        expenses: {
          housing: 1500,
          food: 500
        }
      }
    ];
    
    getBudgetHistory.mockResolvedValueOnce(mockHistory);
    
    renderBudget();
    
    await waitFor(() => {
      expect(getBudgetHistory).toHaveBeenCalled();
    });
  });
});