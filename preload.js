const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("certitransAPI", {
  onNavigateInTab: (callback) => ipcRenderer.on("navigate-in-tab", (e, dir) => callback(dir)),

  // ✅ Gère l'ouverture de lien externe côté main.js
  openExternal: (url) => ipcRenderer.send("open-external", url),

  // 🔄 Déclenche une vérification manuelle de mise à jour
  checkForUpdate: () => ipcRenderer.send("check-for-update"),

  // 📬 Retour du statut de mise à jour
  onUpdateStatus: (callback) => ipcRenderer.on("update-status", (e, msg) => callback(msg)),
});
