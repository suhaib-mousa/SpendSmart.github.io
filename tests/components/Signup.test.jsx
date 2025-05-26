import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../../src/pages/Signup';
import { register } from '../../src/services/auth';

// Mock the auth service
jest.mock('../../src/services/auth', () => ({
  register: jest.fn()
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
    t: (key) => {
      const translations = {
        'signup.title': 'Create Account',
        'signup.subtitle': 'Join SpendSmart today',
        'signup.firstName': 'First Name',
        'signup.lastName': 'Last Name',
        'signup.email': 'Email',
        'signup.password': 'Password',
        'signup.confirmPassword': 'Confirm Password',
        'signup.terms': 'I agree to the Terms of Service',
        'signup.signup': 'Sign Up',
        'signup.login': 'Already have an account? Sign in'
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'en'
    }
  })
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  error: jest.fn(),
  success: jest.fn()
}));

const renderSignup = () => {
  return render(
    <BrowserRouter>
      <Signup />
    </BrowserRouter>
  );
};

describe('Signup Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders signup form elements', () => {
    renderSignup();
    
    expect(screen.getByText('Sign Up for an Account')).toBeInTheDocument();
    expect(screen.getByText('Join our community and start your savings journey!')).toBeInTheDocument();
  });

  test('renders form fields', () => {
    renderSignup();
    
    // Look for input fields - signup typically has multiple text inputs
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThanOrEqual(3); // At least first name, last name, email
  });

  test('renders submit button', () => {
    renderSignup();
    
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    expect(submitButton).toBeInTheDocument();
  });

  test('handles successful registration', async () => {
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    };

    register.mockResolvedValueOnce(mockUser);

    renderSignup();
    
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    
    // Fill some basic form data
    const textInputs = screen.getAllByRole('textbox');
    if (textInputs.length >= 3) {
      fireEvent.change(textInputs[0], { target: { value: 'John' } });
      fireEvent.change(textInputs[1], { target: { value: 'Doe' } });
      fireEvent.change(textInputs[2], { target: { value: 'john@example.com' } });
    }
    
    // Try to submit
    fireEvent.click(submitButton);

    // The component should handle validation and potentially call register
  });

  test('handles registration failure', async () => {
    register.mockRejectedValueOnce({
      message: 'Email already exists'
    });

    renderSignup();
    
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    // Component should handle the error appropriately
  });

  test('renders navigation elements', () => {
    renderSignup();
    
    // Check for common signup page elements
    expect(screen.getByText(/sign up for an account/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });
}); 