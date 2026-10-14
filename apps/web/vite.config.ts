import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const ui = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../packages/ui/src');

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      { find: '@repo/ui/catalog', replacement: path.join(ui, 'catalog.ts') },
      { find: /^@repo\/ui\/views\/(.*)$/, replacement: `${ui}/views/$1.tsx` },
      { find: /^@repo\/ui\/lib\/(.*)$/, replacement: `${ui}/lib/$1` },
      { find: /^@repo\/ui\/hooks\/(.*)$/, replacement: `${ui}/hooks/$1` },
      { find: /^@repo\/ui\/(.*)$/, replacement: `${ui}/components/ui/$1.tsx` },
    ],
  },
  server: { port: 5173, fs: { allow: ['../..'] } },
});
