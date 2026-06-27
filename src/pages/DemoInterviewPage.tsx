import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Target,
  Zap,
  Grid3x3,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  Briefcase,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Compass,
  Wallet,
} from 'lucide-react';
import { BARBARA_INTERVIEW_ANSWERS } from '@/lib/barbaraDemo';

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const steps = ['Upload', 'Interview', 'Research', 'Results', 'Resumes'];

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type AnswerType = 'text' | 'single' | 'multi' | 'scale' | 'location';

interface Question {
  id: number;
  category: string;
  text: string;
  hint: string;
  type: AnswerType;
  options?: string[];
  scaleLabels?: [string, string];
  icon: React.ReactNode;
}

interface AnswerState {
  [questionId: number]: string;
}

/* ------------------------------------------------------------------ */
/*  Question data                                                      */
/* ------------------------------------------------------------------ */

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'career-goals',
    text: 'What are your short-term and long-term career goals?',
    hint: 'This helps us align opportunities with your growth trajectory.',
    type: 'text',
    icon: <Target size={18} />,
  },
  {
    id: 2,
    category: 'preferred-roles',
    text: 'What type of roles are you most interested in?',
    hint: 'Select all that match your ideal job titles.',
    type: 'multi',
    options: [
      'Software Engineer',
      'Data Scientist',
      'Product Manager',
      'UX Designer',
      'DevOps Engineer',
      'ML Engineer',
      'Engineering Manager',
      'Research Scientist',
    ],
    icon: <Briefcase size={18} />,
  },
  {
    id: 3,
    category: 'skills',
    text: 'Which of these skills do you want to use most in your next role?',
    hint: "Select the skills you'd like to focus on and develop further.",
    type: 'multi',
    options: [
      'Python',
      'JavaScript/TypeScript',
      'React/Vue/Angular',
      'Machine Learning',
      'SQL & Databases',
      'Cloud (AWS/GCP/Azure)',
      'Data Engineering',
      'System Design',
      'Leadership',
      'Communication',
    ],
    icon: <Zap size={18} />,
  },
  {
    id: 4,
    category: 'industries',
    text: 'Which industries are you most interested in working in?',
    hint: 'This helps us prioritize companies in your preferred sectors.',
    type: 'multi',
    options: [
      'Technology / SaaS',
      'Healthcare / Biotech',
      'Finance / Fintech',
      'E-commerce / Retail',
      'Energy / Climate',
      'Education / EdTech',
      'Government / Defense',
      'Media / Entertainment',
    ],
    icon: <Grid3x3 size={18} />,
  },
  {
    id: 5,
    category: 'location',
    text: 'Where would you like to work?',
    hint: "Enter your preferred city, region, or type 'Remote'.",
    type: 'location',
    icon: <MapPin size={18} />,
  },
  {
    id: 6,
    category: 'work-type',
    text: 'What type of work environment do you thrive in?',
    hint: 'This helps us filter companies by culture and size.',
    type: 'single',
    options: ['Fast-paced startup', 'Mid-size growth company', 'Established enterprise', 'No preference'],
    icon: <Building2 size={18} />,
  },
  {
    id: 7,
    category: 'salary',
    text: 'How important is compensation vs. other factors?',
    hint: 'This helps us balance salary range with growth and mission fit.',
    type: 'scale',
    scaleLabels: ['Growth & mission matter more', 'Compensation is top priority'],
    icon: <DollarSign size={18} />,
  },
  {
    id: 8,
    category: 'experience-level',
    text: 'What seniority level are you targeting for your next role?',
    hint: 'This ensures we match you with appropriately leveled positions.',
    type: 'single',
    options: ['Entry-level / Junior', 'Mid-level', 'Senior', 'Staff / Principal / Lead'],
    icon: <Clock size={18} />,
  },
];

const TOTAL_QUESTIONS = QUESTIONS.length;

/* ------------------------------------------------------------------ */
/*  Sidebar profile derived from answers                               */
/* ------------------------------------------------------------------ */

function buildProfileDisplay(answers: AnswerState) {
  const profile: Record<
    string,
    { label: string; icon: React.ReactNode; values: string[]; style?: 'chips' | 'text' }
  > = {};

  // 1. Career goals
  profile.goals = {
    label: 'Career Goals',
    icon: <Compass size={14} />,
    values: answers[1] ? [answers[1]] : [],
    style: 'text',
  };

  // 2. Target roles
  const roles = answers[2];
  profile.targetRole = {
    label: 'Target Roles',
    icon: <Briefcase size={14} />,
    values: roles ? roles.split(', ') : [],
  };

  // 3. Skills
  const skills = answers[3];
  profile.skills = {
    label: 'Skills',
    icon: <Zap size={14} />,
    values: skills ? skills.split(', ') : [],
  };

  // 4. Sectors
  const sectors = answers[4];
  profile.sectors = {
    label: 'Sectors',
    icon: <Grid3x3 size={14} />,
    values: sectors ? sectors.split(', ') : [],
  };

  // 5. Desired location
  profile.location = {
    label: 'Desired Location',
    icon: <MapPin size={14} />,
    values: answers[5] ? [answers[5]] : [],
  };

  // 6. Work environment
  profile.environment = {
    label: 'Work Environment',
    icon: <Building2 size={14} />,
    values: answers[6] ? [answers[6]] : [],
  };

  // 7. Compensation priority
  if (answers[7]) {
    const val = parseInt(answers[7], 10);
    profile.compensation = {
      label: 'Compensation Priority',
      icon: <Wallet size={14} />,
      values: [`${val} / 5 — ${val >= 4 ? 'High' : val >= 3 ? 'Medium' : 'Lower'}`],
    };
  }

  // 8. Experience level
  profile.level = {
    label: 'Experience Level',
    icon: <Clock size={14} />,
    values: answers[8] ? [answers[8]] : [],
  };

  return profile;
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function DemoInterviewPage() {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [direction, setDirection] = useState(1);

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / TOTAL_QUESTIONS) * 100;

  const visibleAnswers: AnswerState = {};
  for (const [id, answer] of Object.entries(BARBARA_INTERVIEW_ANSWERS)) {
    if (Number(id) <= currentQuestion.id) {
      visibleAnswers[Number(id)] = answer;
    }
  }

  const profileDisplay = buildProfileDisplay(visibleAnswers);
  const completionPercent = Math.round(
    (Object.keys(visibleAnswers).length / TOTAL_QUESTIONS) * 100
  );

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  };

  const handleNext = () => {
    setThinking(true);

    setTimeout(() => {
      if (currentIndex < TOTAL_QUESTIONS - 1) {
        setDirection(1);
        setCurrentIndex((prev) => prev + 1);
        setThinking(false);
      } else {
        navigate('/demo/research');
      }
    }, 600);
  };

  const handleBack = () => {
    setThinking(true);

    setTimeout(() => {
      if (currentIndex > 0) {
        setDirection(-1);
        setCurrentIndex((prev) => prev - 1);
        setThinking(false);
      } else {
        navigate('/demo/upload');
      }
    }, 300);
  };

  const currentAnswer = BARBARA_INTERVIEW_ANSWERS[currentQuestion.id] || '';

  return (
    <div
      className="min-h-[100dvh] w-full"
      style={{ backgroundColor: 'var(--deep-navy)' }}
    >
      {/* Header */}
      <section className="mx-auto max-w-[960px] px-4 pt-16 pb-8 sm:pt-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="text-xs font-medium tracking-[0.15em]"
          style={{ color: 'var(--electric-blue)', fontFamily: 'JetBrains Mono, monospace' }}
        >
          STEP 2 OF 5
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: easeOutExpo }}
          className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
          style={{ color: 'var(--ice-white)' }}
        >
          Let&apos;s Get to Know Barbara
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: easeOutExpo }}
          className="mt-3 max-w-[600px] text-lg leading-relaxed"
          style={{ color: 'var(--slate-400)' }}
        >
          Watch how CareerSyncAI builds a detailed profile from a few targeted
          questions.
        </motion.p>

        {/* Step progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: easeOutExpo }}
          className="mt-8"
        >
          <div className="flex items-center justify-between gap-2">
            {steps.map((label, i) => (
              <div key={label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-500"
                  style={{
                    backgroundColor:
                      i === 0 ? 'var(--electric-blue)' : i === 1 ? 'var(--electric-blue)' : 'var(--slate-700)',
                    color: i <= 1 ? '#0B0E14' : 'var(--slate-400)',
                    fontFamily: 'JetBrains Mono, monospace',
                  }}
                >
                  {i === 0 ? '✓' : i + 1}
                </div>
                <span
                  className="hidden text-xs sm:inline"
                  style={{
                    color: i <= 1 ? 'var(--electric-blue)' : 'var(--slate-400)',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '11px',
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div
            className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: 'var(--slate-700)' }}
          >
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full progress-gradient"
              initial={{ width: '20%' }}
              animate={{ width: `${20 + progress * 0.2}%` }}
              transition={{ duration: 0.5, ease: easeOutExpo }}
            />
          </div>
        </motion.div>
      </section>

      {/* Main interface */}
      <section className="mx-auto max-w-[960px] px-4 pb-20">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Question area */}
          <div className="flex-1 lg:w-[60%]">
            <div
              className="relative min-h-[480px] overflow-hidden rounded-2xl p-6 sm:p-10"
              style={{
                backgroundColor: 'var(--slate-800)',
                border: '1px solid var(--slate-700)',
              }}
            >
              <AnimatePresence mode="wait" custom={direction}>
                {thinking ? (
                  <motion.div
                    key="thinking"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center py-20"
                  >
                    <div className="flex items-center gap-2">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: 'var(--electric-blue)' }}
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.4, 1, 0.4],
                          }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.3,
                            ease: 'easeInOut',
                          }}
                        />
                      ))}
                    </div>
                    <p
                      className="mt-4 text-xs"
                      style={{
                        color: 'var(--slate-400)',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                    >
                      AI analyzing...
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={currentQuestion.id}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.4,
                      ease: easeOutExpo,
                    }}
                  >
                    <p
                      className="text-xs font-medium"
                      style={{
                        color: 'var(--slate-400)',
                        fontFamily: 'JetBrains Mono, monospace',
                      }}
                    >
                      Question {currentIndex + 1} of {TOTAL_QUESTIONS}
                    </p>

                    <div className="mt-4 flex items-center gap-2">
                      <span style={{ color: 'var(--electric-blue)' }}>
                        {currentQuestion.icon}
                      </span>
                      <h2
                        className="text-2xl font-semibold leading-snug sm:text-3xl"
                        style={{ color: 'var(--ice-white)' }}
                      >
                        {currentQuestion.text}
                      </h2>
                    </div>

                    <p className="mt-2 text-sm" style={{ color: 'var(--slate-400)' }}>
                      {currentQuestion.hint}
                    </p>

                    {/* Read-only answer */}
                    <div className="mt-8">
                      <p
                        className="mb-2 text-xs font-medium uppercase tracking-wider"
                        style={{ color: 'var(--slate-500)' }}
                      >
                        Barbara&apos;s answer
                      </p>
                      <div
                        className="min-h-[120px] rounded-xl p-4"
                        style={{
                          backgroundColor: 'var(--midnight)',
                          border: '1px solid var(--slate-700)',
                        }}
                      >
                        {currentQuestion.type === 'multi' && currentQuestion.options ? (
                          <div className="flex flex-wrap gap-2">
                            {currentAnswer
                              .split(', ')
                              .filter(Boolean)
                              .map((item) => (
                                <span
                                  key={item}
                                  className="rounded-full px-3 py-1 text-xs font-medium"
                                  style={{
                                    backgroundColor: 'rgba(0, 201, 255, 0.12)',
                                    color: 'var(--electric-blue)',
                                    border: '1px solid rgba(0, 201, 255, 0.25)',
                                  }}
                                >
                                  {item}
                                </span>
                              ))}
                          </div>
                        ) : currentQuestion.type === 'scale' ? (
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              {[1, 2, 3, 4, 5].map((step) => {
                                const selected = step === parseInt(currentAnswer, 10);
                                return (
                                  <div key={step} className="flex flex-1 flex-col items-center gap-2">
                                    <div
                                      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-200"
                                      style={{
                                        backgroundColor: selected
                                          ? 'var(--electric-blue)'
                                          : 'var(--slate-700)',
                                        color: selected ? '#0B0E14' : 'var(--slate-400)',
                                      }}
                                    >
                                      {step}
                                    </div>
                                    <div
                                      className="h-1.5 w-full rounded-full"
                                      style={{
                                        backgroundColor: step <= parseInt(currentAnswer, 10)
                                          ? 'var(--electric-blue)'
                                          : 'var(--slate-700)',
                                      }}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                            {currentQuestion.scaleLabels && (
                              <div
                                className="flex justify-between text-xs"
                                style={{ color: 'var(--slate-500)' }}
                              >
                                <span>{currentQuestion.scaleLabels[0]}</span>
                                <span>{currentQuestion.scaleLabels[1]}</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: 'var(--ice-white)' }}
                          >
                            {currentAnswer}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Navigation */}
                    <div className="mt-8 flex items-center justify-between">
                      <button
                        onClick={handleBack}
                        className="flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:shadow-lg"
                        style={{
                          borderColor: 'var(--slate-600)',
                          color: 'var(--slate-300)',
                          backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = 'var(--electric-blue)';
                          e.currentTarget.style.color = 'var(--electric-blue)';
                          e.currentTarget.style.backgroundColor = 'rgba(0, 201, 255, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = 'var(--slate-600)';
                          e.currentTarget.style.color = 'var(--slate-300)';
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <ArrowLeft size={16} />
                        {currentIndex === 0 ? 'Back to Resume' : 'Back'}
                      </button>

                      <button
                        onClick={handleNext}
                        className="accent-gradient flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg"
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
                        {currentIndex === TOTAL_QUESTIONS - 1 ? (
                          <>
                            <Sparkles size={16} />
                            Finish
                          </>
                        ) : (
                          <>
                            Next
                            <ArrowRight size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Sidebar profile */}
          <div className="lg:w-[40%]">
            <div
              className="sticky top-20 rounded-2xl p-6"
              style={{
                backgroundColor: 'var(--midnight)',
                border: '1px solid var(--slate-700)',
              }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User size={16} style={{ color: 'var(--electric-blue)' }} />
                  <h4
                    className="text-base font-semibold"
                    style={{ color: 'var(--ice-white)' }}
                  >
                    Barbara&apos;s Profile
                  </h4>
                </div>
                <div className="relative flex h-10 w-10 items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
                    <circle
                      cx="20"
                      cy="20"
                      r="16"
                      fill="none"
                      stroke="var(--slate-700)"
                      strokeWidth="3"
                    />
                    <motion.circle
                      cx="20"
                      cy="20"
                      r="16"
                      fill="none"
                      stroke="var(--electric-blue)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 16}
                      strokeDashoffset={2 * Math.PI * 16 * (1 - completionPercent / 100)}
                      transition={{ duration: 0.5, ease: easeOutExpo }}
                    />
                  </svg>
                  <span
                    className="absolute text-[10px] font-bold"
                    style={{
                      color: 'var(--electric-blue)',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    {completionPercent}%
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {Object.entries(profileDisplay).map(([key, section]) => (
                  <div key={key} className="rounded-xl px-3 py-3">
                    <div className="mb-2 flex items-center gap-2">
                      <span style={{ color: 'var(--slate-400)' }}>{section.icon}</span>
                      <span
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: 'var(--slate-400)' }}
                      >
                        {section.label}
                      </span>
                    </div>

                    {section.values.length > 0 ? (
                      section.style === 'text' ? (
                        <p
                          className="line-clamp-4 text-xs leading-relaxed"
                          style={{ color: 'var(--ice-white)' }}
                        >
                          {section.values[0]}
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-1.5">
                          {section.values.map((val, i) => (
                            <span
                              key={`${key}-${i}`}
                              className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                              style={{
                                backgroundColor: 'rgba(0, 201, 255, 0.08)',
                                color: 'var(--electric-blue)',
                              }}
                            >
                              {val}
                            </span>
                          ))}
                        </div>
                      )
                    ) : (
                      <span className="text-xs italic" style={{ color: 'var(--slate-500)' }}>
                        Not specified yet...
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div
                className="mt-6 border-t pt-4"
                style={{ borderColor: 'var(--slate-700)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: 'var(--slate-500)' }}>
                    Questions answered
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{
                      color: 'var(--electric-blue)',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}
                  >
                    {Object.keys(visibleAnswers).length} / {TOTAL_QUESTIONS}
                  </span>
                </div>
                <div
                  className="relative mt-2 h-1.5 w-full overflow-hidden rounded-full"
                  style={{ backgroundColor: 'var(--slate-700)' }}
                >
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full progress-gradient"
                    animate={{
                      width: `${(Object.keys(visibleAnswers).length / TOTAL_QUESTIONS) * 100}%`,
                    }}
                    transition={{ duration: 0.4, ease: easeOutExpo }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
