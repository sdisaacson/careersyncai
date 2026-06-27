import { useMemo } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Download, ArrowLeft, ArrowRight, FileText, Sparkles } from 'lucide-react';
import { generateBarbaraJobs, generateBarbaraTailoredResumes } from '@/lib/barbaraDemo';
import type { TailoredResume } from '@/db/schema';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

function ResumeCard({ resume, index }: { resume: TailoredResume; index: number }) {
  const highlights = resume.highlights ? resume.highlights.split('\n').filter(Boolean) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: easeOutExpo }}
      className="flex flex-col rounded-2xl border p-6 transition-all duration-300"
      style={{
        backgroundColor: 'var(--midnight)',
        borderColor: 'var(--slate-700)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 201, 255, 0.3)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 201, 255, 0.06)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--slate-700)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: 'rgba(0, 201, 255, 0.1)' }}
        >
          <FileText size={20} style={{ color: 'var(--electric-blue)' }} />
        </div>
        <div>
          <h3 className="text-base font-semibold" style={{ color: 'var(--ice-white)' }}>
            {resume.content.split('\n')[0]}
          </h3>
          <p className="text-sm" style={{ color: 'var(--slate-400)' }}>
            {resume.narrativeSummary?.split(' at ')[1]?.split(' by')[0] ?? ''}
          </p>
        </div>
      </div>

      <p
        className="mt-4 line-clamp-3 text-sm leading-relaxed"
        style={{ color: 'var(--slate-400)' }}
      >
        {resume.narrativeSummary}
      </p>

      <div className="mt-4 flex-1">
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
    </motion.div>
  );
}

export default function DemoResumesPage() {
  const resumes = useMemo(() => {
    const jobs = generateBarbaraJobs(12);
    return generateBarbaraTailoredResumes(jobs);
  }, []);

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
            STEP 5 OF 5
          </p>
          <h1
            className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
            style={{ color: 'var(--ice-white)' }}
          >
            Tailored Resumes
          </h1>
          <p
            className="mt-3 max-w-[640px] text-lg leading-relaxed"
            style={{ color: 'var(--slate-400)' }}
          >
            For each top match, CareerSync restructures Barbara&apos;s resume to
            emphasize the skills and experience most relevant to the role.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: easeOutExpo }}
          className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {resumes.map((resume, i) => (
            <ResumeCard key={resume.id} resume={resume} index={i} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: easeOutExpo }}
          className="mt-12 flex flex-col-reverse items-center justify-between gap-4 sm:flex-row"
        >
          <Link
            to="/demo/results"
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
            to="/signup"
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
            Sign Up Now to Create Your Own
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
