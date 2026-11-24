import type { IHashService } from '@genovalv/core';
import { createHash, randomBytes } from 'node:crypto';

export class NodeHashService implements IHashService {
  sha256(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  generateStrongPassword(): string {
    return `Gnv!9${randomBytes(12).toString('base64url')}a1`;
  }
}
