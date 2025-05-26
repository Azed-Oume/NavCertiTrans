import React, { useState, useRef, useEffect } from 'react';
import './styles/style.css'; // Ton CSS global
import UpdateChecker from './components/UpdateChecker';


// 👇 Détection de prod ou dev
const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
const defaultURL = isDev ? 'http://localhost:1234' : 'https://www.dwaccess.com';


const createInitialTab = (url = defaultURL) => {
  return {
    id: Date.now(),
    url,
    history: [url],
    historyIndex: 0,
  };
};

const AppWebBrowser = () => {

  const [tabs, setTabs] = useState([createInitialTab()]);
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);
  const [address, setAddress] = useState(tabs[0].url);
  const [errorTabs, setErrorTabs] = useState({});
  const webviewRefs = useRef({});

  useEffect(() => {
    const tab = tabs.find((t) => t.id === activeTabId);
    if (tab) {
      setAddress(tab.url);
    }
  }, [activeTabId, tabs]);

  useEffect(() => {
    if (window.electron) {
      window.electron.onNavigateInTab((direction) => {
        if (direction === 'back') goBack();
        else if (direction === 'forward') goForward();
      });
    }
  }, [tabs, activeTabId]);

  const navigate = (id, newUrl) => {
    const fullUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
    const updatedTabs = tabs.map((tab) => {
      if (tab.id !== id) return tab;
      const newHistory = [...tab.history.slice(0, tab.historyIndex + 1), fullUrl];
      return {
        ...tab,
        url: fullUrl,
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    });
    setTabs(updatedTabs);
  };

  const goBack = () => {
    const updatedTabs = tabs.map((tab) => {
      if (tab.id !== activeTabId || tab.historyIndex === 0) return tab;
      return {
        ...tab,
        historyIndex: tab.historyIndex - 1,
        url: tab.history[tab.historyIndex - 1],
      };
    });
    setTabs(updatedTabs);
  };

  const goForward = () => {
    const updatedTabs = tabs.map((tab) => {
      if (tab.id !== activeTabId || tab.historyIndex >= tab.history.length - 1) return tab;
      return {
        ...tab,
        historyIndex: tab.historyIndex + 1,
        url: tab.history[tab.historyIndex + 1],
      };
    });
    setTabs(updatedTabs);
  };

  const reload = () => {
    const ref = webviewRefs.current[activeTabId];
    if (ref) ref.reload();
  };

  const addTab = () => {
    const newTab = createInitialTab();
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const closeTab = (id) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter((tab) => tab.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[0].id);
    }
  };

  const handleAddressSubmit = (e) => {
    if (e.key === 'Enter') {
      navigate(activeTabId, address);
    }
  };

  useEffect(() => {
  tabs.forEach((tab) => {
    const webview = webviewRefs.current[tab.id];
    if (webview) {
      const handleLoadError = (event) => {
        if (event.errorCode !== -3) {
          console.error(`Erreur de chargement dans l'onglet ${tab.id}`, event);
          setErrorTabs((prev) => ({ ...prev, [tab.id]: true }));
        }
      };

      const handleNewWindow = (event) => {
        event.preventDefault(); // Empêche Electron d’ouvrir une nouvelle fenêtre externe
        const newUrl = event.url;
        console.log(`Nouvel onglet ouvert pour : ${newUrl}`);
        const newTab = createInitialTab(newUrl);
        setTabs((prev) => [...prev, newTab]);
        setActiveTabId(newTab.id);
      };

      webview.addEventListener('did-fail-load', handleLoadError);
      webview.addEventListener('new-window', handleNewWindow);

      return () => {
        webview.removeEventListener('did-fail-load', handleLoadError);
        webview.removeEventListener('new-window', handleNewWindow);
      };
    }
  });
}, [tabs]);

  


  return (
    <div className="browser-wrapper">
      <div className="tabs">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
            onClick={() => setActiveTabId(tab.id)}
          >
            {new URL(tab.url).hostname}
            <button onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}>✖</button>
          </div>
        ))}
        <button className="add-tab" onClick={addTab}>➕</button>
      </div>

      <div className="address-bar">
        <button className='address-bar-button' onClick={goBack}>⬅️</button>
        <button className='address-bar-button' onClick={goForward}>➡️</button>
        <button className='address-bar-button' onClick={reload}>🔄</button>
        <input
          className="address-input"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={handleAddressSubmit}
          placeholder="Entrer une URL"
        />
        <UpdateChecker />
      </div>
      
      <div className="webview-container">
  {tabs.map((tab) =>
    errorTabs[tab.id] ? (
      <div
              key={tab.id}
              className="webview-error"
            >
              <h2>🚫 Erreur de chargement</h2>
              <p>L’URL a échoué : <strong>{tab.url}</strong></p>
              <button
                onClick={() => {
                  setErrorTabs((prev) => ({ ...prev, [tab.id]: false }));
                  navigate(tab.id, tab.url); // Relancer le chargement
                }}
              >
                🔁 Réessayer
              </button>
            </div>
          ) : (
            <webview
              key={tab.id}
              src={tab.url}
              ref={(el) => (webviewRefs.current[tab.id] = el)}
              className={`webview ${tab.id === activeTabId ? 'active' : ''}`}
              style={{
                display: tab.id === activeTabId ? 'flex' : 'none',
                flex: 1,
                width: '100%',
                height: '100%',
                border: 'none',
              }}
            />
          )
        )}
      </div>

    </div>
  );
};

export default AppWebBrowser;


// 📦 AppWebBrowser.jsx - Version corrigée et prête à coller
// import React, { useState, useRef, useEffect } from 'react';
// import './styles/style.css'; // Ton CSS global
// import UpdateChecker from './components/UpdateChecker';

// // 👇 Détection de prod ou dev
// const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
// const defaultURL = isDev ? 'http://localhost:1234' : 'https://www.dwaccess.com';

// // Fonction pour créer un nouvel onglet initial
// const createInitialTab = (url = defaultURL) => {
//   return {
//     id: Date.now(),
//     url,
//     history: [url],
//     historyIndex: 0,
//   };
// };

// const AppWebBrowser = () => {
//   const [tabs, setTabs] = useState([createInitialTab()]);
//   const [activeTabId, setActiveTabId] = useState(tabs[0].id);
//   const [address, setAddress] = useState(tabs[0].url);
//   const [errorTabs, setErrorTabs] = useState({});
//   const webviewRefs = useRef({});

//   // Met à jour l’adresse affichée quand l’onglet actif change
//   useEffect(() => {
//     const tab = tabs.find((t) => t.id === activeTabId);
//     if (tab) {
//       setAddress(tab.url);
//     }
//   }, [activeTabId, tabs]);

//   // Gère la navigation avant/arrière via les boutons
//   useEffect(() => {
//     if (window.electron) {
//       window.electron.onNavigateInTab((direction) => {
//         if (direction === 'back') goBack();
//         else if (direction === 'forward') goForward();
//       });
//     }
//   }, [tabs, activeTabId]);

//   // Fonction pour naviguer vers une nouvelle URL dans un onglet
//   const navigate = (id, newUrl) => {
//     const fullUrl = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`;
//     const updatedTabs = tabs.map((tab) => {
//       if (tab.id !== id) return tab;
//       const newHistory = [...tab.history.slice(0, tab.historyIndex + 1), fullUrl];
//       return {
//         ...tab,
//         url: fullUrl,
//         history: newHistory,
//         historyIndex: newHistory.length - 1,
//       };
//     });
//     setTabs(updatedTabs);
//   };

//   const goBack = () => {
//     const updatedTabs = tabs.map((tab) => {
//       if (tab.id !== activeTabId || tab.historyIndex === 0) return tab;
//       return {
//         ...tab,
//         historyIndex: tab.historyIndex - 1,
//         url: tab.history[tab.historyIndex - 1],
//       };
//     });
//     setTabs(updatedTabs);
//   };

//   const goForward = () => {
//     const updatedTabs = tabs.map((tab) => {
//       if (tab.id !== activeTabId || tab.historyIndex >= tab.history.length - 1) return tab;
//       return {
//         ...tab,
//         historyIndex: tab.historyIndex + 1,
//         url: tab.history[tab.historyIndex + 1],
//       };
//     });
//     setTabs(updatedTabs);
//   };

//   const reload = () => {
//     const ref = webviewRefs.current[activeTabId];
//     if (ref) ref.reload();
//   };

//   // ✅ Correction ici : accepte une URL mais fallback sur defaultURL
//   const addTab = (url) => {
//     const newTab = createInitialTab(url || defaultURL);
//     setTabs((prev) => [...prev, newTab]);
//     setActiveTabId(newTab.id);
//   };

//   const closeTab = (id) => {
//     if (tabs.length === 1) return;
//     const newTabs = tabs.filter((tab) => tab.id !== id);
//     setTabs(newTabs);
//     if (activeTabId === id) {
//       setActiveTabId(newTabs[0].id);
//     }
//   };

//   const handleAddressSubmit = (e) => {
//     if (e.key === 'Enter') {
//       navigate(activeTabId, address);
//     }
//   };

//   // Gestion des événements spéciaux sur les webviews
//   useEffect(() => {
//     tabs.forEach((tab) => {
//       const webview = webviewRefs.current[tab.id];
//       if (webview) {
//         // Gestion des erreurs de chargement
//         const handleLoadError = (event) => {
//           if (event.errorCode !== -3) {
//             console.error(`Erreur de chargement dans l'onglet ${tab.id}`, event);
//             setErrorTabs((prev) => ({ ...prev, [tab.id]: true }));
//           }
//         };

//         // Gestion des liens target="_blank" pour ouvrir en nouvel onglet React
//         const handleNewWindow = (event) => {
//           event.preventDefault();
//           const newUrl = event.url;
//           console.log(`Nouvel onglet ouvert pour : ${newUrl}`);
//           const newTab = createInitialTab(newUrl);
//           setTabs((prev) => [...prev, newTab]);
//           setActiveTabId(newTab.id);
//         };

//         webview.addEventListener('did-fail-load', handleLoadError);
//         webview.addEventListener('new-window', handleNewWindow);

//         return () => {
//           webview.removeEventListener('did-fail-load', handleLoadError);
//           webview.removeEventListener('new-window', handleNewWindow);
//         };
//       }
//     });
//   }, [tabs]);

//   return (
//     <div className="browser-wrapper">
//       <div className="tabs">
//         {tabs.map((tab) => (
//           <div
//             key={tab.id}
//             className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
//             onClick={() => setActiveTabId(tab.id)}
//           >
//             {new URL(tab.url).hostname}
//             <button onClick={(e) => { e.stopPropagation(); closeTab(tab.id); }}>✖</button>
//           </div>
//         ))}
//         <button className="add-tab" onClick={() => addTab()}>➕</button>
//       </div>

//       <div className="address-bar">
//         <button className='address-bar-button' onClick={goBack}>⬅️</button>
//         <button className='address-bar-button' onClick={goForward}>➡️</button>
//         <button className='address-bar-button' onClick={reload}>🔄</button>
//         <input
//           className="address-input"
//           type="text"
//           value={address}
//           onChange={(e) => setAddress(e.target.value)}
//           onKeyDown={handleAddressSubmit}
//           placeholder="Entrer une URL"
//         />
//         <UpdateChecker />
//       </div>

//       <div className="webview-container">
//         {tabs.map((tab) =>
//           errorTabs[tab.id] ? (
//             <div
//               key={tab.id}
//               className="webview-error"
//             >
//               <h2>🚫 Erreur de chargement</h2>
//               <p>L’URL a échoué : <strong>{tab.url}</strong></p>
//               <button
//                 onClick={() => {
//                   setErrorTabs((prev) => ({ ...prev, [tab.id]: false }));
//                   navigate(tab.id, tab.url);
//                 }}
//               >
//                 🔁 Réessayer
//               </button>
//             </div>
//           ) : (
//             <webview
//               key={tab.id}
//               src={tab.url}
//               ref={(el) => (webviewRefs.current[tab.id] = el)}
//               className={`webview ${tab.id === activeTabId ? 'active' : ''}`}
//               style={{
//                 display: tab.id === activeTabId ? 'flex' : 'none',
//                 flex: 1,
//                 width: '100%',
//                 height: '100%',
//                 border: 'none',
//               }}
//             />
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default AppWebBrowser;
