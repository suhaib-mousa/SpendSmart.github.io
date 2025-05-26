import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import Navbar from './Navbar';

// Mock i18next
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
        language: 'en'
      },
    };
  },
  I18nextProvider: ({ children }) => children,
}));

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
      <Navbar />
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
    expect(screen.getByText('Spend Smart')).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    renderNavbar();
    expect(screen.getByText('nav.home')).toBeInTheDocument();
    expect(screen.getByText('nav.budgeting')).toBeInTheDocument();
    expect(screen.getByText('nav.discounts')).toBeInTheDocument();
    expect(screen.getByText('nav.tips')).toBeInTheDocument();
  });

  test('renders login and signup buttons when user is not logged in', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    renderNavbar();
    
    expect(screen.getByText('nav.login')).toBeInTheDocument();
    expect(screen.getByText('nav.signup')).toBeInTheDocument();
  });

  test('renders user name and logout button when user is logged in', () => {
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe'
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));
    
    renderNavbar();
    
    expect(screen.getByText('nav.welcome, {"name":"John"}')).toBeInTheDocument();
    expect(screen.getByText('nav.logout')).toBeInTheDocument();
  });

  test('toggles dropdown menu when clicking budgeting link', () => {
    renderNavbar();
    
    const dropdownButton = screen.getByText('nav.budgeting');
    fireEvent.click(dropdownButton);
    
    expect(screen.getByText('nav.budget_analysis')).toBeInTheDocument();
    expect(screen.getByText('nav.financial_planner')).toBeInTheDocument();
  });
});