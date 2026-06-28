import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Target,
  Zap,
  Grid3x3,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle,
  MapPin,
  Building2,
  DollarSign,
  Clock,
  Compass,
  Briefcase,
} from "lucide-react";
import { trpc } from "@/lib/trpc.tsx";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type AnswerType = "text" | "single" | "multi" | "scale" | "location";

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
    category: "career-goals",
    text: "What are your short-term and long-term career goals?",
    hint: "This helps us align opportunities with your growth trajectory.",
    type: "text",
    icon: <Target size={18} />,
  },
  {
    id: 2,
    category: "preferred-roles",
    text: "What type of roles are you most interested in?",
    hint: "Select all that match your ideal job titles.",
    type: "multi",
    options: [
      "Software Engineer",
      "Data Scientist",
      "Product Manager",
      "UX Designer",
      "DevOps Engineer",
      "ML Engineer",
      "Engineering Manager",
      "Research Scientist",
    ],
    icon: <BriefcaseIcon />,
  },
  {
    id: 3,
    category: "skills",
    text: "Which of these skills do you want to use most in your next role?",
    hint: "Select the skills you'd like to focus on and develop further.",
    type: "multi",
    options: [
      "Python",
      "JavaScript/TypeScript",
      "React/Vue/Angular",
      "Machine Learning",
      "SQL & Databases",
      "Cloud (AWS/GCP/Azure)",
      "Data Engineering",
      "System Design",
      "Leadership",
      "Communication",
    ],
    icon: <Zap size={18} />,
  },
  {
    id: 4,
    category: "industries",
    text: "Which industries are you most interested in working in?",
    hint: "This helps us prioritize companies in your preferred sectors.",
    type: "multi",
    options: [
      "Technology / SaaS",
      "Healthcare / Biotech",
      "Finance / Fintech",
      "E-commerce / Retail",
      "Energy / Climate",
      "Education / EdTech",
      "Government / Defense",
      "Media / Entertainment",
    ],
    icon: <Grid3x3 size={18} />,
  },
  {
    id: 5,
    category: "location",
    text: "Where would you like to work?",
    hint: "Enter your preferred city, region, or type 'Remote'.",
    type: "location",
    icon: <MapPin size={18} />,
  },
  {
    id: 6,
    category: "work-type",
    text: "What type of work environment do you thrive in?",
    hint: "This helps us filter companies by culture and size.",
    type: "single",
    options: [
      "Fast-paced startup",
      "Mid-size growth company",
      "Established enterprise",
      "No preference",
    ],
    icon: <Building2 size={18} />,
  },
  {
    id: 7,
    category: "salary",
    text: "How important is compensation vs. other factors?",
    hint: "This helps us balance salary range with growth and mission fit.",
    type: "scale",
    scaleLabels: [
      "Growth & mission matter more",
      "Compensation is top priority",
    ],
    icon: <DollarSign size={18} />,
  },
  {
    id: 8,
    category: "experience-level",
    text: "What seniority level are you targeting for your next role?",
    hint: "This ensures we match you with appropriately leveled positions.",
    type: "single",
    options: [
      "Entry-level / Junior",
      "Mid-level",
      "Senior",
      "Staff / Principal / Lead",
    ],
    icon: <Clock size={18} />,
  },
];

const TOTAL_QUESTIONS = QUESTIONS.length;

/* ------------------------------------------------------------------ */
/*  Helper icon components                                             */
/* ------------------------------------------------------------------ */

function BriefcaseIcon() {
  return <Target size={18} />;
}

/* ------------------------------------------------------------------ */
/*  Sidebar profile derived from answers                               */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  Sidebar profile derived from answers                               */
/* ------------------------------------------------------------------ */

function buildProfileDisplay(answers: AnswerState) {
  const profile: Record<
    string,
    {
      label: string;
      icon: React.ReactNode;
      values: string[];
      style?: "chips" | "text";
    }
  > = {};

  // 1. Career goals
  profile.goals = {
    label: "Career Goals",
    icon: <Compass size={14} />,
    values: answers[1] ? [answers[1]] : [],
    style: "text",
  };

  // 2. Target roles
  const roles = answers[2];
  profile.targetRole = {
    label: "Target Roles",
    icon: <BriefcaseIcon />,
    values: roles ? roles.split(", ") : [],
  };

  // 3. Skills
  const skills = answers[3];
  profile.skills = {
    label: "Skills",
    icon: <Zap size={14} />,
    values: skills ? skills.split(", ") : [],
  };

  // 4. Sectors
  const sectors = answers[4];
  profile.sectors = {
    label: "Sectors",
    icon: <Grid3x3 size={14} />,
    values: sectors ? sectors.split(", ") : [],
  };

  // 5. Desired location
  profile.location = {
    label: "Desired Location",
    icon: <MapPin size={14} />,
    values: answers[5] ? [answers[5]] : [],
  };

  // 6. Work environment
  profile.environment = {
    label: "Work Environment",
    icon: <Building2 size={14} />,
    values: answers[6] ? [answers[6]] : [],
  };

  // 7. Compensation priority
  if (answers[7]) {
    const val = parseInt(answers[7], 10);
    profile.compensation = {
      label: "Compensation Priority",
      icon: <DollarSign size={14} />,
      values: [
        `${val} / 5 — ${val >= 4 ? "High" : val >= 3 ? "Medium" : "Lower"}`,
      ],
    };
  }

  // 8. Experience level
  profile.level = {
    label: "Experience Level",
    icon: <Clock size={14} />,
    values: answers[8] ? [answers[8]] : [],
  };

  return profile;
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function InterviewPage() {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerState>({});
  const [isComplete, setIsComplete] = useState(false);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [flashSection, setFlashSection] = useState<string | null>(null);
  const [thinking, setThinking] = useState(false);
  const [locationInput, setLocationInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [interviewId, setInterviewId] = useState<number | null>(null);
  const [questionRowIds, setQuestionRowIds] = useState<Record<number, number>>(
    {}
  );
  const [profileId, setProfileId] = useState<number>(1);

  const createInterview = trpc.interview.create.useMutation();
  const addQuestion = trpc.interview.addQuestion.useMutation();
  const answerMutation = trpc.interview.answerQuestion.useMutation();
  const completeMutation = trpc.interview.complete.useMutation({
    onSuccess: () => {
      setIsComplete(true);
    },
  });
  const getProfile = trpc.profile.getByUser.useQuery({ userId: 1 });
  const updateProfile = trpc.profile.update.useMutation();

  const currentQuestion = QUESTIONS[currentIndex];
  const progress =
    ((currentIndex + (isComplete ? 1 : 0)) / TOTAL_QUESTIONS) * 100;

  /* ---- initialize interview on mount -------------------------------- */

  useEffect(() => {
    if (getProfile.data && !interviewId) {
      setProfileId(getProfile.data.id);
      void (async () => {
        try {
          const { id: newInterviewId } = await createInterview.mutateAsync({
            profileId: getProfile.data.id,
          });
          setInterviewId(newInterviewId);

          // Add all questions and collect their row IDs
          const rowIds: Record<number, number> = {};
          for (let i = 0; i < QUESTIONS.length; i++) {
            const q = QUESTIONS[i];
            const result = await addQuestion.mutateAsync({
              interviewId: newInterviewId,
              question: q.text,
              category: q.category,
              order: i,
            });
            if (result.id) {
              rowIds[q.id] = result.id;
            }
          }
          setQuestionRowIds(rowIds);
        } catch (err) {
          console.error("Failed to create interview:", err);
        }
      })();
    }
  }, [getProfile.data, interviewId, createInterview, addQuestion]);

  /* ---- answer handlers --------------------------------------------- */

  const handleTextAnswer = (value: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleSingleSelect = (option: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(newAnswers);
    triggerFlash(currentQuestion.category);
  };

  const handleMultiSelect = (option: string) => {
    const current = answers[currentQuestion.id] || "";
    const selected = current ? current.split(", ") : [];
    const updated = selected.includes(option)
      ? selected.filter(s => s !== option)
      : [...selected, option];
    const newAnswers = { ...answers, [currentQuestion.id]: updated.join(", ") };
    setAnswers(newAnswers);
    triggerFlash(currentQuestion.category);
  };

  const handleScaleSelect = (value: number) => {
    const newAnswers = { ...answers, [currentQuestion.id]: String(value) };
    setAnswers(newAnswers);
    triggerFlash(currentQuestion.category);
  };

  const handleLocationSubmit = () => {
    if (!locationInput.trim()) return;
    const newAnswers = {
      ...answers,
      [currentQuestion.id]: locationInput.trim(),
    };
    setAnswers(newAnswers);
    triggerFlash(currentQuestion.category);
  };

  const triggerFlash = useCallback((category: string) => {
    const sectionMap: Record<string, string> = {
      "career-goals": "goals",
      "preferred-roles": "targetRole",
      skills: "skills",
      industries: "sectors",
      location: "location",
      "work-type": "environment",
      salary: "compensation",
      "experience-level": "level",
    };
    const section = sectionMap[category] || "goals";
    setFlashSection(section);
    setTimeout(() => setFlashSection(null), 500);
  }, []);

  /* ---- navigation -------------------------------------------------- */

  const goNext = async () => {
    const currentAnswer = answers[currentQuestion.id];
    if (!currentAnswer && currentQuestion.type !== "scale") return;

    setThinking(true);

    // Save answer to database using the actual question row ID
    const questionRowId = questionRowIds[currentQuestion.id];
    if (questionRowId) {
      try {
        await answerMutation.mutateAsync({
          id: questionRowId,
          answer: currentAnswer || "",
        });
      } catch (err) {
        console.error("Failed to save answer:", err);
      }
    }

    // Also update the profile with aggregated answers as we go
    if (interviewId && currentIndex === TOTAL_QUESTIONS - 1) {
      // On last question, update profile with all answers
      const allAnswers = { ...answers, [currentQuestion.id]: currentAnswer };
      try {
        await updateProfile.mutateAsync({
          id: profileId,
          preferredRoles: allAnswers[2] || undefined,
          skills: allAnswers[3] || undefined,
          preferredIndustries: allAnswers[4] || undefined,
          targetLocation: allAnswers[5] || undefined,
          workType: allAnswers[6] || undefined,
          salaryExpectation: allAnswers[7] || undefined,
          status: "interviewing",
        });
      } catch (err) {
        console.error("Failed to update profile:", err);
      }
    }

    // Simulate AI "thinking" between questions
    if (currentIndex < TOTAL_QUESTIONS - 1) {
      setTimeout(() => {
        setThinking(false);
        setDirection(1);
        setCurrentIndex(prev => prev + 1);
        setLocationInput("");
      }, 600);
    } else {
      setTimeout(() => {
        setThinking(false);
        // Complete the interview using the actual interview ID
        if (interviewId) {
          void completeMutation.mutateAsync({ id: interviewId });
        } else {
          setIsComplete(true);
        }
      }, 800);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    // Mark profile as completed when user finishes the interview
    if (profileId) {
      void updateProfile.mutateAsync({
        id: profileId,
        status: "completed",
      });
    }
    navigate("/research");
  };

  /* ---- derived values ---------------------------------------------- */

  const profileDisplay = buildProfileDisplay(answers);
  const completionPercent = Math.round(
    (Object.keys(answers).length / TOTAL_QUESTIONS) * 100
  );

  /* ---- animation variants ------------------------------------------ */

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

  const isAnswered = !!answers[currentQuestion?.id];

  /* ------------------------------------------------------------------ */

  return (
    <div
      className="min-h-[100dvh] w-full"
      style={{ backgroundColor: "var(--deep-navy)" }}
    >
      {/* ======================== HEADER ======================== */}
      <section className="mx-auto max-w-[960px] px-4 pt-16 pb-8 sm:pt-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
          className="text-xs font-medium tracking-[0.15em]"
          style={{
            color: "var(--electric-blue)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          STEP 2 OF 5
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.1,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
          className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
          style={{ color: "var(--ice-white)" }}
        >
          Let&apos;s Get to Know You
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
          className="mt-3 max-w-[600px] text-lg leading-relaxed"
          style={{ color: "var(--slate-400)" }}
        >
          Our AI will ask you a few targeted questions to understand exactly
          what you&apos;re looking for. The more detail you provide, the better
          our matches.
        </motion.p>

        {/* Step Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.5,
            ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
          }}
          className="mt-8"
        >
          <div className="flex items-center justify-between gap-2">
            {["Upload", "Interview", "Research", "Results", "Resumes"].map(
              (label, i) => (
                <div
                  key={label}
                  className="flex flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-500"
                    style={{
                      backgroundColor:
                        i === 0
                          ? "var(--electric-blue)"
                          : i === 1
                            ? "var(--electric-blue)"
                            : "var(--slate-700)",
                      color: i <= 1 ? "#0B0E14" : "var(--slate-400)",
                      fontFamily: "JetBrains Mono, monospace",
                    }}
                  >
                    {i === 0 ? "✓" : i + 1}
                  </div>
                  <span
                    className="hidden text-xs sm:inline"
                    style={{
                      color:
                        i <= 1 ? "var(--electric-blue)" : "var(--slate-400)",
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: "11px",
                    }}
                  >
                    {label}
                  </span>
                </div>
              )
            )}
          </div>
          <div
            className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--slate-700)" }}
          >
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full progress-gradient"
              initial={{ width: "20%" }}
              animate={{
                width: isComplete ? "40%" : `${20 + progress * 0.2}%`,
              }}
              transition={{
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              }}
            />
          </div>
        </motion.div>
      </section>

      {/* ======================== MAIN INTERFACE ======================== */}
      {!isComplete ? (
        <section className="mx-auto max-w-[960px] px-4 pb-20">
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* ---- LEFT: Question Area ---- */}
            <div className="flex-1 lg:w-[60%]">
              <div
                className="relative min-h-[480px] overflow-hidden rounded-2xl p-6 sm:p-10"
                style={{
                  backgroundColor: "var(--slate-800)",
                  border: "1px solid var(--slate-700)",
                }}
              >
                <AnimatePresence mode="wait" custom={direction}>
                  {thinking ? (
                    /* ---- THINKING STATE ---- */
                    <motion.div
                      key="thinking"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center py-20"
                    >
                      <div className="flex items-center gap-2">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: "var(--electric-blue)" }}
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.4, 1, 0.4],
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.3,
                              ease: "easeInOut",
                            }}
                          />
                        ))}
                      </div>
                      <p
                        className="mt-4 text-xs"
                        style={{
                          color: "var(--slate-400)",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        Analyzing your response...
                      </p>
                    </motion.div>
                  ) : (
                    /* ---- QUESTION CARD ---- */
                    <motion.div
                      key={currentQuestion.id}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1] as [
                          number,
                          number,
                          number,
                          number,
                        ],
                      }}
                    >
                      {/* Question number */}
                      <p
                        className="text-xs font-medium"
                        style={{
                          color: "var(--slate-400)",
                          fontFamily: "JetBrains Mono, monospace",
                        }}
                      >
                        Question {currentIndex + 1} of {TOTAL_QUESTIONS}
                      </p>

                      {/* Question text */}
                      <h2
                        className="mt-4 text-2xl font-semibold leading-snug sm:text-3xl"
                        style={{ color: "var(--ice-white)" }}
                      >
                        {currentQuestion.text}
                      </h2>

                      {/* Hint */}
                      <p
                        className="mt-2 text-sm"
                        style={{ color: "var(--slate-400)" }}
                      >
                        {currentQuestion.hint}
                      </p>

                      {/* ---- ANSWER INPUTS ---- */}
                      <div className="mt-8">
                        {/* TEXT */}
                        {currentQuestion.type === "text" && (
                          <textarea
                            ref={inputRef}
                            rows={4}
                            className="w-full resize-none rounded-xl px-4 py-3 text-base outline-none transition-all duration-200 focus:ring-[3px]"
                            style={{
                              backgroundColor: "var(--midnight)",
                              border: "1px solid var(--slate-700)",
                              color: "var(--ice-white)",
                            }}
                            placeholder="Describe your ideal role..."
                            value={answers[currentQuestion.id] || ""}
                            onChange={e => handleTextAnswer(e.target.value)}
                            onFocus={e => {
                              e.currentTarget.style.borderColor =
                                "var(--electric-blue)";
                              e.currentTarget.style.boxShadow =
                                "0 0 0 3px rgba(0, 201, 255, 0.12)";
                            }}
                            onBlur={e => {
                              e.currentTarget.style.borderColor =
                                "var(--slate-700)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          />
                        )}

                        {/* SINGLE SELECT */}
                        {currentQuestion.type === "single" &&
                          currentQuestion.options && (
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              {currentQuestion.options.map(option => {
                                const selected =
                                  answers[currentQuestion.id] === option;
                                return (
                                  <button
                                    key={option}
                                    onClick={() => handleSingleSelect(option)}
                                    className="flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium transition-all duration-200"
                                    style={{
                                      borderColor: selected
                                        ? "var(--electric-blue)"
                                        : "var(--slate-700)",
                                      backgroundColor: selected
                                        ? "rgba(0, 201, 255, 0.08)"
                                        : "var(--midnight)",
                                      color: selected
                                        ? "var(--electric-blue)"
                                        : "var(--ice-white)",
                                    }}
                                    onMouseEnter={e => {
                                      if (!selected) {
                                        e.currentTarget.style.borderColor =
                                          "var(--slate-500)";
                                      }
                                    }}
                                    onMouseLeave={e => {
                                      if (!selected) {
                                        e.currentTarget.style.borderColor =
                                          "var(--slate-700)";
                                      }
                                    }}
                                  >
                                    <div
                                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2"
                                      style={{
                                        borderColor: selected
                                          ? "var(--electric-blue)"
                                          : "var(--slate-600)",
                                      }}
                                    >
                                      {selected && (
                                        <div
                                          className="h-2.5 w-2.5 rounded-full"
                                          style={{
                                            backgroundColor:
                                              "var(--electric-blue)",
                                          }}
                                        />
                                      )}
                                    </div>
                                    {option}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                        {/* MULTI SELECT */}
                        {currentQuestion.type === "multi" &&
                          currentQuestion.options && (
                            <div className="flex flex-wrap gap-2">
                              {currentQuestion.options.map(option => {
                                const selected = (
                                  answers[currentQuestion.id] || ""
                                )
                                  .split(", ")
                                  .includes(option);
                                return (
                                  <button
                                    key={option}
                                    onClick={() => handleMultiSelect(option)}
                                    className="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
                                    style={{
                                      backgroundColor: selected
                                        ? "rgba(0, 201, 255, 0.15)"
                                        : "var(--midnight)",
                                      color: selected
                                        ? "var(--electric-blue)"
                                        : "var(--slate-400)",
                                      border: selected
                                        ? "1px solid rgba(0, 201, 255, 0.3)"
                                        : "1px solid var(--slate-700)",
                                    }}
                                    onMouseEnter={e => {
                                      if (!selected) {
                                        e.currentTarget.style.borderColor =
                                          "var(--slate-500)";
                                        e.currentTarget.style.color =
                                          "var(--ice-white)";
                                      }
                                    }}
                                    onMouseLeave={e => {
                                      if (!selected) {
                                        e.currentTarget.style.borderColor =
                                          "var(--slate-700)";
                                        e.currentTarget.style.color =
                                          "var(--slate-400)";
                                      }
                                    }}
                                  >
                                    {selected && "✓ "}
                                    {option}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                        {/* SCALE */}
                        {currentQuestion.type === "scale" &&
                          currentQuestion.scaleLabels && (
                            <div className="space-y-4">
                              <div className="flex items-center gap-3">
                                {[1, 2, 3, 4, 5].map(val => {
                                  const selected =
                                    answers[currentQuestion.id] === String(val);
                                  return (
                                    <button
                                      key={val}
                                      onClick={() => handleScaleSelect(val)}
                                      className="flex h-12 w-12 items-center justify-center rounded-xl text-base font-bold transition-all duration-200"
                                      style={{
                                        backgroundColor: selected
                                          ? "var(--electric-blue)"
                                          : "var(--midnight)",
                                        color: selected
                                          ? "#0B0E14"
                                          : "var(--slate-400)",
                                        border: selected
                                          ? "none"
                                          : "1px solid var(--slate-700)",
                                        transform: selected
                                          ? "scale(1.08)"
                                          : "scale(1)",
                                      }}
                                      onMouseEnter={e => {
                                        if (!selected) {
                                          e.currentTarget.style.borderColor =
                                            "var(--slate-500)";
                                          e.currentTarget.style.color =
                                            "var(--ice-white)";
                                        }
                                      }}
                                      onMouseLeave={e => {
                                        if (!selected) {
                                          e.currentTarget.style.borderColor =
                                            "var(--slate-700)";
                                          e.currentTarget.style.color =
                                            "var(--slate-400)";
                                        }
                                      }}
                                    >
                                      {val}
                                    </button>
                                  );
                                })}
                              </div>
                              <div
                                className="flex justify-between text-xs"
                                style={{ color: "var(--slate-500)" }}
                              >
                                <span>{currentQuestion.scaleLabels[0]}</span>
                                <span>{currentQuestion.scaleLabels[1]}</span>
                              </div>
                            </div>
                          )}

                        {/* LOCATION */}
                        {currentQuestion.type === "location" && (
                          <div className="space-y-3">
                            <div className="relative">
                              <MapPin
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2"
                                style={{ color: "var(--slate-500)" }}
                              />
                              <input
                                type="text"
                                className="w-full rounded-xl py-3 pl-10 pr-4 text-base outline-none transition-all duration-200 focus:ring-[3px]"
                                style={{
                                  backgroundColor: "var(--midnight)",
                                  border: "1px solid var(--slate-700)",
                                  color: "var(--ice-white)",
                                }}
                                placeholder="San Francisco Bay Area, Remote, New York..."
                                value={locationInput}
                                onChange={e => setLocationInput(e.target.value)}
                                onKeyDown={e => {
                                  if (e.key === "Enter") handleLocationSubmit();
                                }}
                                onFocus={e => {
                                  e.currentTarget.style.borderColor =
                                    "var(--electric-blue)";
                                  e.currentTarget.style.boxShadow =
                                    "0 0 0 3px rgba(0, 201, 255, 0.12)";
                                }}
                                onBlur={e => {
                                  e.currentTarget.style.borderColor =
                                    "var(--slate-700)";
                                  e.currentTarget.style.boxShadow = "none";
                                }}
                              />
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {[
                                "Remote",
                                "San Francisco",
                                "New York",
                                "Austin",
                                "Seattle",
                                "Los Angeles",
                              ].map(city => (
                                <button
                                  key={city}
                                  onClick={() => {
                                    setLocationInput(city);
                                    const newAnswers = {
                                      ...answers,
                                      [currentQuestion.id]: city,
                                    };
                                    setAnswers(newAnswers);
                                    triggerFlash("location");
                                  }}
                                  className="rounded-full px-3 py-1.5 text-xs font-medium transition-all duration-200"
                                  style={{
                                    backgroundColor:
                                      locationInput === city
                                        ? "rgba(0, 201, 255, 0.15)"
                                        : "var(--midnight)",
                                    color:
                                      locationInput === city
                                        ? "var(--electric-blue)"
                                        : "var(--slate-400)",
                                    border:
                                      locationInput === city
                                        ? "1px solid rgba(0, 201, 255, 0.3)"
                                        : "1px solid var(--slate-700)",
                                  }}
                                >
                                  {city}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ---- NAVIGATION BUTTONS ---- */}
                      <div className="mt-8 flex items-center justify-between">
                        <button
                          onClick={goBack}
                          disabled={currentIndex === 0}
                          className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-30"
                          style={{ color: "var(--slate-400)" }}
                          onMouseEnter={e => {
                            if (currentIndex > 0)
                              e.currentTarget.style.color = "var(--ice-white)";
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.color = "var(--slate-400)";
                          }}
                        >
                          <ArrowLeft size={16} />
                          Back
                        </button>

                        <button
                          onClick={goNext}
                          disabled={!isAnswered || answerMutation.isPending}
                          className="accent-gradient flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
                          style={{
                            boxShadow: "0 0 20px rgba(0, 201, 255, 0.2)",
                          }}
                          onMouseEnter={e => {
                            if (isAnswered) {
                              e.currentTarget.style.transform = "scale(1.02)";
                              e.currentTarget.style.boxShadow =
                                "0 0 30px rgba(0, 201, 255, 0.35)";
                            }
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow =
                              "0 0 20px rgba(0, 201, 255, 0.2)";
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

            {/* ---- RIGHT: Profile Sidebar ---- */}
            <div className="lg:w-[40%]">
              <div
                className="sticky top-20 rounded-2xl p-6"
                style={{
                  backgroundColor: "var(--midnight)",
                  border: "1px solid var(--slate-700)",
                }}
              >
                {/* Sidebar Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User size={16} style={{ color: "var(--electric-blue)" }} />
                    <h4
                      className="text-base font-semibold"
                      style={{ color: "var(--ice-white)" }}
                    >
                      Your Profile
                    </h4>
                  </div>
                  {/* Completion Ring */}
                  <div className="relative flex h-10 w-10 items-center justify-center">
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      className="-rotate-90"
                    >
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
                        strokeDashoffset={
                          2 * Math.PI * 16 * (1 - completionPercent / 100)
                        }
                        transition={{
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1] as [
                            number,
                            number,
                            number,
                            number,
                          ],
                        }}
                      />
                    </svg>
                    <span
                      className="absolute text-[10px] font-bold"
                      style={{
                        color: "var(--electric-blue)",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {completionPercent}%
                    </span>
                  </div>
                </div>

                {/* Profile Sections */}
                <div className="space-y-4">
                  {Object.entries(profileDisplay).map(([key, section]) => (
                    <motion.div
                      key={key}
                      animate={{
                        backgroundColor:
                          flashSection === key
                            ? "rgba(0, 201, 255, 0.1)"
                            : "transparent",
                      }}
                      transition={{ duration: 0.5 }}
                      className="rounded-xl px-3 py-3"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <span style={{ color: "var(--slate-400)" }}>
                          {section.icon}
                        </span>
                        <span
                          className="text-xs font-medium uppercase tracking-wider"
                          style={{ color: "var(--slate-400)" }}
                        >
                          {section.label}
                        </span>
                      </div>

                      {section.values.length > 0 ? (
                        section.style === "text" ? (
                          <p
                            className="line-clamp-4 text-xs leading-relaxed"
                            style={{ color: "var(--ice-white)" }}
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
                                  backgroundColor: "rgba(0, 201, 255, 0.08)",
                                  color: "var(--electric-blue)",
                                }}
                              >
                                {val}
                              </span>
                            ))}
                          </div>
                        )
                      ) : (
                        <span
                          className="text-xs italic"
                          style={{ color: "var(--slate-500)" }}
                        >
                          Not specified yet...
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Question Progress */}
                <div
                  className="mt-6 border-t pt-4"
                  style={{ borderColor: "var(--slate-700)" }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs"
                      style={{ color: "var(--slate-500)" }}
                    >
                      Questions answered
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{
                        color: "var(--electric-blue)",
                        fontFamily: "JetBrains Mono, monospace",
                      }}
                    >
                      {Object.keys(answers).length} / {TOTAL_QUESTIONS}
                    </span>
                  </div>
                  <div
                    className="relative mt-2 h-1.5 w-full overflow-hidden rounded-full"
                    style={{ backgroundColor: "var(--slate-700)" }}
                  >
                    <motion.div
                      className="absolute left-0 top-0 h-full rounded-full progress-gradient"
                      animate={{
                        width: `${(Object.keys(answers).length / TOTAL_QUESTIONS) * 100}%`,
                      }}
                      transition={{
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1] as [
                          number,
                          number,
                          number,
                          number,
                        ],
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        /* ======================== COMPLETE STATE ======================== */
        <section className="mx-auto flex max-w-[560px] flex-col items-center px-4 pt-8 pb-20 text-center">
          {/* Animated checkmark circle */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.1, 1] }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            }}
            className="relative flex h-24 w-24 items-center justify-center rounded-full accent-gradient"
          >
            <CheckCircle size={40} color="#fff" />
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ border: "2px solid var(--electric-blue)" }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 text-4xl font-bold"
            style={{ color: "var(--ice-white)" }}
          >
            Interview Complete!
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-4 max-w-[480px] text-lg leading-relaxed"
            style={{ color: "var(--slate-400)" }}
          >
            We&apos;ve built a detailed profile of your skills, preferences, and
            goals. Our agents are ready to find your perfect matches.
          </motion.p>

          {/* Summary Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 w-full rounded-2xl p-6 text-left"
            style={{
              backgroundColor: "var(--slate-800)",
              border: "1px solid var(--slate-700)",
            }}
          >
            <h4
              className="mb-4 text-sm font-semibold"
              style={{ color: "var(--ice-white)" }}
            >
              Profile Summary
            </h4>

            <div className="space-y-3">
              {profileDisplay.goals?.values.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <Compass
                    size={14}
                    style={{ color: "var(--electric-blue)" }}
                  />
                  <span style={{ color: "var(--slate-400)" }}>Goals:</span>
                  <span
                    className="line-clamp-2"
                    style={{ color: "var(--ice-white)" }}
                  >
                    {profileDisplay.goals.values[0]}
                  </span>
                </div>
              )}

              {profileDisplay.targetRole?.values.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase
                    size={14}
                    style={{ color: "var(--electric-blue)" }}
                  />
                  <span style={{ color: "var(--slate-400)" }}>Target:</span>
                  <span style={{ color: "var(--ice-white)" }}>
                    {profileDisplay.targetRole.values.join(", ")}
                  </span>
                </div>
              )}

              {profileDisplay.skills?.values.length > 0 && (
                <div className="flex items-start gap-2 text-sm">
                  <Zap size={14} style={{ color: "var(--electric-blue)" }} />
                  <span style={{ color: "var(--slate-400)" }}>Top skills:</span>
                  <div className="flex flex-wrap gap-1">
                    {profileDisplay.skills.values.slice(0, 5).map(s => (
                      <span
                        key={s}
                        className="rounded-full px-2 py-0.5 text-xs"
                        style={{
                          backgroundColor: "rgba(0, 201, 255, 0.1)",
                          color: "var(--electric-blue)",
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {profileDisplay.location?.values.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={14} style={{ color: "var(--electric-blue)" }} />
                  <span style={{ color: "var(--slate-400)" }}>Location:</span>
                  <span style={{ color: "var(--ice-white)" }}>
                    {profileDisplay.location.values[0]}
                  </span>
                </div>
              )}

              {profileDisplay.environment?.values.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Building2
                    size={14}
                    style={{ color: "var(--electric-blue)" }}
                  />
                  <span style={{ color: "var(--slate-400)" }}>
                    Environment:
                  </span>
                  <span style={{ color: "var(--ice-white)" }}>
                    {profileDisplay.environment.values[0]}
                  </span>
                </div>
              )}

              {profileDisplay.compensation?.values.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <DollarSign
                    size={14}
                    style={{ color: "var(--electric-blue)" }}
                  />
                  <span style={{ color: "var(--slate-400)" }}>
                    Compensation:
                  </span>
                  <span style={{ color: "var(--ice-white)" }}>
                    {profileDisplay.compensation.values[0]}
                  </span>
                </div>
              )}

              {profileDisplay.level?.values.length > 0 && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={14} style={{ color: "var(--electric-blue)" }} />
                  <span style={{ color: "var(--slate-400)" }}>Level:</span>
                  <span style={{ color: "var(--ice-white)" }}>
                    {profileDisplay.level.values[0]}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            onClick={handleFinish}
            className="accent-gradient mt-8 flex items-center gap-2 rounded-xl px-8 py-3.5 text-base font-semibold text-white transition-all duration-200 hover:shadow-lg"
            style={{
              boxShadow: "0 0 20px rgba(0, 201, 255, 0.2)",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow =
                "0 0 30px rgba(0, 201, 255, 0.35)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 0 20px rgba(0, 201, 255, 0.2)";
            }}
          >
            Launch Agent Research
            <ArrowRight size={18} />
          </motion.button>
        </section>
      )}
    </div>
  );
}
