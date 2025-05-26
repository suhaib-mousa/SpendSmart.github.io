import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../../src/pages/Login';
import { login } from '../../src/services/auth';
import { toast } from 'react-hot-toast';

// Mock the auth service
jest.mock('../../src/services/auth', () => ({
  login: jest.fn()
}));

// Mock react-router-dom navigation
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
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

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn()
  }
}));

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders login form elements', () => {
    renderLogin();
    
    expect(screen.getByText('Log in to Your Account')).toBeInTheDocument();
    expect(screen.getByText('Log in to your account so you can start saving today.')).toBeInTheDocument();
  });

  test('renders email and password fields', () => {
    renderLogin();
    
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  test('renders submit button', () => {
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: 'Log In' });
    expect(submitButton).toBeInTheDocument();
  });

  test('renders additional elements', () => {
    renderLogin();
    
    expect(screen.getByText('Remember me')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByText('Don\'t Have an Account Yet?')).toBeInTheDocument();
    expect(screen.getByText('SIGN UP')).toBeInTheDocument();
  });

  test('handles successful form submission', async () => {
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    };

    login.mockResolvedValueOnce({
      token: 'test-token',
      user: mockUser
    });

    renderLogin();
    
    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Log In' });

    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('john@example.com', 'password123');
    });
  });

  test('renders SpendSmart branding', () => {
    renderLogin();
    
    expect(screen.getByText('SpendSmart')).toBeInTheDocument();
  });
}); 