import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List,
  MapPin,
  Clock,
  ChevronRight,
  X,
  CheckCircle,
  XCircle,
  ExternalLink,
  FileText,
  Star,
  Briefcase,
  BarChart3,
  Layers,
  Download,
} from 'lucide-react';
import { trpc } from '@/lib/trpc.tsx';
import { generateMockJobs, getSectorName, getFitScoreColor, SECTORS } from '@/lib/mockJobs';
import type { Job } from '@/db/schema';

/* ─── easing ─── */
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ─── Fit Score Pill ─── */
function FitScorePill({ score, size = 'sm' }: { score: number | null | undefined; size?: 'sm' | 'md' | 'lg' }) {
  const colors = getFitScoreColor(score);
  const fontSize = size === 'lg' ? '20px' : size === 'md' ? '16px' : '12px';
  const padding = size === 'lg' ? '8px 18px' : size === 'md' ? '6px 14px' : '4px 10px';

  return (
    <span
      className="inline-flex items-center rounded-full font-mono font-bold whitespace-nowrap"
      style={{
        fontSize,
        padding,
        background: colors.bg,
        color: colors.text,
      }}
    >
      {score ?? 0}%
    </span>
  );
}

/* ─── Company Badge ─── */
function CompanyBadge({ company, size = 32 }: { company: string; size?: number }) {
  const initial = company.charAt(0).toUpperCase();
  return (
    <div
      className="flex items-center justify-center rounded-lg font-bold text-sm"
      style={{
        width: size,
        height: size,
        backgroundColor: '#334155',
        color: '#F5F7FA',
      }}
    >
      {initial}
    </div>
  );
}

/* ─── Job Card ─── */
function JobCard({ job, index, onView }: { job: Job; index: number; onView: (job: Job) => void }) {
  const sectorName = getSectorName(job.sectorId);
  const requirements = job.requirements?.split(',').map((r) => r.trim()).slice(0, 4) ?? [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: easeOutExpo }}
      className="group relative flex flex-col rounded-xl border p-5 transition-all duration-300"
      style={{
        backgroundColor: '#111827',
        borderColor: '#334155',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 201, 255, 0.3)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 201, 255, 0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#334155';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <CompanyBadge company={job.company} />
        <div className="min-w-0 flex-1 pr-16">
          <h3 className="text-base font-semibold leading-snug" style={{ color: '#F5F7FA' }}>
            {job.title}
          </h3>
          <p className="mt-0.5 text-sm" style={{ color: '#94A3B8' }}>
            {job.company}
          </p>
        </div>
        <div className="absolute right-4 top-4">
          <FitScorePill score={job.fitScore} />
        </div>
      </div>

      {/* Body */}
      <div className="mt-4 flex-1">
        {job.location && (
          <div className="mb-2 flex items-center gap-1 text-xs" style={{ color: '#94A3B8' }}>
            <MapPin size={12} />
            {job.location}
          </div>
        )}
        <p
          className="line-clamp-2 text-sm leading-relaxed"
          style={{ color: '#94A3B8' }}
        >
          {job.jobDescription}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {requirements.map((req) => (
            <span
              key={req}
              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
              style={{ backgroundColor: '#1E293B', color: '#94A3B8' }}
            >
              {req}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div
        className="mt-4 flex items-center justify-between border-t pt-3"
        style={{ borderColor: '#334155' }}
      >
        <div className="flex items-center gap-2">
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: `${getSectorColor(sectorName)}20`,
              color: getSectorColor(sectorName),
            }}
          >
            {sectorName}
          </span>
          {job.deadline && (
            <span className="flex items-center gap-1 text-xs" style={{ color: '#94A3B8' }}>
              <Clock size={11} />
              {formatDate(job.deadline)}
            </span>
          )}
        </div>
        <button
          onClick={() => onView(job)}
          className="flex items-center gap-1 text-sm font-medium transition-colors duration-200"
          style={{ color: '#00C9FF' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#3B82F6'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#00C9FF'; }}
        >
          View <ChevronRight size={14} />
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Job List Row ─── */
function JobListRow({ job, index, onView }: { job: Job; index: number; onView: (job: Job) => void }) {
  const sectorName = getSectorName(job.sectorId);
  const requirements = job.requirements?.split(',').map((r) => r.trim()).slice(0, 3) ?? [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: easeOutExpo }}
      className="flex items-center gap-4 rounded-lg border px-4 py-3 transition-all duration-300"
      style={{ backgroundColor: '#1E293B', borderColor: '#334155' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 201, 255, 0.3)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 201, 255, 0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#334155';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <CompanyBadge company={job.company} size={40} />
      <div className="min-w-0 flex-1">
        <h4 className="truncate text-sm font-semibold" style={{ color: '#F5F7FA' }}>
          {job.title}
        </h4>
        <p className="text-xs" style={{ color: '#94A3B8' }}>
          {job.company}
        </p>
      </div>
      <div className="hidden items-center gap-2 md:flex">
        {job.location && (
          <span className="flex items-center gap-1 text-xs" style={{ color: '#94A3B8' }}>
            <MapPin size={11} /> {job.location}
          </span>
        )}
        <span
          className="rounded-full px-2 py-0.5 text-xs"
          style={{ backgroundColor: `${getSectorColor(sectorName)}20`, color: getSectorColor(sectorName) }}
        >
          {sectorName}
        </span>
        <div className="flex flex-wrap gap-1">
          {requirements.map((req) => (
            <span key={req} className="rounded-full px-2 py-0.5 text-xs" style={{ backgroundColor: '#1E293B', color: '#94A3B8' }}>
              {req}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <FitScorePill score={job.fitScore} size="md" />
        {job.deadline && (
          <span className="hidden items-center gap-1 text-xs sm:flex" style={{ color: '#94A3B8' }}>
            <Clock size={11} />
            {formatDate(job.deadline)}
          </span>
        )}
        <button
          onClick={() => onView(job)}
          className="text-sm font-medium"
          style={{ color: '#00C9FF' }}
        >
          View
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Job Detail Drawer ─── */
function JobDetailDrawer({ job, onClose }: { job: Job | null; onClose: () => void }) {
  const updateStatus = trpc.job.updateStatus.useMutation();
  const [now] = useState(() => Date.now());

  if (!job) return null;

  const sectorName = getSectorName(job.sectorId);
  const requirements = job.requirements?.split(',').map((r) => r.trim()) ?? [];
  const matchItems = job.matchReasons?.split('.').filter(Boolean).map((s) => s.trim()) ?? [];
  const gapItems = job.skillGaps?.split('.').filter(Boolean).map((s) => s.trim()) ?? [];

  const handleStatusChange = (status: 'discovered' | 'shortlisted' | 'applied' | 'archived') => {
    updateStatus.mutate({ id: job.id, status });
  };

  const isExpired = job.deadline ? new Date(job.deadline) < new Date() : false;
  const daysUntilDeadline = job.deadline
    ? Math.ceil((new Date(job.deadline).getTime() - now) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <AnimatePresence>
      {job && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
            onClick={onClose}
          />
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: easeOutExpo }}
            className="fixed right-0 top-0 z-50 flex h-full w-full flex-col overflow-hidden sm:w-[560px]"
            style={{
              backgroundColor: '#111827',
              borderLeft: '1px solid #334155',
            }}
          >
            {/* Header */}
            <div className="flex items-start gap-4 border-b p-6" style={{ borderColor: '#334155' }}>
              <CompanyBadge company={job.company} size={48} />
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold" style={{ color: '#F5F7FA' }}>
                  {job.title}
                </h2>
                <p className="mt-1" style={{ color: '#94A3B8' }}>
                  {job.company}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <FitScorePill score={job.fitScore} size="lg" />
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: `${getSectorColor(sectorName)}20`,
                      color: getSectorColor(sectorName),
                    }}
                  >
                    {sectorName}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 transition-colors duration-200"
                style={{ color: '#94A3B8' }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#F5F7FA'; e.currentTarget.style.backgroundColor = 'rgba(148, 163, 184, 0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Fit Score Gauge */}
              <div className="mb-6 flex items-center gap-6">
                <svg width="80" height="80" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="34" fill="none" stroke="#334155" strokeWidth="6" />
                  <circle
                    cx="40"
                    cy="40"
                    r="34"
                    fill="none"
                    stroke="url(#gauge-gradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 34 * (job.fitScore ?? 0) / 100} ${2 * Math.PI * 34}`}
                    strokeDashoffset={-2 * Math.PI * 34 * 0.25}
                    transform="rotate(-90 40 40)"
                  />
                  <defs>
                    <linearGradient id="gauge-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00C9FF" />
                      <stop offset="100%" stopColor="#7C3AED" />
                    </linearGradient>
                  </defs>
                  <text
                    x="40"
                    y="44"
                    textAnchor="middle"
                    style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '18px', fontWeight: 700, fill: '#F5F7FA' }}
                  >
                    {job.fitScore}%
                  </text>
                </svg>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Skills', value: Math.min(100, (job.fitScore ?? 0) + 2) },
                    { label: 'Experience', value: Math.min(100, (job.fitScore ?? 0) + 1) },
                    { label: 'Location', value: Math.min(100, (job.fitScore ?? 0) - 1) },
                    { label: 'Growth', value: Math.min(100, (job.fitScore ?? 0) - 2) },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-xs" style={{ color: '#94A3B8' }}>{item.label}</span>
                        <span className="text-xs font-mono font-bold" style={{ color: '#00C9FF' }}>{item.value}%</span>
                      </div>
                      <div className="h-1 w-16 rounded-full" style={{ backgroundColor: '#334155' }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.value}%`,
                            background: 'linear-gradient(90deg, #00C9FF 0%, #7C3AED 100%)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <Section title="Overview">
                <p className="text-sm leading-relaxed" style={{ color: '#94A3B8' }}>
                  {job.jobDescription}
                </p>
              </Section>

              {/* Requirements */}
              <Section title="Requirements">
                <div className="space-y-2">
                  {requirements.map((req) => (
                    <div key={req} className="flex items-center gap-2">
                      <CheckCircle size={14} style={{ color: '#22C55E' }} />
                      <span className="text-sm" style={{ color: '#F5F7FA' }}>{req}</span>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Match Reasons */}
              {matchItems.length > 0 && (
                <Section title="Match Reasons">
                  <div className="space-y-2">
                    {matchItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle size={14} className="mt-0.5 shrink-0" style={{ color: '#22C55E' }} />
                        <span className="text-sm" style={{ color: '#94A3B8' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Skill Gaps */}
              {gapItems.length > 0 && (
                <Section title="Skill Gaps">
                  <div className="space-y-2">
                    {gapItems.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <XCircle size={14} className="mt-0.5 shrink-0" style={{ color: '#EF4444' }} />
                        <span className="text-sm" style={{ color: '#94A3B8' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* Compensation */}
              <Section title="Compensation">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>Salary Range</p>
                    <p className="mt-1 font-mono text-sm font-bold" style={{ color: '#F5F7FA' }}>
                      {job.salaryRange || 'Not listed'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>Job Type</p>
                    <p className="mt-1 text-sm font-medium" style={{ color: '#F5F7FA' }}>
                      {job.jobType || 'Full-time'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>Experience Level</p>
                    <p className="mt-1 text-sm font-medium" style={{ color: '#F5F7FA' }}>
                      {job.experienceLevel || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: '#94A3B8' }}>Location</p>
                    <p className="mt-1 text-sm font-medium" style={{ color: '#F5F7FA' }}>
                      {job.location || 'Not specified'}
                    </p>
                  </div>
                </div>
              </Section>

              {/* Deadline */}
              {job.deadline && (
                <Section title="Application Deadline">
                  <div
                    className="flex items-center gap-2 rounded-lg border px-4 py-3"
                    style={{
                      borderColor: isExpired ? 'rgba(239, 68, 68, 0.3)' : daysUntilDeadline !== null && daysUntilDeadline <= 7 ? 'rgba(245, 158, 11, 0.3)' : '#334155',
                      backgroundColor: isExpired ? 'rgba(239, 68, 68, 0.05)' : daysUntilDeadline !== null && daysUntilDeadline <= 7 ? 'rgba(245, 158, 11, 0.05)' : 'transparent',
                    }}
                  >
                    <Clock size={16} style={{ color: isExpired ? '#EF4444' : daysUntilDeadline !== null && daysUntilDeadline <= 7 ? '#F59E0B' : '#94A3B8' }} />
                    <span
                      className="text-sm font-medium"
                      style={{ color: isExpired ? '#EF4444' : daysUntilDeadline !== null && daysUntilDeadline <= 7 ? '#F59E0B' : '#F5F7FA' }}
                    >
                      {formatDate(job.deadline)}
                      {isExpired ? ' (Expired)' : daysUntilDeadline !== null && daysUntilDeadline <= 7 ? ` (${daysUntilDeadline} days left)` : ''}
                    </span>
                  </div>
                </Section>
              )}

              {/* Status Actions */}
              <Section title="Status">
                <div className="flex flex-wrap gap-2">
                  {(['discovered', 'shortlisted', 'applied', 'archived'] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className="rounded-lg border px-4 py-2 text-sm font-medium capitalize transition-all duration-200"
                      style={{
                        borderColor: job.status === s ? '#00C9FF' : '#334155',
                        backgroundColor: job.status === s ? 'rgba(0, 201, 255, 0.1)' : 'transparent',
                        color: job.status === s ? '#00C9FF' : '#94A3B8',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </Section>

              {/* Spacer for bottom buttons */}
              <div className="h-4" />
            </div>

            {/* Footer Actions */}
            <div className="border-t p-6" style={{ borderColor: '#334155', backgroundColor: '#111827' }}>
              <div className="flex gap-3">
                <a
                  href={job.applicationLink || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="accent-gradient flex flex-1 items-center justify-center gap-2 rounded-lg py-3 text-sm font-semibold text-white transition-all duration-200"
                  style={{ boxShadow: '0 0 20px rgba(0, 201, 255, 0.2)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 201, 255, 0.35)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 201, 255, 0.2)'; }}
                >
                  <ExternalLink size={16} />
                  Apply Now
                </a>
                <Link
                  to={`/resumes?jobId=${job.id}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg border py-3 text-sm font-semibold transition-all duration-200"
                  style={{ borderColor: '#00C9FF', color: '#00C9FF', backgroundColor: 'transparent' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 201, 255, 0.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  <FileText size={16} />
                  Generate Resume
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Section component for Drawer ─── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <h4 className="mb-3 text-sm font-semibold" style={{ color: '#F5F7FA' }}>
        {title}
      </h4>
      {children}
    </div>
  );
}

/* ─── Helpers ─── */
function getSectorColor(sector: string): string {
  const colors: Record<string, string> = {
    Technology: '#00C9FF',
    Healthcare: '#22C55E',
    Finance: '#3B82F6',
    Energy: '#F59E0B',
    Education: '#8B5CF6',
    Manufacturing: '#EF4444',
    Retail: '#EC4899',
    Government: '#14B8A6',
  };
  return colors[sector] || '#94A3B8';
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

/* ─── Status Tabs ─── */
const STATUS_TABS = ['all', 'shortlisted', 'applied', 'archived'] as const;

/* ═══════════════════════════════════════════════════════════════════
   MAIN DASHBOARD PAGE
   ═══════════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [minFitScore, setMinFitScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('fitScore-desc');
  const [statusTab, setStatusTab] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [visibleCount, setVisibleCount] = useState(12);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // tRPC query - use mock data for development
  const profileId = 1;
  const jobsQuery = trpc.job.getByProfile.useQuery({ profileId });
  const statsQuery = trpc.job.stats.useQuery({ profileId });

  const jobs = useMemo(() => {
    if (jobsQuery.data && jobsQuery.data.length > 0) return jobsQuery.data;
    return generateMockJobs(100, profileId);
  }, [jobsQuery.data]);

  const stats = useMemo(() => {
    if (statsQuery.data && jobsQuery.data && jobsQuery.data.length > 0) {
      return statsQuery.data;
    }
    const total = jobs.length;
    const avgFitScore = total > 0 ? Math.round(jobs.reduce((s, j) => s + (j.fitScore ?? 0), 0) / total) : 0;
    const shortlisted = jobs.filter((j) => j.status === 'shortlisted').length;
    const sectors = new Set(jobs.map((j) => j.sectorId)).size;
    return { total, avgFitScore, shortlisted, sectors };
  }, [statsQuery.data, jobs, jobsQuery.data]);

  /* Filter + Sort */
  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Status tab
    if (statusTab !== 'all') {
      result = result.filter((j) => j.status === statusTab);
    }

    // Sector filter
    if (selectedSector !== 'all') {
      const sectorIdx = SECTORS.indexOf(selectedSector) + 1;
      result = result.filter((j) => j.sectorId === sectorIdx);
    }

    // Fit score
    if (minFitScore > 0) {
      result = result.filter((j) => (j.fitScore ?? 0) >= minFitScore);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.requirements?.toLowerCase().includes(q)
      );
    }

    // Sort
    const [sortField, sortDir] = sortBy.split('-');
    result.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortField === 'fitScore') return dir * ((a.fitScore ?? 0) - (b.fitScore ?? 0));
      if (sortField === 'title') return dir * a.title.localeCompare(b.title);
      if (sortField === 'company') return dir * a.company.localeCompare(b.company);
      if (sortField === 'deadline') return dir * ((a.deadline || '') > (b.deadline || '') ? 1 : -1);
      return dir * (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });

    return result;
  }, [jobs, statusTab, selectedSector, minFitScore, searchQuery, sortBy]);

  const visibleJobs = filteredJobs.slice(0, visibleCount);
  const hasMore = visibleCount < filteredJobs.length;

  const handleLoadMore = useCallback(() => {
    setVisibleCount((prev) => prev + 12);
  }, []);

  const handleViewJob = useCallback((job: Job) => {
    setSelectedJob(job);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedJob(null);
  }, []);

  /* ─── Export CSV ─── */
  const handleExport = () => {
    const headers = ['Title', 'Company', 'Sector', 'Location', 'Fit Score', 'Job Type', 'Experience Level', 'Salary Range', 'Deadline', 'Status'];
    const rows = filteredJobs.map((j) => [
      j.title,
      j.company,
      getSectorName(j.sectorId),
      j.location || '',
      String(j.fitScore ?? 0),
      j.jobType || '',
      j.experienceLevel || '',
      j.salaryRange || '',
      j.deadline || '',
      j.status,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '\\"')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'job-matches.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* ═══ Section 1: Page Header ═══ */}
      <div className="w-full" style={{ backgroundColor: '#0B0E14' }}>
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8" style={{ paddingTop: '48px', paddingBottom: '32px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easeOutExpo }}
          >
            <p className="font-mono text-xs font-medium tracking-widest" style={{ color: '#00C9FF' }}>
              STEP 4 OF 5
            </p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl" style={{ color: '#F5F7FA' }}>
              Your Job Opportunities
            </h1>
            <p className="mt-3 max-w-2xl text-lg" style={{ color: '#94A3B8' }}>
              We&apos;ve found <span className="font-semibold" style={{ color: '#00C9FF' }}>{stats.total}</span> roles across{' '}
              <span className="font-semibold" style={{ color: '#00C9FF' }}>{stats.sectors}</span> sectors. Each has been analyzed against your profile and scored for fit.
            </p>
          </motion.div>

          {/* Stats Ribbon */}
          <motion.div
            className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
          >
            {[
              { label: 'Total Roles', value: stats.total, icon: Briefcase, color: '#F5F7FA' },
              { label: 'Avg. Fit Score', value: `${stats.avgFitScore}%`, icon: BarChart3, color: stats.avgFitScore >= 80 ? '#22C55E' : stats.avgFitScore >= 60 ? '#3B82F6' : '#94A3B8' },
              { label: 'Sectors Covered', value: stats.sectors, icon: Layers, color: '#F5F7FA' },
              { label: 'High Priority', value: jobs.filter((j) => (j.fitScore ?? 0) >= 80).length, icon: Star, color: '#22C55E' },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeOutExpo } },
                }}
                className="flex items-center gap-3 rounded-xl border px-5 py-4"
                style={{
                  backgroundColor: '#111827',
                  borderColor: '#334155',
                  borderLeft: stat.label === 'High Priority' ? '3px solid #22C55E' : undefined,
                }}
              >
                <stat.icon size={20} style={{ color: stat.color }} />
                <div>
                  <p className="font-mono text-2xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ═══ Section 2: Controls Bar ═══ */}
      <div
        className="sticky z-40 w-full border-b"
        style={{
          top: '64px',
          backgroundColor: 'rgba(11, 14, 20, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderColor: '#334155',
        }}
      >
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="relative flex-shrink-0" style={{ width: '280px', maxWidth: '100%' }}>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#64748B' }} />
            <input
              type="text"
              placeholder="Search roles, companies, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none transition-all duration-200 focus:border-[#00C9FF]"
              style={{
                backgroundColor: '#1E293B',
                borderColor: '#334155',
                color: '#F5F7FA',
              }}
            />
          </div>

          {/* Sector Filter */}
          <div className="relative">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="appearance-none rounded-lg border py-2 pl-3 pr-8 text-sm outline-none transition-all duration-200 focus:border-[#00C9FF]"
              style={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F5F7FA' }}
            >
              <option value="all">All Sectors</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <Filter size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: '#64748B' }} />
          </div>

          {/* Fit Score Min */}
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-xs" style={{ color: '#94A3B8' }}>Min Fit:</span>
            <input
              type="range"
              min={0}
              max={100}
              value={minFitScore}
              onChange={(e) => setMinFitScore(Number(e.target.value))}
              className="h-1 w-24 cursor-pointer appearance-none rounded-full"
              style={{ backgroundColor: '#334155', accentColor: '#00C9FF' }}
            />
            <span className="w-8 font-mono text-xs font-bold" style={{ color: '#00C9FF' }}>{minFitScore}</span>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-lg border py-2 pl-3 pr-8 text-sm outline-none transition-all duration-200 focus:border-[#00C9FF]"
              style={{ backgroundColor: '#1E293B', borderColor: '#334155', color: '#F5F7FA' }}
            >
              <option value="fitScore-desc">Fit Score (High→Low)</option>
              <option value="fitScore-asc">Fit Score (Low→High)</option>
              <option value="deadline-asc">Deadline (Soonest)</option>
              <option value="company-asc">Company (A–Z)</option>
              <option value="title-asc">Title (A–Z)</option>
              <option value="createdAt-desc">Recently Added</option>
            </select>
            <ArrowUpDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" style={{ color: '#64748B' }} />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center rounded-lg border p-0.5" style={{ backgroundColor: '#1E293B', borderColor: '#334155' }}>
            {STATUS_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className="rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-all duration-200"
                style={{
                  backgroundColor: statusTab === tab ? 'rgba(0, 201, 255, 0.12)' : 'transparent',
                  color: statusTab === tab ? '#00C9FF' : '#94A3B8',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* View Toggle */}
          <div className="flex items-center rounded-lg border" style={{ borderColor: '#334155' }}>
            <button
              onClick={() => setViewMode('grid')}
              className="rounded-l-lg p-2 transition-all duration-200"
              style={{ backgroundColor: viewMode === 'grid' ? 'rgba(0, 201, 255, 0.12)' : '#1E293B', color: viewMode === 'grid' ? '#00C9FF' : '#94A3B8' }}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="rounded-r-lg p-2 transition-all duration-200"
              style={{ backgroundColor: viewMode === 'list' ? 'rgba(0, 201, 255, 0.12)' : '#1E293B', color: viewMode === 'list' ? '#00C9FF' : '#94A3B8' }}
            >
              <List size={16} />
            </button>
          </div>

          {/* Result count + Export */}
          <span className="text-xs" style={{ color: '#94A3B8' }}>
            {filteredJobs.length} results
          </span>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200"
            style={{ borderColor: '#00C9FF', color: '#00C9FF' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 201, 255, 0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* ═══ Section 3: Job Grid / List ═══ */}
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8" style={{ paddingBottom: '48px' }}>
        {filteredJobs.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24"
          >
            <div
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
              style={{ backgroundColor: '#1E293B' }}
            >
              <Search size={36} style={{ color: '#334155' }} />
            </div>
            <h3 className="text-xl font-semibold" style={{ color: '#F5F7FA' }}>
              No jobs match your filters
            </h3>
            <p className="mt-2 max-w-md text-center text-sm" style={{ color: '#94A3B8' }}>
              Try adjusting your search criteria, lowering the minimum fit score, or selecting a different sector.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedSector('all'); setMinFitScore(0); setStatusTab('all'); }}
              className="mt-6 rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #00C9FF 0%, #3B82F6 50%, #7C3AED 100%)' }}
            >
              Clear All Filters
            </button>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {visibleJobs.map((job, i) => (
                <JobCard key={job.id} job={job} index={i} onView={handleViewJob} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div layout className="flex flex-col gap-3">
            <AnimatePresence mode="popLayout">
              {visibleJobs.map((job, i) => (
                <JobListRow key={job.id} job={job} index={i} onView={handleViewJob} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={handleLoadMore}
              className="rounded-lg border px-8 py-3 text-sm font-medium transition-all duration-200"
              style={{ borderColor: '#00C9FF', color: '#00C9FF', backgroundColor: 'transparent' }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 201, 255, 0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              Load More
            </button>
            <p className="text-xs" style={{ color: '#94A3B8' }}>
              Showing {visibleJobs.length} of {filteredJobs.length}
            </p>
          </div>
        )}
      </div>

      {/* ═══ Section 4: Job Detail Drawer ═══ */}
      <AnimatePresence>
        {selectedJob && (
          <JobDetailDrawer job={selectedJob} onClose={handleCloseDrawer} />
        )}
      </AnimatePresence>
    </div>
  );
}
