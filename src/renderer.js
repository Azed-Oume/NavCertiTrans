// const remote = require('@electron/remote');
// const win = remote.getCurrentWindow();

// const input = document.getElementById('address');
// const iframe = document.getElementById('browser');

// const backBtn = document.getElementById('back-btn');
// const forwardBtn = document.getElementById('forward-btn');
// const reloadBtn = document.getElementById('reload-btn');


// const historyStack = [];
// let historyIndex = -1;

// function navigateTo(url) {
//   if (!url.startsWith('http')) url = 'https://' + url;
//   iframe.src = url;
//   historyStack.splice(historyIndex + 1);
//   historyStack.push(url);
//   historyIndex = historyStack.length - 1;
//   input.value = url;
// }

// input.addEventListener('keydown', (e) => {
//   if (e.key === 'Enter') navigateTo(input.value);
// });

// backBtn.addEventListener('click', () => {
//   if (historyIndex > 0) {
//     historyIndex--;
//     iframe.src = historyStack[historyIndex];
//     input.value = historyStack[historyIndex];
//   }
// });

// forwardBtn.addEventListener('click', () => {
//   if (historyIndex < historyStack.length - 1) {
//     historyIndex++;
//     iframe.src = historyStack[historyIndex];
//     input.value = historyStack[historyIndex];
//   }
// });


// const input = document.getElementById('address');
// const iframe = document.getElementById('browser');

// const historyStack = [];
// let historyIndex = -1;

// const backBtn = document.querySelector('button:nth-child(1)');
// const forwardBtn = document.querySelector('button:nth-child(2)');
// const reloadBtn = document.querySelector('button:nth-child(3)');

// backBtn.addEventListener('click', () => {
//   if (historyIndex > 0) {
//     historyIndex--;
//     iframe.src = historyStack[historyIndex];
//     input.value = historyStack[historyIndex];
//   }
// });

// forwardBtn.addEventListener('click', () => {
//   if (historyIndex < historyStack.length - 1) {
//     historyIndex++;
//     iframe.src = historyStack[historyIndex];
//     input.value = historyStack[historyIndex];
//   }
// });

// reloadBtn.addEventListener('click', () => {
//   iframe.src = iframe.src;
// });


// function navigateTo(url) {
//   if (!url.startsWith('http')) url = 'https://' + url;
//   iframe.src = url;
//   historyStack.splice(historyIndex + 1);
//   historyStack.push(url);
//   historyIndex = historyStack.length - 1;
//   input.value = url;
// }

// input.addEventListener('keydown', (e) => {
//   if (e.key === 'Enter') {
//     navigateTo(input.value);
//   }
// });

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('service-worker.js')
//       .then(reg => console.log('Service Worker enregistré', reg))
//       .catch(err => console.error('Erreur SW', err));
//   });
// }





const input = document.getElementById('address');
const webview = document.getElementById('browser');

const historyStack = [];
let historyIndex = -1;

const backBtn = document.querySelector('button:nth-child(1)');
const forwardBtn = document.querySelector('button:nth-child(2)');
const reloadBtn = document.querySelector('button:nth-child(3)');

// 🔙 Bouton retour
backBtn.addEventListener('click', () => {
  if (historyIndex > 0) {
    historyIndex--;
    webview.loadURL(historyStack[historyIndex]);
    input.value = historyStack[historyIndex];
  }
});

// 🔜 Bouton suivant
forwardBtn.addEventListener('click', () => {
  if (historyIndex < historyStack.length - 1) {
    historyIndex++;
    webview.loadURL(historyStack[historyIndex]);
    input.value = historyStack[historyIndex];
  }
});

// 🔄 Recharger
reloadBtn.addEventListener('click', () => {
  webview.reload();
});

// 🌐 Aller à une nouvelle URL
function navigateTo(url) {
  if (!url.startsWith('http')) url = 'https://' + url;
  webview.loadURL(url);

  // Mise à jour de l'historique
  historyStack.splice(historyIndex + 1);
  historyStack.push(url);
  historyIndex = historyStack.length - 1;

  input.value = url;
}

// 🎯 Entrée clavier dans la barre d'adresse
input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    navigateTo(input.value.trim());
  }
});

// 📍 Met à jour la barre d'adresse quand on navigue dans le webview
webview.addEventListener('did-navigate', (event) => {
  const currentUrl = event.url;
  input.value = currentUrl;

  // Ajouter à l'historique seulement si ce n'est pas une redirection interne
  if (historyStack[historyIndex] !== currentUrl) {
    historyStack.splice(historyIndex + 1);
    historyStack.push(currentUrl);
    historyIndex = historyStack.length - 1;
  }
});

// ✅ Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker enregistré', reg))
      .catch(err => console.error('Erreur SW', err));
  });
}
