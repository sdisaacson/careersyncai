import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  HeartPulse,
  Landmark,
  Zap,
  GraduationCap,
  Factory,
  Briefcase,
  Shield,
  CheckCircle2,
  Play,
  ArrowRight,
  BarChart3,
  Clock,
  Globe,
  TrendingUp,
  Database,
  ZapIcon,
  Activity,
  Search,
  Network,
  Sparkles,
} from "lucide-react";
import { trpc } from "@/lib/trpc.tsx";
import AgentCanvas from "@/components/research/AgentCanvas";
import ActivityLog from "@/components/research/ActivityLog";
import {
  SECTOR_CONFIGS,
  generateMockJobsForSector,
  createLogEntry,
  getLogMessagesForSector,
} from "@/lib/researchMockData";
import type { LogEntry, MockJob } from "@/lib/researchMockData";

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as [number, number, number, number];

const SECTOR_ICONS: Record<string, React.ElementType> = {
  cpu: Cpu,
  "heart-pulse": HeartPulse,
  landmark: Landmark,
  zap: Zap,
  "graduation-cap": GraduationCap,
  factory: Factory,
  briefcase: Briefcase,
  shield: Shield,
};

type SectorStatus = "waiting" | "running" | "completed";

type SectorState = {
  id: number;
  name: string;
  color: string;
  icon: string;
  status: SectorStatus;
  jobCount: number;
  progress: number;
  jobs: MockJob[];
};

export default function ResearchPage() {
  const navigate = useNavigate();
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [sectors, setSectors] = useState<SectorState[]>(
    SECTOR_CONFIGS.map(s => ({
      id: s.id,
      name: s.name,
      color: s.color,
      icon: s.icon,
      status: "waiting" as SectorStatus,
      jobCount: 0,
      progress: 0,
      jobs: [],
    }))
  );
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [expandedSector, setExpandedSector] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalJobsFound, setTotalJobsFound] = useState(0);
  const [completedSectors, setCompletedSectors] = useState(0);
  const [sourcesScanned, setSourcesScanned] = useState(0);
  const [matchesAnalyzed, setMatchesAnalyzed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const createManyJobs = trpc.job.createMany.useMutation();

  const addLog = useCallback(
    (
      sector: string,
      sectorColor: string,
      message: string,
      status: LogEntry["status"] = "active"
    ) => {
      setLogEntries(prev => [
        ...prev,
        createLogEntry(sector, sectorColor, message, status),
      ]);
    },
    []
  );

  const clearLog = useCallback(() => {
    setLogEntries([]);
  }, []);

  // Timer
  useEffect(() => {
    if (isRunning && !isComplete) {
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isComplete]);

  const runSimulation = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
    setIsComplete(false);
    setElapsedTime(0);
    setTotalJobsFound(0);
    setCompletedSectors(0);
    setSourcesScanned(0);
    setMatchesAnalyzed(0);
    setLogEntries([]);
    setSectors(prev =>
      prev.map(s => ({
        ...s,
        status: "waiting" as SectorStatus,
        jobCount: 0,
        progress: 0,
        jobs: [],
      }))
    );

    const allJobs: MockJob[] = [];

    for (let i = 0; i < SECTOR_CONFIGS.length; i++) {
      const sectorConfig = SECTOR_CONFIGS[i];

      // Mark sector as running
      setSectors(prev =>
        prev.map(s =>
          s.id === sectorConfig.id
            ? { ...s, status: "running" as SectorStatus }
            : s
        )
      );

      // Add log entries for this sector
      const messages = getLogMessagesForSector(sectorConfig);
      for (let m = 0; m < messages.length - 1; m++) {
        addLog(sectorConfig.name, sectorConfig.color, messages[m], "active");
        await new Promise(r => setTimeout(r, 300 + Math.random() * 400));
      }

      // Generate jobs
      const jobs = generateMockJobsForSector(sectorConfig);
      allJobs.push(...jobs);

      // Mark sector as completed
      setSectors(prev =>
        prev.map(s =>
          s.id === sectorConfig.id
            ? {
                ...s,
                status: "completed" as SectorStatus,
                jobCount: jobs.length,
                progress: 100,
                jobs,
              }
            : s
        )
      );

      setTotalJobsFound(prev => prev + jobs.length);
      setCompletedSectors(prev => prev + 1);
      setSourcesScanned(prev => prev + Math.floor(Math.random() * 3) + 2);
      setMatchesAnalyzed(prev => prev + jobs.length * 3);

      addLog(
        sectorConfig.name,
        sectorConfig.color,
        messages[messages.length - 1],
        "complete"
      );
    }

    // Save all jobs to database
    if (allJobs.length > 0) {
      const dbJobs = allJobs.map(job => ({
        profileId: 1,
        sectorId: job.sectorId,
        title: job.title,
        company: job.company,
        location: job.location,
        jobDescription: job.jobDescription,
        requirements: job.requirements,
        responsibilities: job.responsibilities,
        salaryRange: job.salaryRange,
        jobType: job.jobType,
        experienceLevel: job.experienceLevel,
        applicationLink: job.applicationLink,
        deadline: job.deadline,
        postedDate: job.postedDate,
        source: job.source,
        fitScore: job.fitScore,
        matchReasons: job.matchReasons,
        skillGaps: job.skillGaps,
      }));

      try {
        await createManyJobs.mutateAsync(dbJobs);
        addLog(
          "System",
          "#00C9FF",
          `Saved ${dbJobs.length} jobs to database`,
          "complete"
        );
      } catch {
        addLog(
          "System",
          "#EF4444",
          "Failed to save jobs to database",
          "complete"
        );
      }
    }

    setIsRunning(false);
    setIsComplete(true);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [isRunning, addLog, createManyJobs]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const overallProgress =
    sectors.length > 0
      ? Math.round(
          sectors.reduce((sum, s) => sum + s.progress, 0) / sectors.length
        )
      : 0;

  const avgFitScore =
    sectors.flatMap(s => s.jobs).length > 0
      ? Math.round(
          sectors.flatMap(s => s.jobs).reduce((sum, j) => sum + j.fitScore, 0) /
            sectors.flatMap(s => s.jobs).length
        )
      : 0;

  return (
    <div style={{ backgroundColor: "#0B0E14", minHeight: "100dvh" }}>
      {/* Section 1: Page Header */}
      <section className="mx-auto max-w-[1200px] px-4 pt-20 pb-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
          className="text-center"
        >
          <span
            className="mb-4 inline-block text-xs font-medium tracking-wider"
            style={{
              color: "#00C9FF",
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            }}
          >
            STEP 3 OF 5
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.1 }}
          className="text-center text-3xl font-bold sm:text-4xl lg:text-5xl"
          style={{
            color: "#F5F7FA",
            letterSpacing: "-0.02em",
            lineHeight: 1.15,
          }}
        >
          Launching Research Agents
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.2 }}
          className="mx-auto mt-6 max-w-[640px] text-center text-base sm:text-lg"
          style={{ color: "#94A3B8", lineHeight: 1.6 }}
        >
          Our AI is now searching across 8 economic sectors in parallel. Each
          specialized agent scans job boards, company websites, and professional
          networks to find the best matches for your profile.
        </motion.p>

        {/* Progress steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.3 }}
          className="mx-auto mt-8 flex max-w-[500px] items-center justify-center gap-2"
        >
          {[1, 2, 3, 4, 5].map(step => (
            <div key={step} className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
                style={{
                  backgroundColor:
                    step < 3 ? "#22C55E" : step === 3 ? "#00C9FF" : "#1E293B",
                  color: step <= 3 ? "#FFFFFF" : "#64748B",
                  border:
                    step === 3
                      ? "2px solid #00C9FF"
                      : step < 3
                        ? "2px solid #22C55E"
                        : "2px solid #334155",
                }}
              >
                {step < 3 ? <CheckCircle2 size={14} /> : step}
              </div>
              {step < 5 && (
                <div
                  className="h-[2px] w-6 sm:w-10"
                  style={{
                    backgroundColor: step < 3 ? "#22C55E" : "#334155",
                  }}
                />
              )}
            </div>
          ))}
        </motion.div>
      </section>

      {/* Section 2: Control + Overall Progress + Main Dashboard */}
      <section className="mx-auto max-w-[1200px] px-4 pb-12 sm:px-6 lg:px-8">
        {/* Control Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.4 }}
          className="mb-6 flex items-center justify-center gap-4"
        >
          {!isComplete ? (
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className="flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: isRunning
                  ? "#334155"
                  : "linear-gradient(135deg, #00C9FF 0%, #3B82F6 50%, #7C3AED 100%)",
                boxShadow: isRunning
                  ? "none"
                  : "0 0 20px rgba(0, 201, 255, 0.2)",
              }}
              onMouseEnter={e => {
                if (!isRunning) {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow =
                    "0 0 30px rgba(0, 201, 255, 0.35)";
                }
              }}
              onMouseLeave={e => {
                if (!isRunning) {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow =
                    "0 0 20px rgba(0, 201, 255, 0.2)";
                }
              }}
            >
              {isRunning ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Research in Progress...
                </>
              ) : (
                <>
                  <Play size={16} />
                  Start Research
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-all duration-200"
              style={{
                background:
                  "linear-gradient(135deg, #00C9FF 0%, #3B82F6 50%, #7C3AED 100%)",
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
              View Results
              <ArrowRight size={16} />
            </button>
          )}

          {isComplete && (
            <button
              onClick={runSimulation}
              className="rounded-lg border px-5 py-3 text-sm font-medium transition-all duration-200"
              style={{
                borderColor: "#00C9FF",
                color: "#00C9FF",
                backgroundColor: "transparent",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor =
                  "rgba(0, 201, 255, 0.08)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              Run Again
            </button>
          )}
        </motion.div>

        {/* Overall Progress - Above both cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.45 }}
          className="mb-6 rounded-xl p-5"
          style={{
            backgroundColor: "#111827",
            border: "1px solid #334155",
          }}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} style={{ color: "#00C9FF" }} />
              <span
                className="text-sm font-medium"
                style={{ color: "#F5F7FA" }}
              >
                Overall Progress
              </span>
            </div>
            <span
              className="text-xs font-medium"
              style={{
                color: "#00C9FF",
                fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              }}
            >
              {overallProgress}%
            </span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "#1E293B" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, #00C9FF 0%, #3B82F6 50%, #7C3AED 100%)",
                boxShadow: "0 0 10px rgba(0, 201, 255, 0.3)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="flex items-center gap-2">
              <Globe size={14} style={{ color: "#94A3B8" }} />
              <span className="text-xs" style={{ color: "#94A3B8" }}>
                Sectors:{" "}
                <strong style={{ color: "#F5F7FA" }}>
                  {completedSectors}/8
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 size={14} style={{ color: "#94A3B8" }} />
              <span className="text-xs" style={{ color: "#94A3B8" }}>
                Jobs:{" "}
                <strong style={{ color: "#F5F7FA" }}>{totalJobsFound}</strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={14} style={{ color: "#94A3B8" }} />
              <span className="text-xs" style={{ color: "#94A3B8" }}>
                Time:{" "}
                <strong style={{ color: "#F5F7FA" }}>
                  {formatTime(elapsedTime)}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles size={14} style={{ color: "#94A3B8" }} />
              <span className="text-xs" style={{ color: "#94A3B8" }}>
                Avg Fit:{" "}
                <strong style={{ color: "#F5F7FA" }}>{avgFitScore}%</strong>
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Dashboard: Canvas + Log */}
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Agent Arena */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.5 }}
            className="relative overflow-hidden lg:w-[58%]"
            style={{
              backgroundColor: "#111827",
              border: "1px solid #334155",
              borderRadius: "16px",
              aspectRatio: "16/10",
            }}
          >
            <AgentCanvas
              isRunning={isRunning}
              completedSectors={completedSectors}
              totalSectors={8}
              jobsFound={totalJobsFound}
            />
          </motion.div>

          {/* Activity Log */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.6 }}
            className="h-[400px] lg:h-auto lg:w-[42%]"
            style={{ minHeight: "300px" }}
          >
            <ActivityLog entries={logEntries} onClear={clearLog} />
          </motion.div>
        </div>

        {/* Additional Metrics Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.7 }}
          className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <MetricCard
            icon={Search}
            label="Sources Scanned"
            value={sourcesScanned > 0 ? sourcesScanned.toString() : "—"}
            subValue="job boards"
            color="#00C9FF"
            isActive={isRunning || isComplete}
          />
          <MetricCard
            icon={Network}
            label="Matches Analyzed"
            value={matchesAnalyzed > 0 ? matchesAnalyzed.toString() : "—"}
            subValue="candidates"
            color="#22C55E"
            isActive={isRunning || isComplete}
          />
          <MetricCard
            icon={Database}
            label="Data Points"
            value={totalJobsFound > 0 ? (totalJobsFound * 12).toString() : "—"}
            subValue="per job"
            color="#F59E0B"
            isActive={isRunning || isComplete}
          />
          <MetricCard
            icon={ZapIcon}
            label="Processing Speed"
            value={isRunning ? "2.4x" : isComplete ? "2.4x" : "—"}
            subValue="vs manual"
            color="#EC4899"
            isActive={isRunning || isComplete}
          />
        </motion.div>
      </section>

      {/* Section 3: Sector Breakdown */}
      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          className="mb-8"
        >
          <h2
            className="text-2xl font-semibold sm:text-3xl"
            style={{ color: "#F5F7FA", letterSpacing: "-0.01em" }}
          >
            Sector Coverage
          </h2>
          <p className="mt-2 text-base" style={{ color: "#94A3B8" }}>
            Research distribution across economic sectors
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sectors.map((sector, index) => {
            const IconComponent = SECTOR_ICONS[sector.icon] || Cpu;
            const isExpanded = expandedSector === sector.id;

            return (
              <motion.div
                key={sector.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.7,
                  ease: EASE_OUT_EXPO,
                  delay: index * 0.1,
                }}
                layout
                className="cursor-pointer overflow-hidden rounded-xl"
                style={{
                  backgroundColor: "#1E293B",
                  border: "1px solid",
                  borderColor:
                    sector.status === "running"
                      ? `${sector.color}40`
                      : sector.status === "completed"
                        ? `${sector.color}30`
                        : "#334155",
                  boxShadow:
                    sector.status === "running"
                      ? `0 0 20px ${sector.color}15`
                      : "none",
                  transition:
                    "border-color 0.35s ease-out, box-shadow 0.35s ease-out",
                }}
                onClick={() => setExpandedSector(isExpanded ? null : sector.id)}
                onMouseEnter={e => {
                  if (sector.status !== "running") {
                    e.currentTarget.style.borderColor = `${sector.color}40`;
                  }
                }}
                onMouseLeave={e => {
                  if (
                    sector.status !== "running" &&
                    sector.status !== "completed"
                  ) {
                    e.currentTarget.style.borderColor = "#334155";
                  } else if (sector.status === "completed") {
                    e.currentTarget.style.borderColor = `${sector.color}30`;
                  }
                }}
              >
                <div className="p-5">
                  {/* Top Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${sector.color}15` }}
                      >
                        <IconComponent
                          size={20}
                          style={{ color: sector.color }}
                        />
                      </div>
                      <div>
                        <h4
                          className="text-sm font-semibold"
                          style={{ color: "#F5F7FA" }}
                        >
                          {sector.name}
                        </h4>
                      </div>
                    </div>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                      style={{
                        backgroundColor: `${sector.color}15`,
                        color: sector.color,
                      }}
                    >
                      {sector.jobCount}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div
                      className="h-1 w-full overflow-hidden rounded-full"
                      style={{ backgroundColor: "#334155" }}
                    >
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: sector.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${sector.progress}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      />
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mt-3 flex items-center gap-2">
                    {sector.status === "running" && (
                      <div
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor: sector.color,
                          animation: "pulse 1.5s infinite",
                        }}
                      />
                    )}
                    {sector.status === "completed" && (
                      <CheckCircle2 size={12} style={{ color: "#22C55E" }} />
                    )}
                    {sector.status === "waiting" && (
                      <div
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: "#334155" }}
                      />
                    )}
                    <span className="text-xs" style={{ color: "#94A3B8" }}>
                      {sector.status === "running"
                        ? "Searching..."
                        : sector.status === "completed"
                          ? `Complete — ${sector.jobCount} found`
                          : "Waiting..."}
                    </span>
                  </div>

                  {/* Sparkline */}
                  {sector.status === "completed" && sector.jobs.length > 0 && (
                    <div className="mt-3">
                      <Sparkline
                        data={sector.jobs.map(j => j.fitScore)}
                        color={sector.color}
                      />
                    </div>
                  )}
                </div>

                {/* Expanded job list */}
                <AnimatePresence>
                  {isExpanded && sector.jobs.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                      className="overflow-hidden"
                      style={{ borderTop: "1px solid #334155" }}
                    >
                      <div
                        className="max-h-[280px] overflow-y-auto p-4"
                        style={{ backgroundColor: "rgba(17, 24, 39, 0.5)" }}
                      >
                        <div className="flex flex-col gap-2">
                          {sector.jobs.slice(0, 10).map((job, i) => (
                            <div
                              key={i}
                              className="rounded-lg p-3"
                              style={{ backgroundColor: "#1E293B" }}
                            >
                              <div className="flex items-center justify-between">
                                <span
                                  className="text-xs font-medium"
                                  style={{ color: "#F5F7FA" }}
                                >
                                  {job.title.length > 28
                                    ? job.title.slice(0, 28) + "..."
                                    : job.title}
                                </span>
                                <span
                                  className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                                  style={{
                                    backgroundColor:
                                      job.fitScore >= 80
                                        ? "rgba(0, 201, 255, 0.15)"
                                        : job.fitScore >= 60
                                          ? "rgba(59, 130, 246, 0.15)"
                                          : "rgba(100, 116, 139, 0.15)",
                                    color:
                                      job.fitScore >= 80
                                        ? "#00C9FF"
                                        : job.fitScore >= 60
                                          ? "#3B82F6"
                                          : "#64748B",
                                    fontFamily:
                                      '"JetBrains Mono", ui-monospace, monospace',
                                  }}
                                >
                                  {job.fitScore}%
                                </span>
                              </div>
                              <span
                                className="mt-1 block text-[11px]"
                                style={{ color: "#94A3B8" }}
                              >
                                {job.company} · {job.location}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Section 4: Completion */}
      <AnimatePresence>
        {isComplete && (
          <motion.section
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
            className="mx-auto max-w-[720px] px-4 py-12 sm:px-6 lg:px-8"
          >
            <div
              className="rounded-2xl p-12 text-center"
              style={{
                backgroundColor: "#1E293B",
                border: "1px solid #334155",
              }}
            >
              {/* Success Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="mx-auto flex h-24 w-24 items-center justify-center rounded-full"
                style={{ backgroundColor: "#22C55E" }}
              >
                <CheckCircle2 size={48} color="#FFFFFF" />
              </motion.div>

              {/* Ripple rings */}
              <div className="relative mx-auto -mt-24 flex h-24 w-24 items-center justify-center">
                <motion.div
                  initial={{ scale: 1, opacity: 0.4 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                  className="absolute inset-0 rounded-full"
                  style={{ border: "2px solid #22C55E" }}
                />
                <motion.div
                  initial={{ scale: 1, opacity: 0.3 }}
                  animate={{ scale: 2.5, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
                  className="absolute inset-0 rounded-full"
                  style={{ border: "2px solid #22C55E" }}
                />
              </div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5, ease: EASE_OUT_EXPO }}
                className="mt-6 text-3xl font-bold"
                style={{ color: "#F5F7FA", letterSpacing: "-0.02em" }}
              >
                Research Complete!
              </motion.h2>

              {/* Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5, ease: EASE_OUT_EXPO }}
                className="mt-6 flex items-center justify-center gap-8"
              >
                <div className="text-center">
                  <div
                    className="text-2xl font-bold sm:text-3xl"
                    style={{ color: "#F5F7FA" }}
                  >
                    <CounterAnimation target={totalJobsFound} duration={1000} />
                  </div>
                  <span
                    className="mt-1 block text-xs"
                    style={{ color: "#94A3B8" }}
                  >
                    Jobs Found
                  </span>
                </div>
                <div
                  className="h-10 w-px"
                  style={{ backgroundColor: "#334155" }}
                />
                <div className="text-center">
                  <div
                    className="text-2xl font-bold sm:text-3xl"
                    style={{ color: "#F5F7FA" }}
                  >
                    <CounterAnimation target={8} duration={800} />
                  </div>
                  <span
                    className="mt-1 block text-xs"
                    style={{ color: "#94A3B8" }}
                  >
                    Sectors
                  </span>
                </div>
                <div
                  className="h-10 w-px"
                  style={{ backgroundColor: "#334155" }}
                />
                <div className="text-center">
                  <div
                    className="text-2xl font-bold sm:text-3xl"
                    style={{ color: "#F5F7FA" }}
                  >
                    {formatTime(elapsedTime)}
                  </div>
                  <span
                    className="mt-1 block text-xs"
                    style={{ color: "#94A3B8" }}
                  >
                    Time Elapsed
                  </span>
                </div>
              </motion.div>

              {/* Top Matches Preview */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="mt-8"
              >
                <h3
                  className="mb-4 text-sm font-medium"
                  style={{ color: "#94A3B8" }}
                >
                  Top Matches
                </h3>
                <div className="flex flex-col gap-3 sm:flex-row">
                  {(() => {
                    const allFound = sectors.flatMap(s => s.jobs);
                    const top3 = allFound
                      .sort((a, b) => b.fitScore - a.fitScore)
                      .slice(0, 3);
                    return top3.map((job, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: 0.8 + i * 0.15,
                          duration: 0.4,
                          ease: EASE_OUT_EXPO,
                        }}
                        className="flex-1 rounded-xl p-4 text-left"
                        style={{
                          backgroundColor: "#111827",
                          border: "1px solid #334155",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className="text-xs font-medium"
                            style={{ color: "#F5F7FA" }}
                          >
                            {job.title.length > 28
                              ? job.title.slice(0, 28) + "..."
                              : job.title}
                          </span>
                          <span
                            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                            style={{
                              backgroundColor:
                                job.fitScore >= 80
                                  ? "rgba(0, 201, 255, 0.15)"
                                  : "rgba(59, 130, 246, 0.15)",
                              color: job.fitScore >= 80 ? "#00C9FF" : "#3B82F6",
                              fontFamily:
                                '"JetBrains Mono", ui-monospace, monospace',
                            }}
                          >
                            {job.fitScore}%
                          </span>
                        </div>
                        <span
                          className="mt-1 block text-[11px]"
                          style={{ color: "#94A3B8" }}
                        >
                          {job.company}
                        </span>
                        <span
                          className="mt-1 block text-[10px]"
                          style={{ color: "#64748B" }}
                        >
                          {job.sectorName}
                        </span>
                      </motion.div>
                    ));
                  })()}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="mt-8"
              >
                <button
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center gap-2 rounded-lg px-8 py-3 text-sm font-semibold text-white transition-all duration-200"
                  style={{
                    background:
                      "linear-gradient(135deg, #00C9FF 0%, #3B82F6 50%, #7C3AED 100%)",
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
                  View Full Results
                  <ArrowRight size={16} />
                </button>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Spacer for footer */}
      <div className="h-16" />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}

/* Metric Card Component */
function MetricCard({
  icon: Icon,
  label,
  value,
  subValue,
  color,
  isActive,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subValue: string;
  color: string;
  isActive: boolean;
}) {
  return (
    <div
      className="rounded-xl p-4"
      style={{
        backgroundColor: "#111827",
        border: "1px solid #334155",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={14} style={{ color: isActive ? color : "#64748B" }} />
        <span className="text-xs" style={{ color: "#94A3B8" }}>
          {label}
        </span>
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className="text-xl font-bold"
          style={{
            color: isActive ? "#F5F7FA" : "#64748B",
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          }}
        >
          {value}
        </span>
        <span className="text-[10px]" style={{ color: "#64748B" }}>
          {subValue}
        </span>
      </div>
    </div>
  );
}

/* Sparkline Component */
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = 120;
    const h = 32;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const points = data.map((v, i) => ({
      x: (i / (data.length - 1 || 1)) * w,
      y: h - ((v - min) / range) * (h - 4) - 2,
    }));

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      ctx.bezierCurveTo(cpx, prev.y, cpx, curr.y, curr.x, curr.y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Fill area
    ctx.lineTo(points[points.length - 1].x, h);
    ctx.lineTo(points[0].x, h);
    ctx.closePath();
    ctx.fillStyle = `${color}15`;
    ctx.fill();
  }, [data, color]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 120, height: 32, display: "block" }}
    />
  );
}

/* Counter Animation */
function CounterAnimation({
  target,
  duration,
}: {
  target: number;
  duration: number;
}) {
  const [count, setCount] = useState(0);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    startTimeRef.current = performance.now();
    let raf: number;

    const animate = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return <span>{count}</span>;
}
