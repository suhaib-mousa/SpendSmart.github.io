import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '../../src/components/Footer';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'footer.copyright': '© 2025 University Of Jordan, SpendSmart',
        'footer.links.home': 'Home',
        'footer.links.discounts': 'Discounts',
        'footer.links.budget': 'Budget Analysis',
        'footer.links.planner': 'Financial Planner',
        'footer.links.tips': 'Tips'
      };
      return translations[key] || key;
    }
  })
}));

describe('Footer Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
  });

  test('renders copyright text', () => {
    expect(screen.getByText(/© 2025 University Of Jordan, SpendSmart/)).toBeInTheDocument();
  });

  test('renders navigation links', () => {
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Discounts')).toBeInTheDocument();
    expect(screen.getByText('Budget Analysis')).toBeInTheDocument();
    expect(screen.getByText('Financial Planner')).toBeInTheDocument();
    expect(screen.getByText('Tips')).toBeInTheDocument();
  });

  test('links have correct href attributes', () => {
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Discounts').closest('a')).toHaveAttribute('href', '/discounts');
    expect(screen.getByText('Budget Analysis').closest('a')).toHaveAttribute('href', '/budget');
    expect(screen.getByText('Financial Planner').closest('a')).toHaveAttribute('href', '/planner');
    expect(screen.getByText('Tips').closest('a')).toHaveAttribute('href', '/tips');
  });
});