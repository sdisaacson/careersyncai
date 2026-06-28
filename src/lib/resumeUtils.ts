import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { MockTailoredResume } from "./resumeMockData";

function escapeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9\-_]/g, "_");
}

/**
 * Download a single resume as HTML file (simulated PDF)
 */
export function downloadResumeAsHtml(
  item: MockTailoredResume,
  htmlContent: string
): void {
  const filename = `Resume_${escapeFilename(item.job.title)}_${escapeFilename(
    item.job.company
  )}.html`;
  const blob = new Blob(
    [
      `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${item.job.title} - ${item.job.company}</title>
<style>
@page { size: auto; margin: 0; }
body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style>
</head>
<body>
${htmlContent}
<script>
window.onload = function() { setTimeout(function() { window.print(); }, 500); };
</script>
</body>
</html>`,
    ],
    { type: "text/html" }
  );
  saveAs(blob, filename);
}

/**
 * Download selected resumes as a ZIP file
 */
export async function downloadSelectedAsZip(
  items: MockTailoredResume[],
  getHtmlContent: (item: MockTailoredResume) => string
): Promise<void> {
  const zip = new JSZip();
  const folder = zip.folder("Tailored_Resumes");
  if (!folder) return;

  items.forEach(item => {
    const filename = `Resume_${escapeFilename(item.job.title)}_${escapeFilename(
      item.job.company
    )}.html`;
    const htmlContent = getHtmlContent(item);
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${item.job.title} - ${item.job.company}</title>
<style>
@page { size: auto; margin: 0; }
body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
</style>
</head>
<body>
${htmlContent}
</body>
</html>`;
    folder.file(filename, fullHtml);
  });

  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `Tailored_Resumes_${items.length}.zip`);
}

/**
 * Download all resumes as a ZIP file
 */
export async function downloadAllAsZip(
  items: MockTailoredResume[],
  getHtmlContent: (item: MockTailoredResume) => string
): Promise<void> {
  return downloadSelectedAsZip(items, getHtmlContent);
}

/**
 * Get score color based on fit score
 */
export function getScoreColor(score: number): string {
  if (score >= 80) return "#00C9FF";
  if (score >= 60) return "#3B82F6";
  return "#64748B";
}

/**
 * Get score background gradient based on fit score
 */
export function getScoreGradient(score: number): string {
  if (score >= 80) return "linear-gradient(135deg, #00C9FF 0%, #3B82F6 100%)";
  if (score >= 60) return "linear-gradient(135deg, #3B82F6 0%, #1E3A8A 100%)";
  return "linear-gradient(135deg, #64748B 0%, #334155 100%)";
}

/**
 * Get sector color
 */
export function getSectorColor(sector: string): string {
  const colors: Record<string, string> = {
    Technology: "#00C9FF",
    Healthcare: "#10B981",
    Finance: "#F59E0B",
    Energy: "#22C55E",
    Education: "#7C3AED",
    Manufacturing: "#EF4444",
    Retail: "#EC4899",
    Government: "#6B7280",
    Consulting: "#8B5CF6",
    Media: "#F97316",
    Automotive: "#14B8A6",
    Pharmaceuticals: "#06B6D4",
    Aerospace: "#6366F1",
    Telecommunications: "#3B82F6",
    Biotechnology: "#A855F7",
  };
  return colors[sector] ?? "#3B82F6";
}

/**
 * Sort resumes based on sort option
 */
export function sortResumes(
  items: MockTailoredResume[],
  sortBy: string,
  sortOrder: "asc" | "desc"
): MockTailoredResume[] {
  const sorted = [...items].sort((a, b) => {
    let comparison: number;
    switch (sortBy) {
      case "fitScore":
        comparison = (a.job.fitScore ?? 0) - (b.job.fitScore ?? 0);
        break;
      case "date":
        comparison =
          new Date(a.job.createdAt).getTime() -
          new Date(b.job.createdAt).getTime();
        break;
      case "title":
        comparison = a.job.title.localeCompare(b.job.title);
        break;
      case "company":
        comparison = a.job.company.localeCompare(b.job.company);
        break;
      default:
        comparison = (a.job.fitScore ?? 0) - (b.job.fitScore ?? 0);
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });
  return sorted;
}

/**
 * Filter resumes based on criteria
 */
export function filterResumes(
  items: MockTailoredResume[],
  filters: {
    sector?: string;
    minScore?: number;
    maxScore?: number;
    search?: string;
  }
): MockTailoredResume[] {
  return items.filter(item => {
    if (filters.sector && item.job.sectorId) {
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
        ][(item.job.sectorId ?? 1) - 1] ?? "";
      if (sectorName !== filters.sector) return false;
    }
    if (
      filters.minScore !== undefined &&
      (item.job.fitScore ?? 0) < filters.minScore
    )
      return false;
    if (
      filters.maxScore !== undefined &&
      (item.job.fitScore ?? 0) > filters.maxScore
    )
      return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesTitle = item.job.title.toLowerCase().includes(searchLower);
      const matchesCompany = item.job.company
        .toLowerCase()
        .includes(searchLower);
      if (!matchesTitle && !matchesCompany) return false;
    }
    return true;
  });
}
