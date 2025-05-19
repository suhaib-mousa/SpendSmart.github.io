import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.dir = lng === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
      >
        English
      </button>
      <button
        className={`lang-btn ${i18n.language === 'ar' ? 'active' : ''}`}
        onClick={() => changeLanguage('ar')}
      >
        العربية
      </button>
    </div>
  );
};

export default LanguageSwitcher;