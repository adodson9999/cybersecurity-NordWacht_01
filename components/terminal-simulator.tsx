"use client";

const terminalLines = [
  { time: "09:15:23", type: "info", message: "AI Agent initialized for document processing" },
  { time: "09:15:24", type: "success", message: "Connected to client CRM system" },
  { time: "09:15:25", type: "info", message: "Processing 147 invoices from queue" },
  { time: "09:15:28", type: "success", message: "Invoice #4521 validated and routed" },
  { time: "09:15:29", type: "info", message: "Anomaly detected: duplicate payment request" },
  { time: "09:15:30", type: "warning", message: "Flagged for human review: Invoice #4523" },
  { time: "09:15:31", type: "success", message: "Auto-approved: 12 standard invoices" },
  { time: "09:15:33", type: "info", message: "Syncing data with accounting system" },
  { time: "09:15:35", type: "success", message: "Email notification sent to approver" },
  { time: "09:15:36", type: "info", message: "Starting vendor compliance check" },
  { time: "09:15:38", type: "success", message: "All vendor certifications valid" },
  { time: "09:15:40", type: "info", message: "Generating daily processing report" },
  { time: "09:15:42", type: "success", message: "Report saved: /reports/daily-2024-01-15.pdf" },
  { time: "09:15:43", type: "info", message: "Queue processing complete: 147/147" },
  { time: "09:15:44", type: "success", message: "Average processing time: 0.8s per document" },
  { time: "09:15:45", type: "info", message: "Human intervention required: 1 item" },
];

function getTypeColor(type: string) {
  switch (type) {
    case "success":
      return "text-green-400";
    case "warning":
      return "text-amber-400";
    case "error":
      return "text-red-400";
    default:
      return "text-primary";
  }
}

function getTypePrefix(type: string) {
  switch (type) {
    case "success":
      return "[OK]";
    case "warning":
      return "[WARN]";
    case "error":
      return "[ERR]";
    default:
      return "[INFO]";
  }
}

export function TerminalSimulator() {
  // Duplicate lines for seamless scroll loop
  const allLines = [...terminalLines, ...terminalLines];

  return (
    <div className="glass overflow-hidden rounded-lg">
      {/* Terminal header */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/50 px-4 py-2">
        <div className="h-3 w-3 rounded-full bg-red-500/80" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <div className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-2 font-mono text-xs text-muted-foreground">
          nordwacht-agent.log
        </span>
      </div>

      {/* Terminal content */}
      <div className="h-48 overflow-hidden bg-background/50 p-4">
        <div className="terminal-scroll font-mono text-xs leading-relaxed">
          {allLines.map((line, index) => (
            <div key={index} className="flex gap-2">
              <span className="text-muted-foreground">{line.time}</span>
              <span className={getTypeColor(line.type)}>{getTypePrefix(line.type)}</span>
              <span className="text-foreground/80">{line.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
