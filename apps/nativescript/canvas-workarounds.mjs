import fs from 'node:fs';
import path from 'node:path';

/**
 * Resolves `@nativescript/canvas`'s own `./platform` imports to `platform.js`.
 *
 * The package ships both `platform.js` (capability flags such as `NAPI_HOST`)
 * and a `platform/` directory (per-platform helpers, imported as
 * `./platform/index`). Node and webpack resolve a bare `./platform` to the
 * file, but `@nativescript/vite` (resolveNativeScriptPlatformFile) tries the
 * directory's `index.<platform>.js` first, so the build fails with
 * `"NAPI_HOST" is not exported by platform/index.windows.js`.
 *
 * @returns {import('vite').Plugin}
 */
export function canvasPlatformFile() {
  const IN_CANVAS = /[\\/]node_modules[\\/]@nativescript[\\/]canvas[\\/]/;
  const BARE_PLATFORM = /^\.{1,2}(\/\.\.)*\/platform$/;

  return {
    name: 'nativescript-canvas-platform-file',
    enforce: 'pre',
    resolveId: {
      // Ahead of @nativescript/vite's own platform resolver.
      order: 'pre',
      handler(source, importer) {
        if (!importer || !BARE_PLATFORM.test(source)) {
          return null;
        }
        const from = importer.split('?')[0];
        if (!IN_CANVAS.test(from)) {
          return null;
        }
        const file = path.resolve(path.dirname(from), `${source}.js`);
        // Forward slashes, like the rest of the module graph, so Rolldown
        // doesn't see the same file twice under two ids.
        return fs.existsSync(file) ? file.replace(/\\/g, '/') : null;
      },
    },
  };
}
