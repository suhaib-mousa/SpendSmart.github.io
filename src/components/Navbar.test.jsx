import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { initReactI18next } from 'react-i18next';
import i18n from '../i18n';

// Initialize i18next for tests
i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: {}
    }
  }
});

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str) => str,
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