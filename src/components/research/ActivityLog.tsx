import { memo, useRef, useEffect } from "react";
import { Activity } from "lucide-react";
import type { LogEntry } from "@/lib/researchMockData";

export type ActivityLogProps = {
  entries: LogEntry[];
  onClear: () => void;
};

const ActivityLog = memo(function ActivityLog({ entries, onClear }: ActivityLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries.length]);

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{
        backgroundColor: "#111827",
        border: "1px solid #334155",
        borderRadius: "16px",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid #334155" }}
      >
        <div className="flex items-center gap-2">
          <Activity size={16} style={{ color: "#00C9FF" }} />
          <h4
            className="text-sm font-semibold"
            style={{ color: "#F5F7FA", fontFamily: '"Inter", system-ui, sans-serif' }}
          >
            Activity Log
          </h4>
        </div>
        <button
          onClick={onClear}
          className="text-xs font-medium transition-colors duration-200 hover:text-[#00C9FF]"
          style={{ color: "#64748B" }}
        >
          Clear
        </button>
      </div>

      {/* Log entries */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-5 py-4"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start gap-3"
              style={{
                animation: "logSlideIn 0.2s ease-out",
              }}
            >
              {/* Timestamp */}
              <span
                className="shrink-0 text-[11px]"
                style={{
                  color: "#64748B",
                  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  width: "72px",
                  minWidth: "72px",
                }}
              >
                {entry.timestamp}
              </span>

              {/* Status dot */}
              <div className="mt-1.5 shrink-0">
                {entry.status === "active" && (
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{
                      backgroundColor: "#00C9FF",
                      animation: "pulse 1.5s infinite",
                    }}
                  />
                )}
                {entry.status === "complete" && (
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "#22C55E" }}
                  />
                )}
                {entry.status === "queued" && (
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: "#334155" }}
                  />
                )}
              </div>

              {/* Sector badge */}
              <span
                className="shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                style={{
                  backgroundColor: `${entry.sectorColor}18`,
                  color: entry.sectorColor,
                  borderRadius: "20px",
                }}
              >
                {entry.sector}
              </span>

              {/* Message */}
              <span
                className="break-words text-xs leading-relaxed"
                style={{ color: "#94A3B8" }}
              >
                {entry.message}
              </span>
            </div>
          ))}

          {entries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <Activity size={24} style={{ color: "#334155" }} />
              <p className="mt-3 text-xs" style={{ color: "#64748B" }}>
                No activity yet. Click "Start Research" to begin.
              </p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes logSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
});

export default ActivityLog;
