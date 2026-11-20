import { apiSource } from './api-source.js';
import { mockSource } from '../mock/source.js';

// One switch decides where every screen gets its data from.
export const source =
  process.env.NEXT_PUBLIC_DATA_SOURCE === 'api' ? apiSource : mockSource;
