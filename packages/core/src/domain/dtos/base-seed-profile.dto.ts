import type { ProfileRole } from './profile-role.dto';
import type { ProfileScope } from './profile-scope.dto';

export interface BaseSeedProfile {
  code: string;
  scope: ProfileScope;
  role: ProfileRole;
  description: string;
}
