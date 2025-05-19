import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer>
      <div className="container">
        <footer className="py-3 my-4 text-center">
          <ul className="nav justify-content-center border-bottom pb-3 mb-3">
            <li className="nav-item">
              <Link to="/" className="nav-link px-2 text-muted">{t('footer.links.home')}</Link>
            </li>
            <li className="nav-item">
              <Link to="/discounts" className="nav-link px-2 text-muted">{t('footer.links.discounts')}</Link>
            </li>
            <li className="nav-item">
              <Link to="/budget" className="nav-link px-2 text-muted">{t('footer.links.budget')}</Link>
            </li>
            <li className="nav-item">
              <Link to="/planner" className="nav-link px-2 text-muted">{t('footer.links.planner')}</Link>
            </li>
            <li className="nav-item">
              <Link to="/tips" className="nav-link px-2 text-muted">{t('footer.links.tips')}</Link>
            </li>
          </ul>
          <p className="text-center text-muted">{t('footer.copyright')}</p>
        </footer>
      </div>
    </footer>
  );
};

export default Footer;