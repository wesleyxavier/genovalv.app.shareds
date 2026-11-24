import { config as loadDotenv } from 'dotenv';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export function loadEnvFile(rawEnv = process.env['APP_ENV'] || process.env['NODE_ENV'] || 'development'): void {
  const appEnv = rawEnv.trim();
  const candidate = resolve(process.cwd(), `.env.${appEnv}`);
  if (existsSync(candidate)) {
    loadDotenv({ path: candidate, override: true });
  }
}
