import type { AuditLogInput } from './audit-log-input.dto';

export interface AuditLogEntry extends AuditLogInput {
  id: string;
  createdAt: string;
}
