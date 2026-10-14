import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, mergeConfig } from 'vite';
import { reactConfig } from '@nativescript/vite/react';

const require = createRequire(import.meta.url);
// React's package entry only re-exports the dev build at runtime. Hot reload
// lists named exports statically, so `import { Fragment } from 'react'` fails
// unless we point at the file that actually assigns `exports.Fragment`.
const reactDevelopment = path.join(path.dirname(require.resolve('react/package.json')), 'cjs/react.development.js');

const ui = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../packages/ui/src');
import { protect, restore } from './postcss-masonkit.mjs';
import { masonkitSingleInstance } from './masonkit-hmr.mjs';
import { escapedSelectorCommas } from './postcss-selector-commas.mjs';
import { nativeColors } from './postcss-native-colors.mjs';
import { nativescriptReact } from './react-workarounds.mjs';
import { stableActivityChunk } from './android-workarounds.mjs';
import { canvasPlatformFile } from './canvas-workarounds.mjs';
import { sharedPackageHmr } from './ui-hmr.mjs';

export default defineConfig(({ mode }) =>
  mergeConfig(reactConfig({ mode }), {
    plugins: [...nativescriptReact(), masonkitSingleInstance(), sharedPackageHmr(), stableActivityChunk(), canvasPlatformFile()],
    optimizeDeps: {
      // MasonKit must load as a single instance over the HMR server. If Vite
      // pre-bundles a subpath (e.g. `/elements`), that copy is routed to the
      // vendor bundle, where MasonKit is deliberately absent, and its exports
      // come back undefined.
      exclude: [
        '@triniwiz/nativescript-masonkit',
        '@triniwiz/nativescript-masonkit/web',
        '@triniwiz/nativescript-masonkit/elements',
      ],
    },
    resolve: {
      alias: [
        ...(mode === 'development' ? [{ find: /^react$/, replacement: reactDevelopment }] : []),
        { find: '@repo/ui/catalog', replacement: path.join(ui, 'catalog.ts') },
        { find: /^@repo\/ui\/views\/(.*)$/, replacement: `${ui}/views/$1.tsx` },
        { find: '@repo/ui/lib/slot', replacement: path.join(ui, 'lib/slot.tsx') },
        { find: /^@repo\/ui\/lib\/(.*)$/, replacement: `${ui}/lib/$1.ts` },
        { find: /^@repo\/ui\/hooks\/(.*)$/, replacement: `${ui}/hooks/$1.ts` },
        { find: /^@repo\/ui\/(.*)$/, replacement: `${ui}/components/ui/$1.tsx` },
      ],
    },
    server: { fs: { allow: [path.resolve(ui, '../..')] } },
    css: {
      postcss: {
        // Lets Tailwind layout utilities (flex, grid, gap, max-w, ...) and
        // `hover:` styles reach MasonKit views instead of being stripped,
        // keeps classes with commas in them, like `grid-cols-[repeat(...,...)]`,
        // and converts shadcn's colors (see postcss-native-colors.mjs).
        plugins: [protect(), restore(), escapedSelectorCommas(), nativeColors()],
      },
    },
  }),
);

