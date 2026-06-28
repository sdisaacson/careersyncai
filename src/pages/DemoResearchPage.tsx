import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Globe,
  Sparkles,
  Heart,
  CheckCircle2,
  Zap,
  Users,
  Award,
} from "lucide-react";

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const MIN_LOADING_MS = 8000;

const steps = [
  {
    icon: <Globe size={16} />,
    label: "Searching job boards",
    detail:
      "Scanning 200+ sources across museums, galleries, education, and the arts.",
  },
  {
    icon: <Users size={16} />,
    label: "Matching Barbara's profile",
    detail:
      "Weighing her Art History background, internships, and skills against each role.",
  },
  {
    icon: <Sparkles size={16} />,
    label: "Scoring fit",
    detail:
      "Some matches may be a stretch — others feel like they were made for her.",
  },
  {
    icon: <Heart size={16} />,
    label: "Prioritizing potential",
    detail:
      "We believe in Barbara, so we're also surfacing roles that reward growth and curiosity.",
  },
  {
    icon: <Award size={16} />,
    label: "Finalizing top picks",
    detail:
      "Curating the list of opportunities where she has the best shot to thrive.",
  },
];

const messages = [
  "We never stop looking for the best fit for you.",
  "Every candidate deserves a champion — consider us yours.",
  "A stretch role today can become a dream job tomorrow.",
  "We highlight matches where your unique background shines.",
  "Your potential matters as much as your past experience.",
];

export default function DemoResearchPage() {
  const navigate = useNavigate();
  const [startedAt] = useState(() => Date.now());
  const [progress, setProgress] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        // Advance quickly at first, then slow down so the animation lasts ~8s
        const remaining = 100 - prev;
        const increment = remaining > 30 ? 2 : remaining > 10 ? 0.8 : 0.3;
        return Math.min(prev + increment, 99);
      });
    }, 80);

    const stepInterval = setInterval(() => {
      setActiveStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1400);

    const messageInterval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % messages.length);
    }, 2200);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearInterval(messageInterval);
    };
  }, []);

  useEffect(() => {
    if (progress >= 99 && !done) {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
      const timer = setTimeout(() => {
        setProgress(100);
        setDone(true);
        setTimeout(() => navigate("/demo/results"), 600);
      }, remaining);
      return () => clearTimeout(timer);
    }
  }, [progress, done, navigate, startedAt]);

  return (
    <div
      className="min-h-[100dvh] w-full"
      style={{ backgroundColor: "var(--deep-navy)" }}
    >
      <section className="mx-auto flex min-h-[100dvh] max-w-[720px] flex-col items-center justify-center px-4 py-20 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="text-xs font-medium tracking-[0.15em]"
          style={{
            color: "var(--electric-blue)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          STEP 3 OF 5
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: easeOutExpo }}
          className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
          style={{ color: "var(--ice-white)" }}
        >
          Finding Barbara&apos;s Best Matches
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: easeOutExpo }}
          className="mt-3 max-w-[560px] text-lg leading-relaxed"
          style={{ color: "var(--slate-400)" }}
        >
          CareerSyncAI is using Barbara&apos;s resume and interview answers to
          search hundreds of opportunities and build a shortlist tailored just
          for her.
        </motion.p>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: easeOutExpo }}
          className="mt-10 w-full"
        >
          <div className="mb-2 flex items-center justify-between">
            <span
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: "var(--ice-white)" }}
            >
              <Search size={16} style={{ color: "var(--electric-blue)" }} />
              Researching opportunities
            </span>
            <span
              className="text-sm font-bold"
              style={{
                color: "var(--electric-blue)",
                fontFamily: "JetBrains Mono, monospace",
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <div
            className="relative h-3 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--slate-700)" }}
          >
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full progress-gradient"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2, ease: "linear" }}
            />
          </div>
        </motion.div>

        {/* Activity steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: easeOutExpo }}
          className="mt-8 w-full space-y-3"
        >
          {steps.map((step, i) => {
            const isActive = i === activeStep;
            const isPast = i < activeStep;
            return (
              <motion.div
                key={step.label}
                animate={{
                  backgroundColor: isActive
                    ? "rgba(0, 201, 255, 0.10)"
                    : "rgba(30, 41, 59, 0.50)",
                  borderColor: isActive
                    ? "rgba(0, 201, 255, 0.35)"
                    : "var(--slate-700)",
                }}
                className="flex items-start gap-4 rounded-xl border p-4 text-left"
                style={{
                  border: "1px solid var(--slate-700)",
                  backgroundColor: isActive
                    ? "rgba(0, 201, 255, 0.10)"
                    : "rgba(30, 41, 59, 0.50)",
                }}
              >
                <div
                  className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                  style={{
                    backgroundColor:
                      isPast || isActive
                        ? "var(--electric-blue)"
                        : "var(--slate-700)",
                    color: isPast || isActive ? "#0B0E14" : "var(--slate-400)",
                  }}
                >
                  {isPast ? <CheckCircle2 size={16} /> : step.icon}
                </div>
                <div className="flex-1">
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--ice-white)" }}
                  >
                    {step.label}
                  </p>
                  <p
                    className="mt-0.5 text-xs leading-relaxed"
                    style={{ color: "var(--slate-400)" }}
                  >
                    {step.detail}
                  </p>
                </div>
                {isActive && (
                  <motion.div
                    className="mt-1.5 h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--electric-blue)" }}
                    animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Encouragement ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 flex items-center gap-2"
        >
          <Zap size={16} style={{ color: "var(--electric-blue)" }} />
          <div className="h-6 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={messageIndex}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4, ease: easeOutExpo }}
                className="text-sm font-medium"
                style={{ color: "var(--electric-blue)" }}
              >
                {messages[messageIndex]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
