// server/config/i18n.js

const translations = {
  en: {
    'auth.errors.user_exists': 'User already exists',
    'errors.server_error': 'Internal server error',
    'auth.errors.invalid_credentials': 'Invalid credentials',
    'auth.success.password_reset': 'Password has been reset',
    'auth.email.sent': 'Password reset instructions sent to email',
    'auth.email.failed': 'Failed to send reset email',
    'auth.errors.user_not_found': 'User not found',
    'auth.errors.invalid_or_expired_token': 'Invalid or expired reset token',
  },
  // Add more languages if needed
};

const currentLanguage = 'en';

export function t(key) {
  return translations[currentLanguage][key] || key;
}
