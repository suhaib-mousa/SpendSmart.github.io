import axios from 'axios';
import { login, register, forgotPassword, resetPassword, logout } from '../../src/services/auth';

jest.mock('axios');

describe('Auth Service', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('login', () => {
    const mockLoginData = {
      token: 'test-token',
      user: {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com'
      }
    };

    test('successful login sets token and user in localStorage', async () => {
      axios.post.mockResolvedValueOnce({ data: mockLoginData });

      await login('john@example.com', 'password123');

      expect(localStorage.getItem('token')).toBe('test-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockLoginData.user));
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/login',
        { email: 'john@example.com', password: 'password123' }
      );
    });

    test('failed login throws error', async () => {
      const errorMessage = 'Invalid credentials';
      axios.post.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(login('wrong@email.com', 'wrongpass'))
        .rejects
        .toEqual({ message: errorMessage });
    });
  });

  describe('register', () => {
    const mockUserData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123'
    };

    test('successful registration returns user data', async () => {
      const mockResponse = { data: { ...mockUserData, id: '1' } };
      axios.post.mockResolvedValueOnce(mockResponse);

      const result = await register(mockUserData);

      expect(result).toEqual(mockResponse.data);
      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:5000/api/auth/register',
        mockUserData
      );
    });

    test('failed registration throws error', async () => {
      const errorMessage = 'Email already exists';
      axios.post.mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      await expect(register(mockUserData))
        .rejects
        .toEqual({ message: errorMessage });
    });
  });

  describe('logout', () => {
    test('removes token and user from localStorage', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: '1' }));

      logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });
});