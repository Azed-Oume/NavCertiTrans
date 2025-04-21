// src/components/CookieConsentComponent.jsx
import React, { useState, useEffect } from 'react';
import '../styles/style.css'; // Assurez-vous que le chemin est correct

const CookieConsentComponent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setVisible(false);
  };

  const refuseCookies = () => {
    localStorage.setItem('cookieConsent', 'refused');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent">
      <p>
        Ce site utilise des cookies pour améliorer votre expérience.
      </p>
      <div className="cookie-consent-buttons">
        <button className="accept-btn" onClick={acceptCookies}>Accepter</button>
        <button className="refuse-btn" onClick={refuseCookies}>Refuser</button>
      </div>
    </div>
  );
};

export default CookieConsentComponent;
