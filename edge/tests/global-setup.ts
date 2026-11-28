import { compose } from './helpers';

export default async function globalSetup(): Promise<void> {
  const certs = compose(['run', '--rm', 'edge-certs-init']);
  if (certs.status !== 0) throw new Error(`edge-certs-init falhou:\n${certs.output}`);

  const services = ['edge-proxy', 'edge-origin-echo', 'playground'];
  const up = compose(['--profile', 'test', 'up', '-d', '--build', '--force-recreate', '--no-deps', '--wait', ...services]);
  if (up.status !== 0) throw new Error(`docker compose up falhou:\n${up.output}`);

  // cache limpo antes das suites
  compose(['exec', '-T', 'edge-proxy', 'sh', '-c', 'rm -rf /var/cache/nginx/edge/*']);
}
