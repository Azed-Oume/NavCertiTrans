import React from 'react';

const Footer = () => {
  return (
    <footer className="custom-footer">
      <div className="footer-content">
        
        <div className="footer-links">
        <span>Suivez-moi sur :</span>
          <a href="https://x.com/AzedOU5" target="_blank" rel="noopener noreferrer">Twitter</a>
          <a href="https://www.linkedin.com/in/azzedine-oume-developpeur-full-stack/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://wa.me/+33768221452" target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <a href="https://www.dwaccess.com/Cgu/" target="_blank" rel="noopener noreferrer">C-G-U</a>
          </div>
          <div className="footer-links">
            <a href="https://www.dwaccess.com/" target="_blank" rel="noopener noreferrer" className="footer-powered">
              Propulsé par dwaccess
            </a>
            <p className='footer-legal'>© Oumessaoud 2024. Tous droits réservés.</p>
          </div>
        
      </div>
    </footer>
  );
};

export default Footer;
