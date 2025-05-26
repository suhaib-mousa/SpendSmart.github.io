import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { initReactI18next } from 'react-i18next';
import i18n from '../i18n';
import Navbar from './Navbar';

// Initialize i18next for tests
i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: {
        'nav.home': 'Home',
        'nav.budgeting': 'Budgeting',
        'nav.budget_analysis': 'Budget Analysis',
        'nav.financial_planner': 'Financial Planner',
        'nav.discounts': 'Discounts',
        'nav.tips': 'Tips',
        'nav.login': 'Log In',
        'nav.signup': 'Sign Up',
        'nav.logout': 'Sign Out',
        'nav.welcome': 'Welcome, {{name}}'
      }
    }
  }
});

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, params) => {
      const translations = {
        'nav.home': 'Home',
        'nav.budgeting': 'Budgeting',
        'nav.budget_analysis': 'Budget Analysis',
        'nav.financial_planner': 'Financial Planner',
        'nav.discounts': 'Discounts',
        'nav.tips': 'Tips',
        'nav.login': 'Log In',
        'nav.signup': 'Sign Up',
        'nav.logout': 'Sign Out',
        'nav.welcome': params ? `Welcome, ${params.name}` : 'Welcome'
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'en'
    },
  }),
  I18nextProvider: ({ children }) => children,
  initReactI18next: {
    type: '3rdParty',
    init: () => {}
  }
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
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Budgeting')).toBeInTheDocument();
    expect(screen.getByText('Discounts')).toBeInTheDocument();
    expect(screen.getByText('Tips')).toBeInTheDocument();
  });

  test('renders login and signup buttons when user is not logged in', () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    renderNavbar();
    
    expect(screen.getByText('Log In')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  test('renders user name and logout button when user is logged in', () => {
    const mockUser = {
      firstName: 'John',
      lastName: 'Doe'
    };
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));
    
    renderNavbar();
    
    expect(screen.getByText('Welcome, John')).toBeInTheDocument();
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  test('toggles dropdown menu when clicking budgeting link', () => {
    renderNavbar();
    
    const dropdownButton = screen.getByText('Budgeting');
    fireEvent.click(dropdownButton);
    
    expect(screen.getByText('Budget Analysis')).toBeInTheDocument();
    expect(screen.getByText('Financial Planner')).toBeInTheDocument();
  });
});