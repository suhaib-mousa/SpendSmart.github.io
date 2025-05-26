import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from '../../src/components/LanguageSwitcher';

const mockChangeLanguage = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      changeLanguage: mockChangeLanguage,
      language: 'en'
    }
  })
}));

describe('LanguageSwitcher Component', () => {
  beforeEach(() => {
    render(<LanguageSwitcher />);
    mockChangeLanguage.mockClear();
  });

  test('renders language buttons', () => {
    expect(screen.getByText('English')).toBeInTheDocument();
    expect(screen.getByText('العربية')).toBeInTheDocument();
  });

  test('changes language to Arabic', () => {
    fireEvent.click(screen.getByText('العربية'));
    expect(mockChangeLanguage).toHaveBeenCalledWith('ar');
  });

  test('changes language to English', () => {
    fireEvent.click(screen.getByText('English'));
    expect(mockChangeLanguage).toHaveBeenCalledWith('en');
  });

  test('applies active class to selected language button', () => {
    const englishButton = screen.getByText('English').closest('button');
    const arabicButton = screen.getByText('العربية').closest('button');

    expect(englishButton).toHaveClass('active');
    expect(arabicButton).not.toHaveClass('active');
  });
});