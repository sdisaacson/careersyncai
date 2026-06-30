import { motion } from "framer-motion";
import { TrendingUp, AlertTriangle, Info, Clock } from "lucide-react";
import type {
  Insight,
  InsightBar,
  InsightSeverity,
} from "@/lib/insightsEngine";
import { severityColor } from "@/lib/insightsEngine";

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const SEVERITY_META: Record<
  InsightSeverity,
  { label: string; Icon: typeof Info }
> = {
  opportunity: { label: "Opportunity", Icon: TrendingUp },
  warning: { label: "Heads up", Icon: AlertTriangle },
  info: { label: "Context", Icon: Info },
};

/* ─── Mini horizontal bar chart ─── */
function BarChart({ bars, accent }: { bars: InsightBar[]; accent: string }) {
  const max = Math.max(...bars.map(b => b.value), 1);
  return (
    <div className="mt-3 space-y-1.5">
      {bars.map((bar, i) => (
        <div key={`${bar.label}-${i}`} className="flex items-center gap-2">
          <span
            className="w-20 shrink-0 truncate text-[11px]"
            style={{ color: "#94A3B8" }}
            title={bar.label}
          >
            {bar.label}
          </span>
          <div
            className="h-2.5 flex-1 overflow-hidden rounded-full"
            style={{ backgroundColor: "#0B0E14" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(bar.value / max) * 100}%` }}
              transition={{ duration: 0.7, ease: easeOutExpo }}
              className="h-full rounded-full"
              style={{ backgroundColor: bar.color || accent }}
            />
          </div>
          <span
            className="w-10 shrink-0 text-right font-mono text-[11px]"
            style={{ color: "#F5F7FA" }}
          >
            {bar.display ?? bar.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Big stat callout ─── */
function StatCallout({
  value,
  caption,
  items,
  accent,
}: {
  value: string;
  caption: string;
  items?: string[];
  accent: string;
}) {
  return (
    <div className="mt-3">
      <div className="flex items-baseline gap-2">
        <span
          className="font-mono text-3xl font-bold leading-none"
          style={{ color: accent }}
        >
          {value}
        </span>
        <span className="text-xs" style={{ color: "#94A3B8" }}>
          {caption}
        </span>
      </div>
      {items && items.length > 0 && (
        <ul className="mt-3 space-y-1">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-1.5 text-[11px]"
              style={{ color: "#94A3B8" }}
            >
              <Clock size={11} style={{ color: accent }} />
              <span className="truncate" title={item}>
                {item}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function InsightCard({
  insight,
  index,
}: {
  insight: Insight;
  index: number;
}) {
  const accent = severityColor(insight.severity);
  const { label, Icon } = SEVERITY_META[insight.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: easeOutExpo, delay: index * 0.06 }}
      className="rounded-xl border p-4"
      style={{
        backgroundColor: "#111827",
        borderColor: "#334155",
        borderLeft: `3px solid ${accent}`,
      }}
    >
      {/* Severity badge */}
      <div className="flex items-center gap-1.5">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
          style={{ backgroundColor: `${accent}1A`, color: accent }}
        >
          <Icon size={11} />
          {label}
        </span>
      </div>

      {/* Title */}
      <h4
        className="mt-2 text-sm font-semibold leading-snug"
        style={{ color: "#F5F7FA" }}
      >
        {insight.title}
      </h4>

      {/* Description */}
      <p
        className="mt-1 text-[12px] leading-relaxed"
        style={{ color: "#94A3B8" }}
      >
        {insight.description}
      </p>

      {/* Visualization */}
      {insight.data.chart === "bars" && insight.data.bars && (
        <BarChart bars={insight.data.bars} accent={accent} />
      )}
      {insight.data.chart === "stat" && insight.data.stat && (
        <StatCallout
          value={insight.data.stat.value}
          caption={insight.data.stat.caption}
          items={insight.data.items}
          accent={accent}
        />
      )}
    </motion.div>
  );
}
