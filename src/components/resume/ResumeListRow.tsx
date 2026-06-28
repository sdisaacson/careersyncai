import { useCallback } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Eye,
  Check,
  Building2,
} from "lucide-react";
import type { MockTailoredResume } from "@/lib/resumeMockData";
import {
  getScoreGradient,
  getSectorColor,
} from "@/lib/resumeUtils";

interface ResumeListRowProps {
  item: MockTailoredResume;
  index: number;
  isSelected: boolean;
  isMultiSelectMode: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onDownload: () => void;
}

export default function ResumeListRow({
  item,
  index,
  isSelected,
  isMultiSelectMode,
  onSelect,
  onPreview,
  onDownload,
}: ResumeListRowProps) {
  const { job, highlights } = item;
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

  const handleCheckboxClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect();
    },
    [onSelect]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: index * 0.02,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      className="flex items-center gap-4 px-4 py-3"
      style={{
        backgroundColor: isSelected
          ? "rgba(0,201,255,0.04)"
          : index % 2 === 0
            ? "#111827"
            : "rgba(30,41,59,0.5)",
        borderBottom: "1px solid #334155",
        transition: "background-color 0.2s ease",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Checkbox */}
      {isMultiSelectMode && (
        <button
          onClick={handleCheckboxClick}
          className="flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors duration-200"
          style={{
            borderColor: isSelected ? "#00C9FF" : "#64748B",
            backgroundColor: isSelected ? "#00C9FF" : "transparent",
          }}
        >
          {isSelected && <Check size={10} color="#FFFFFF" strokeWidth={3} />}
        </button>
      )}

      {/* Score */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
        style={{ background: scoreGradient }}
      >
        <span
          className="text-[10px] font-bold text-white"
          style={{ fontFamily: '"JetBrains Mono", monospace' }}
        >
          {score}
        </span>
      </div>

      {/* Job Title */}
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-medium"
          style={{ color: "#F5F7FA" }}
        >
          {job.title}
        </p>
        <p className="truncate text-xs" style={{ color: "#94A3B8" }}>
          {job.company}
        </p>
      </div>

      {/* Sector */}
      <div className="hidden w-28 shrink-0 sm:block">
        <span
          className="rounded-full px-2.5 py-0.5 text-[10px] font-medium"
          style={{
            color: sectorColor,
            backgroundColor: `${sectorColor}15`,
            border: `1px solid ${sectorColor}30`,
          }}
        >
          {sectorName}
        </span>
      </div>

      {/* Highlights */}
      <div className="hidden min-w-0 flex-1 flex-wrap gap-1 lg:flex">
        {highlights.slice(0, 2).map((h, i) => (
          <span
            key={i}
            className="line-clamp-1 rounded-md px-2 py-0.5 text-[10px] font-medium"
            style={{
              color: "#94A3B8",
              backgroundColor: "#1E293B",
            }}
            title={h}
          >
            {h.length > 45 ? h.substring(0, 45) + "..." : h}
          </span>
        ))}
      </div>

      {/* Location */}
      <div className="hidden w-32 shrink-0 text-xs md:block" style={{ color: "#94A3B8" }}>
        <div className="flex items-center gap-1">
          <Building2 size={11} />
          <span className="truncate">{job.location}</span>
        </div>
      </div>

      {/* Deadline */}
      <div
        className="hidden w-24 shrink-0 text-right text-[10px] font-medium sm:block"
        style={{ color: "#64748B", fontFamily: '"JetBrains Mono", monospace' }}
      >
        {job.deadline}
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPreview();
          }}
          className="flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200"
          style={{ color: "#64748B" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#00C9FF";
            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(0,201,255,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#64748B";
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
          }}
          title="Preview"
        >
          <Eye size={15} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload();
          }}
          className="flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200"
          style={{ color: "#64748B" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#00C9FF";
            (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(0,201,255,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = "#64748B";
            (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
          }}
          title="Download PDF"
        >
          <Download size={15} />
        </button>
      </div>
    </motion.div>
  );
}
