import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const activitySourcePath = require.resolve('@nativescript/core/ui/frame/activity.android.js');

const ACTIVITY_IMPORTS = [
  ["import '../../globals';", (url) => `import ${url('globals')};`],
  ["import { setActivityCallbacks } from '.';", (url) => `import { setActivityCallbacks } from ${url('ui/frame')};`],
  ["import { Application } from '../../application';", (url) => `import { Application } from ${url('application')};`],
  ["import { isEmbedded } from '../embedding';", (url) => `import { isEmbedded } from ${url('ui/embedding')};`],
];

/**
 * The generated Java activity always loads `./activity.android.mjs`.
 * A normal build emits that chunk. Hot reload serves `@nativescript/core`
 * over HTTP instead, so the chunk disappears and a sync deletes it.
 * Put the same module back, importing the hot-reload core, and point the
 * bundle's activity import at that file so the class is registered once.
 *
 * @returns {import('vite').Plugin}
 */
export function stableActivityChunk() {
  return {
    name: 'stable-android-activity-chunk',
    apply: 'build',
    outputOptions(options) {
      const original = options.chunkFileNames;
      return {
        ...options,
        chunkFileNames: (chunk) => {
          if (chunk.name?.startsWith('activity.android')) return '[name].mjs';
          return typeof original === 'function' ? original(chunk) : (original ?? '[name]-[hash].mjs');
        },
      };
    },
    generateBundle(_options, bundle) {
      const chunks = Object.values(bundle).filter((item) => item.type === 'chunk');
      if (chunks.some((chunk) => chunk.fileName === 'activity.android.mjs' || chunk.name?.startsWith('activity.android'))) {
        return;
      }

      let origin = '';
      for (const chunk of chunks) {
        const match = chunk.code.match(/(https?:\/\/[^"'/\s]+)\/ns\/core\//);
        if (match) {
          origin = match[1];
          break;
        }
      }
      if (!origin) return;

      for (const chunk of chunks) {
        chunk.code = chunk.code.replace(
          /import\((['"])https?:\/\/[^'"]*\/ns\/core\/ui\/frame\/activity\1\)/g,
          'import("~/activity.android.mjs")',
        );
      }

      this.emitFile({
        type: 'asset',
        fileName: 'activity.android.mjs',
        source: activityModule(origin),
      });
    },
  };
}

function activityModule(origin) {
  const url = (sub) => JSON.stringify(`${origin}/ns/core/${sub}`);
  let body = readFileSync(activitySourcePath, 'utf8').replace(/\r\n/g, '\n');
  body = body.replace(/\/\/# sourceMappingURL=.*\n?$/, '');
  const imports = [];
  for (const [statement, rewrite] of ACTIVITY_IMPORTS) {
    if (!body.includes(statement)) {
      throw new Error(`activity.android.js no longer contains: ${statement}`);
    }
    body = body.replace(statement, '');
    imports.push(rewrite(url));
  }
  // ponytail: one registration. Java loads this file, then the bundle imports it again.
  return `${imports.join('\n')}
if (!globalThis.__nsActivityDefined) {
  globalThis.__nsActivityDefined = true;
${body.trim()}
}
`;
}
