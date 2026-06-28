import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Star,
  CheckSquare,
  FileText,
  LayoutGrid,
  List,
  Search,
  ChevronDown,
  X,
  Loader2,
  Table,
  RotateCcw,
} from "lucide-react";
import { trpc } from "@/lib/trpc.tsx";
import { useAuth } from "@/hooks/useAuth";
import {
  generateMockResumes,
  type MockTailoredResume,
} from "@/lib/resumeMockData";
import {
  filterResumes,
  sortResumes,
  downloadResumeAsHtml,
  downloadSelectedAsZip,
  downloadAllAsZip,
} from "@/lib/resumeUtils";
import ResumeCard from "@/components/resume/ResumeCard";
import ResumeListRow from "@/components/resume/ResumeListRow";
import ResumePreviewModal from "@/components/resume/ResumePreviewModal";
import HtmlResumeRenderer from "@/components/resume/HtmlResumeRenderer";

const SECTORS = [
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
];

const SORT_OPTIONS = [
  { value: "fitScore", label: "Fit Score" },
  { value: "date", label: "Date" },
  { value: "title", label: "Title" },
  { value: "company", label: "Company" },
];

export default function ResumesPage() {
  const { isLoading: authLoading } = useAuth();
  const profileId = 1; // Mock profile ID for demo

  // Fetch data from tRPC
  const resumesQuery = trpc.resume.getByProfile.useQuery(
    { profileId },
    { enabled: !authLoading, retry: false }
  );
  const jobsQuery = trpc.job.getByProfile.useQuery(
    { profileId },
    { enabled: !authLoading, retry: false }
  );

  // Generate mock data if no data from server
  const mockData = useMemo(() => {
    if (resumesQuery.data && resumesQuery.data.length > 0) {
      // Map server data to MockTailoredResume format
      const serverData: MockTailoredResume[] = [];
      for (const resume of resumesQuery.data) {
        const job = jobsQuery.data?.find(j => j.id === resume.jobId);
        if (job) {
          const highlights = JSON.parse(resume.highlights ?? "[]") as string[];
          const changesMade = JSON.parse(
            resume.changesMade ?? "[]"
          ) as string[];
          serverData.push({
            job,
            resume,
            highlights,
            changesMade,
            narrativeSummary: resume.narrativeSummary ?? "",
            keywordsMatched: [],
            keywordsMissing: [],
          });
        }
      }
      return serverData.length > 0
        ? serverData
        : generateMockResumes(profileId, 100);
    }
    return generateMockResumes(profileId, 100);
  }, [resumesQuery.data, jobsQuery.data]);

  // State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("");
  const [minScoreFilter, setMinScoreFilter] = useState<number | undefined>(
    undefined
  );
  const [sortBy, setSortBy] = useState("fitScore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [previewItem, setPreviewItem] = useState<MockTailoredResume | null>(
    null
  );
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  // Filter and sort
  const filteredData = useMemo(() => {
    const filtered = filterResumes(mockData, {
      sector: sectorFilter || undefined,
      minScore: minScoreFilter,
      search: searchQuery || undefined,
    });
    return sortResumes(filtered, sortBy, sortOrder);
  }, [mockData, sectorFilter, minScoreFilter, searchQuery, sortBy, sortOrder]);

  // Selection handlers
  const toggleSelection = useCallback((id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    if (selectedIds.size === filteredData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredData.map(d => d.resume.id)));
    }
  }, [filteredData, selectedIds.size]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
    setIsMultiSelectMode(false);
  }, []);

  // Preview handler
  const openPreview = useCallback((item: MockTailoredResume) => {
    setPreviewItem(item);
    setIsPreviewOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setTimeout(() => setPreviewItem(null), 300);
  }, []);

  // Download handlers
  const handleDownloadSingle = useCallback((item: MockTailoredResume) => {
    const el = document.getElementById(`resume-html-${item.resume.id}`);
    if (el) {
      downloadResumeAsHtml(item, el.innerHTML);
    }
  }, []);

  const getHtmlContent = useCallback((item: MockTailoredResume) => {
    const el = document.getElementById(`resume-html-${item.resume.id}`);
    return el?.innerHTML ?? "";
  }, []);

  const handleDownloadSelected = useCallback(async () => {
    const selected = filteredData.filter(d => selectedIds.has(d.resume.id));
    if (selected.length === 0) return;
    setIsDownloadingZip(true);
    try {
      await downloadSelectedAsZip(selected, getHtmlContent);
    } catch (e) {
      console.error("Download failed:", e);
    } finally {
      setIsDownloadingZip(false);
    }
  }, [filteredData, selectedIds, getHtmlContent]);

  const handleDownloadAll = useCallback(async () => {
    if (filteredData.length === 0) return;
    setIsDownloadingZip(true);
    try {
      await downloadAllAsZip(filteredData, getHtmlContent);
    } catch (e) {
      console.error("Download failed:", e);
    } finally {
      setIsDownloadingZip(false);
    }
  }, [filteredData, getHtmlContent]);

  const handleDownloadTop20 = useCallback(async () => {
    const top20 = [...filteredData]
      .sort((a, b) => (b.job.fitScore ?? 0) - (a.job.fitScore ?? 0))
      .slice(0, 20);
    setIsDownloadingZip(true);
    try {
      await downloadAllAsZip(top20, getHtmlContent);
    } catch (e) {
      console.error("Download failed:", e);
    } finally {
      setIsDownloadingZip(false);
    }
  }, [filteredData, getHtmlContent]);

  const selectedCount = selectedIds.size;

  return (
    <div style={{ backgroundColor: "#0B0E14", minHeight: "100dvh" }}>
      {/* ── Section 1: Page Header ── */}
      <section
        className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: "48px", paddingBottom: "24px" }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
        >
          {/* Eyebrow */}
          <p
            className="mb-3 text-xs font-medium tracking-widest"
            style={{
              color: "#00C9FF",
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            STEP 5 OF 5
          </p>

          {/* Heading */}
          <h1
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{
              color: "#F5F7FA",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Your Tailored Resumes
          </h1>

          {/* Subtext */}
          <p
            className="mt-3 max-w-[640px] text-base sm:text-lg"
            style={{ color: "#94A3B8", lineHeight: 1.6 }}
          >
            Each resume has been restructured to highlight the skills,
            experience, and keywords most relevant to the target role. Every
            application tells a cohesive story.
          </p>

          {/* Count */}
          <p
            className="mt-3 text-sm font-medium"
            style={{
              color: "#64748B",
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            {filteredData.length} resume{filteredData.length !== 1 ? "s" : ""}{" "}
            generated
            {filteredData.length < mockData.length &&
              ` (filtered from ${mockData.length})`}
          </p>
        </motion.div>

        {/* Batch Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
          className="mt-6 flex flex-wrap items-center gap-3"
        >
          <button
            onClick={handleDownloadAll}
            disabled={isDownloadingZip || filteredData.length === 0}
            className="accent-gradient flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            style={{ boxShadow: "0 0 20px rgba(0,201,255,0.2)" }}
          >
            {isDownloadingZip ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            Download All (ZIP)
          </button>

          <button
            onClick={handleDownloadTop20}
            disabled={isDownloadingZip}
            className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              color: "#00C9FF",
              borderColor: "#00C9FF",
              backgroundColor: "transparent",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                "rgba(0,201,255,0.08)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor =
                "transparent";
            }}
          >
            <Star size={16} />
            Download Top 20
          </button>

          <button
            onClick={() => {
              setIsMultiSelectMode(prev => !prev);
              if (isMultiSelectMode) {
                setSelectedIds(new Set());
              }
            }}
            className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200"
            style={{
              color: isMultiSelectMode ? "#00C9FF" : "#94A3B8",
              backgroundColor: isMultiSelectMode
                ? "rgba(0,201,255,0.08)"
                : "transparent",
              border: `1px solid ${isMultiSelectMode ? "#00C9FF" : "transparent"}`,
            }}
            onMouseEnter={e => {
              if (!isMultiSelectMode) {
                (e.currentTarget as HTMLElement).style.color = "#F5F7FA";
              }
            }}
            onMouseLeave={e => {
              if (!isMultiSelectMode) {
                (e.currentTarget as HTMLElement).style.color = "#94A3B8";
              }
            }}
          >
            <CheckSquare size={16} />
            {isMultiSelectMode ? "Done" : "Select Multiple"}
          </button>

          <button
            className="flex cursor-not-allowed items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium opacity-40"
            style={{
              color: "#00C9FF",
              borderColor: "#00C9FF",
              backgroundColor: "transparent",
            }}
            onClick={() => {}}
          >
            <FileText size={16} />
            Generate Cover Letters
            <span
              className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: "#334155", color: "#94A3B8" }}
            >
              Soon
            </span>
          </button>
        </motion.div>
      </section>

      {/* ── Section 2: Filter Bar ── */}
      <section
        className="sticky top-[64px] z-40 border-b"
        style={{
          backgroundColor: "rgba(11,14,20,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderColor: "rgba(148,163,184,0.08)",
          paddingTop: "12px",
          paddingBottom: "12px",
        }}
      >
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div
            className="relative flex min-w-0 flex-1 items-center"
            style={{ maxWidth: "280px" }}
          >
            <Search
              size={15}
              className="pointer-events-none absolute left-3"
              style={{ color: "#64748B" }}
            />
            <input
              type="text"
              placeholder="Search job title or company..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border py-2 pl-9 pr-4 text-sm outline-none transition-colors duration-200 focus:border-[#00C9FF]"
              style={{
                backgroundColor: "#1E293B",
                borderColor: "#334155",
                color: "#F5F7FA",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3"
                style={{ color: "#64748B" }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sector Dropdown */}
          <div className="relative">
            <select
              value={sectorFilter}
              onChange={e => setSectorFilter(e.target.value)}
              className="appearance-none rounded-lg border py-2 pl-3 pr-8 text-sm outline-none transition-colors duration-200 focus:border-[#00C9FF]"
              style={{
                backgroundColor: "#1E293B",
                borderColor: "#334155",
                color: "#F5F7FA",
                fontSize: "13px",
              }}
            >
              <option value="">All Sectors</option>
              {SECTORS.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
              style={{ color: "#64748B" }}
            />
          </div>

          {/* Min Score */}
          <div className="relative">
            <select
              value={minScoreFilter ?? ""}
              onChange={e =>
                setMinScoreFilter(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              className="appearance-none rounded-lg border py-2 pl-3 pr-8 text-sm outline-none transition-colors duration-200 focus:border-[#00C9FF]"
              style={{
                backgroundColor: "#1E293B",
                borderColor: "#334155",
                color: "#F5F7FA",
                fontSize: "13px",
              }}
            >
              <option value="">Any Score</option>
              <option value="90">90%+</option>
              <option value="80">80%+</option>
              <option value="70">70%+</option>
              <option value="60">60%+</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
              style={{ color: "#64748B" }}
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span
              className="hidden text-xs sm:inline"
              style={{ color: "#64748B" }}
            >
              Sort:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none rounded-lg border py-2 pl-3 pr-8 text-sm outline-none transition-colors duration-200 focus:border-[#00C9FF]"
                style={{
                  backgroundColor: "#1E293B",
                  borderColor: "#334155",
                  color: "#F5F7FA",
                  fontSize: "13px",
                }}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2"
                style={{ color: "#64748B" }}
              />
            </div>
            <button
              onClick={() => setSortOrder(o => (o === "asc" ? "desc" : "asc"))}
              className="flex h-8 w-8 items-center justify-center rounded-lg border text-xs transition-colors duration-200"
              style={{
                borderColor: "#334155",
                color: "#94A3B8",
                backgroundColor: "#1E293B",
              }}
              title={sortOrder === "asc" ? "Ascending" : "Descending"}
            >
              {sortOrder === "asc" ? "A\u2191" : "D\u2193"}
            </button>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* View Toggle */}
          <div
            className="flex items-center rounded-lg border p-0.5"
            style={{ borderColor: "#334155", backgroundColor: "#1E293B" }}
          >
            <button
              onClick={() => setViewMode("grid")}
              className="flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200"
              style={{
                backgroundColor:
                  viewMode === "grid" ? "#334155" : "transparent",
                color: viewMode === "grid" ? "#F5F7FA" : "#64748B",
              }}
            >
              <LayoutGrid size={15} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className="flex h-8 w-8 items-center justify-center rounded-md transition-all duration-200"
              style={{
                backgroundColor:
                  viewMode === "list" ? "#334155" : "transparent",
                color: viewMode === "list" ? "#F5F7FA" : "#64748B",
              }}
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Section 3: Resume Gallery ── */}
      <section
        className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8"
        style={{ paddingTop: "24px", paddingBottom: "48px" }}
      >
        {/* Multi-select bar */}
        {isMultiSelectMode && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-3 rounded-lg border px-4 py-3"
            style={{
              backgroundColor: "rgba(0,201,255,0.04)",
              borderColor: "rgba(0,201,255,0.15)",
            }}
          >
            <button
              onClick={selectAll}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "#00C9FF" }}
            >
              {selectedIds.size === filteredData.length
                ? "Deselect All"
                : `Select All (${filteredData.length})`}
            </button>
            {selectedCount > 0 && (
              <>
                <span style={{ color: "#334155" }}>|</span>
                <span className="text-sm" style={{ color: "#94A3B8" }}>
                  {selectedCount} selected
                </span>
              </>
            )}
          </motion.div>
        )}

        {/* Gallery content */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredData.map((item, index) => (
              <ResumeCard
                key={item.resume.id}
                item={item}
                index={index}
                isSelected={selectedIds.has(item.resume.id)}
                isMultiSelectMode={isMultiSelectMode}
                onSelect={() => toggleSelection(item.resume.id)}
                onPreview={() => openPreview(item)}
                onDownload={() => handleDownloadSingle(item)}
              />
            ))}
          </div>
        ) : (
          <div
            className="overflow-hidden rounded-xl border"
            style={{ borderColor: "#334155" }}
          >
            {/* List header */}
            <div
              className="flex items-center gap-4 px-4 py-2.5 text-xs font-medium uppercase tracking-wider"
              style={{
                backgroundColor: "#1E293B",
                color: "#64748B",
                borderBottom: "1px solid #334155",
              }}
            >
              {isMultiSelectMode && <div className="h-4 w-4 shrink-0" />}
              <div className="h-8 w-8 shrink-0" />
              <div className="min-w-0 flex-1">Role</div>
              <div className="hidden w-28 shrink-0 sm:block">Sector</div>
              <div className="hidden min-w-0 flex-1 lg:block">Highlights</div>
              <div className="hidden w-32 shrink-0 md:block">Location</div>
              <div className="hidden w-24 shrink-0 text-right sm:block">
                Due
              </div>
              <div className="w-16 shrink-0" />
            </div>
            {filteredData.map((item, index) => (
              <ResumeListRow
                key={item.resume.id}
                item={item}
                index={index}
                isSelected={selectedIds.has(item.resume.id)}
                isMultiSelectMode={isMultiSelectMode}
                onSelect={() => toggleSelection(item.resume.id)}
                onPreview={() => openPreview(item)}
                onDownload={() => handleDownloadSingle(item)}
              />
            ))}
          </div>
        )}

        {/* Empty state */}
        {filteredData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <Search size={48} style={{ color: "#334155" }} />
            <p
              className="mt-4 text-lg font-medium"
              style={{ color: "#94A3B8" }}
            >
              No resumes match your filters
            </p>
            <p className="mt-1 text-sm" style={{ color: "#64748B" }}>
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSectorFilter("");
                setMinScoreFilter(undefined);
              }}
              className="mt-4 flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-200"
              style={{
                color: "#00C9FF",
                borderColor: "#00C9FF",
                backgroundColor: "transparent",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "rgba(0,201,255,0.08)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "transparent";
              }}
            >
              <X size={14} />
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* ── Section 4: Completion ── */}
      <section
        className="border-t"
        style={{
          backgroundColor: "#0B0E14",
          borderColor: "rgba(148,163,184,0.08)",
          paddingTop: "80px",
          paddingBottom: "80px",
        }}
      >
        <div className="mx-auto max-w-[800px] px-4 text-center sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
            className="text-2xl font-bold sm:text-3xl"
            style={{ color: "#F5F7FA", letterSpacing: "-0.01em" }}
          >
            You&apos;re Ready to Apply
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
            className="mx-auto mt-4 max-w-[560px] text-base"
            style={{ color: "#94A3B8", lineHeight: 1.6 }}
          >
            All {mockData.length} resumes are generated and ready for download.
            Your complete job search package includes the structured data sheet
            and individual PDFs.
          </motion.p>

          {/* Action Cards */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              {
                icon: Table,
                title: "View Data Sheet",
                description:
                  "Browse the complete 100-role data table with all details, scores, and links.",
                action: "Open Datasheet \u2192",
                href: "/datasheet",
              },
              {
                icon: Download,
                title: "Download All",
                description:
                  "Get all 100 tailored resumes as a single ZIP file, ready for batch applications.",
                action: "Download ZIP",
                onClick: handleDownloadAll,
              },
              {
                icon: RotateCcw,
                title: "Start New Search",
                description:
                  "Run a fresh search with a different resume or preferences to explore new roles.",
                action: "Start Over \u2192",
                href: "/upload",
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: 0.12 * i,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
                className="flex flex-col items-center rounded-2xl border p-8 text-center transition-all duration-300"
                style={{
                  backgroundColor: "#111827",
                  borderColor: "#334155",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "rgba(0,201,255,0.3)";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 20px 40px rgba(0,201,255,0.08)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor =
                    "#334155";
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #00C9FF 0%, #3B82F6 50%, #7C3AED 100%)",
                  }}
                >
                  <card.icon size={24} color="#FFFFFF" />
                </div>
                <h3
                  className="mt-5 text-base font-semibold"
                  style={{ color: "#F5F7FA" }}
                >
                  {card.title}
                </h3>
                <p
                  className="mt-2 text-sm leading-relaxed"
                  style={{ color: "#94A3B8" }}
                >
                  {card.description}
                </p>
                {card.href ? (
                  <a
                    href={card.href}
                    className="mt-5 inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200"
                    style={{
                      color: "#00C9FF",
                      border: "1px solid #00C9FF",
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "rgba(0,201,255,0.08)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.backgroundColor =
                        "transparent";
                    }}
                  >
                    {card.action}
                  </a>
                ) : (
                  <button
                    onClick={card.onClick}
                    disabled={isDownloadingZip}
                    className="accent-gradient mt-5 inline-flex items-center rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
                    style={{ boxShadow: "0 0 15px rgba(0,201,255,0.2)" }}
                  >
                    {isDownloadingZip ? (
                      <Loader2 size={14} className="mr-2 animate-spin" />
                    ) : null}
                    {card.action}
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Floating Action Bar for Multi-Select ── */}
      <AnimatePresence>
        {isMultiSelectMode && selectedCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-50 flex items-center gap-4 rounded-2xl border px-6 py-3 shadow-2xl"
            style={{
              backgroundColor: "rgba(17,24,39,0.95)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              borderColor: "rgba(0,201,255,0.25)",
              transform: "translateX(-50%)",
              boxShadow: "0 8px 32px rgba(0,201,255,0.15)",
            }}
          >
            <span className="text-sm font-medium" style={{ color: "#F5F7FA" }}>
              {selectedCount} selected
            </span>
            <button
              onClick={handleDownloadSelected}
              disabled={isDownloadingZip}
              className="accent-gradient flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ boxShadow: "0 0 15px rgba(0,201,255,0.25)" }}
            >
              {isDownloadingZip ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              Download Selected
            </button>
            <button
              onClick={clearSelection}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "#94A3B8" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = "#F5F7FA";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = "#94A3B8";
              }}
            >
              Clear
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hidden resume HTML containers for download ── */}
      <div className="sr-only" aria-hidden="true">
        {mockData.map(item => (
          <div key={item.resume.id} id={`resume-html-${item.resume.id}`}>
            <HtmlResumeRenderer item={item} scale={1} />
          </div>
        ))}
      </div>

      {/* ── Resume Preview Modal ── */}
      <ResumePreviewModal
        item={previewItem}
        isOpen={isPreviewOpen}
        onClose={closePreview}
      />
    </div>
  );
}
