// 📦 main.js – Electron main process sécurisé pour NavCertiTrans

const { app, BrowserWindow, Menu, shell, Notification, globalShortcut, ipcMain } = require("electron");
const path = require("path");
const remoteMain = require("@electron/remote/main");
const { autoUpdater } = require("electron-updater");

remoteMain.initialize();

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    frame: true,
    icon: path.join(__dirname, "src/assets/icons/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "dist/preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
      webviewTag: true,
    },
  });

  remoteMain.enable(win);

  // ✅ Notification de test (optionnelle)
  new Notification({ title: "Bienvenue", body: "NavCertiTrans est lancé." }).show();

  // ❌ Supprimer le menu système
  Menu.setApplicationMenu(null);

  const isDev = !app.isPackaged;
  if (isDev) {
    win.loadURL("http://localhost:1234"); // correspond à defaultURL côté webview
  } else {
    win.loadURL(`file://${__dirname}/dist/index.html#/`);
  }

  // 🔒 Bloquer toutes les ouvertures sauf exceptions explicites
  win.webContents.setWindowOpenHandler(({ url }) => {
    const allowedPrefixes = [
      "https://www.google.com/maps",
      "https://wa.me"
    ];

    if (allowedPrefixes.some(prefix => url.startsWith(prefix))) {
      shell.openExternal(url);
      return { action: "deny" };
    }

    console.warn("❌ Lien bloqué :", url);
    return { action: "deny" };
  });

  // 🔄 Raccourcis clavier utiles uniquement
  win.webContents.on("before-input-event", (event, input) => {
    const { control, key } = input;

    if (control && key === "r") {
      event.preventDefault();
      win.webContents.reload();
    }

    if (control && key === "ArrowLeft") {
      event.preventDefault();
      win.webContents.send("navigate-in-tab", "back");
    }

    if (control && key === "ArrowRight") {
      event.preventDefault();
      win.webContents.send("navigate-in-tab", "forward");
    }

    // 🔐 DevTools désactivés
    if ((control && key === "d") || key === "F12") {
      event.preventDefault(); // Ne rien faire
    }
  });

  // 🔄 Vérifier les mises à jour automatiquement
  autoUpdater.checkForUpdatesAndNotify();

  // ✅ Raccourcis globaux utiles
  globalShortcut.register('Control+Left', () => {
    win.webContents.send('navigate-in-tab', 'back');
  });

  globalShortcut.register('Control+Right', () => {
    win.webContents.send('navigate-in-tab', 'forward');
  });

  // ❌ F12 désactivé globalement
  // globalShortcut.register('F12', () => {});
}

app.whenReady().then(() => {
  createWindow();

  autoUpdater.on("update-available", () => {
    new Notification({ title: "Mise à jour disponible", body: "Une nouvelle version sera installée automatiquement." }).show();
  });

  autoUpdater.on("update-not-available", () => {
    console.log("✅ Application à jour.");
  });

  autoUpdater.on("error", (error) => {
    console.error("🚨 Erreur lors de la mise à jour :", error);
  });

  autoUpdater.on("download-progress", (progress) => {
    console.log(`⬇️ Téléchargement : ${Math.floor(progress.percent)}%`);
  });

  autoUpdater.on("update-downloaded", () => {
    new Notification({
      title: "Mise à jour prête",
      body: "Redémarre l'application pour l'appliquer.",
    }).show();
  });
});

// 📬 Vérification manuelle depuis le renderer (si utilisée)
ipcMain.on("check-for-update", (event) => {
  autoUpdater.checkForUpdates();

  autoUpdater.once("update-not-available", () => {
    event.sender.send("update-status", "Aucune mise à jour disponible.");
  });

  autoUpdater.once("update-available", () => {
    event.sender.send("update-status", "Mise à jour disponible ! Téléchargement en cours...");
  });

  autoUpdater.once("error", (err) => {
    event.sender.send("update-status", `Erreur de mise à jour : ${err.message}`);
  });
});

// 🌐 Lien externe autorisé depuis le renderer
ipcMain.on("open-external", (event, url) => {
  console.log("🔗 Ouverture externe :", url);
  shell.openExternal(url);
});

// 🧹 Quitter proprement si toutes les fenêtres sont fermées
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// 🔧 Optimisation Electron (évite cache GPU inutile)
app.commandLine.appendSwitch("disable-gpu-shader-disk-cache");
