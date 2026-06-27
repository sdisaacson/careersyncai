import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  Calendar,
  Briefcase,
  Globe,
  FileText,
  Sparkles,
  Download,
  CheckCircle2,
  Plus,
  Check,
} from 'lucide-react';
import { generateBarbaraJobs, generateBarbaraTailoredResumes } from '@/lib/barbaraDemo';
import type { Job, TailoredResume } from '@/db/schema';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

function FitScoreBadge({ score }: { score: number | null | undefined }) {
  const value = score ?? 0;
  const high = value >= 85;
  return (
    <span
      className="rounded-full px-2.5 py-0.5 text-xs font-bold"
      style={{
        backgroundColor: high ? 'rgba(0, 201, 255, 0.15)' : 'rgba(59, 130, 246, 0.15)',
        color: high ? 'var(--electric-blue)' : '#3B82F6',
        fontFamily: 'JetBrains Mono, monospace',
      }}
    >
      {value}%
    </span>
  );
}

function ResumePanel({ resume }: { resume: TailoredResume }) {
  const highlights = resume.highlights ? resume.highlights.split('\n').filter(Boolean) : [];

  return (
    <div
      className="rounded-xl border p-5 sm:p-6"
      style={{
        backgroundColor: 'rgba(0, 201, 255, 0.05)',
        borderColor: 'rgba(0, 201, 255, 0.25)',
      }}
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: 'rgba(0, 201, 255, 0.12)' }}
        >
          <FileText size={20} style={{ color: 'var(--electric-blue)' }} />
        </div>
        <div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--ice-white)' }}>
            Tailored Resume
          </h3>
          <p className="text-sm" style={{ color: 'var(--slate-400)' }}>
            Customized for this role
          </p>
        </div>
      </div>

      <p
        className="text-sm leading-relaxed"
        style={{ color: 'var(--slate-300)' }}
      >
        {resume.narrativeSummary}
      </p>

      <div className="mt-4">
        <p
          className="mb-2 text-xs font-medium uppercase tracking-wider"
          style={{ color: 'var(--slate-500)' }}
        >
          Highlights
        </p>
        <ul className="space-y-2">
          {highlights.slice(0, 4).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--slate-400)' }}>
              <Sparkles size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--electric-blue)' }} />
              {item.replace(/^- /, '')}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() => window.alert('Demo download')}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all duration-200"
        style={{
          borderColor: 'var(--electric-blue)',
          color: 'var(--electric-blue)',
          backgroundColor: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 201, 255, 0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <Download size={16} />
        Download Sample
      </button>
    </div>
  );
}

function JobCard({
  job,
  index,
  isSelected,
  onToggle,
  resume,
  isRequested,
  onRequestToggle,
}: {
  job: Job;
  index: number;
  isSelected: boolean;
  onToggle: () => void;
  resume?: TailoredResume;
  isRequested: boolean;
  onRequestToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: easeOutExpo }}
      className="rounded-xl border transition-all duration-300"
      style={{
        backgroundColor: 'var(--midnight)',
        borderColor: isSelected ? 'rgba(0, 201, 255, 0.4)' : 'var(--slate-700)',
        boxShadow: isSelected ? '0 12px 40px rgba(0, 201, 255, 0.08)' : 'none',
      }}
    >
      <button
        onClick={onToggle}
        className="w-full p-5 text-left"
        style={{ backgroundColor: 'transparent' }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold"
              style={{ backgroundColor: 'var(--slate-700)', color: 'var(--ice-white)' }}
            >
              {job.company.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3
                className="text-base font-semibold leading-snug"
                style={{ color: 'var(--ice-white)' }}
              >
                {job.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--slate-400)' }}>
                {job.company}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isRequested && (
              <span
                className="hidden rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider sm:inline"
                style={{
                  backgroundColor: 'rgba(0, 201, 255, 0.12)',
                  color: 'var(--electric-blue)',
                }}
              >
                Queued
              </span>
            )}
            <FitScoreBadge score={job.fitScore} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--slate-400)' }}>
          {job.location && (
            <span className="flex items-center gap-1">
              <MapPin size={12} />
              {job.location}
            </span>
          )}
          {job.salaryRange && (
            <span className="flex items-center gap-1">
              <DollarSign size={12} />
              {job.salaryRange}
            </span>
          )}
          {job.jobType && (
            <span className="flex items-center gap-1">
              <Briefcase size={12} />
              {job.jobType}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p
            className="line-clamp-2 flex-1 pr-4 text-sm leading-relaxed"
            style={{ color: 'var(--slate-400)' }}
          >
            {job.matchReasons}
          </p>
          <motion.div
            animate={{ rotate: isSelected ? 180 : 0 }}
            transition={{ duration: 0.3, ease: easeOutExpo }}
          >
            <ChevronDown size={18} style={{ color: 'var(--electric-blue)' }} />
          </motion.div>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isSelected && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: easeOutExpo }}
            className="overflow-hidden"
          >
            <div
              className="border-t px-5 pb-5 pt-4 sm:px-6"
              style={{ borderColor: 'var(--slate-700)' }}
            >
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Job details */}
                <div className="space-y-5">
                  <div>
                    <h4
                      className="mb-2 text-xs font-medium uppercase tracking-wider"
                      style={{ color: 'var(--slate-500)' }}
                    >
                      Why this matches Barbara
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--slate-300)' }}>
                      {job.matchReasons}
                    </p>
                  </div>

                  <div>
                    <h4
                      className="mb-2 text-xs font-medium uppercase tracking-wider"
                      style={{ color: 'var(--slate-500)' }}
                    >
                      About the role
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--slate-300)' }}>
                      {job.jobDescription}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <h4
                        className="mb-1 text-xs font-medium uppercase tracking-wider"
                        style={{ color: 'var(--slate-500)' }}
                      >
                        Requirements
                      </h4>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--slate-300)' }}>
                        {job.requirements}
                      </p>
                    </div>
                    <div>
                      <h4
                        className="mb-1 text-xs font-medium uppercase tracking-wider"
                        style={{ color: 'var(--slate-500)' }}
                      >
                        Responsibilities
                      </h4>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--slate-300)' }}>
                        {job.responsibilities}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs" style={{ color: 'var(--slate-400)' }}>
                    {job.deadline && (
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        Apply by {job.deadline}
                      </span>
                    )}
                    {job.source && (
                      <span className="flex items-center gap-1">
                        <Globe size={12} />
                        Found on {job.source}
                      </span>
                    )}
                    {job.experienceLevel && (
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        {job.experienceLevel}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRequestToggle();
                    }}
                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all duration-200"
                    style={{
                      backgroundColor: isRequested
                        ? 'rgba(0, 201, 255, 0.15)'
                        : 'var(--electric-blue)',
                      color: isRequested ? 'var(--electric-blue)' : '#0B0E14',
                      border: isRequested
                        ? '1px solid rgba(0, 201, 255, 0.35)'
                        : '1px solid var(--electric-blue)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isRequested) {
                        e.currentTarget.style.transform = 'scale(1.02)';
                        e.currentTarget.style.boxShadow = '0 0 24px rgba(0, 201, 255, 0.35)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {isRequested ? (
                      <>
                        <Check size={16} />
                        Queued for tailored resume
                      </>
                    ) : (
                      <>
                        <Plus size={16} />
                        Request tailored resume
                      </>
                    )}
                  </button>
                </div>

                {/* Resume panel */}
                {resume ? (
                  <ResumePanel resume={resume} />
                ) : (
                  <div
                    className="flex flex-col items-center justify-center rounded-xl border p-6 text-center"
                    style={{
                      backgroundColor: 'rgba(30, 41, 59, 0.40)',
                      borderColor: 'var(--slate-700)',
                    }}
                  >
                    <FileText size={32} style={{ color: 'var(--slate-500)' }} />
                    <p className="mt-3 text-sm font-medium" style={{ color: 'var(--slate-400)' }}>
                      Tailored resume available for top 5 matches
                    </p>
                    <p className="mt-1 text-xs" style={{ color: 'var(--slate-500)' }}>
                      This role is outside the priority set, but still a great opportunity.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function DemoResultsPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [requestedIds, setRequestedIds] = useState<Set<number>>(new Set());
  const jobs = useMemo(() => generateBarbaraJobs(12), []);
  const resumes = useMemo(() => generateBarbaraTailoredResumes(jobs), [jobs]);
  const resumeByJobId = useMemo(() => {
    const map = new Map<number, TailoredResume>();
    for (const resume of resumes) {
      map.set(resume.jobId, resume);
    }
    return map;
  }, [resumes]);

  const toggleRequest = (jobId: number) => {
    setRequestedIds((prev) => {
      const next = new Set(prev);
      if (next.has(jobId)) {
        next.delete(jobId);
      } else {
        next.add(jobId);
      }
      return next;
    });
  };

  return (
    <div
      className="min-h-[100dvh] w-full"
      style={{ backgroundColor: 'var(--deep-navy)' }}
    >
      <section className="mx-auto max-w-[1200px] px-4 pt-16 pb-12 sm:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
        >
          <p
            className="text-xs font-medium tracking-[0.15em]"
            style={{ color: 'var(--electric-blue)', fontFamily: 'JetBrains Mono, monospace' }}
          >
            STEP 4 OF 5
          </p>
          <h1
            className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ color: 'var(--ice-white)' }}
          >
            Barbara&apos;s Top Matches
          </h1>
          <p
            className="mt-3 max-w-[640px] text-lg leading-relaxed"
            style={{ color: 'var(--slate-400)' }}
          >
            CareerSync analyzed Barbara&apos;s profile and found these 12 roles across
            museums, galleries, education, and arts organizations. Select a role to see
            the full details, then click <strong>Request tailored resume</strong> to add
            it to your queue. The number of tailored resumes you can generate depends on
            the plan you choose.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: easeOutExpo }}
          className="mt-8 space-y-4"
        >
          {jobs.map((job, i) => (
            <JobCard
              key={job.id}
              job={job}
              index={i}
              isSelected={selectedId === job.id}
              onToggle={() => setSelectedId(selectedId === job.id ? null : job.id)}
              resume={resumeByJobId.get(job.id)}
              isRequested={requestedIds.has(job.id)}
              onRequestToggle={() => toggleRequest(job.id)}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: easeOutExpo }}
          className="mt-10 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row"
        >
          <Link
            to="/demo/research"
            className="flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-all duration-200"
            style={{
              borderColor: 'var(--slate-700)',
              color: 'var(--slate-400)',
              backgroundColor: 'transparent',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--electric-blue)';
              e.currentTarget.style.color = 'var(--electric-blue)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--slate-700)';
              e.currentTarget.style.color = 'var(--slate-400)';
            }}
          >
            <ArrowLeft size={16} />
            Back
          </Link>

          <Link
            to="/demo/resumes"
            className="accent-gradient flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200"
            style={{ boxShadow: '0 0 20px rgba(0, 201, 255, 0.2)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 201, 255, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 201, 255, 0.2)';
            }}
          >
            View All Tailored Resumes
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
