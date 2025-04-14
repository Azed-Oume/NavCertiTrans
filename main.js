const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const remoteMain = require('@electron/remote/main');
const { autoUpdater } = require('electron-updater');


remoteMain.initialize();

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    frame: true,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png')
  });

  remoteMain.enable(win);

  // 🗂️ Menu en français avec emojis pour un style visuel
  const template = [
    {
      label: '📁 Fichier',
      submenu: [
        { role: 'quit', label: '❌ Quitter' }
      ]
    },
    {
      label: '✏️ Édition',
      submenu: [
        { role: 'undo', label: '↩️ Annuler' },
        { role: 'redo', label: '↪️ Rétablir' },
        { type: 'separator' },
        { role: 'cut', label: '✂️ Couper' },
        { role: 'copy', label: '📋 Copier' },
        { role: 'paste', label: '📥 Coller' },
        { role: 'selectAll', label: '🔍 Tout sélectionner' }
      ]
    },
    {
      label: '🖥 Affichage',
      submenu: [
        { role: 'reload', label: '⟳ Recharger' },
        { role: 'togglefullscreen', label: '⛶ Plein écran' },
        { role: 'toggleDevTools', label: '🛠 Outils de développement' }
      ]
    },
    {
      label: '❓ Aide',
      submenu: [
        {
          label: 'ℹ️ À propos',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox({
              type: 'info',
              title: 'À propos',
              message: 'NavCertiTrans v1.0.0\nCréé avec ❤️ en Electron.'
            });
          }
        }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  win.loadFile(path.join(__dirname, 'src/index.html'));

  // 🎯 Raccourcis clavier natifs
  win.webContents.on('before-input-event', (event, input) => {
    const { control, key } = input;

    if (control && key === 'r') {
      event.preventDefault();
      win.webContents.reload();
    }

    if (control && key === 'ArrowLeft') {
      event.preventDefault();
      if (win.webContents.canGoBack()) win.webContents.goBack();
    }

    if (control && key === 'ArrowRight') {
      event.preventDefault();
      if (win.webContents.canGoForward()) win.webContents.goForward();
    }

    if (control && key === 'd') {
      event.preventDefault();
      win.webContents.toggleDevTools();
    }
  });
}

app.whenReady().then(createWindow);
autoUpdater.checkForUpdatesAndNotify();

app.whenReady().then(() => {
  createWindow();
  autoUpdater.checkForUpdatesAndNotify();
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});





