import type { Job, Profile } from "@/db/schema";
import { getSectorName } from "@/lib/mockJobs";

/* ═══════════════════════════════════════════════════════════════════
   INSIGHTS ENGINE
   Rule-based analysis of filtered job data + the candidate profile.
   Pure functions — no side effects, safe to run on every render.
   ═══════════════════════════════════════════════════════════════════ */

export type InsightSeverity = "opportunity" | "warning" | "info";

export type InsightType =
  | "sector_mismatch"
  | "salary_opportunity"
  | "skill_gap"
  | "deadline_urgency"
  | "location_shift"
  | "experience_level"
  | "title_specialization";

export interface InsightBar {
  label: string;
  value: number;
  /** Optional explicit colour; falls back to the severity colour. */
  color?: string;
  /** Optional formatted value shown instead of the raw number. */
  display?: string;
}

export interface InsightData {
  chart: "bars" | "stat";
  bars?: InsightBar[];
  /** For the "stat" chart: a big headline number + caption. */
  stat?: { value: string; caption: string };
  /** Optional supporting line items (e.g. closing-soon job titles). */
  items?: string[];
}

export interface Insight {
  insightType: InsightType;
  title: string;
  description: string;
  severity: InsightSeverity;
  data: InsightData;
}

const HIGH_FIT = 85;

/* ─── parsing helpers ─── */
function parseList(value: string | null | undefined): string[] {
  if (!value) return [];
  return value
    .split(/[,;\n]/)
    .map(s => s.trim())
    .filter(Boolean);
}

function parseSalaryMidpoint(range: string | null | undefined): number | null {
  if (!range) return null;
  const m = range.match(
    /\$?\s*(\d+(?:\.\d+)?)\s*k?\s*-\s*\$?\s*(\d+(?:\.\d+)?)\s*k?/i
  );
  if (!m) return null;
  const toDollars = (raw: string) => {
    const n = parseFloat(raw);
    return n < 1000 ? n * 1000 : n;
  };
  const min = toDollars(m[1]);
  const max = toDollars(m[2]);
  return (min + max) / 2;
}

function daysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const d = Math.ceil(
    (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return Number.isNaN(d) ? null : d;
}

function median(nums: number[]): number {
  if (nums.length === 0) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

function fmtK(dollars: number): string {
  return `$${Math.round(dollars / 1000)}k`;
}

function topEntries<T>(
  map: Map<T, number>,
  limit: number
): { key: T; count: number }[] {
  return [...map.entries()]
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/* ─── severity palette ─── */
const SEVERITY_COLOR: Record<InsightSeverity, string> = {
  opportunity: "#22C55E",
  warning: "#F59E0B",
  info: "#00C9FF",
};
const MUTED = "#475569";

/* ═══════════════════════════════════════════════════════════════════
   RULES — each returns an Insight or null.
   ═══════════════════════════════════════════════════════════════════ */

function ruleSectorMismatch(
  highFit: Job[],
  preferred: string[]
): Insight | null {
  if (highFit.length < 3) return null;

  const counts = new Map<string, number>();
  highFit.forEach(j => {
    const s = getSectorName(j.sectorId);
    counts.set(s, (counts.get(s) || 0) + 1);
  });
  const ranked = topEntries(counts, 5);
  if (ranked.length === 0) return null;

  const top = ranked[0];
  const preferredLower = preferred.map(p => p.toLowerCase());
  const topIsPreferred = preferredLower.includes(top.key.toLowerCase());
  const share = top.count / highFit.length;

  const bars: InsightBar[] = ranked.map(r => ({
    label: r.key,
    value: r.count,
    color: preferredLower.includes(r.key.toLowerCase()) ? "#00C9FF" : MUTED,
  }));

  if (preferred.length > 0 && !topIsPreferred) {
    return {
      insightType: "sector_mismatch",
      title: `Your best matches are in ${top.key}`,
      description: `${top.count} of your ${highFit.length} highest-fit roles are in ${top.key}, which isn't one of your preferred industries (${preferred.join(", ")}). It may be worth widening your focus.`,
      severity: "opportunity",
      data: { chart: "bars", bars },
    };
  }

  if (share >= 0.4) {
    return {
      insightType: "sector_mismatch",
      title: `${top.key} dominates your matches`,
      description: `${Math.round(share * 100)}% of your strongest matches concentrate in ${top.key}. Diversifying sectors could surface more options.`,
      severity: "info",
      data: { chart: "bars", bars },
    };
  }

  return null;
}

function ruleSalaryOpportunity(
  jobs: Job[],
  preferred: string[]
): Insight | null {
  const bySector = new Map<string, number[]>();
  jobs.forEach(j => {
    const mid = parseSalaryMidpoint(j.salaryRange);
    if (mid === null) return;
    const s = getSectorName(j.sectorId);
    const arr = bySector.get(s) || [];
    arr.push(mid);
    bySector.set(s, arr);
  });

  const medians = [...bySector.entries()]
    .filter(([, arr]) => arr.length >= 2)
    .map(([sector, arr]) => ({ sector, median: median(arr) }))
    .sort((a, b) => b.median - a.median);

  if (medians.length < 2) return null;

  const top = medians[0];
  const low = medians[medians.length - 1];
  if (top.median < low.median * 1.2) return null;

  const preferredLower = preferred.map(p => p.toLowerCase());
  const topIsPreferred = preferredLower.includes(top.sector.toLowerCase());
  const pctGap = Math.round((top.median / low.median - 1) * 100);

  const bars: InsightBar[] = medians.slice(0, 5).map(m => ({
    label: m.sector,
    value: Math.round(m.median),
    display: fmtK(m.median),
    color: m.sector === top.sector ? "#22C55E" : MUTED,
  }));

  const severity: InsightSeverity =
    preferred.length > 0 && !topIsPreferred ? "opportunity" : "info";

  const description =
    severity === "opportunity"
      ? `${top.sector} roles pay a median of ${fmtK(top.median)} — about ${pctGap}% more than ${low.sector} (${fmtK(low.median)}). It's outside your preferred industries but worth considering.`
      : `${top.sector} leads on pay at a median of ${fmtK(top.median)}, roughly ${pctGap}% above ${low.sector} (${fmtK(low.median)}).`;

  return {
    insightType: "salary_opportunity",
    title: `${top.sector} pays the most right now`,
    description,
    severity,
    data: { chart: "bars", bars },
  };
}

function ruleSkillGap(highFit: Job[], skills: string[]): Insight | null {
  if (highFit.length < 3) return null;

  const skillSet = new Set(skills.map(s => s.toLowerCase()));
  const counts = new Map<string, number>();
  const label = new Map<string, string>();

  highFit.forEach(j => {
    const reqs = parseList(j.requirements);
    const seen = new Set<string>();
    reqs.forEach(r => {
      const key = r.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      counts.set(key, (counts.get(key) || 0) + 1);
      if (!label.has(key)) label.set(key, r);
    });
  });

  if (skillSet.size === 0) {
    // No profile skills to compare against — surface the most in-demand skills.
    const ranked = topEntries(counts, 5);
    if (ranked.length === 0) return null;
    const bars: InsightBar[] = ranked.map(r => ({
      label: label.get(r.key) || r.key,
      value: r.count,
      color: "#00C9FF",
    }));
    return {
      insightType: "skill_gap",
      title: "Most in-demand skills in your matches",
      description: `Across your top matches, ${bars
        .slice(0, 3)
        .map(b => b.label)
        .join(
          ", "
        )} show up most often. Add the ones you have to your profile to sharpen scoring.`,
      severity: "info",
      data: { chart: "bars", bars },
    };
  }

  const missing = topEntries(counts, 20)
    .filter(r => !skillSet.has(r.key))
    .filter(r => r.count / highFit.length >= 0.25)
    .slice(0, 5);

  if (missing.length === 0) return null;

  const bars: InsightBar[] = missing.map(r => ({
    label: label.get(r.key) || r.key,
    value: r.count,
    color: "#F59E0B",
  }));

  return {
    insightType: "skill_gap",
    title: "Recurring skills you're missing",
    description: `${bars
      .map(b => b.label)
      .join(
        ", "
      )} appear in many of your highest-fit roles but aren't on your profile. Closing these gaps would lift your match quality.`,
    severity: "warning",
    data: { chart: "bars", bars },
  };
}

function ruleDeadlineUrgency(highFit: Job[]): Insight | null {
  const closing = highFit
    .map(j => ({ job: j, days: daysUntil(j.deadline) }))
    .filter(x => x.days !== null && x.days >= 0 && x.days <= 7)
    .sort((a, b) => (a.days as number) - (b.days as number));

  if (closing.length === 0) return null;

  const items = closing
    .slice(0, 4)
    .map(
      x =>
        `${x.job.title} @ ${x.job.company} — ${x.days === 0 ? "today" : `${x.days}d`}`
    );

  return {
    insightType: "deadline_urgency",
    title: `${closing.length} strong match${closing.length === 1 ? "" : "es"} closing this week`,
    description: `${closing.length} of your highest-fit roles have application deadlines within 7 days. Prioritise these before they expire.`,
    severity: "warning",
    data: {
      chart: "stat",
      stat: {
        value: String(closing.length),
        caption: "closing within 7 days",
      },
      items,
    },
  };
}

function ruleLocationShift(
  highFit: Job[],
  targetLocation: string | null | undefined
): Insight | null {
  if (highFit.length < 4) return null;

  const counts = new Map<string, number>();
  highFit.forEach(j => {
    const loc = (j.location || "Unknown").trim();
    counts.set(loc, (counts.get(loc) || 0) + 1);
  });
  const ranked = topEntries(counts, 5);
  if (ranked.length === 0) return null;

  const top = ranked[0];
  const bars: InsightBar[] = ranked.map(r => ({
    label: r.key,
    value: r.count,
    color: "#00C9FF",
  }));

  const target = (targetLocation || "").trim().toLowerCase();
  if (target) {
    const inTarget = highFit.filter(j =>
      (j.location || "").toLowerCase().includes(target)
    ).length;
    const share = inTarget / highFit.length;
    if (share < 0.3 && top.key.toLowerCase() !== target) {
      return {
        insightType: "location_shift",
        title: `Top matches cluster in ${top.key}`,
        description: `Only ${Math.round(share * 100)}% of your strongest matches are in or near ${targetLocation}. The most opportunities are in ${top.key}. Consider broadening your target location or remote roles.`,
        severity: "opportunity",
        data: { chart: "bars", bars },
      };
    }
    return null;
  }

  // No target set — surface the geographic concentration if there's a leader.
  if (top.count / highFit.length >= 0.25) {
    return {
      insightType: "location_shift",
      title: `Most matches are in ${top.key}`,
      description: `Your strongest matches are concentrated in ${top.key}. Setting a target location on your profile will refine future scoring.`,
      severity: "info",
      data: { chart: "bars", bars },
    };
  }
  return null;
}

function ruleExperienceLevel(highFit: Job[]): Insight | null {
  if (highFit.length < 4) return null;

  const counts = new Map<string, number>();
  highFit.forEach(j => {
    const lvl = (j.experienceLevel || "Unspecified").trim();
    counts.set(lvl, (counts.get(lvl) || 0) + 1);
  });
  const ranked = topEntries(counts, 5);
  if (ranked.length === 0) return null;

  const top = ranked[0];
  const share = top.count / highFit.length;
  if (share < 0.45 || top.key === "Unspecified") return null;

  const bars: InsightBar[] = ranked.map(r => ({
    label: r.key,
    value: r.count,
    color: r.key === top.key ? "#3B82F6" : MUTED,
  }));

  return {
    insightType: "experience_level",
    title: `Your matches skew ${top.key}`,
    description: `${Math.round(share * 100)}% of your highest-fit roles are ${top.key} positions. Make sure your résumé framing matches that seniority.`,
    severity: "info",
    data: { chart: "bars", bars },
  };
}

const TITLE_STOPWORDS = new Set([
  "senior",
  "junior",
  "lead",
  "principal",
  "staff",
  "manager",
  "associate",
  "specialist",
  "engineer",
  "developer",
  "analyst",
  "of",
  "and",
  "the",
  "i",
  "ii",
  "iii",
]);

function ruleTitleSpecialization(highFit: Job[]): Insight | null {
  if (highFit.length < 5) return null;

  const counts = new Map<string, number>();
  highFit.forEach(j => {
    const words = j.title
      .toLowerCase()
      .replace(/[^a-z\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length >= 4 && !TITLE_STOPWORDS.has(w));
    const seen = new Set<string>();
    words.forEach(w => {
      if (seen.has(w)) return;
      seen.add(w);
      counts.set(w, (counts.get(w) || 0) + 1);
    });
  });

  const ranked = topEntries(counts, 5).filter(r => r.count >= 3);
  if (ranked.length === 0) return null;

  const top = ranked[0];
  // Only meaningful if a theme recurs across a chunk of the matches.
  if (top.count / highFit.length < 0.2) return null;

  const cap = (w: string) => w.charAt(0).toUpperCase() + w.slice(1);
  const bars: InsightBar[] = ranked.map(r => ({
    label: cap(r.key),
    value: r.count,
    color: r.key === top.key ? "#7C3AED" : MUTED,
  }));

  return {
    insightType: "title_specialization",
    title: `Recurring theme: "${cap(top.key)}"`,
    description: `"${cap(top.key)}" appears in ${top.count} of your top role titles — a clear specialisation thread worth leaning into when tailoring résumés.`,
    severity: "info",
    data: { chart: "bars", bars },
  };
}

/* ─── severity rank for ordering ─── */
const SEVERITY_RANK: Record<InsightSeverity, number> = {
  warning: 0,
  opportunity: 1,
  info: 2,
};

/* ═══════════════════════════════════════════════════════════════════
   PUBLIC API
   ═══════════════════════════════════════════════════════════════════ */
export function generateInsights(
  jobs: Job[],
  profile: Profile | null,
  limit = 6
): Insight[] {
  if (jobs.length === 0) return [];

  let highFit = jobs.filter(j => (j.fitScore ?? 0) >= HIGH_FIT);
  // Fall back to the top quartile if very few clear the bar.
  if (highFit.length < 5) {
    const sorted = [...jobs].sort(
      (a, b) => (b.fitScore ?? 0) - (a.fitScore ?? 0)
    );
    highFit = sorted.slice(0, Math.max(5, Math.ceil(jobs.length * 0.25)));
  }

  const preferred = parseList(profile?.preferredIndustries);
  const skills = parseList(profile?.skills);

  const candidates: (Insight | null)[] = [
    ruleSkillGap(highFit, skills),
    ruleDeadlineUrgency(highFit),
    ruleSectorMismatch(highFit, preferred),
    ruleSalaryOpportunity(jobs, preferred),
    ruleLocationShift(highFit, profile?.targetLocation),
    ruleExperienceLevel(highFit),
    ruleTitleSpecialization(highFit),
  ];

  return candidates
    .filter((i): i is Insight => i !== null)
    .sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity])
    .slice(0, limit);
}

export function severityColor(severity: InsightSeverity): string {
  return SEVERITY_COLOR[severity];
}
