import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import Navbar from './Navbar';

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

const renderNavbar = () => {
  return render(
    <BrowserRouter>
      <I18nextProvider i18n={i18n}>
        <Navbar />
      </I18nextProvider>
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
  });

  test('renders brand logo and name', () => {
    renderNavbar();
    expect(screen.getByText(/Spend Smart/i)).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    renderNavbar();
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Budgeting/i)).toBeInTheDocument();
    expect(screen.getByText(/Discounts/i)).toBeInTheDocument();
    expect(screen.getByText(/Tips/i)).toBeInTheDocument();
  });

  test('renders login and signup buttons when user is not logged in', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    renderNavbar();
    
    expect(screen.getByText(/Log In/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
  });

  test('renders user name and logout button when user is logged in', () => {
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe'
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));
    
    renderNavbar();
    
    expect(screen.getByText(/Welcome, John/i)).toBeInTheDocument();
    expect(screen.getByText(/Sign Out/i)).toBeInTheDocument();
  });

  test('toggles dropdown menu when clicking budgeting link', () => {
    renderNavbar();
    
    const dropdownButton = screen.getByText(/Budgeting/i);
    fireEvent.click(dropdownButton);
    
    expect(screen.getByText(/Budget Analysis/i)).toBeInTheDocument();
    expect(screen.getByText(/Financial Planner/i)).toBeInTheDocument();
  });
});