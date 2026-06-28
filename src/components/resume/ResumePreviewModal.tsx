import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  CheckCircle,
  ArrowUpCircle,
  Pencil,
  ZoomIn,
  ZoomOut,
  Building2,
  MapPin,
  Calendar,
  Tag,
} from "lucide-react";
import type { MockTailoredResume } from "@/lib/resumeMockData";
import {
  getScoreGradient,
  getSectorColor,
  downloadResumeAsHtml,
} from "@/lib/resumeUtils";
import HtmlResumeRenderer from "./HtmlResumeRenderer";

interface ResumePreviewModalProps {
  item: MockTailoredResume | null;
  isOpen: boolean;
  onClose: () => void;
}

const changeIcons: Record<string, { icon: typeof CheckCircle; color: string }> =
  {
    Summary: { icon: Pencil, color: "#F59E0B" },
    Skills: { icon: ArrowUpCircle, color: "#3B82F6" },
    Experience: { icon: CheckCircle, color: "#10B981" },
    Project: { icon: CheckCircle, color: "#10B981" },
    Education: { icon: ArrowUpCircle, color: "#8B5CF6" },
    Added: { icon: CheckCircle, color: "#10B981" },
    Default: { icon: Pencil, color: "#F59E0B" },
    Technical: { icon: ArrowUpCircle, color: "#3B82F6" },
    Certifications: { icon: CheckCircle, color: "#10B981" },
    Refine: { icon: Pencil, color: "#F59E0B" },
  };

function getChangeIcon(text: string) {
  for (const [key, val] of Object.entries(changeIcons)) {
    if (text.toLowerCase().includes(key.toLowerCase())) return val;
  }
  return { icon: Pencil, color: "#F59E0B" };
}

export default function ResumePreviewModal({
  item,
  isOpen,
  onClose,
}: ResumePreviewModalProps) {
  const [zoom, setZoom] = useState(0.65);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = useCallback(
    () => setZoom(z => Math.min(z + 0.1, 1.2)),
    []
  );
  const handleZoomOut = useCallback(
    () => setZoom(z => Math.max(z - 0.1, 0.4)),
    []
  );
  const handleResetZoom = useCallback(() => setZoom(0.65), []);

  if (!item) return null;

  const { job, highlights, changesMade, keywordsMatched, keywordsMissing } =
    item;
  const score = job.fitScore ?? 0;
  const scoreGradient = getScoreGradient(score);
  const sectorName =
    [
      "Technology",
      "Healthcare",
      "Finance",
      "Energy",
      "Education",
      "Manufacturing",
      "Retail",
      "Government",
      "Consulting",
      "Media",
      "Automotive",
      "Pharmaceuticals",
      "Aerospace",
      "Telecommunications",
      "Biotechnology",
    ][(job.sectorId ?? 1) - 1] ?? "Technology";
  const sectorColor = getSectorColor(sectorName);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-start justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 120,
              damping: 14,
            }}
            className="relative mx-4 mt-8 flex w-full max-w-[1000px] flex-col overflow-hidden rounded-2xl"
            style={{
              backgroundColor: "#111827",
              border: "1px solid #334155",
              maxHeight: "calc(100vh - 64px)",
              boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex flex-col gap-3 border-b px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
              style={{ borderColor: "#334155" }}
            >
              <div className="min-w-0 flex-1">
                <h3
                  className="truncate text-lg font-semibold"
                  style={{ color: "#F5F7FA" }}
                >
                  {job.title}
                </h3>
                <div
                  className="mt-1 flex flex-wrap items-center gap-3 text-xs"
                  style={{ color: "#94A3B8" }}
                >
                  <span className="flex items-center gap-1">
                    <Building2 size={12} />
                    {job.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    Due {job.deadline}
                  </span>
                  <span
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      color: sectorColor,
                      backgroundColor: `${sectorColor}15`,
                      border: `1px solid ${sectorColor}30`,
                    }}
                  >
                    <Tag size={10} />
                    {sectorName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Score */}
                <div
                  className="flex h-10 items-center gap-2 rounded-full px-3"
                  style={{ background: scoreGradient }}
                >
                  <span
                    className="text-sm font-bold text-white"
                    style={{ fontFamily: '"JetBrains Mono", monospace' }}
                  >
                    {score}%
                  </span>
                  <span className="text-[10px] font-medium text-white/80">
                    MATCH
                  </span>
                </div>

                {/* Download */}
                <button
                  onClick={() =>
                    downloadResumeAsHtml(
                      item,
                      document.getElementById("resume-html-preview")
                        ?.innerHTML ?? ""
                    )
                  }
                  className="accent-gradient hidden items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg sm:flex"
                  style={{ boxShadow: "0 0 15px rgba(0,201,255,0.2)" }}
                >
                  <Download size={14} />
                  Download
                </button>

                {/* Close */}
                <button
                  onClick={onClose}
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200"
                  style={{ color: "#94A3B8" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = "#F5F7FA";
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "#1E293B";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = "#94A3B8";
                    (e.currentTarget as HTMLElement).style.backgroundColor =
                      "transparent";
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div
              className="flex flex-1 overflow-hidden"
              style={{ height: "calc(90vh - 140px)" }}
            >
              {/* Left — PDF Preview */}
              <div className="relative flex flex-1 flex-col overflow-hidden">
                {/* Zoom controls */}
                <div
                  className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-lg px-2 py-1"
                  style={{
                    backgroundColor: "rgba(11,14,20,0.85)",
                    border: "1px solid #334155",
                  }}
                >
                  <button
                    onClick={handleZoomOut}
                    className="flex h-7 w-7 items-center justify-center rounded transition-colors duration-150"
                    style={{ color: "#94A3B8" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = "#F5F7FA";
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "#1E293B";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = "#94A3B8";
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "transparent";
                    }}
                  >
                    <ZoomOut size={14} />
                  </button>
                  <button
                    onClick={handleResetZoom}
                    className="px-2 text-[11px] font-medium"
                    style={{
                      color: "#94A3B8",
                      fontFamily: '"JetBrains Mono", monospace',
                    }}
                  >
                    {Math.round(zoom * 100)}%
                  </button>
                  <button
                    onClick={handleZoomIn}
                    className="flex h-7 w-7 items-center justify-center rounded transition-colors duration-150"
                    style={{ color: "#94A3B8" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = "#F5F7FA";
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "#1E293B";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = "#94A3B8";
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "transparent";
                    }}
                  >
                    <ZoomIn size={14} />
                  </button>
                </div>

                {/* Scrollable preview */}
                <div
                  ref={containerRef}
                  className="flex-1 overflow-auto"
                  style={{ backgroundColor: "#0B0E14" }}
                >
                  <div
                    id="resume-html-preview"
                    className="flex min-h-full items-start justify-center p-6"
                  >
                    <HtmlResumeRenderer item={item} scale={zoom} />
                  </div>
                </div>
              </div>

              {/* Right — Changes Panel */}
              <div
                className="hidden w-[340px] shrink-0 overflow-y-auto border-l lg:block"
                style={{
                  backgroundColor: "#1E293B",
                  borderColor: "#334155",
                  padding: "20px",
                }}
              >
                {/* What Changed */}
                <h4
                  className="mb-4 text-sm font-semibold"
                  style={{ color: "#F5F7FA" }}
                >
                  What Changed
                </h4>
                <div className="flex flex-col gap-3">
                  {changesMade.map((change, i) => {
                    const { icon: Icon, color } = getChangeIcon(change);
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 rounded-lg p-2.5"
                        style={{ backgroundColor: "rgba(11,14,20,0.4)" }}
                      >
                        <Icon
                          size={16}
                          color={color}
                          className="mt-0.5 shrink-0"
                        />
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "#94A3B8" }}
                        >
                          {change}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Keywords Matched */}
                <h4
                  className="mb-3 mt-6 text-sm font-semibold"
                  style={{ color: "#F5F7FA" }}
                >
                  Keywords Matched
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {keywordsMatched.map((kw, i) => (
                    <span
                      key={i}
                      className="rounded-full px-2.5 py-1 text-[10px] font-medium"
                      style={{
                        color: "#00C9FF",
                        backgroundColor: "rgba(0,201,255,0.1)",
                        border: "1px solid rgba(0,201,255,0.2)",
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                  {keywordsMissing.map((kw, i) => (
                    <span
                      key={`missing-${i}`}
                      className="rounded-full px-2.5 py-1 text-[10px] font-medium"
                      style={{
                        color: "#64748B",
                        backgroundColor: "#1E293B",
                        border: "1px solid #334155",
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>

                {/* Tailoring Highlights */}
                <h4
                  className="mb-3 mt-6 text-sm font-semibold"
                  style={{ color: "#F5F7FA" }}
                >
                  Tailoring Highlights
                </h4>
                <div className="flex flex-col gap-2">
                  {highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 rounded-lg p-2.5"
                      style={{ backgroundColor: "rgba(11,14,20,0.4)" }}
                    >
                      <CheckCircle
                        size={14}
                        color="#10B981"
                        className="mt-0.5 shrink-0"
                      />
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "#94A3B8" }}
                      >
                        {h}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Narrative Summary */}
                <div
                  className="mt-6 rounded-lg p-3"
                  style={{
                    backgroundColor: `${sectorColor}08`,
                    border: `1px solid ${sectorColor}20`,
                  }}
                >
                  <h4
                    className="mb-2 text-xs font-semibold"
                    style={{ color: sectorColor }}
                  >
                    AI Narrative
                  </h4>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "#94A3B8" }}
                  >
                    {item.narrativeSummary}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
