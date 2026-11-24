import type { AuditLogEntry } from '../dtos/audit-log-entry.dto';

export interface IAuditLogReader {
  listRecent(limit?: number): Promise<AuditLogEntry[]>;
}
