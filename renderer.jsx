// 🧠 Fichier d’entrée principal de ton app React (chargé depuis index.html)

import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom"; // alternative à BrowserRouter
import { CookiesProvider } from "react-cookie";

// 🧩 Importation des composants
import App from "./src/app.jsx";
import Footer from "./src/components/Footer.jsx";
import CookieConsentComponent from "./src/components/CookieConsentComponent.jsx";

// 🎨 Feuille de style globale
import "./src/styles/style.css" // adapte selon ton arborescence

// 🎯 Point d’ancrage React (div#app dans index.html)
const container = document.getElementById("app");
const root = createRoot(container);

// 🚀 Affichage de l’interface React
root.render(
  <HashRouter>
    <CookiesProvider>
      {/* <div className="d-flex flex-column min-vh-100"> */}
      <div className="d-flex flex-column min-vh-100">
        <main className="flex-grow-1">
          <App />
          
        </main>
        <Footer />
        <CookieConsentComponent />
      </div>
    </CookiesProvider>
  </HashRouter>
);
