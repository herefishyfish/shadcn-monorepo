import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';

/**
 * `@nativescript/vite` graph ids slice at the first `/src/`.
 * `packages/ui/src/views/kite.tsx` becomes `/src/views/kite`, and the device
 * requests `/ns/m/src/views/kite` (404). The file is served from the monorepo
 * root as `/ns/m/packages/ui/src/views/kite.tsx`. The HMR client strips script
 * extensions, so the re-import URL is that path without `.tsx`.
 *
 * ponytail: rebase the id, serve the extensionless path, and emit the same
 * URL in imports. A 200 on the leaf is not enough: the page captured the
 * export, so the delta also reloads in-app importers. `src/app` is left out;
 * `Application.run` throws once the activity has started, and AppShell
 * remounts the tree when it is re-evaluated.
 * Per-package aliases if a lib ever lives outside `/packages/`.
 */

const require = createRequire(import.meta.url);
const { HmrModuleGraph } = await import(
  pathToFileURL(
    path.join(path.dirname(require.resolve('@nativescript/vite')), 'hmr/server/hmr-module-graph.js'),
  ).href
);

const SCRIPT_EXTS = ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.mts', '.cts'];
const SCRIPT_EXT_RE = /\.(tsx|ts|jsx|js|mjs|mts|cts)$/i;
const PACKAGE_SCRIPT_URL = /(["'])([^"']*\/ns\/m\/packages\/[^"']+?)\.(?:tsx|ts|jsx|js|mjs|mts|cts)(?:\?t=\d+)?\1/g;

let workspaceCache;

export function workspaceModuleId(raw, appRoot, workspaceRoot) {
  if (!raw || !appRoot || !workspaceRoot) return null;
  let id = String(raw).split('?')[0].replace(/\\/g, '/').replace(/^file:\/\//, '');
  if (id.startsWith('/@fs/')) id = id.slice('/@fs'.length);
  id = id.replace(/^\/(?=[A-Za-z]:\/)/, '');
  const app = appRoot.replace(/\\/g, '/').replace(/\/$/, '');
  const workspace = workspaceRoot.replace(/\\/g, '/').replace(/\/$/, '');
  if (!workspace || workspace === app || id.includes('/node_modules/')) return null;
  if (id.startsWith('/packages/') || id.startsWith('packages/')) {
    return id.startsWith('/') ? id : '/' + id;
  }
  const abs = (/^[A-Za-z]:\//.test(id) ? path.resolve(id) : path.resolve(app, id.replace(/^\//, ''))).replace(/\\/g, '/');
  if (abs === app || abs.startsWith(app + '/') || !abs.startsWith(workspace + '/')) return null;
  return '/' + abs.slice(workspace.length + 1);
}

function findWorkspace(start) {
  if (workspaceCache !== undefined) return workspaceCache;
  let dir = path.resolve(start);
  workspaceCache = null;
  for (;;) {
    try {
      const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf8'));
      if (pkg.workspaces) {
        workspaceCache = dir.replace(/\\/g, '/');
        break;
      }
    } catch {}
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return workspaceCache;
}

function scriptSuffix(workspace, spec) {
  const rel = spec.replace(/^\/+/, '');
  if (!rel || rel.includes('node_modules/')) return null;
  const abs = path.join(workspace, rel);
  for (const ext of SCRIPT_EXTS) {
    if (fs.existsSync(abs + ext)) return ext;
  }
  for (const ext of SCRIPT_EXTS) {
    if (fs.existsSync(path.join(abs, 'index' + ext))) return '/index' + ext;
  }
  return null;
}

function installGraphIds() {
  const current = HmrModuleGraph.prototype.normalizeGraphId;
  if (current.__sharedPackage) return;
  function normalizeGraphId(raw) {
    const appRoot = this.deps.getPluginRoot?.();
    const next = workspaceModuleId(raw, appRoot, appRoot && findWorkspace(appRoot));
    return next ?? current.call(this, raw);
  }
  normalizeGraphId.__sharedPackage = true;
  HmrModuleGraph.prototype.normalizeGraphId = normalizeGraphId;
}

let devServer = null;

function canonicalId(id) {
  return String(id || '').replace(/\.(tsx|ts|jsx|js|mjs|mts|cts)$/i, '');
}

/**
 * Importers the device must drop before it reloads the changed module.
 * The app entry is first: its import loads each dependency once. A second
 * explicit import of an invalidated module throws on device.
 */
export function appendImporterUpdates(changed, importerIds) {
  const seen = new Set();
  const ids = [];
  const push = (id) => {
    const key = canonicalId(id);
    if (!id || !key || seen.has(key) || id.includes('node_modules')) return;
    if (!id.startsWith('/src/') && !id.startsWith('/packages/')) return;
    seen.add(key);
    ids.push(id);
  };
  for (const mod of changed || []) push(mod?.id);
  for (const id of importerIds || []) push(id);
  const entry = ids.filter((id) => canonicalId(id) === '/src/app');
  const rest = ids.filter((id) => canonicalId(id) !== '/src/app');
  const ordered = [...entry, ...rest];
  if (ordered.length === (changed?.length || 0) && ordered.every((id, i) => id === changed[i]?.id)) return changed;
  const byId = new Map((changed || []).filter((mod) => mod?.id).map((mod) => [mod.id, mod]));
  const hash = changed?.find((mod) => mod?.hash)?.hash || '1';
  return ordered.map((id) => byId.get(id) || { id, deps: [], hash });
}

function seedModules(server, absForward) {
  const mg = server?.moduleGraph;
  if (!mg) return [];
  const out = [];
  const add = (list) => {
    if (!list) return;
    for (const mod of list) if (mod) out.push(mod);
  };
  add(mg.getModulesByFile?.(absForward));
  add(mg.getModulesByFile?.(absForward.replace(/\//g, '\\')));
  if (out.length) return out;
  const map = mg.idToModuleMap;
  if (!map) return out;
  const tail = absForward.toLowerCase();
  for (const mod of map.values()) {
    const id = String(mod?.id || mod?.file || '').replace(/\\/g, '/').toLowerCase();
    if (id === tail || id.endsWith('/' + tail) || id.endsWith(tail)) out.push(mod);
  }
  return out;
}

function importerIdsFor(graph, server, workspace, graphId) {
  const rel = String(graphId || '').replace(/^\/+/, '');
  if (!rel || !workspace) return [];
  let abs = path.resolve(workspace, rel).replace(/\\/g, '/');
  if (!fs.existsSync(abs)) {
    const suffix = scriptSuffix(workspace, '/' + rel);
    if (!suffix) return [];
    abs = path.resolve(workspace, rel + suffix).replace(/\\/g, '/');
  }
  const ids = [];
  const seen = new Set();
  const queue = seedModules(server, abs);
  while (queue.length) {
    const mod = queue.shift();
    if (!mod || seen.has(mod)) continue;
    seen.add(mod);
    for (const imp of mod.importers || []) {
      queue.push(imp);
      if (!imp?.id || String(imp.id).includes('node_modules')) continue;
      const id = graph.normalizeGraphId(imp.id);
      if (id) ids.push(id);
    }
  }
  return ids;
}

function installDeltaImporters() {
  const current = HmrModuleGraph.prototype.emitDelta;
  if (current.__sharedPackage) return;
  function emitDelta(changed, removed) {
    let next = changed;
    try {
      if (devServer && this.version > 1 && changed?.some((mod) => mod?.id?.startsWith('/packages/'))) {
        const workspace = findWorkspace(devServer.config.root);
        const importerIds = [];
        for (const mod of changed) {
          if (mod?.id?.startsWith('/packages/')) importerIds.push(...importerIdsFor(this, devServer, workspace, mod.id));
        }
        const expanded = appendImporterUpdates(changed, importerIds);
        // Reimporting src/app calls Application.run again, which the device
        // rejects. The shell remounts when it is re-evaluated.
        const rest = expanded.filter((mod) => canonicalId(mod.id) !== '/src/app');
        if (rest.length && (rest.length !== changed.length || rest.some((mod, i) => mod.id !== changed[i]?.id))) {
          next = rest;
          console.info('[shared-package-hmr]', next.map((mod) => mod.id).join(' '));
        }
      }
    } catch (error) {
      console.warn('[shared-package-hmr] importer walk failed', error?.message || error);
    }
    return current.call(this, next, removed);
  }
  emitDelta.__sharedPackage = true;
  HmrModuleGraph.prototype.emitDelta = emitDelta;
}

installGraphIds();
installDeltaImporters();

export function sharedPackageHmr() {
  return {
    name: 'shared-package-hmr',
    apply: 'serve',
    enforce: 'pre',
    configureServer(server) {
      devServer = server;
      const workspace = findWorkspace(server.config.root);
      if (!workspace) return;
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/ns/m/')) return next();
        const q = req.url.indexOf('?');
        const pathname = q === -1 ? req.url : req.url.slice(0, q);
        const search = q === -1 ? '' : req.url.slice(q);
        const spec = pathname.slice('/ns/m'.length);
        if (spec.startsWith('/packages/') && !SCRIPT_EXT_RE.test(spec)) {
          const suffix = scriptSuffix(workspace, spec);
          if (suffix) req.url = pathname + suffix + search;
        }
        const end = res.end;
        res.end = function (chunk, ...rest) {
          if (typeof chunk === 'string' && chunk.includes('/ns/m/packages/')) {
            const rewritten = chunk.replace(PACKAGE_SCRIPT_URL, '$1$2$1');
            if (rewritten !== chunk) {
              chunk = rewritten;
              if (!res.headersSent && res.getHeader('Content-Length')) {
                res.setHeader('Content-Length', Buffer.byteLength(chunk));
              }
            }
          }
          return end.call(this, chunk, ...rest);
        };
        next();
      });
    },
  };
}

function selfCheck() {
  const app = 'D:/repo/apps/nativescript';
  const workspace = 'D:/repo';
  const want = '/packages/ui/src/views/kite.tsx';
  const cases = [
    ['D:/repo/packages/ui/src/views/kite.tsx', want],
    ['/../../packages/ui/src/views/kite.tsx', want],
    ['/packages/ui/src/views/kite.tsx', want],
    ['/src/pages/KitePage.tsx', null],
    ['D:/repo/apps/nativescript/src/app.tsx', null],
  ];
  for (const [raw, expected] of cases) {
    const got = workspaceModuleId(raw, app, workspace);
    if (got !== expected) throw new Error(`${raw} -> ${got}, expected ${expected}`);
  }
  const changed = [{ id: '/packages/ui/src/views/kite.tsx', deps: [], hash: 'a' }];
  const next = appendImporterUpdates(changed, [
    '/src/pages/KitePage.tsx',
    '/src/pages/KitePage.tsx',
    '/node_modules/react/index.js',
    '/src/components/AppShell.tsx',
    '/src/app.tsx',
    'nope',
  ]);
  const ids = next.map((mod) => mod.id).join(',');
  const chain = '/src/app.tsx,/packages/ui/src/views/kite.tsx,/src/pages/KitePage.tsx,/src/components/AppShell.tsx';
  if (ids !== chain) throw new Error(ids);
  const deduped = appendImporterUpdates(changed, ['/src/app.tsx', '/src/app.js']);
  if (deduped.map((mod) => mod.id).join(',') !== '/src/app.tsx,/packages/ui/src/views/kite.tsx') {
    throw new Error('dedupe ' + deduped.map((mod) => mod.id).join(','));
  }
  if (appendImporterUpdates(changed, []) !== changed) throw new Error('identity');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  selfCheck();
  console.log('ok');
}
