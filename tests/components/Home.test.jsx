import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../../src/pages/Home';

// Mock react-i18next
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => {
      const translations = {
        'home.hero.title': 'Smart Financial Management',
        'home.hero.subtitle': 'Take control of your finances with our comprehensive tools',
        'home.hero.start_saving': 'Start Saving',
        'home.hero.explore_discounts': 'Explore Discounts',
        'home.why_section.title': 'Why Choose SpendSmart?',
        'home.why_section.subtitle': 'Your complete financial management solution',
        'home.why_section.features.budget.title': 'Budget Management',
        'home.why_section.features.discounts.title': 'Exclusive Discounts',
        'home.why_section.features.tips.title': 'Financial Tips',
        'home.features.title': 'Powerful Features',
        'home.features.subtitle': 'Everything you need to manage your finances',
        'home.features.budgeting.title': 'Budget Analysis',
        'home.features.recommendations.title': 'Smart Recommendations',
        'home.features.database.title': 'Discount Database',
        'home.features.community.title': 'Community & Reviews',
        'home.features.education.title': 'Educational Resources',
        'home.features.budgeting.learn_more': 'Learn More',
        'home.features.recommendations.learn_more': 'Learn More',
        'home.features.database.learn_more': 'Learn More',
        'home.features.community.learn_more': 'Learn More',
        'home.features.education.learn_more': 'Learn More',
        'home.cta.title': 'Ready to Start Saving?',
        'home.cta.subtitle': 'Join thousands of users who save money with SpendSmart',
        'home.cta.signup': 'Sign Up Free'
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: 'en'
    }
  })
}));

// Mock AOS (Animate On Scroll)
jest.mock('aos', () => ({
  init: jest.fn()
}));

const renderHome = () => {
  return render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );
};

describe('Home Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders main hero section', () => {
    renderHome();
    
    expect(screen.getByText('Smart Financial Management')).toBeInTheDocument();
    expect(screen.getByText('Take control of your finances with our comprehensive tools')).toBeInTheDocument();
    expect(screen.getByText('Start Saving')).toBeInTheDocument();
    expect(screen.getByText('Explore Discounts')).toBeInTheDocument();
  });

  test('renders why choose section', () => {
    renderHome();
    
    expect(screen.getByText('Why Choose SpendSmart?')).toBeInTheDocument();
    expect(screen.getByText('Budget Management')).toBeInTheDocument();
    expect(screen.getByText('Exclusive Discounts')).toBeInTheDocument();
    expect(screen.getByText('Financial Tips')).toBeInTheDocument();
  });

  test('renders features section', () => {
    renderHome();
    
    expect(screen.getByText('Powerful Features')).toBeInTheDocument();
    expect(screen.getAllByText('Budget Analysis')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Smart Recommendations')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Discount Database')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Community & Reviews')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Educational Resources')[0]).toBeInTheDocument();
  });

  test('renders navigation links to different pages', () => {
    renderHome();
    
    // Check hero section links
    expect(screen.getByRole('link', { name: 'Start Saving' })).toHaveAttribute('href', '/budget');
    expect(screen.getByRole('link', { name: 'Explore Discounts' })).toHaveAttribute('href', '/discounts');
    
    // Check feature section links
    const learnMoreLinks = screen.getAllByText('Learn More');
    expect(learnMoreLinks.length).toBeGreaterThan(0);
  });

  test('shows CTA section when user is not logged in', () => {
    renderHome();
    
    expect(screen.getByText('Ready to Start Saving?')).toBeInTheDocument();
    expect(screen.getByText('Join thousands of users who save money with SpendSmart')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign Up Free' })).toHaveAttribute('href', '/signup');
  });

  test('hides CTA section when user is logged in', () => {
    const mockUser = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe'
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    renderHome();
    
    expect(screen.queryByText('Ready to Start Saving?')).not.toBeInTheDocument();
    expect(screen.queryByText('Sign Up Free')).not.toBeInTheDocument();
  });

  test('renders responsive layout with proper structure', () => {
    renderHome();
    
    // Check for hero section
    expect(screen.getByText('Smart Financial Management')).toBeInTheDocument();
    
    // Check for why section features
    expect(screen.getByText('Budget Management')).toBeInTheDocument();
    expect(screen.getByText('Exclusive Discounts')).toBeInTheDocument();
    expect(screen.getByText('Financial Tips')).toBeInTheDocument();
    
    // Check for main features - use getAllByText for duplicated text
    expect(screen.getAllByText('Budget Analysis')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Smart Recommendations')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Discount Database')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Community & Reviews')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Educational Resources')[0]).toBeInTheDocument();
  });

  test('initializes AOS on component mount', () => {
    const AOS = require('aos');
    renderHome();
    
    expect(AOS.init).toHaveBeenCalledWith({
      once: true,
      duration: 800
    });
  });

  test('renders hero image with correct attributes', () => {
    renderHome();
    
    const heroImage = screen.getByAltText('SpendSmart Hero Image');
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('src', '/Media/Media/Hero.png');
  });
}); 