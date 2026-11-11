import {
  AuditLog,
  AuditLogChange,
  AuditLogEntry,
} from "@/registry/bases/newt/ui/audit-log"

export default function AuditLogDemo() {
  return (
    <AuditLog aria-label="Audit log" className="max-w-lg">
      <AuditLogEntry
        actor="ada"
        action="updated the role"
        target="Moderator"
        kind="update"
        time="Today at 14:23"
        dateTime="2026-11-10T14:23"
        defaultOpen
      >
        <AuditLogChange>
          Granted <strong>Manage messages</strong>
        </AuditLogChange>
        <AuditLogChange>
          Changed the colour to <strong>#1abc9c</strong>
        </AuditLogChange>
      </AuditLogEntry>
      <AuditLogEntry
        actor="mio"
        action="created the channel"
        target="#release-notes"
        kind="create"
        time="Today at 11:40"
        dateTime="2026-11-10T11:40"
      >
        <AuditLogChange>
          Set the topic to <strong>What shipped, and when</strong>
        </AuditLogChange>
      </AuditLogEntry>
      <AuditLogEntry
        actor="kai"
        action="deleted the channel"
        target="#old-news"
        kind="delete"
        time="Yesterday at 09:02"
        dateTime="2026-11-09T09:02"
      />
    </AuditLog>
  )
}
