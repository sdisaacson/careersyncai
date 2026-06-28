import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  X,
  CheckCircle,
  Lightbulb,
  ChevronDown,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { trpc } from '@/lib/trpc.tsx';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ExtractedProfile {
  name: string;
  experience: string;
  education: string;
  skills: string;
}

interface ParsedResume {
  filename: string;
  size: number;
  text: string;
  profile: ExtractedProfile;
}

type UploadState = 'idle' | 'dragover' | 'uploading' | 'parsed' | 'error';

const ACCEPTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

/* ------------------------------------------------------------------ */
/*  Mock profile extraction (client-side text → structured data)       */
/* ------------------------------------------------------------------ */

function extractProfileFromText(text: string): ExtractedProfile {
  const lines = text.split(/\n|\r/).filter((l) => l.trim().length > 0);

  const fullText = text.toLowerCase();

  const eduKeywords = ['b.s.', 'b.a.', 'm.s.', 'm.a.', 'ph.d', 'bachelor', 'master', 'university', 'college', 'degree'];
  const eduLines = lines.filter((l) =>
    eduKeywords.some((k) => l.toLowerCase().includes(k))
  );

  const expKeywords = ['experience', 'work', 'engineer', 'manager', 'analyst', 'developer', 'senior', 'lead', 'director'];
  const expLines = lines.filter((l) =>
    expKeywords.some((k) => l.toLowerCase().includes(k))
  );

  const commonSkills = ['python', 'javascript', 'typescript', 'react', 'node', 'sql', 'aws', 'docker', 'kubernetes', 'machine learning', 'data analysis', 'project management', 'tableau', 'excel', 'java', 'go', 'rust', 'cpp', 'c++', 'html', 'css', 'git', 'linux', 'agile', 'scrum'];
  const foundSkills = commonSkills.filter((s) => fullText.includes(s));

  const nameLine = lines[0]?.trim() ?? 'Unknown';
  const nameCandidate = nameLine.length < 50 && !nameLine.toLowerCase().includes('resume') ? nameLine : 'Candidate';

  return {
    name: nameCandidate,
    experience: expLines.slice(0, 3).join('; ') || 'Experience data extracted from resume',
    education: eduLines.slice(0, 2).join('; ') || 'Education data extracted from resume',
    skills: foundSkills.length > 0 ? foundSkills.join(', ') : 'Skills extracted from resume',
  };
}

/* ------------------------------------------------------------------ */
/*  PDF text extraction — lightweight client-side                      */
/* ------------------------------------------------------------------ */

async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();

    const pdf = await pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: unknown) => {
          if (typeof item === 'object' && item !== null && 'str' in item) {
            return (item as { str: string }).str;
          }
          return '';
        })
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();
  } catch {
    // Fallback: decode raw bytes as best-effort
    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(arrayBuffer);
    return text
      .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 8000);
  }
}

/* ------------------------------------------------------------------ */
/*  DOCX text extraction                                               */
/* ------------------------------------------------------------------ */

async function extractTextFromDOCX(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const mammoth = await import('mammoth');
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch {
    const decoder = new TextDecoder('utf-8');
    return decoder.decode(arrayBuffer).slice(0, 8000);
  }
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [progress, setProgress] = useState(0);
  const [parsed, setParsed] = useState<ParsedResume | null>(null);
  const [tipsOpen, setTipsOpen] = useState(false);

  const createProfile = trpc.profile.create.useMutation({
    onSuccess: () => {
      navigate('/interview');
    },
  });

  /* ---- drag & drop ------------------------------------------------ */

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploadState === 'idle' || uploadState === 'error') {
      setUploadState('dragover');
    }
  }, [uploadState]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (uploadState === 'dragover') {
      setUploadState('idle');
    }
  }, [uploadState]);

  const processFile = async (file: File) => {
    setErrorMsg('');

    if (!ACCEPTED_TYPES.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
      setUploadState('error');
      setErrorMsg('Invalid file type. Please upload a PDF or DOCX file.');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setUploadState('error');
      setErrorMsg(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }

    setUploadState('uploading');
    setProgress(0);

    // Animate progress 0 → 100 over ~2s
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    // Read + parse file
    try {
      const arrayBuffer = await file.arrayBuffer();
      let text = '';

      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        text = await extractTextFromPDF(arrayBuffer);
      } else {
        text = await extractTextFromDOCX(arrayBuffer);
      }

      const profile = extractProfileFromText(text);

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setParsed({
          filename: file.name,
          size: file.size,
          text,
          profile,
        });
        setUploadState('parsed');
      }, 400);
    } catch {
      clearInterval(progressInterval);
      setUploadState('error');
      setErrorMsg('Failed to parse the file. Please try again with a different file.');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (uploadState === 'uploading' || uploadState === 'parsed') return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      void processFile(files[0]);
    } else {
      setUploadState('idle');
    }
  }, [uploadState]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void processFile(file);
    }
  };

  const handleRemove = () => {
    setParsed(null);
    setUploadState('idle');
    setProgress(0);
    setErrorMsg('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleContinue = () => {
    if (!parsed) return;
    createProfile.mutate({
      userId: 1, // demo user
      fullName: parsed.profile.name,
      skills: parsed.profile.skills,
      education: parsed.profile.education,
      experience: parsed.profile.experience,
      resumeText: parsed.text,
      resumeUrl: parsed.filename,
    });
  };

  /* ---- animations -------------------------------------------------- */

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
    }),
  };

  /* ---- step labels for progress bar -------------------------------- */

  const steps = ['Upload', 'Interview', 'Research', 'Results', 'Resumes'];

  /* ---- format file size -------------------------------------------- */

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  /* ------------------------------------------------------------------ */

  return (
    <div
      className="min-h-[100dvh] w-full"
      style={{ backgroundColor: 'var(--deep-navy)' }}
    >
      {/* ======================== HEADER ======================== */}
      <section className="mx-auto max-w-[800px] px-4 pt-16 pb-12 sm:pt-20 sm:pb-12">
        {/* Eyebrow */}
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-xs font-medium tracking-[0.15em]"
          style={{ color: 'var(--electric-blue)', fontFamily: 'JetBrains Mono, monospace' }}
        >
          STEP 1 OF 5
        </motion.p>

        {/* Heading */}
        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
          style={{ color: 'var(--ice-white)' }}
        >
          Upload Your Resume
        </motion.h1>

        {/* Subtext */}
        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-3 max-w-[560px] text-lg leading-relaxed"
          style={{ color: 'var(--slate-400)' }}
        >
          We&apos;ll scan your resume to understand your skills, experience, and education.
          Then our AI will ask a few clarifying questions.
        </motion.p>

        {/* Progress Bar */}
        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-8"
        >
          <div className="flex items-center justify-between gap-2">
            {steps.map((label, i) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-500"
                  style={{
                    backgroundColor: i === 0 ? 'var(--electric-blue)' : 'var(--slate-700)',
                    color: i === 0 ? '#0B0E14' : 'var(--slate-400)',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  {i === 0 ? '1' : i + 1}
                </div>
                <span
                  className="hidden text-xs sm:inline"
                  style={{
                    color: i === 0 ? 'var(--electric-blue)' : 'var(--slate-400)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '11px',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          {/* Progress track */}
          <div
            className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: 'var(--slate-700)' }}
          >
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full progress-gradient"
              initial={{ width: '0%' }}
              animate={{ width: '20%' }}
              transition={{ delay: 0.4, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            />
          </div>
        </motion.div>
      </section>

      {/* ======================== UPLOAD ZONE ======================== */}
      <section className="mx-auto max-w-[720px] px-4">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="hidden"
          onChange={handleFileInput}
        />

        <AnimatePresence mode="wait">
          {/* ---- IDLE / DRAGOVER STATE ---- */}
          {(uploadState === 'idle' || uploadState === 'dragover' || uploadState === 'error') && (
            <motion.div
              key="upload-zone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            >
              {/* Upload Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl transition-all duration-300"
                style={{
                  minHeight: '320px',
                  border:
                    uploadState === 'dragover'
                      ? '2px dashed var(--electric-blue)'
                      : '2px dashed var(--slate-600)',
                  backgroundColor:
                    uploadState === 'dragover'
                      ? 'rgba(0, 201, 255, 0.05)'
                      : 'rgba(30, 58, 138, 0.05)',
                  transform: uploadState === 'dragover' ? 'scale(1.01)' : 'scale(1)',
                  boxShadow:
                    uploadState === 'dragover'
                      ? '0 0 30px rgba(0, 201, 255, 0.1)'
                      : 'none',
                }}
              >
                <UploadCloud
                  size={48}
                  style={{
                    color: uploadState === 'dragover' ? 'var(--electric-blue)' : 'var(--slate-400)',
                    transition: 'color 0.3s ease',
                  }}
                />
                <p
                  className="mt-4 text-center text-lg"
                  style={{ color: 'var(--slate-400)' }}
                >
                  Drop your resume here, or click to browse
                </p>
                <p
                  className="mt-2 text-center text-sm"
                  style={{ color: 'var(--slate-500)' }}
                >
                  Supports PDF, DOCX — up to 10MB
                </p>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4 flex items-center gap-2 rounded-lg px-4 py-3 text-sm"
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: '#EF4444',
                      border: '1px solid #EF4444',
                    }}
                  >
                    <X size={16} />
                    {errorMsg}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom row */}
              <div className="mt-6 flex items-center justify-center gap-2 text-sm">
                <span style={{ color: 'var(--slate-500)' }}>Don&apos;t have a resume?</span>
                <button
                  className="transition-colors duration-200 hover:underline"
                  style={{ color: 'var(--electric-blue)' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    // Would open resume builder in full app
                  }}
                >
                  Build one with our template →
                </button>
              </div>
            </motion.div>
          )}

          {/* ---- UPLOADING STATE ---- */}
          {uploadState === 'uploading' && (
            <motion.div
              key="uploading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center rounded-2xl px-6 py-16"
              style={{
                backgroundColor: 'var(--midnight)',
                border: '1px solid var(--slate-700)',
              }}
            >
              <Loader2
                size={40}
                className="animate-spin"
                style={{ color: 'var(--electric-blue)' }}
              />
              <p className="mt-4 text-base" style={{ color: 'var(--ice-white)' }}>
                Uploading...
              </p>
              <div
                className="relative mt-4 h-2 w-full max-w-[320px] overflow-hidden rounded-full"
                style={{ backgroundColor: 'var(--slate-700)' }}
              >
                <motion.div
                  className="absolute left-0 top-0 h-full rounded-full progress-gradient"
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.2 }}
                />
              </div>
              <p className="mt-3 text-sm" style={{ color: 'var(--slate-400)' }}>
                Parsing your resume...
              </p>
            </motion.div>
          )}

          {/* ---- PARSED STATE ---- */}
          {uploadState === 'parsed' && parsed && (
            <motion.div
              key="parsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* File Card */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="flex items-center gap-4 rounded-xl px-5 py-4"
                style={{
                  backgroundColor: 'var(--midnight)',
                  border: '1px solid var(--slate-700)',
                }}
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: 'rgba(0, 201, 255, 0.1)' }}
                >
                  <FileText size={24} style={{ color: 'var(--electric-blue)' }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium" style={{ color: 'var(--ice-white)' }}>
                    {parsed.filename}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--slate-400)' }}>
                    {formatSize(parsed.size)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.15)',
                      color: '#22C55E',
                    }}
                  >
                    <CheckCircle size={12} />
                    Parsed
                  </span>
                  <button
                    onClick={handleRemove}
                    className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-200"
                    style={{ color: 'var(--slate-500)' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = '#EF4444'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--slate-500)'; }}
                  >
                    <X size={18} />
                  </button>
                </div>
              </motion.div>

              {/* Extracted Profile Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="mt-6 rounded-2xl p-6 sm:p-8"
                style={{
                  backgroundColor: 'var(--slate-800)',
                  border: '1px solid var(--slate-700)',
                }}
              >
                {/* Header */}
                <div className="mb-6 flex items-center gap-2">
                  <Sparkles size={20} style={{ color: 'var(--electric-blue)' }} />
                  <h3
                    className="text-xl font-semibold"
                    style={{ color: 'var(--ice-white)' }}
                  >
                    Extracted Profile
                  </h3>
                </div>

                {/* 2×2 Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Name */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="rounded-xl p-4"
                    style={{ backgroundColor: 'var(--midnight)' }}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <User size={14} style={{ color: 'var(--slate-400)' }} />
                      <span
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: 'var(--slate-400)' }}
                      >
                        Full Name
                      </span>
                    </div>
                    <p className="mt-1 text-sm" style={{ color: 'var(--ice-white)' }}>
                      {parsed.profile.name}
                    </p>
                  </motion.div>

                  {/* Experience */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.4 }}
                    className="rounded-xl p-4"
                    style={{ backgroundColor: 'var(--midnight)' }}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <Briefcase size={14} style={{ color: 'var(--slate-400)' }} />
                      <span
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: 'var(--slate-400)' }}
                      >
                        Experience
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--ice-white)' }}>
                      {parsed.profile.experience}
                    </p>
                  </motion.div>

                  {/* Education */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4 }}
                    className="rounded-xl p-4"
                    style={{ backgroundColor: 'var(--midnight)' }}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <GraduationCap size={14} style={{ color: 'var(--slate-400)' }} />
                      <span
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: 'var(--slate-400)' }}
                      >
                        Education
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--ice-white)' }}>
                      {parsed.profile.education}
                    </p>
                  </motion.div>

                  {/* Skills */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75, duration: 0.4 }}
                    className="rounded-xl p-4"
                    style={{ backgroundColor: 'var(--midnight)' }}
                  >
                    <div className="mb-1 flex items-center gap-2">
                      <Wrench size={14} style={{ color: 'var(--slate-400)' }} />
                      <span
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: 'var(--slate-400)' }}
                      >
                        Skills
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {parsed.profile.skills.split(',').slice(0, 8).map((skill) => (
                        <span
                          key={skill.trim()}
                          className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                          style={{
                            backgroundColor: 'rgba(0, 201, 255, 0.1)',
                            color: 'var(--electric-blue)',
                          }}
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Review note */}
                <p className="mt-5 text-sm" style={{ color: 'var(--slate-400)' }}>
                  Review your extracted information above. You can edit details in the next step.
                </p>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                  className="mt-8 flex flex-col-reverse items-center justify-end gap-3 sm:flex-row"
                >
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full rounded-lg border px-5 py-2.5 text-sm font-medium transition-all duration-200 sm:w-auto"
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
                    Re-upload
                  </button>
                  <button
                    onClick={handleContinue}
                    disabled={createProfile.isPending}
                    className="accent-gradient flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg sm:w-auto"
                    style={{
                      boxShadow: '0 0 20px rgba(0, 201, 255, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 201, 255, 0.35)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 201, 255, 0.2)';
                    }}
                  >
                    {createProfile.isPending ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        Continue to Interview
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ======================== TIPS SECTION ======================== */}
      <section className="mx-auto mb-20 mt-12 max-w-[720px] px-4">
        <div
          className="overflow-hidden rounded-2xl"
          style={{
            backgroundColor: 'var(--slate-800)',
            border: '1px solid var(--slate-700)',
          }}
        >
          {/* Header */}
          <button
            onClick={() => setTipsOpen(!tipsOpen)}
            className="flex w-full items-center justify-between px-5 py-4 transition-colors duration-200 hover:bg-white/[0.02]"
          >
            <div className="flex items-center gap-3">
              <Lightbulb size={20} style={{ color: 'var(--electric-blue)' }} />
              <h4
                className="text-base font-semibold"
                style={{ color: 'var(--ice-white)' }}
              >
                Tips for Best Results
              </h4>
            </div>
            <motion.div
              animate={{ rotate: tipsOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown size={20} style={{ color: 'var(--slate-400)' }} />
            </motion.div>
          </button>

          {/* Expandable Content */}
          <AnimatePresence>
            {tipsOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                className="overflow-hidden"
              >
                <ul className="space-y-3 px-5 pb-5">
                  {[
                    'Use a standard format — single-column layouts parse most accurately',
                    'Include specific metrics and achievements (e.g., "increased revenue by 25%")',
                    'List all relevant tools, languages, and certifications',
                    'Ensure contact information is current',
                    'PDF format recommended for best parsing accuracy',
                  ].map((tip, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm leading-relaxed"
                      style={{ color: 'var(--slate-400)' }}
                    >
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: 'var(--electric-blue)' }}
                      />
                      {tip}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
