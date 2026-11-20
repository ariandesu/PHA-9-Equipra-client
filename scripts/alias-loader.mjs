import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

// Minimal resolver so plain Node can load the app's src/ modules: maps the
// "@/*" alias from jsconfig.json and fills in the .js extension that
// bundler-style imports omit (auth.js imports "@/lib/auth-rules" that way).
const SRC_DIR = path.join(process.cwd(), 'src');

function candidateFiles(specifier, parentUrl) {
  if (specifier.startsWith('@/')) {
    return [path.join(SRC_DIR, specifier.slice(2))];
  }
  if (specifier.startsWith('.') && parentUrl?.startsWith('file:')) {
    return [path.join(path.dirname(fileURLToPath(parentUrl)), specifier)];
  }
  return [];
}

function firstExisting(base) {
  if (fs.existsSync(base) && fs.statSync(base).isFile()) return base;
  for (const ext of ['.js', '.mjs', '.jsx', '/index.js']) {
    if (fs.existsSync(base + ext)) return base + ext;
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  for (const base of candidateFiles(specifier, context.parentURL)) {
    const hit = firstExisting(base);
    if (hit) return { url: pathToFileURL(hit).href, shortCircuit: true };
  }
  return nextResolve(specifier, context);
}
