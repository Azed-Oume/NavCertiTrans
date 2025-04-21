// Description: Main process for an Electron application with auto-update, notifications, and custom window handling.

const { app, BrowserWindow, Menu, ipcMain, shell, Notification, globalShortcut } = require("electron");
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
  new Notification({ title: "Test", body: "Est-ce que tu vois cette notif ?" }).show();


  // ❌ Supprimer complètement le menu système
  Menu.setApplicationMenu(null);

  const isDev = !app.isPackaged;
  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    // win.loadFile(path.join(__dirname, "dist/index.html"));
    win.loadURL(`file://${__dirname}/dist/index.html#/`);
  }

  // 🔗 Ouvrir certains liens dans le navigateur externe
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https://www.google.com/maps") || url.startsWith("https://wa.me")) {
      shell.openExternal(url);
      return { action: "deny" };
    }
    win.webContents.send("open-new-tab", url);
    return { action: "deny" };
  });

  // 🎯 Raccourcis clavier internes
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

    if ((control && key === "d") || key === "F12") {
      event.preventDefault();
      win.webContents.toggleDevTools();
    }
  });

  // 🔄 Mise à jour auto au démarrage
  autoUpdater.checkForUpdatesAndNotify();

  // ✅ Enregistrer les raccourcis globaux
  globalShortcut.register('F12', () => {
    const focused = BrowserWindow.getFocusedWindow();
    if (focused) focused.webContents.toggleDevTools();
  });

  globalShortcut.register('Control+Left', () => {
    win.webContents.send('navigate-in-tab', 'back');
  });

  globalShortcut.register('Control+Right', () => {
    win.webContents.send('navigate-in-tab', 'forward');
  });
}

app.whenReady().then(() => {
  createWindow();

  autoUpdater.on("update-available", () => {
    new Notification({ title: "Mise à jour", body: "Une nouvelle version est disponible." }).show();
  });

  autoUpdater.on("update-not-available", () => {
    console.log("❌ Aucune mise à jour disponible.");
  });

  autoUpdater.on("error", (error) => {
    console.error("🚨 Erreur de mise à jour :", error);
  });

  autoUpdater.on("download-progress", (progress) => {
    console.log(`⬇️ Téléchargement : ${Math.floor(progress.percent)}%`);
  });

  autoUpdater.on("update-downloaded", () => {
    new Notification({
      title: "Mise à jour prête",
      body: "Redémarre l'application pour appliquer la mise à jour.",
    }).show();
  });
});

// 📬 Vérification manuelle depuis le renderer
ipcMain.on("check-for-update", (event) => {
  console.log("🔄 Vérification manuelle de mise à jour...");
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

// 🌐 Ouverture de lien externe depuis le renderer
ipcMain.on("open-external", (event, url) => {
  console.log("🔗 Lien externe ouvert :", url);
  shell.openExternal(url);
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.commandLine.appendSwitch("disable-gpu-shader-disk-cache");
