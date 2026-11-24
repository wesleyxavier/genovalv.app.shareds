import type { AuditLogLevel } from './audit-log-level.dto';

export interface AuditLogInput {
  level: AuditLogLevel;
  action: string;
  actorEmail?: string;
  actorUserId?: string;
  tenantId?: string;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}
