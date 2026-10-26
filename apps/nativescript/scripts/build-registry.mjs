// Regenerates registry.json from src/lib, src/hooks and src/components/ui,
// reading each file's imports for its npm and registry dependencies, then
// runs `shadcn build` to write public/r/. Run with `npm run registry:build`.
//
// Files this app re-exports from @repo/ui are read from packages/ui/src
// instead, published under the same src/ path, with their relative imports
// rewritten to the @/ aliases from components.json.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';

const NAMESPACE = '@ns';
const NPM = ['class-variance-authority', 'clsx', 'tailwind-merge', '@nativescript/canvas-svg'];
const SHARED = '../../packages/ui';

const sources = [
  { dir: 'src/lib', type: 'registry:lib' },
  { dir: 'src/hooks', type: 'registry:hook' },
  { dir: 'src/components/ui', type: 'registry:ui' },
];

// Dependencies a file needs but doesn't import: chart.tsx draws with <svg>,
// which src/dom.ts registers from @nativescript/canvas-svg.
const EXTRA = {
  chart: {
    dependencies: ['@nativescript/canvas-svg'],
    description: 'Bar, line and area charts drawn with @nativescript/canvas-svg. Register <svg> as src/dom.ts does.',
  },
};

const title = (name) =>
  name.split('-').map((part) => part[0].toUpperCase() + part.slice(1)).join(' ');

const list = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((file) => /\.tsx?$/.test(file)) : []);

// Rewrites `./x` and `../../lib/x` to `@/components/ui/x` and `@/lib/x`,
// resolving each against the file's published path.
const aliasImports = (source, filePath) =>
  source.replace(/from '(\.{1,2}\/[^']+)'/g, (match, specifier) => {
    const target = path.posix.join(path.posix.dirname(filePath), specifier);
    return target.startsWith('src/') ? `from '@/${target.slice('src/'.length)}'` : match;
  });

const staging = fs.mkdtempSync(path.join(os.tmpdir(), 'ns-registry-'));
const items = [];
for (const { dir, type } of sources) {
  const files = [...new Set([...list(dir), ...list(path.join(SHARED, dir))])].sort();
  for (const file of files) {
    const filePath = `${dir}/${file}`;
    const local = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
    const source =
      local && !local.includes("from '@repo/ui/")
        ? local
        : aliasImports(fs.readFileSync(path.join(SHARED, filePath), 'utf8'), filePath);
    const content = source.replace(/\r\n/g, '\n');
    fs.mkdirSync(path.join(staging, dir), { recursive: true });
    fs.writeFileSync(path.join(staging, filePath), content);

    const name = file.replace(/\.tsx?$/, '');
    const imports = [...content.matchAll(/from '([^']+)'/g)].map((m) => m[1]);
    const registryDependencies = [
      ...new Set(
        imports
          .filter((i) => i.startsWith('@/'))
          .map((i) => `${NAMESPACE}/${path.basename(i)}`)
          .filter((dep) => dep !== `${NAMESPACE}/${name}`),
      ),
    ];
    const extra = EXTRA[name] ?? {};
    const dependencies = [...new Set([...NPM.filter((pkg) => imports.includes(pkg)), ...(extra.dependencies ?? [])])];
    items.push({
      name,
      type,
      title: title(name),
      description: extra.description ?? `${title(name)} for NativeScript (MasonKit).`,
      ...(dependencies.length && { dependencies }),
      ...(registryDependencies.length && { registryDependencies }),
      files: [{ path: filePath, type }],
    });
  }
}

const registry =
  JSON.stringify(
    {
      $schema: 'https://ui.shadcn.com/schema/registry.json',
      name: 'ns',
      homepage: 'https://github.com/triniwiz/nativescript-desktop-starter-template-shadcn',
      items,
    },
    null,
    2,
  ) + '\n';
fs.writeFileSync('registry.json', registry);
fs.writeFileSync(path.join(staging, 'registry.json'), registry);
console.log(`registry.json: ${items.length} items`);

try {
  execSync(`npx -y shadcn@latest build --cwd "${staging}" --output "${path.resolve('public/r')}"`, {
    stdio: 'inherit',
  });
} finally {
  fs.rmSync(staging, { recursive: true, force: true });
}
