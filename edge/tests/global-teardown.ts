import { compose } from './helpers';

export default async function globalTeardown(): Promise<void> {
  if (process.env.KEEP_EDGE === '1') return;
  // remove so os conteineres da borda; nunca `down` (preservaria postgres e volumes)
  compose(['--profile', 'test', 'rm', '-sf', 'edge-proxy', 'edge-origin-echo', 'playground']);
}
