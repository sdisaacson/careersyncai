import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  FileText,
  CheckCircle,
  Sparkles,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { BARBARA_PARSED_RESUME } from "@/lib/barbaraDemo";

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];
const steps = ["Upload", "Interview", "Research", "Results", "Resumes"];

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DemoUploadPage() {
  const profile = BARBARA_PARSED_RESUME.profile;

  return (
    <div
      className="min-h-[100dvh] w-full"
      style={{ backgroundColor: "var(--deep-navy)" }}
    >
      {/* Header */}
      <section className="mx-auto max-w-[800px] px-4 pt-16 pb-12 sm:pt-20 sm:pb-12">
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
          STEP 1 OF 5
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5, ease: easeOutExpo }}
          className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl"
          style={{ color: "var(--ice-white)" }}
        >
          Upload Your Resume
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: easeOutExpo }}
          className="mt-3 max-w-[560px] text-lg leading-relaxed"
          style={{ color: "var(--slate-400)" }}
        >
          Barbara begins by uploading a copy of her resume. Resumes saved as PDF
          or DOCX are accepted. Once the resume is uploaded, CareerSyncAI
          extracts and saves her information for later.
        </motion.p>

        {/* Progress steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: easeOutExpo }}
          className="mt-8"
        >
          <div className="flex items-center justify-between gap-2">
            {steps.map((label, i) => (
              <div
                key={label}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors duration-500"
                  style={{
                    backgroundColor:
                      i === 0 ? "var(--electric-blue)" : "var(--slate-700)",
                    color: i === 0 ? "#0B0E14" : "var(--slate-400)",
                    fontFamily: "JetBrains Mono, monospace",
                  }}
                >
                  {i === 0 ? "1" : i + 1}
                </div>
                <span
                  className="hidden text-xs sm:inline"
                  style={{
                    color:
                      i === 0 ? "var(--electric-blue)" : "var(--slate-400)",
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "11px",
                  }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div
            className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--slate-700)" }}
          >
            <motion.div
              className="absolute left-0 top-0 h-full rounded-full progress-gradient"
              initial={{ width: "0%" }}
              animate={{ width: "20%" }}
              transition={{ delay: 0.4, duration: 0.6, ease: easeOutExpo }}
            />
          </div>
        </motion.div>
      </section>

      {/* File + parsed profile */}
      <section className="mx-auto max-w-[720px] px-4 pb-20">
        {/* File card */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="flex items-center gap-4 rounded-xl px-5 py-4"
          style={{
            backgroundColor: "var(--midnight)",
            border: "1px solid var(--slate-700)",
          }}
        >
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: "rgba(0, 201, 255, 0.1)" }}
          >
            <FileText size={24} style={{ color: "var(--electric-blue)" }} />
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="truncate text-sm font-medium"
              style={{ color: "var(--ice-white)" }}
            >
              {BARBARA_PARSED_RESUME.filename}
            </p>
            <p className="text-xs" style={{ color: "var(--slate-400)" }}>
              {formatSize(BARBARA_PARSED_RESUME.size)}
            </p>
          </div>
          <span
            className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium"
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.15)",
              color: "#22C55E",
            }}
          >
            <CheckCircle size={12} />
            Parsed
          </span>
        </motion.div>

        {/* Extracted profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: easeOutExpo }}
          className="mt-6 rounded-2xl p-6 sm:p-8"
          style={{
            backgroundColor: "var(--slate-800)",
            border: "1px solid var(--slate-700)",
          }}
        >
          <div className="mb-6 flex items-center gap-2">
            <Sparkles size={20} style={{ color: "var(--electric-blue)" }} />
            <h3
              className="text-xl font-semibold"
              style={{ color: "var(--ice-white)" }}
            >
              Extracted Profile
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ProfileField
              icon={<User size={14} />}
              label="Full Name"
              value={profile.name}
              delay={0.3}
            />
            <ProfileField
              icon={<Briefcase size={14} />}
              label="Experience"
              value={profile.experience}
              delay={0.4}
            />
            <ProfileField
              icon={<GraduationCap size={14} />}
              label="Education"
              value={profile.education}
              delay={0.5}
            />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="rounded-xl p-4"
              style={{ backgroundColor: "var(--midnight)" }}
            >
              <div className="mb-1 flex items-center gap-2">
                <Wrench size={14} style={{ color: "var(--slate-400)" }} />
                <span
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: "var(--slate-400)" }}
                >
                  Skills
                </span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {profile.skills
                  .split(",")
                  .slice(0, 8)
                  .map(skill => (
                    <span
                      key={skill.trim()}
                      className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                      style={{
                        backgroundColor: "rgba(0, 201, 255, 0.1)",
                        color: "var(--electric-blue)",
                      }}
                    >
                      {skill.trim()}
                    </span>
                  ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="mt-8 flex flex-col-reverse items-center justify-end gap-3 sm:flex-row"
          >
            <Link
              to="/demo"
              className="flex w-full items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-all duration-200 sm:w-auto"
              style={{
                borderColor: "var(--slate-700)",
                color: "var(--slate-400)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--electric-blue)";
                e.currentTarget.style.color = "var(--electric-blue)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--slate-700)";
                e.currentTarget.style.color = "var(--slate-400)";
              }}
            >
              <ArrowLeft size={16} />
              Back
            </Link>
            <Link
              to="/demo/interview"
              className="accent-gradient flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 sm:w-auto"
              style={{ boxShadow: "0 0 20px rgba(0, 201, 255, 0.2)" }}
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
              Next
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}

function ProfileField({
  icon,
  label,
  value,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="rounded-xl p-4"
      style={{ backgroundColor: "var(--midnight)" }}
    >
      <div className="mb-1 flex items-center gap-2">
        <span style={{ color: "var(--slate-400)" }}>{icon}</span>
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: "var(--slate-400)" }}
        >
          {label}
        </span>
      </div>
      <p
        className="mt-1 text-sm leading-relaxed"
        style={{ color: "var(--ice-white)" }}
      >
        {value}
      </p>
    </motion.div>
  );
}
