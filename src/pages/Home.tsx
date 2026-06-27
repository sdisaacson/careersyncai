import { useRef } from 'react';
import { Link } from 'react-router';
import { motion, useInView } from 'framer-motion';
import {
  BrainCircuit,
  Search,
  FileText,
  BarChart3,
  Upload,
  MessageSquare,
  Target,
  Bot,
  FileCheck,
  CheckCircle,
  Star,
} from 'lucide-react';
import NeuralCanvas from '../components/NeuralCanvas';
import AnimatedCounter from '../components/AnimatedCounter';

/* ─────────────────── easing token ─────────────────── */
const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

/* ─────────────────── Section Wrapper ─────────────────── */
function SectionReveal({ children, className, style, delay = 0 }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-15% 0px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: easeOutExpo }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/* ════════════════════ HOME PAGE ════════════════════ */
export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeaturesSection />
      <ProcessSection />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}

/* ═══════════ SECTION 1: HERO ═══════════ */
function HeroSection() {
  return (
    <section
      className="relative min-h-[100dvh] overflow-hidden"
      style={{ backgroundColor: '#0B0E14' }}
    >
      {/* Neural Canvas Background */}
      <NeuralCanvas nodeCount={70} />

      {/* Fallback gradient behind canvas */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: 'linear-gradient(135deg, #0B0E14 0%, #111827 40%, #1E3A8A 100%)' }}
      />

      {/* Background image overlay */}
      <img
        src="/hero-neural-bg.jpg"
        alt=""
        className="pointer-events-none absolute inset-0 -z-[5] h-full w-full object-cover opacity-20"
      />

      {/* Content */}
      <div
        className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1200px] flex-col justify-center px-4 sm:px-6 lg:px-8"
        style={{ paddingLeft: 'clamp(16px, 5vw, 80px)', paddingRight: '16px' }}
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }}
          className="font-mono text-xs font-medium uppercase tracking-[0.15em]"
          style={{ color: '#00C9FF', marginBottom: '24px' }}
        >
          AI-POWERED CAREER PLATFORM
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: easeOutExpo }}
          className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-[72px]"
          style={{ color: '#F5F7FA', lineHeight: 1.05, letterSpacing: '-0.03em' }}
        >
          Your Next Career
        </motion.h1>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: easeOutExpo }}
          className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-[72px]"
          style={{ lineHeight: 1.05, letterSpacing: '-0.03em' }}
        >
          <span style={{ color: '#F5F7FA' }}>Move, Powered by </span>
          <span
            style={{
              color: '#00C9FF',
              textShadow: '0 0 40px rgba(0, 201, 255, 0.3)',
            }}
          >
            AI
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: easeOutExpo }}
          className="mt-6 max-w-[560px] text-lg"
          style={{ color: '#94A3B8', lineHeight: 1.6 }}
        >
          Upload your resume. Answer a few questions. Our AI interviews you, researches 100+ opportunities across every sector, and generates tailored applications — all in minutes.
        </motion.p>

        {/* CTA Group */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9, ease: easeOutExpo }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Link
            to="/signup"
            className="accent-gradient inline-flex items-center rounded-[10px] px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200"
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
            Sign Up Now
          </Link>
          <Link
            to="/demo"
            className="inline-flex items-center rounded-[10px] border px-7 py-3.5 text-sm font-semibold transition-all duration-200"
            style={{ borderColor: '#00C9FF', color: '#00C9FF', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 201, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            See How It Works
          </Link>
        </motion.div>

        {/* Trust Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1, ease: easeOutExpo }}
          className="mt-14 flex flex-wrap items-center gap-0"
        >
          {[
            '100+ Jobs',
            '8 Sectors',
            'Tailored Resumes',
            '2 Min Setup',
          ].map((item, i) => (
            <div key={item} className="flex items-center">
              {i > 0 && (
                <div
                  className="mx-4 hidden h-6 sm:block"
                  style={{ width: '1px', backgroundColor: '#334155' }}
                />
              )}
              <div className="flex items-center gap-2 py-2">
                <span
                  className="inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: '#00C9FF' }}
                />
                <span className="text-xs font-medium" style={{ color: '#94A3B8' }}>
                  {item}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════ SECTION 2: FEATURES ═══════════ */
const featureCards = [
  {
    icon: BrainCircuit,
    title: 'Smart Interview',
    description:
      'Our AI conducts a dynamic interview, probing your experience, preferences, and goals to build a precise candidate profile beyond what\'s on your resume.',
  },
  {
    icon: Search,
    title: 'Parallel Research',
    description:
      'We spawn specialized agents across 8 economic sectors simultaneously, each scanning job boards, company sites, and niche platforms for hidden opportunities.',
  },
  {
    icon: FileText,
    title: 'Tailored Resumes',
    description:
      'Every application gets a custom-structured resume — reorganized skills, reframed experience, and optimized keywords matched to each job description.',
  },
  {
    icon: BarChart3,
    title: 'Fit Scoring',
    description:
      'Each opportunity is scored against your profile (0–100) based on skills alignment, experience match, location, salary range, and growth potential.',
  },
];

function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' });

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: '#0B0E14', padding: '120px 0' }}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <SectionReveal>
            <p
              className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.15em]"
              style={{ color: '#00C9FF' }}
            >
              CAPABILITIES
            </p>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <h2
              className="text-4xl font-bold sm:text-5xl lg:text-[56px]"
              style={{ color: '#F5F7FA', lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              One Platform. Every Step.
            </h2>
          </SectionReveal>
          <SectionReveal delay={0.2}>
            <p
              className="mx-auto mt-4 max-w-[640px] text-lg"
              style={{ color: '#94A3B8', lineHeight: 1.6 }}
            >
              From resume upload to tailored applications — CareerSync handles the entire job search pipeline with AI precision.
            </p>
          </SectionReveal>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {featureCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12, ease: easeOutExpo }}
            >
              <FeatureCard {...card} />
            </motion.div>
          ))}
        </div>

        {/* Highlight Row */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.8, ease: easeOutExpo }}
          className="mt-12 overflow-hidden rounded-2xl border sm:flex"
          style={{ borderColor: '#334155', backgroundColor: '#1E293B' }}
        >
          <div className="sm:w-1/2">
            <img
              src="/dashboard-preview.jpg"
              alt="Dashboard Preview"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="p-8 sm:w-1/2 sm:p-12">
            <h3
              className="text-2xl font-semibold sm:text-3xl"
              style={{ color: '#F5F7FA', lineHeight: 1.2 }}
            >
              Your Complete Job Dashboard
            </h3>
            <p className="mt-4" style={{ color: '#94A3B8', lineHeight: 1.6 }}>
              See all 100+ opportunities organized by sector, priority, and fit score. Filter, sort, and compare side by side.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {['Real-time fit scoring', 'Deadline tracking', 'One-click resume generation'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3 text-sm" style={{ color: '#94A3B8' }}>
                    <CheckCircle size={16} style={{ color: '#00C9FF', flexShrink: 0 }} />
                    {item}
                  </li>
                )
              )}
            </ul>
            <Link
              to="/dashboard"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200"
              style={{ color: '#94A3B8' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#F5F7FA'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8'; }}
            >
              Explore the Dashboard →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  title: string;
  description: string;
}) {
  return (
    <div
      className="group relative rounded-2xl border p-8 transition-all duration-[350ms] ease-out"
      style={{
        borderColor: '#334155',
        backgroundColor: '#111827',
        boxShadow: '0 0 0 transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0, 201, 255, 0.3)';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 201, 255, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#334155';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 0 0 transparent';
      }}
    >
      {/* Card glow overlay */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(0, 201, 255, 0.08) 0%, transparent 60%)',
        }}
      />
      {/* Icon */}
      <div
        className="accent-gradient flex h-12 w-12 items-center justify-center rounded-xl"
      >
        <Icon size={24} style={{ color: '#FFFFFF' }} />
      </div>
      {/* Title */}
      <h3
        className="mt-5 text-2xl font-semibold"
        style={{ color: '#F5F7FA', lineHeight: 1.3 }}
      >
        {title}
      </h3>
      {/* Description */}
      <p className="mt-3" style={{ color: '#94A3B8', lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
}

/* ═══════════ SECTION 3: PROCESS ═══════════ */
const processSteps = [
  {
    icon: Upload,
    title: 'Upload Your Resume',
    description:
      'Drag and drop your resume. Our AI parses your experience, skills, education, and achievements into a structured profile.',
  },
  {
    icon: MessageSquare,
    title: 'AI Interview',
    description:
      'Answer a series of smart, adaptive questions. The AI digs deeper where it matters, refining its understanding of your ideal role.',
  },
  {
    icon: Target,
    title: 'Define Your Search',
    description:
      'Specify geographic area, salary expectations, role types, and any sectors to prioritize or exclude.',
  },
  {
    icon: Bot,
    title: 'Parallel Agent Research',
    description:
      '8 specialized agents fan out across sectors — Tech, Healthcare, Finance, Energy, Education, Manufacturing, Retail, Government — finding up to 100 roles.',
  },
  {
    icon: FileCheck,
    title: 'Get Tailored Applications',
    description:
      'Receive a complete package: a structured data sheet of all opportunities, fit scores, and 100 individually tailored resume PDFs ready to submit.',
  },
];

function ProcessSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' });

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: '#0B0E14', padding: '120px 0' }}
    >
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <SectionReveal>
            <p
              className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.15em]"
              style={{ color: '#00C9FF' }}
            >
              THE PROCESS
            </p>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <h2
              className="text-4xl font-bold sm:text-5xl lg:text-[56px]"
              style={{ color: '#F5F7FA', lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              From Resume to Applications in 5 Steps
            </h2>
          </SectionReveal>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Central vertical line */}
          <div
            className="absolute left-4 top-0 bottom-0 w-[2px] sm:left-1/2 sm:-ml-[1px]"
            style={{ backgroundColor: '#334155', borderStyle: 'dashed' }}
          />

          {processSteps.map((step, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12, ease: easeOutExpo }}
                className={`relative mb-12 flex items-center last:mb-0 ${
                  isLeft ? 'sm:flex-row' : 'sm:flex-row-reverse'
                }`}
              >
                {/* Card */}
                <div
                  className={`ml-12 rounded-[20px] border p-6 sm:ml-0 sm:w-[calc(50%-24px)] sm:p-8 ${
                    isLeft ? 'sm:mr-12' : 'sm:ml-12'
                  }`}
                  style={{
                    borderColor: '#334155',
                    backgroundColor: '#1E293B',
                  }}
                >
                  {/* Step number watermark */}
                  <span
                    className="pointer-events-none absolute font-mono text-[48px] font-bold leading-none opacity-30"
                    style={{
                      color: '#00C9FF',
                      top: '8px',
                      ...(isLeft ? { right: '16px' } : { left: '16px' }),
                    }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="relative z-10">
                    <step.icon size={40} style={{ color: '#00C9FF' }} />
                    <h3
                      className="mt-4 text-xl font-semibold sm:text-2xl"
                      style={{ color: '#F5F7FA', lineHeight: 1.3 }}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-3" style={{ color: '#94A3B8', lineHeight: 1.6 }}>
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Center dot */}
                <div
                  className="absolute left-4 hidden h-4 w-4 -translate-x-1/2 rounded-full border-2 sm:left-1/2 sm:block"
                  style={{
                    borderColor: '#00C9FF',
                    backgroundColor: '#0B0E14',
                  }}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════ SECTION 4: STATS ═══════════ */
const statsData = [
  { value: 100, suffix: '+', label: 'Per Search', key: 'Jobs Found' },
  { value: 8, suffix: '', label: 'Economic Verticals', key: 'Sectors' },
  { value: 100, suffix: '', label: 'Tailored PDFs', key: 'Resumes Generated' },
  { value: 40, suffix: '+', label: 'Hours Per Run', key: 'Time Saved' },
];

function StatsSection() {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #1E3A8A 0%, #111827 100%)',
        padding: '80px 0',
      }}
    >
      <div className="mx-auto flex max-w-[1000px] flex-wrap items-center justify-center gap-8 px-4 sm:gap-0 sm:px-6 lg:px-8">
        {statsData.map((stat, i) => (
          <div key={stat.key} className="flex items-center">
            <div className="px-6 text-center sm:px-12">
              <AnimatedCounter
                target={stat.value}
                suffix={stat.suffix}
                className="block text-4xl font-bold sm:text-5xl lg:text-[56px]"
                style={{
                  color: '#F5F7FA',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                  fontFamily: 'Inter, system-ui, sans-serif',
                }}
              />
              <p
                className="mt-2 text-xs font-medium uppercase tracking-wider"
                style={{ color: '#94A3B8' }}
              >
                {stat.key}
              </p>
              <p className="mt-1 text-xs" style={{ color: '#64748B' }}>
                {stat.label}
              </p>
            </div>
            {i < statsData.length - 1 && (
              <div
                className="hidden h-16 sm:block"
                style={{ width: '1px', backgroundColor: '#334155' }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════ SECTION 5: TESTIMONIALS ═══════════ */
const testimonials = [
  {
    quote:
      'CareerSync found 87 relevant positions I never would have discovered on my own. The tailored resumes got me callbacks from 12 companies.',
    name: 'Sarah K.',
    role: 'Data Scientist',
  },
  {
    quote:
      'I went from scattered job boards to a complete application pipeline in under an hour. The fit scores were surprisingly accurate.',
    name: 'Marcus T.',
    role: 'Product Manager',
  },
  {
    quote:
      'The AI interview actually understood my research background and found niche academic-industry bridge roles I didn\'t know existed.',
    name: 'Dr. Priya R.',
    role: 'Biotech Researcher',
  },
];

function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-15% 0px' });

  return (
    <section
      ref={sectionRef}
      style={{ backgroundColor: '#0B0E14', padding: '120px 0' }}
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <SectionReveal>
            <p
              className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.15em]"
              style={{ color: '#00C9FF' }}
            >
              TESTIMONIALS
            </p>
          </SectionReveal>
          <SectionReveal delay={0.1}>
            <h2
              className="text-4xl font-bold sm:text-5xl lg:text-[56px]"
              style={{ color: '#F5F7FA', lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              Real Results, Real Careers
            </h2>
          </SectionReveal>
        </div>

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15, ease: easeOutExpo }}
              className="relative rounded-2xl border p-8"
              style={{
                borderColor: '#334155',
                backgroundColor: '#111827',
              }}
            >
              {/* Quote mark */}
              <span
                className="absolute left-6 top-4 font-serif text-[48px] leading-none"
                style={{ color: '#00C9FF' }}
              >
                &ldquo;
              </span>

              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={14} fill="#00C9FF" style={{ color: '#00C9FF' }} />
                ))}
              </div>

              {/* Quote */}
              <p className="italic" style={{ color: '#F5F7FA', lineHeight: 1.6 }}>
                {t.quote}
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #00C9FF 0%, #7C3AED 100%)',
                    color: '#FFFFFF',
                  }}
                >
                  {t.name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#F5F7FA' }}>
                    {t.name}
                  </p>
                  <p className="text-xs" style={{ color: '#94A3B8' }}>
                    {t.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════ SECTION 6: CTA ═══════════ */
function CTASection() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: '#0B0E14', padding: '160px 0' }}
    >
      {/* Lighter neural canvas background */}
      <div className="absolute inset-0 opacity-40">
        <NeuralCanvas nodeCount={30} />
      </div>

      <div className="relative z-10 mx-auto max-w-[700px] px-4 text-center sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="text-4xl font-bold sm:text-5xl lg:text-[56px]"
          style={{ color: '#F5F7FA', lineHeight: 1.1, letterSpacing: '-0.02em' }}
        >
          Ready to Find Your Next Role?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: easeOutExpo }}
          className="mx-auto mt-6 max-w-[500px] text-lg"
          style={{ color: '#94A3B8', lineHeight: 1.6 }}
        >
          Upload your resume and let our AI do the rest. Plans start at $9/mo after a 7-day free trial.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.6, delay: 0.4, ease: easeOutExpo }}
          className="mt-10"
        >
          <Link
            to="/signup"
            className="accent-gradient inline-flex items-center rounded-xl px-10 py-4 text-base font-semibold text-white transition-all duration-200"
            style={{ boxShadow: '0 0 30px rgba(0, 201, 255, 0.25)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 0 40px rgba(0, 201, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 201, 255, 0.25)';
            }}
          >
            Sign Up Now
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-4 text-xs"
          style={{ color: '#64748B' }}
        >
          7-day free trial. Cancel anytime.
        </motion.p>
      </div>
    </section>
  );
}
