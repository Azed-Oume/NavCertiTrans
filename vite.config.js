// // vite.config.js
// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';
// import { copyFileSync } from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // ✅ copie le preload.js à chaque build
// try {
//   copyFileSync('preload.js', 'dist/preload.js');
//   console.log('✅ preload.js copié dans dist/');
// } catch (e) {
//   console.warn('⚠️ preload.js non copié :', e.message);
// }

// export default defineConfig({
//   // root: 'src', // ⬅️ Utilise bien la racine (là où est index.html)
//   base: './',
//   build: {
//     outDir: 'dist',
//     emptyOutDir: true,
//   },
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'src'),
//     },
//   },
//   plugins: [react()],
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [
    react(),
    {
      name: 'copy-preload-plugin',
      closeBundle() {
        try {
          fs.copyFileSync('preload.js', 'dist/preload.js');
          console.log('✅ preload.js copié après le build');
        } catch (e) {
          console.warn('⚠️ preload.js non copié après build :', e.message);
        }
      }
    }
  ],
});
