// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// import Accueil from './pages/Accueil';
import AppWebBrowser from './AppWebBrowser.jsx';

export default function App() {
  return (
    <div style={{ flexGrow: 1 }}>
      <Routes>
        {/* Page d’accueil avec navigateur intégré */}
        <Route path="/" element={<AppWebBrowser />} />

      </Routes>
    </div>
  );
}
