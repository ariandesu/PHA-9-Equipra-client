import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// Registers the "@/" alias + extension resolver before seed.mjs is imported, so
// the script can reuse the app's BetterAuth config and mock demo data directly.
register('./alias-loader.mjs', pathToFileURL('./scripts/'));

await import('./seed.mjs');
