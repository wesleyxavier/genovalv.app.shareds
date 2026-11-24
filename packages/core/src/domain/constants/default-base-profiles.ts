import type { BaseSeedProfile } from '../dtos/base-seed-profile.dto';

export const DEFAULT_BASE_PROFILES: readonly BaseSeedProfile[] = [
  { code: 'admin:admin', scope: 'admin', role: 'admin', description: 'Platform Master Administrator' },
  { code: 'admin:user', scope: 'admin', role: 'user', description: 'Platform Support Operator' },
  { code: 'client:admin', scope: 'client', role: 'admin', description: 'Customer Tenant Administrator' },
  { code: 'client:user', scope: 'client', role: 'user', description: 'Customer Tenant Standard User' },
];
