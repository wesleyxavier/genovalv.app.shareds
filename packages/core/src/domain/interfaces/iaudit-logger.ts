import type { AuditLogInput } from '../dtos/audit-log-input.dto';

export interface AuditLogger {
  log(entry: AuditLogInput): Promise<void>;
}
