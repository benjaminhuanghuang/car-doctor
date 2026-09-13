// Marks each build output with its module system so Node resolves them correctly:
// dist/cjs is CommonJS (for the backend's require), dist/esm is ES modules (for Vite).
import { writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');

writeFileSync(resolve(distDir, 'cjs', 'package.json'), JSON.stringify({ type: 'commonjs' }, null, 2) + '\n');
writeFileSync(resolve(distDir, 'esm', 'package.json'), JSON.stringify({ type: 'module' }, null, 2) + '\n');
