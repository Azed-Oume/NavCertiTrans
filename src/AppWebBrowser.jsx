// 📦 AppWebBrowser.jsx – Version verrouillée sur une seule URL, adaptable dev/prod
import React, { useRef, useEffect } from 'react';
import './styles/style.css';
import UpdateChecker from './components/UpdateChecker';

// 👇 Détection d’environnement : dev ou prod
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const defaultURL = isDev ? 'http://localhost:1234' : 'http://localhost:1234';

const AppWebBrowser = () => {
  const webviewRef = useRef(null);

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const handleLoadError = (event) => {
      if (event.errorCode !== -3) {
        console.error('🚫 Erreur de chargement :', event);
        alert('Erreur de chargement. Vérifiez votre connexion ou l’URL autorisée.');
      }
    };

    const handleNewWindow = (event) => {
      event.preventDefault();
      if (!event.url.startsWith(defaultURL)) {
        console.warn('Tentative de nouvelle fenêtre bloquée :', event.url);
        alert('❌ Cette URL est bloquée :\n' + event.url);
      }
    };

    const handleWillNavigate = (event) => {
      if (!event.url.startsWith(defaultURL)) {
        event.preventDefault();
        console.warn('Navigation bloquée vers :', event.url);
        alert('❌ Navigation bloquée :\n' + event.url);
      }
    };

    webview.addEventListener('did-fail-load', handleLoadError);
    webview.addEventListener('new-window', handleNewWindow);
    webview.addEventListener('will-navigate', handleWillNavigate);

    return () => {
      webview.removeEventListener('did-fail-load', handleLoadError);
      webview.removeEventListener('new-window', handleNewWindow);
      webview.removeEventListener('will-navigate', handleWillNavigate);
    };
  }, []);

  const reload = () => {
    if (webviewRef.current) webviewRef.current.reload();
  };

  return (
    <div className="browser-wrapper">
      {/* ✅ Barre d'adresse figée et sécurisée */}
      <div className="address-bar">
        <button className="address-bar-button" onClick={reload}>🔄</button>
        <input className="address-input" value={defaultURL} readOnly />
        <UpdateChecker />
      </div>

      {/* ✅ Webview protégée */}
      <div className="webview-container">
        <webview
          ref={webviewRef}
          src={defaultURL}
          className="webview active"
          style={{
            flex: 1,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </div>
    </div>
  );
};

export default AppWebBrowser;
