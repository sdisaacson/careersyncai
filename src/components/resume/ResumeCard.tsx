import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Download, Eye, Check } from "lucide-react";
import type { MockTailoredResume } from "@/lib/resumeMockData";
import { getScoreGradient, getSectorColor } from "@/lib/resumeUtils";
import HtmlResumeRenderer from "./HtmlResumeRenderer";

interface ResumeCardProps {
  item: MockTailoredResume;
  index: number;
  isSelected: boolean;
  isMultiSelectMode: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onDownload: () => void;
}

export default function ResumeCard({
  item,
  index,
  isSelected,
  isMultiSelectMode,
  onSelect,
  onPreview,
  onDownload,
}: ResumeCardProps) {
  const [isHovered, setIsHovered] = useState(false);
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
      className="group relative flex flex-col overflow-hidden rounded-xl"
      style={{
        backgroundColor: "#111827",
        border: `1px solid ${isSelected ? "#00C9FF" : isHovered ? "rgba(0,201,255,0.2)" : "#334155"}`,
        boxShadow: isSelected
          ? "0 0 20px rgba(0,201,255,0.15)"
          : isHovered
            ? "0 8px 24px rgba(0,201,255,0.05)"
            : "none",
        transition:
          "border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
        transform: isHovered ? "translateY(-3px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Multi-select checkbox */}
      {isMultiSelectMode && (
        <button
          onClick={handleCheckboxClick}
          className="absolute left-3 top-3 z-20 flex h-5 w-5 items-center justify-center rounded border transition-colors duration-200"
          style={{
            borderColor: isSelected ? "#00C9FF" : "#64748B",
            backgroundColor: isSelected ? "#00C9FF" : "transparent",
          }}
        >
          {isSelected && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
        </button>
      )}

      {/* Preview Area */}
      <div
        className="relative cursor-pointer"
        style={{ aspectRatio: "3/4" }}
        onClick={onPreview}
      >
        {/* Mini resume preview */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            transform: isHovered ? "scale(1.03)" : "scale(1)",
            transition: "transform 0.4s ease",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-15%",
              left: "-15%",
              width: "130%",
              height: "130%",
            }}
          >
            <HtmlResumeRenderer item={item} scale={0.32} />
          </div>
        </div>

        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 40%, rgba(11,14,20,0.92) 100%)",
          }}
        />

        {/* Fit Score Badge */}
        <div
          className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: scoreGradient }}
        >
          <span
            className="text-xs font-bold text-white"
            style={{ fontFamily: '"JetBrains Mono", monospace' }}
          >
            {score}
          </span>
        </div>

        {/* Preview button on hover */}
        {isHovered && !isMultiSelectMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-10 flex items-center justify-center"
          >
            <button
              onClick={e => {
                e.stopPropagation();
                onPreview();
              }}
              className="accent-gradient flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg"
              style={{
                boxShadow: "0 0 20px rgba(0,201,255,0.3)",
              }}
            >
              <Eye size={16} />
              Preview
            </button>
          </motion.div>
        )}

        {/* Bottom info overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-3 pt-8">
          <h4
            className="truncate text-sm font-semibold"
            style={{ color: "#F5F7FA" }}
          >
            {job.title}
          </h4>
          <p className="truncate text-xs" style={{ color: "#94A3B8" }}>
            {job.company}
          </p>
        </div>
      </div>

      {/* Info Area */}
      <div className="flex flex-1 flex-col px-4 pb-3 pt-2">
        {/* Sector pill */}
        <span
          className="self-start rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            color: sectorColor,
            backgroundColor: `${sectorColor}15`,
            border: `1px solid ${sectorColor}30`,
          }}
        >
          {sectorName}
        </span>

        {/* Match highlights */}
        <div className="mt-2 flex flex-wrap gap-1">
          {highlights.slice(0, 2).map((h, i) => (
            <span
              key={i}
              className="line-clamp-1 max-w-full rounded-md px-2 py-0.5 text-[10px] font-medium"
              style={{
                color: "#94A3B8",
                backgroundColor: "#1E293B",
              }}
              title={h}
            >
              {h.length > 35 ? h.substring(0, 35) + "..." : h}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div
          className="mt-auto flex items-center justify-between border-t pt-2"
          style={{ borderColor: "#334155" }}
        >
          <span
            className="text-[10px] font-medium"
            style={{
              color: "#64748B",
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            Due {job.deadline}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={e => {
                e.stopPropagation();
                onPreview();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-200"
              style={{ color: "#64748B" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = "#00C9FF";
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "rgba(0,201,255,0.08)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = "#64748B";
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "transparent";
              }}
            >
              <Eye size={14} />
            </button>
            <button
              onClick={e => {
                e.stopPropagation();
                onDownload();
              }}
              className="flex h-7 w-7 items-center justify-center rounded-md transition-colors duration-200"
              style={{ color: "#64748B" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = "#00C9FF";
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "rgba(0,201,255,0.08)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = "#64748B";
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "transparent";
              }}
            >
              <Download size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
