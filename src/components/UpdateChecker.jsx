// src/components/UpdateChecker.jsx
import React, { useState, useEffect } from 'react';

const UpdateChecker = () => {
  const [message, setMessage] = useState(null);

  const handleCheckUpdate = () => {
    if (window.certitransAPI?.checkForUpdate) {
      window.certitransAPI.checkForUpdate();
      setMessage("🔍 Vérification en cours...");
    } else {
      setMessage("❌ Vérification non disponible.");
    }
  };

  useEffect(() => {
    console.log("✅ UpdateChecker mounted");
    if (window.certitransAPI?.onUpdateStatus) {
      window.certitransAPI.onUpdateStatus((status) => {
        console.log("📬 Status reçu :", status);
        setMessage(status);
      });
    }
  }, []);

  return (
    <div className="address-bar">
      <button className="address-bar-button" onClick={handleCheckUpdate} >
        🔄 Vérifier les mises à jour
      </button>
      {message && <p >{message}</p>}
    </div>
  );
};

export default UpdateChecker;
