import { renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useClipSlideDirection } from '../../src/hooks/useAuthSlideDirection';

// Mock react-router-dom
const mockLocation = {
  pathname: '/'
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockLocation
}));

describe('useClipSlideDirection Hook', () => {
  test('returns empty ctaSlideClass for default path', () => {
    mockLocation.pathname = '/';
    
    const { result } = renderHook(() => useClipSlideDirection());
    
    expect(result.current.ctaSlideClass).toBe('');
  });

  test('returns clip-slide-right for login path', () => {
    mockLocation.pathname = '/login';
    
    const { result } = renderHook(() => useClipSlideDirection());
    
    expect(result.current.ctaSlideClass).toBe('clip-slide-right');
  });

  test('returns clip-slide-left for signup path', () => {
    mockLocation.pathname = '/signup';
    
    const { result } = renderHook(() => useClipSlideDirection());
    
    expect(result.current.ctaSlideClass).toBe('clip-slide-left');
  });

  test('returns clip-slide-right for nested login path', () => {
    mockLocation.pathname = '/auth/login';
    
    const { result } = renderHook(() => useClipSlideDirection());
    
    expect(result.current.ctaSlideClass).toBe('clip-slide-right');
  });

  test('returns clip-slide-left for nested signup path', () => {
    mockLocation.pathname = '/auth/signup';
    
    const { result } = renderHook(() => useClipSlideDirection());
    
    expect(result.current.ctaSlideClass).toBe('clip-slide-left');
  });

  test('returns empty string for other paths', () => {
    mockLocation.pathname = '/dashboard';
    
    const { result } = renderHook(() => useClipSlideDirection());
    
    expect(result.current.ctaSlideClass).toBe('');
  });
}); 