import { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Download,
  Code,
  GitCompare,
  Printer,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronFirst,
  ChevronLast,
  Settings,
  Eye,
  FileText,
  ExternalLink,
  Check,
  X,
  Clock,
  MapPin,
} from "lucide-react";
import { Link } from "react-router";
import { trpc } from "@/lib/trpc.tsx";
import {
  generateMockJobs,
  getSectorName,
  getFitScoreColor,
  SECTORS,
} from "@/lib/mockJobs";
import type { Job } from "@/db/schema";

/* ─── easing ─── */
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ─── helpers ─── */
function getSectorColor(sector: string): string {
  const colors: Record<string, string> = {
    Technology: "#00C9FF",
    Healthcare: "#22C55E",
    Finance: "#3B82F6",
    Energy: "#F59E0B",
    Education: "#8B5CF6",
    Manufacturing: "#EF4444",
    Retail: "#EC4899",
    Government: "#14B8A6",
  };
  return colors[sector] || "#94A3B8";
}
function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}
function daysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const d = Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return d;
}

/* ─── Column definitions ─── */
interface ColumnDef {
  key: string;
  label: string;
  width: string;
  sortable: boolean;
  defaultVisible: boolean;
}

const ALL_COLUMNS: ColumnDef[] = [
  {
    key: "select",
    label: "",
    width: "40px",
    sortable: false,
    defaultVisible: true,
  },
  {
    key: "rank",
    label: "#",
    width: "50px",
    sortable: false,
    defaultVisible: true,
  },
  {
    key: "fitScore",
    label: "Fit Score",
    width: "90px",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "company",
    label: "Company",
    width: "150px",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "title",
    label: "Job Title",
    width: "220px",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "sector",
    label: "Sector",
    width: "110px",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "location",
    label: "Location",
    width: "140px",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "salaryRange",
    label: "Salary Range",
    width: "130px",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "jobType",
    label: "Job Type",
    width: "100px",
    sortable: true,
    defaultVisible: false,
  },
  {
    key: "experienceLevel",
    label: "Experience",
    width: "110px",
    sortable: true,
    defaultVisible: false,
  },
  {
    key: "deadline",
    label: "Deadline",
    width: "110px",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "applicationLink",
    label: "Apply Link",
    width: "90px",
    sortable: false,
    defaultVisible: true,
  },
  {
    key: "requirements",
    label: "Requirements",
    width: "130px",
    sortable: false,
    defaultVisible: false,
  },
  {
    key: "status",
    label: "Status",
    width: "100px",
    sortable: true,
    defaultVisible: true,
  },
  {
    key: "actions",
    label: "Actions",
    width: "100px",
    sortable: false,
    defaultVisible: true,
  },
];

/* ─── Fit Score Pill ─── */
function FitScorePill({ score }: { score: number | null | undefined }) {
  const colors = getFitScoreColor(score);
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-xs font-bold whitespace-nowrap"
      style={{ background: colors.bg, color: colors.text }}
    >
      {score ?? 0}%
    </span>
  );
}

/* ─── Sector Pill ─── */
function SectorPill({ sectorId }: { sectorId: number | null | undefined }) {
  const name = getSectorName(sectorId);
  const color = getSectorColor(name);
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {name}
    </span>
  );
}

/* ─── Status Badge ─── */
function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string }> = {
    discovered: { bg: "rgba(100, 116, 139, 0.15)", text: "#94A3B8" },
    shortlisted: { bg: "rgba(0, 201, 255, 0.15)", text: "#00C9FF" },
    applied: { bg: "rgba(34, 197, 94, 0.15)", text: "#22C55E" },
    archived: { bg: "rgba(239, 68, 68, 0.15)", text: "#EF4444" },
  };
  const c = colors[status] || colors.discovered;
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize"
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {status}
    </span>
  );
}

/* ─── Requirements Match ─── */
function RequirementsMatch({
  requirements,
}: {
  requirements: string | null | undefined;
}) {
  if (!requirements)
    return (
      <span className="text-xs" style={{ color: "#64748B" }}>
        —
      </span>
    );
  const items = requirements
    .split(",")
    .map(r => r.trim())
    .filter(Boolean);
  const matched = Math.floor(items.length * 0.75);
  const pct = Math.round((matched / items.length) * 100);
  return (
    <div className="flex items-center gap-2">
      <span
        className="whitespace-nowrap text-xs font-medium"
        style={{ color: "#94A3B8" }}
      >
        {matched}/{items.length}
      </span>
      <div
        className="h-1 w-10 rounded-full"
        style={{ backgroundColor: "#334155" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background:
              pct >= 70
                ? "linear-gradient(90deg, #00C9FF, #7C3AED)"
                : pct >= 40
                  ? "#3B82F6"
                  : "#64748B",
          }}
        />
      </div>
    </div>
  );
}

/* ─── Deadline Cell ─── */
function DeadlineCell({ deadline }: { deadline: string | null | undefined }) {
  const d = daysUntil(deadline);
  const isExpired = d !== null && d < 0;
  const isUrgent = d !== null && d >= 0 && d <= 7;
  return (
    <span
      className="flex items-center gap-1 text-xs whitespace-nowrap"
      style={{
        color: isExpired ? "#EF4444" : isUrgent ? "#F59E0B" : "#94A3B8",
        textDecoration: isExpired ? "line-through" : "none",
      }}
    >
      {isUrgent && <Clock size={11} />}
      {formatDate(deadline)}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   COMPARE MODAL
   ═══════════════════════════════════════════════════════════════════ */
function CompareModal({ jobs, onClose }: { jobs: Job[]; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.35, ease: easeOutExpo }}
          className="flex max-h-[90vh] w-full max-w-[1100px] flex-col overflow-hidden rounded-2xl"
          style={{ backgroundColor: "#111827", border: "1px solid #334155" }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between border-b px-6 py-4"
            style={{ borderColor: "#334155" }}
          >
            <h2 className="text-xl font-bold" style={{ color: "#F5F7FA" }}>
              Compare Opportunities
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors duration-200"
              style={{ color: "#94A3B8" }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "#F5F7FA";
                e.currentTarget.style.backgroundColor =
                  "rgba(148, 163, 184, 0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "#94A3B8";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Comparison Grid */}
          <div className="flex-1 overflow-x-auto p-6">
            <div
              className="flex gap-6"
              style={{ minWidth: `${jobs.length * 320}px` }}
            >
              {jobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.4,
                    ease: easeOutExpo,
                  }}
                  className="flex-1 rounded-xl border p-5"
                  style={{
                    backgroundColor: "#0B0E14",
                    borderColor: "#334155",
                    minWidth: "280px",
                  }}
                >
                  {/* Company */}
                  <div className="mb-4">
                    <p
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#94A3B8" }}
                    >
                      Company
                    </p>
                    <p
                      className="mt-1 text-lg font-bold"
                      style={{ color: "#F5F7FA" }}
                    >
                      {job.company}
                    </p>
                  </div>

                  {/* Title */}
                  <div className="mb-4">
                    <p
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#94A3B8" }}
                    >
                      Title
                    </p>
                    <p
                      className="mt-1 text-sm font-semibold"
                      style={{ color: "#F5F7FA" }}
                    >
                      {job.title}
                    </p>
                  </div>

                  {/* Fit Score */}
                  <div className="mb-4">
                    <p
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#94A3B8" }}
                    >
                      Fit Score
                    </p>
                    <div className="mt-1">
                      <FitScorePill score={job.fitScore} />
                    </div>
                  </div>

                  {/* Sector */}
                  <div className="mb-4">
                    <p
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#94A3B8" }}
                    >
                      Sector
                    </p>
                    <div className="mt-1">
                      <SectorPill sectorId={job.sectorId} />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="mb-4">
                    <p
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#94A3B8" }}
                    >
                      Location
                    </p>
                    <p
                      className="mt-1 flex items-center gap-1 text-sm"
                      style={{ color: "#F5F7FA" }}
                    >
                      <MapPin size={12} style={{ color: "#94A3B8" }} />{" "}
                      {job.location || "Not specified"}
                    </p>
                  </div>

                  {/* Salary */}
                  <div className="mb-4">
                    <p
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#94A3B8" }}
                    >
                      Salary
                    </p>
                    <p
                      className="mt-1 font-mono text-sm font-bold"
                      style={{ color: "#F5F7FA" }}
                    >
                      {job.salaryRange || "Not listed"}
                    </p>
                  </div>

                  {/* Deadline */}
                  <div className="mb-4">
                    <p
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#94A3B8" }}
                    >
                      Deadline
                    </p>
                    <div className="mt-1">
                      <DeadlineCell deadline={job.deadline} />
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="mb-4">
                    <p
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#94A3B8" }}
                    >
                      Requirements
                    </p>
                    <div className="mt-1">
                      <RequirementsMatch requirements={job.requirements} />
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <p
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#94A3B8" }}
                    >
                      Key Skills
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {job.requirements
                        ?.split(",")
                        .slice(0, 6)
                        .map(r => (
                          <span
                            key={r}
                            className="rounded-full px-2 py-0.5 text-xs"
                            style={{
                              backgroundColor: "#1E293B",
                              color: "#94A3B8",
                            }}
                          >
                            {r.trim()}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <p
                      className="text-xs font-medium uppercase tracking-wider"
                      style={{ color: "#94A3B8" }}
                    >
                      Description
                    </p>
                    <p
                      className="mt-1 max-h-[120px] overflow-y-auto text-xs leading-relaxed"
                      style={{ color: "#94A3B8" }}
                    >
                      {job.jobDescription}
                    </p>
                  </div>

                  {/* Apply */}
                  <a
                    href={job.applicationLink || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="accent-gradient mt-2 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-all duration-200"
                    style={{ boxShadow: "0 0 20px rgba(0, 201, 255, 0.2)" }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow =
                        "0 0 30px rgba(0, 201, 255, 0.35)";
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow =
                        "0 0 20px rgba(0, 201, 255, 0.2)";
                    }}
                  >
                    <ExternalLink size={14} />
                    Apply Now
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   SUMMARY CARDS (Footer)
   ═══════════════════════════════════════════════════════════════════ */
function SummaryCards({ jobs }: { jobs: Job[] }) {
  const fitDist = useMemo(() => {
    const bins = { "95-100": 0, "85-94": 0, "70-84": 0, "50-69": 0, "<50": 0 };
    jobs.forEach(j => {
      const s = j.fitScore ?? 0;
      if (s >= 95) (bins as Record<string, number>)["95-100"]++;
      else if (s >= 85) (bins as Record<string, number>)["85-94"]++;
      else if (s >= 70) (bins as Record<string, number>)["70-84"]++;
      else if (s >= 50) (bins as Record<string, number>)["50-69"]++;
      else (bins as Record<string, number>)["<50"]++;
    });
    return bins;
  }, [jobs]);

  const sectorDist = useMemo(() => {
    const dist: Record<string, number> = {};
    jobs.forEach(j => {
      const s = getSectorName(j.sectorId);
      dist[s] = (dist[s] || 0) + 1;
    });
    return dist;
  }, [jobs]);

  const deadlineDist = useMemo(() => {
    const d = { urgent: 0, soon: 0, later: 0 };
    jobs.forEach(j => {
      const days = daysUntil(j.deadline);
      if (days === null) return;
      if (days < 7) d.urgent++;
      else if (days <= 30) d.soon++;
      else d.later++;
    });
    return d;
  }, [jobs]);

  const maxFitCount = Math.max(...Object.values(fitDist));

  return (
    <motion.div
      className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
    >
      {/* Fit Distribution */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: easeOutExpo },
          },
        }}
        className="rounded-2xl border p-5"
        style={{ backgroundColor: "#1E293B", borderColor: "#334155" }}
      >
        <h4 className="text-sm font-semibold" style={{ color: "#F5F7FA" }}>
          Score Distribution
        </h4>
        <div className="mt-4 space-y-2">
          {Object.entries(fitDist).map(([range, count]) => (
            <div key={range} className="flex items-center gap-2">
              <span className="w-12 text-xs" style={{ color: "#94A3B8" }}>
                {range}
              </span>
              <div
                className="h-4 flex-1 rounded-full"
                style={{ backgroundColor: "#0B0E14" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${maxFitCount > 0 ? (count / maxFitCount) * 100 : 0}%`,
                  }}
                  transition={{ duration: 0.8, ease: easeOutExpo }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      range === "95-100"
                        ? "#22C55E"
                        : range === "85-94"
                          ? "linear-gradient(135deg, #00C9FF, #7C3AED)"
                          : range === "70-84"
                            ? "#3B82F6"
                            : range === "50-69"
                              ? "#64748B"
                              : "#334155",
                  }}
                />
              </div>
              <span
                className="w-6 text-right font-mono text-xs"
                style={{ color: "#F5F7FA" }}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sector Breakdown */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: easeOutExpo },
          },
        }}
        className="rounded-2xl border p-5"
        style={{ backgroundColor: "#1E293B", borderColor: "#334155" }}
      >
        <h4 className="text-sm font-semibold" style={{ color: "#F5F7FA" }}>
          By Sector
        </h4>
        <div className="mt-4 space-y-2">
          {Object.entries(sectorDist).map(([sector, count]) => (
            <div key={sector} className="flex items-center gap-2">
              <span
                className="w-20 truncate text-xs"
                style={{ color: "#94A3B8" }}
              >
                {sector}
              </span>
              <div
                className="h-3 flex-1 rounded-full"
                style={{ backgroundColor: "#0B0E14" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${jobs.length > 0 ? (count / jobs.length) * 100 : 0}%`,
                  }}
                  transition={{ duration: 0.8, ease: easeOutExpo }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: getSectorColor(sector) }}
                />
              </div>
              <span
                className="w-6 text-right font-mono text-xs"
                style={{ color: "#F5F7FA" }}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Deadline Urgency */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: easeOutExpo },
          },
        }}
        className="rounded-2xl border p-5"
        style={{ backgroundColor: "#1E293B", borderColor: "#334155" }}
      >
        <h4 className="text-sm font-semibold" style={{ color: "#F5F7FA" }}>
          By Deadline
        </h4>
        <div className="mt-4 space-y-2">
          {[
            {
              label: "Urgent (<7d)",
              count: deadlineDist.urgent,
              color: "#EF4444",
            },
            {
              label: "Soon (7-30d)",
              count: deadlineDist.soon,
              color: "#F59E0B",
            },
            {
              label: "Later (>30d)",
              count: deadlineDist.later,
              color: "#22C55E",
            },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs" style={{ color: "#94A3B8" }}>
                  {item.label}
                </span>
              </div>
              <span
                className="font-mono text-xs font-bold"
                style={{ color: "#F5F7FA" }}
              >
                {item.count}
              </span>
            </div>
          ))}
        </div>
        {/* Mini donut */}
        <div className="mt-4 flex justify-center">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="30"
              fill="none"
              stroke="#334155"
              strokeWidth="10"
            />
            {(() => {
              const total =
                deadlineDist.urgent + deadlineDist.soon + deadlineDist.later;
              if (total === 0) return null;
              let offset = 0;
              const circ = 2 * Math.PI * 30;
              const segments = [
                { count: deadlineDist.urgent, color: "#EF4444" },
                { count: deadlineDist.soon, color: "#F59E0B" },
                { count: deadlineDist.later, color: "#22C55E" },
              ];
              return segments.map((seg, i) => {
                const len = (seg.count / total) * circ;
                const el = (
                  <circle
                    key={i}
                    cx="40"
                    cy="40"
                    r="30"
                    fill="none"
                    stroke={seg.color}
                    strokeWidth="10"
                    strokeDasharray={`${len} ${circ}`}
                    strokeDashoffset={-offset}
                    transform="rotate(-90 40 40)"
                  />
                );
                offset += len;
                return el;
              });
            })()}
          </svg>
        </div>
      </motion.div>

      {/* Salary Overview */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: easeOutExpo },
          },
        }}
        className="rounded-2xl border p-5"
        style={{ backgroundColor: "#1E293B", borderColor: "#334155" }}
      >
        <h4 className="text-sm font-semibold" style={{ color: "#F5F7FA" }}>
          Salary Overview
        </h4>
        {(() => {
          const salaries = jobs
            .map(j => {
              const m = j.salaryRange?.match(/\$(\d+)k?\s*-\s*\$(\d+)k?/);
              if (!m) return null;
              return {
                min: parseInt(m[1]) * (m[1].length > 3 ? 1 : 1000),
                max: parseInt(m[2]) * (m[2].length > 3 ? 1 : 1000),
              };
            })
            .filter(Boolean) as { min: number; max: number }[];
          if (salaries.length === 0)
            return (
              <p className="mt-4 text-xs" style={{ color: "#64748B" }}>
                No salary data
              </p>
            );
          const allMins = salaries.map(s => s.min);
          const allMaxs = salaries.map(s => s.max);
          const min = Math.min(...allMins);
          const max = Math.max(...allMaxs);
          const median = allMins.sort((a, b) => a - b)[
            Math.floor(allMins.length / 2)
          ];
          return (
            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <div>
                  <p className="text-xs" style={{ color: "#94A3B8" }}>
                    Min
                  </p>
                  <p
                    className="font-mono text-sm font-bold"
                    style={{ color: "#F5F7FA" }}
                  >
                    ${(min / 1000).toFixed(0)}k
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs" style={{ color: "#94A3B8" }}>
                    Median
                  </p>
                  <p
                    className="font-mono text-sm font-bold"
                    style={{ color: "#00C9FF" }}
                  >
                    ${(median / 1000).toFixed(0)}k
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: "#94A3B8" }}>
                    Max
                  </p>
                  <p
                    className="font-mono text-sm font-bold"
                    style={{ color: "#F5F7FA" }}
                  >
                    ${(max / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>
              {/* Sparkline */}
              <div
                className="flex items-end gap-0.5"
                style={{ height: "40px" }}
              >
                {salaries.slice(0, 20).map((s, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                      height: `${max > min ? ((s.min - min) / (max - min)) * 100 : 50}%`,
                      backgroundColor: i % 2 === 0 ? "#00C9FF" : "#3B82F6",
                      opacity: 0.6,
                      minWidth: "2px",
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })()}
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MAIN DATASHEET PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function DatasheetPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortCol, setSortCol] = useState<string>("fitScore");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [compareOpen, setCompareOpen] = useState(false);
  const [visibleCols, setVisibleCols] = useState<Set<string>>(() => {
    const saved =
      typeof window !== "undefined"
        ? localStorage.getItem("datasheet-columns")
        : null;
    if (saved) return new Set(JSON.parse(saved));
    return new Set(ALL_COLUMNS.filter(c => c.defaultVisible).map(c => c.key));
  });
  const [colMenuOpen, setColMenuOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sectorFilter, setSectorFilter] = useState<string>("all");

  // Persist visible columns
  useEffect(() => {
    localStorage.setItem(
      "datasheet-columns",
      JSON.stringify(Array.from(visibleCols))
    );
  }, [visibleCols]);

  // tRPC
  const profileId = 1;
  const jobsQuery = trpc.job.getByProfile.useQuery({ profileId });

  const jobs = useMemo(() => {
    if (jobsQuery.data && jobsQuery.data.length > 0) return jobsQuery.data;
    return generateMockJobs(100, profileId);
  }, [jobsQuery.data]);

  /* Filter + Sort */
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Global search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        j =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location?.toLowerCase().includes(q) ||
          getSectorName(j.sectorId).toLowerCase().includes(q) ||
          j.jobType?.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(j => j.status === statusFilter);
    }

    // Sector filter
    if (sectorFilter !== "all") {
      const sectorIdx = SECTORS.indexOf(sectorFilter) + 1;
      result = result.filter(j => j.sectorId === sectorIdx);
    }

    // Sort
    if (sortCol) {
      result.sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        const av = (a as Record<string, unknown>)[sortCol];
        const bv = (b as Record<string, unknown>)[sortCol];
        if (typeof av === "number" && typeof bv === "number")
          return dir * (av - bv);
        if (typeof av === "string" && typeof bv === "string")
          return dir * av.localeCompare(bv);
        return 0;
      });
    }

    return result;
  }, [jobs, searchQuery, statusFilter, sectorFilter, sortCol, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedJobs = filteredJobs.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  // Reset page when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => setCurrentPage(1), 0);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter, sectorFilter, pageSize, sortCol, sortDir]);

  /* Sort handler */
  const handleSort = useCallback(
    (key: string) => {
      if (!key) return;
      if (sortCol === key) {
        setSortDir(d => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortCol(key);
        setSortDir("desc");
      }
    },
    [sortCol]
  );

  /* Selection handlers */
  const toggleSelect = useCallback((id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 3) next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    const pageIds = paginatedJobs.map(j => j.id);
    const allSelected = pageIds.every(id => selectedIds.has(id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      pageIds.forEach(id => {
        if (allSelected) next.delete(id);
        else next.add(id);
      });
      return next;
    });
  }, [paginatedJobs, selectedIds]);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  /* Batch status update */
  const updateStatus = trpc.job.updateStatus.useMutation();
  const handleBatchStatus = useCallback(
    (status: "shortlisted" | "applied" | "archived") => {
      selectedIds.forEach(id => updateStatus.mutate({ id, status }));
      clearSelection();
    },
    [selectedIds, updateStatus, clearSelection]
  );

  /* Compare */
  const compareJobs = useMemo(() => {
    return jobs.filter(j => selectedIds.has(j.id));
  }, [jobs, selectedIds]);

  /* Export CSV */
  const handleExportCSV = useCallback(() => {
    const headers = [
      "Title",
      "Company",
      "Sector",
      "Location",
      "Fit Score",
      "Job Type",
      "Experience Level",
      "Salary Range",
      "Deadline",
      "Status",
    ];
    const rows = filteredJobs.map(j => [
      j.title,
      j.company,
      getSectorName(j.sectorId),
      j.location || "",
      String(j.fitScore ?? 0),
      j.jobType || "",
      j.experienceLevel || "",
      j.salaryRange || "",
      j.deadline || "",
      j.status,
    ]);
    const csv = [
      headers.join(","),
      ...rows.map(r =>
        r.map(c => `"${String(c).replace(/"/g, '\\"')}"`).join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "job-opportunities.csv";
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredJobs]);

  const handleExportJSON = useCallback(() => {
    const json = JSON.stringify(filteredJobs, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "job-opportunities.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredJobs]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const isColVisible = useCallback(
    (key: string) => visibleCols.has(key),
    [visibleCols]
  );
  const toggleCol = useCallback((key: string) => {
    setVisibleCols(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        // Prevent hiding the last visible column
        if (next.size > 1) next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const allPageSelected =
    paginatedJobs.length > 0 && paginatedJobs.every(j => selectedIds.has(j.id));
  const somePageSelected = paginatedJobs.some(j => selectedIds.has(j.id));

  return (
    <div style={{ backgroundColor: "#0B0E14" }}>
      {/* ═══ Section 1: Page Header ═══ */}
      <div
        className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: "48px", paddingBottom: "32px" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
        >
          {/* Breadcrumb */}
          <nav
            className="mb-3 flex items-center gap-1 text-xs"
            style={{ color: "#94A3B8" }}
          >
            <Link
              to="/dashboard"
              className="transition-colors duration-200 hover:text-[#00C9FF]"
            >
              Dashboard
            </Link>
            <ChevronRight size={12} />
            <span style={{ color: "#64748B" }}>Data Sheet</span>
          </nav>

          <h1
            className="text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ color: "#F5F7FA" }}
          >
            Complete Opportunity Data
          </h1>
          <p className="mt-3 max-w-2xl text-lg" style={{ color: "#94A3B8" }}>
            Every job opportunity we discovered, structured and scored. Filter,
            sort, compare, and export your data.
          </p>

          {/* Action Row */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200"
              style={{ borderColor: "#00C9FF", color: "#00C9FF" }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor =
                  "rgba(0, 201, 255, 0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Download size={16} />
              Export CSV
            </button>
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200"
              style={{ color: "#94A3B8" }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "#F5F7FA";
                e.currentTarget.style.backgroundColor =
                  "rgba(148, 163, 184, 0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "#94A3B8";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Code size={16} />
              Export JSON
            </button>
            <button
              onClick={() => setCompareOpen(true)}
              disabled={selectedIds.size < 2}
              className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ borderColor: "#00C9FF", color: "#00C9FF" }}
              onMouseEnter={e => {
                if (selectedIds.size >= 2)
                  e.currentTarget.style.backgroundColor =
                    "rgba(0, 201, 255, 0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <GitCompare size={16} />
              Compare Selected ({selectedIds.size})
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200"
              style={{ color: "#94A3B8" }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "#F5F7FA";
                e.currentTarget.style.backgroundColor =
                  "rgba(148, 163, 184, 0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "#94A3B8";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Printer size={16} />
              Print View
            </button>
          </div>
        </motion.div>
      </div>

      {/* ═══ Section 2: Filter Bar ═══ */}
      <div className="mx-auto max-w-[1400px] px-4 pb-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div
            className="relative"
            style={{ width: "280px", maxWidth: "100%" }}
          >
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: "#64748B" }}
            />
            <input
              type="text"
              placeholder="Search all columns..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none transition-all duration-200 focus:border-[#00C9FF]"
              style={{
                backgroundColor: "#1E293B",
                borderColor: "#334155",
                color: "#F5F7FA",
              }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="appearance-none rounded-lg border py-2 pl-3 pr-8 text-sm outline-none"
            style={{
              backgroundColor: "#1E293B",
              borderColor: "#334155",
              color: "#F5F7FA",
            }}
          >
            <option value="all">All Statuses</option>
            <option value="discovered">Discovered</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="applied">Applied</option>
            <option value="archived">Archived</option>
          </select>

          {/* Sector Filter */}
          <select
            value={sectorFilter}
            onChange={e => setSectorFilter(e.target.value)}
            className="appearance-none rounded-lg border py-2 pl-3 pr-8 text-sm outline-none"
            style={{
              backgroundColor: "#1E293B",
              borderColor: "#334155",
              color: "#F5F7FA",
            }}
          >
            <option value="all">All Sectors</option>
            {SECTORS.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Column Toggle */}
          <div className="relative ml-auto">
            <button
              onClick={() => setColMenuOpen(!colMenuOpen)}
              className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-200"
              style={{ borderColor: "#334155", color: "#94A3B8" }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "#F5F7FA";
                e.currentTarget.style.borderColor = "#00C9FF";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "#94A3B8";
                e.currentTarget.style.borderColor = "#334155";
              }}
            >
              <Settings size={14} />
              Columns
            </button>
            <AnimatePresence>
              {colMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setColMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border shadow-xl"
                    style={{
                      backgroundColor: "#1E293B",
                      borderColor: "#334155",
                    }}
                  >
                    <div className="p-2">
                      {ALL_COLUMNS.filter(
                        c => c.key !== "select" && c.key !== "actions"
                      ).map(col => (
                        <button
                          key={col.key}
                          onClick={() => toggleCol(col.key)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-150"
                          style={{
                            color: visibleCols.has(col.key)
                              ? "#F5F7FA"
                              : "#64748B",
                          }}
                          onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(0, 201, 255, 0.08)";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          <div
                            className="flex h-4 w-4 items-center justify-center rounded border"
                            style={{
                              borderColor: visibleCols.has(col.key)
                                ? "#00C9FF"
                                : "#334155",
                              backgroundColor: visibleCols.has(col.key)
                                ? "rgba(0, 201, 255, 0.2)"
                                : "transparent",
                            }}
                          >
                            {visibleCols.has(col.key) && (
                              <Check size={10} style={{ color: "#00C9FF" }} />
                            )}
                          </div>
                          {col.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Batch Actions Bar */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 flex items-center gap-3 overflow-hidden rounded-lg border px-4 py-3"
              style={{
                backgroundColor: "rgba(0, 201, 255, 0.05)",
                borderColor: "rgba(0, 201, 255, 0.2)",
              }}
            >
              <span
                className="text-sm font-medium"
                style={{ color: "#00C9FF" }}
              >
                {selectedIds.size} selected
              </span>
              <div
                className="h-4 w-px"
                style={{ backgroundColor: "#334155" }}
              />
              <button
                onClick={() => handleBatchStatus("shortlisted")}
                className="text-sm font-medium transition-colors duration-150"
                style={{ color: "#94A3B8" }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "#00C9FF";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "#94A3B8";
                }}
              >
                Shortlist
              </button>
              <button
                onClick={() => handleBatchStatus("applied")}
                className="text-sm font-medium transition-colors duration-150"
                style={{ color: "#94A3B8" }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "#22C55E";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "#94A3B8";
                }}
              >
                Mark Applied
              </button>
              <button
                onClick={() => handleBatchStatus("archived")}
                className="text-sm font-medium transition-colors duration-150"
                style={{ color: "#94A3B8" }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "#EF4444";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "#94A3B8";
                }}
              >
                Archive
              </button>
              <button
                onClick={clearSelection}
                className="ml-auto text-sm transition-colors duration-150"
                style={{ color: "#64748B" }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = "#F5F7FA";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = "#64748B";
                }}
              >
                Clear
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ Section 3: Data Table ═══ */}
      <div className="px-4 pb-8 sm:px-6 lg:px-8">
        <div
          className="mx-auto overflow-hidden rounded-xl border"
          style={{
            backgroundColor: "#111827",
            borderColor: "#334155",
            width: "fit-content",
            maxWidth: "100%",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: "max-content" }}>
              {/* Sticky Header */}
              <thead>
                <tr style={{ backgroundColor: "#1E293B" }}>
                  {/* Select All */}
                  {isColVisible("select") && (
                    <th
                      className="sticky top-0 z-10 px-3 py-3 text-left"
                      style={{ backgroundColor: "#1E293B", width: "40px" }}
                    >
                      <button
                        onClick={toggleSelectAll}
                        className="flex h-4 w-4 items-center justify-center rounded border"
                        style={{
                          borderColor: allPageSelected
                            ? "#00C9FF"
                            : somePageSelected
                              ? "#00C9FF"
                              : "#334155",
                          backgroundColor: allPageSelected
                            ? "rgba(0, 201, 255, 0.2)"
                            : somePageSelected
                              ? "rgba(0, 201, 255, 0.1)"
                              : "transparent",
                        }}
                      >
                        {allPageSelected && (
                          <Check size={10} style={{ color: "#00C9FF" }} />
                        )}
                        {somePageSelected && !allPageSelected && (
                          <div
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: "#00C9FF" }}
                          />
                        )}
                      </button>
                    </th>
                  )}

                  {ALL_COLUMNS.filter(c => c.key !== "select").map(col => {
                    if (!isColVisible(col.key)) return null;
                    return (
                      <th
                        key={col.key}
                        className="sticky top-0 z-10 cursor-pointer whitespace-nowrap px-3 py-3 text-left text-xs font-medium uppercase tracking-wider transition-colors duration-150 select-none"
                        style={{
                          backgroundColor: "#1E293B",
                          color: sortCol === col.key ? "#00C9FF" : "#94A3B8",
                          width: col.width,
                        }}
                        onClick={() => col.sortable && handleSort(col.key)}
                      >
                        <div className="flex items-center gap-1">
                          {col.label}
                          {col.sortable &&
                            sortCol === col.key &&
                            (sortDir === "asc" ? (
                              <ChevronUp size={12} />
                            ) : (
                              <ChevronDown size={12} />
                            ))}
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* Body */}
              <tbody>
                {paginatedJobs.map((job, rowIdx) => {
                  const isSelected = selectedIds.has(job.id);
                  const isExpired = job.deadline
                    ? daysUntil(job.deadline)! < 0
                    : false;
                  return (
                    <tr
                      key={job.id}
                      className="border-t transition-colors duration-150"
                      style={{
                        backgroundColor:
                          rowIdx % 2 === 0
                            ? "#111827"
                            : "rgba(30, 41, 59, 0.5)",
                        borderColor: "#334155",
                        borderLeft: isSelected
                          ? "3px solid #00C9FF"
                          : "3px solid transparent",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(0, 201, 255, 0.04)";
                        e.currentTarget.style.borderLeft = isSelected
                          ? "3px solid #00C9FF"
                          : "3px solid rgba(0, 201, 255, 0.2)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor =
                          rowIdx % 2 === 0
                            ? "#111827"
                            : "rgba(30, 41, 59, 0.5)";
                        e.currentTarget.style.borderLeft = isSelected
                          ? "3px solid #00C9FF"
                          : "3px solid transparent";
                      }}
                    >
                      {/* Checkbox */}
                      {isColVisible("select") && (
                        <td className="px-3 py-3">
                          <button
                            onClick={() => toggleSelect(job.id)}
                            className="flex h-4 w-4 items-center justify-center rounded border"
                            style={{
                              borderColor: isSelected ? "#00C9FF" : "#334155",
                              backgroundColor: isSelected
                                ? "rgba(0, 201, 255, 0.2)"
                                : "transparent",
                            }}
                          >
                            {isSelected && (
                              <Check size={10} style={{ color: "#00C9FF" }} />
                            )}
                          </button>
                        </td>
                      )}

                      {/* Rank */}
                      {isColVisible("rank") && (
                        <td className="px-3 py-3">
                          <span
                            className="font-mono text-xs"
                            style={{ color: "#64748B" }}
                          >
                            {(safePage - 1) * pageSize + rowIdx + 1}
                          </span>
                        </td>
                      )}

                      {/* Fit Score */}
                      {isColVisible("fitScore") && (
                        <td className="px-3 py-3">
                          <FitScorePill score={job.fitScore} />
                        </td>
                      )}

                      {/* Company */}
                      {isColVisible("company") && (
                        <td className="px-3 py-3">
                          <span
                            className="text-sm font-semibold"
                            style={{ color: "#F5F7FA" }}
                          >
                            {job.company}
                          </span>
                        </td>
                      )}

                      {/* Title */}
                      {isColVisible("title") && (
                        <td className="max-w-[220px] px-3 py-3">
                          <span
                            className="block truncate text-sm"
                            style={{
                              color: "#F5F7FA",
                              textDecoration: isExpired
                                ? "line-through"
                                : "none",
                              opacity: isExpired ? 0.5 : 1,
                            }}
                            title={job.title}
                          >
                            {job.title}
                          </span>
                        </td>
                      )}

                      {/* Sector */}
                      {isColVisible("sector") && (
                        <td className="px-3 py-3">
                          <SectorPill sectorId={job.sectorId} />
                        </td>
                      )}

                      {/* Location */}
                      {isColVisible("location") && (
                        <td className="px-3 py-3">
                          <span
                            className="flex items-center gap-1 text-xs whitespace-nowrap"
                            style={{ color: "#94A3B8" }}
                          >
                            {job.location ? (
                              <>
                                <MapPin size={11} /> {job.location}
                              </>
                            ) : (
                              "—"
                            )}
                          </span>
                        </td>
                      )}

                      {/* Salary */}
                      {isColVisible("salaryRange") && (
                        <td className="px-3 py-3">
                          <span
                            className="font-mono text-xs font-semibold"
                            style={{
                              color: job.salaryRange ? "#F5F7FA" : "#64748B",
                            }}
                          >
                            {job.salaryRange || "Not listed"}
                          </span>
                        </td>
                      )}

                      {/* Job Type */}
                      {isColVisible("jobType") && (
                        <td className="px-3 py-3">
                          <span
                            className="text-xs"
                            style={{ color: "#94A3B8" }}
                          >
                            {job.jobType || "—"}
                          </span>
                        </td>
                      )}

                      {/* Experience Level */}
                      {isColVisible("experienceLevel") && (
                        <td className="px-3 py-3">
                          <span
                            className="text-xs"
                            style={{ color: "#94A3B8" }}
                          >
                            {job.experienceLevel || "—"}
                          </span>
                        </td>
                      )}

                      {/* Deadline */}
                      {isColVisible("deadline") && (
                        <td className="px-3 py-3">
                          <DeadlineCell deadline={job.deadline} />
                        </td>
                      )}

                      {/* Application Link */}
                      {isColVisible("applicationLink") && (
                        <td className="px-3 py-3">
                          {job.applicationLink && !isExpired ? (
                            <a
                              href={job.applicationLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-xs font-medium transition-colors duration-150"
                              style={{ color: "#00C9FF" }}
                              onMouseEnter={e => {
                                e.currentTarget.style.color = "#3B82F6";
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.color = "#00C9FF";
                              }}
                            >
                              Apply <ExternalLink size={10} />
                            </a>
                          ) : (
                            <span
                              className="text-xs"
                              style={{ color: "#64748B" }}
                            >
                              —
                            </span>
                          )}
                        </td>
                      )}

                      {/* Requirements */}
                      {isColVisible("requirements") && (
                        <td className="px-3 py-3">
                          <RequirementsMatch requirements={job.requirements} />
                        </td>
                      )}

                      {/* Status */}
                      {isColVisible("status") && (
                        <td className="px-3 py-3">
                          <StatusBadge status={job.status} />
                        </td>
                      )}

                      {/* Actions */}
                      {isColVisible("actions") && (
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            <Link
                              to={`/dashboard?jobId=${job.id}`}
                              className="rounded p-1.5 transition-colors duration-150"
                              style={{ color: "#94A3B8" }}
                              onMouseEnter={e => {
                                e.currentTarget.style.color = "#00C9FF";
                                e.currentTarget.style.backgroundColor =
                                  "rgba(0, 201, 255, 0.08)";
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.color = "#94A3B8";
                                e.currentTarget.style.backgroundColor =
                                  "transparent";
                              }}
                              title="View Details"
                            >
                              <Eye size={14} />
                            </Link>
                            <Link
                              to={`/resumes?jobId=${job.id}`}
                              className="rounded p-1.5 transition-colors duration-150"
                              style={{ color: "#94A3B8" }}
                              onMouseEnter={e => {
                                e.currentTarget.style.color = "#00C9FF";
                                e.currentTarget.style.backgroundColor =
                                  "rgba(0, 201, 255, 0.08)";
                              }}
                              onMouseLeave={e => {
                                e.currentTarget.style.color = "#94A3B8";
                                e.currentTarget.style.backgroundColor =
                                  "transparent";
                              }}
                              title="Generate Resume"
                            >
                              <FileText size={14} />
                            </Link>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {paginatedJobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <Search size={32} style={{ color: "#334155" }} />
              <p
                className="mt-3 text-sm font-medium"
                style={{ color: "#94A3B8" }}
              >
                No results found
              </p>
              <p className="mt-1 text-xs" style={{ color: "#64748B" }}>
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>

        {/* ═══ Pagination ═══ */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs" style={{ color: "#94A3B8" }}>
              Showing{" "}
              {filteredJobs.length > 0 ? (safePage - 1) * pageSize + 1 : 0}–
              {Math.min(safePage * pageSize, filteredJobs.length)} of{" "}
              {filteredJobs.length}
            </span>
            <select
              value={pageSize}
              onChange={e => setPageSize(Number(e.target.value))}
              className="rounded-lg border py-1 pl-2 pr-6 text-xs outline-none"
              style={{
                backgroundColor: "#1E293B",
                borderColor: "#334155",
                color: "#94A3B8",
              }}
            >
              <option value={10}>10/page</option>
              <option value={20}>20/page</option>
              <option value={50}>50/page</option>
              <option value={100}>100/page</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={safePage <= 1}
              className="rounded-lg p-2 transition-colors duration-150 disabled:opacity-30"
              style={{ color: "#94A3B8" }}
              onMouseEnter={e => {
                if (safePage > 1)
                  e.currentTarget.style.backgroundColor =
                    "rgba(148, 163, 184, 0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ChevronFirst size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="rounded-lg p-2 transition-colors duration-150 disabled:opacity-30"
              style={{ color: "#94A3B8" }}
              onMouseEnter={e => {
                if (safePage > 1)
                  e.currentTarget.style.backgroundColor =
                    "rgba(148, 163, 184, 0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) pageNum = i + 1;
                else if (safePage <= 3) pageNum = i + 1;
                else if (safePage >= totalPages - 2)
                  pageNum = totalPages - 4 + i;
                else pageNum = safePage - 2 + i;

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all duration-150"
                    style={{
                      backgroundColor:
                        safePage === pageNum
                          ? "rgba(0, 201, 255, 0.15)"
                          : "transparent",
                      color: safePage === pageNum ? "#00C9FF" : "#94A3B8",
                      border:
                        safePage === pageNum
                          ? "1px solid rgba(0, 201, 255, 0.3)"
                          : "1px solid transparent",
                    }}
                    onMouseEnter={e => {
                      if (safePage !== pageNum) {
                        e.currentTarget.style.backgroundColor =
                          "rgba(148, 163, 184, 0.1)";
                        e.currentTarget.style.color = "#F5F7FA";
                      }
                    }}
                    onMouseLeave={e => {
                      if (safePage !== pageNum) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#94A3B8";
                      }
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="rounded-lg p-2 transition-colors duration-150 disabled:opacity-30"
              style={{ color: "#94A3B8" }}
              onMouseEnter={e => {
                if (safePage < totalPages)
                  e.currentTarget.style.backgroundColor =
                    "rgba(148, 163, 184, 0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={safePage >= totalPages}
              className="rounded-lg p-2 transition-colors duration-150 disabled:opacity-30"
              style={{ color: "#94A3B8" }}
              onMouseEnter={e => {
                if (safePage < totalPages)
                  e.currentTarget.style.backgroundColor =
                    "rgba(148, 163, 184, 0.1)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <ChevronLast size={16} />
            </button>
          </div>
        </div>

        {/* ═══ Summary Cards ═══ */}
        <SummaryCards jobs={filteredJobs} />
      </div>

      {/* ═══ Compare Modal ═══ */}
      <AnimatePresence>
        {compareOpen && selectedIds.size >= 2 && (
          <CompareModal
            jobs={compareJobs}
            onClose={() => setCompareOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
