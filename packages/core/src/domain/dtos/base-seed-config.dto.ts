import type { BaseSeedProfile } from './base-seed-profile.dto';

export interface BaseSeedConfig {
  profiles: readonly BaseSeedProfile[];
}
