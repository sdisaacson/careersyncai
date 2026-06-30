import { memo, useRef, useEffect } from "react";
import { Activity, CheckCircle2, Circle, Loader2 } from "lucide-react";
import type { LogEntry } from "@/lib/researchMockData";

export type ActivityLogProps = {
  entries: LogEntry[];
  onClear: () => void;
};

const ActivityLog = memo(function ActivityLog({
  entries,
  onClear,
}: ActivityLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries.length]);

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-hidden"
      style={{
        backgroundColor: "#111827",
        border: "1px solid #334155",
        borderRadius: "16px",
      }}
    >
      {/* Header */}
      <div
        className="flex shrink-0 items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid #334155" }}
      >
        <div className="flex items-center gap-2">
          <Activity size={16} style={{ color: "#00C9FF" }} />
          <h4
            className="text-sm font-semibold"
            style={{
              color: "#F5F7FA",
              fontFamily: '"Inter", system-ui, sans-serif',
            }}
          >
            Activity Log
          </h4>
          {entries.length > 0 && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-medium"
              style={{
                backgroundColor: "rgba(0, 201, 255, 0.15)",
                color: "#00C9FF",
                fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              }}
            >
              {entries.length}
            </span>
          )}
        </div>
        <button
          onClick={onClear}
          className="text-xs font-medium transition-colors duration-200 hover:text-[#00C9FF]"
          style={{ color: "#64748B" }}
        >
          Clear
        </button>
      </div>

      {/* Log entries — fixed-height scroll region so the card never grows */}
      <div
        ref={scrollRef}
        className="activity-log-scroll min-h-0 flex-1 overflow-y-auto px-5 py-4"
        style={{ scrollBehavior: "smooth" }}
      >
        <div className="flex flex-col gap-2.5">
          {entries.map(entry => (
            <div
              key={entry.id}
              className="flex items-start gap-3"
              style={{
                animation: "logSlideIn 0.25s ease-out",
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

              {/* Status icon */}
              <div className="mt-0.5 shrink-0">
                {entry.status === "active" && (
                  <Loader2
                    size={12}
                    className="animate-spin"
                    style={{ color: "#00C9FF" }}
                  />
                )}
                {entry.status === "complete" && (
                  <CheckCircle2 size={12} style={{ color: "#22C55E" }} />
                )}
                {entry.status === "queued" && (
                  <Circle size={12} style={{ color: "#334155" }} />
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
        .activity-log-scroll {
          scrollbar-width: thin;
          scrollbar-color: #334155 transparent;
        }
        .activity-log-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .activity-log-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .activity-log-scroll::-webkit-scrollbar-thumb {
          background-color: #334155;
          border-radius: 4px;
        }
        .activity-log-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #475569;
        }
      `}</style>
    </div>
  );
});

export default ActivityLog;
