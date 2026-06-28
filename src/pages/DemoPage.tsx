import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function DemoPage() {
  return (
    <div
      className="min-h-[100dvh] w-full"
      style={{ backgroundColor: "var(--deep-navy)" }}
    >
      <section className="mx-auto flex min-h-[100dvh] max-w-[1000px] flex-col items-center justify-center px-4 py-20 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
          className="text-xs font-medium uppercase tracking-[0.15em]"
          style={{
            color: "var(--electric-blue)",
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          Barbara&apos;s Demo Journey
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: easeOutExpo }}
          className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
          style={{
            color: "var(--ice-white)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          See How CareerSync Works
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: easeOutExpo }}
          className="mx-auto mt-5 max-w-[600px] text-lg leading-relaxed"
          style={{ color: "var(--slate-400)" }}
        >
          Follow Barbara, a recent Art History graduate, as CareerSync parses
          her resume, interviews her, finds matching roles, and generates
          tailored resumes — all in one seamless flow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: easeOutExpo }}
          className="mt-10 rounded-2xl border p-6 sm:p-8"
          style={{
            backgroundColor: "var(--midnight)",
            borderColor: "var(--slate-700)",
            maxWidth: "420px",
            width: "100%",
          }}
        >
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:text-left">
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-2xl font-bold"
              style={{
                background: "linear-gradient(135deg, #00C9FF 0%, #7C3AED 100%)",
                color: "#FFFFFF",
              }}
            >
              BC
            </div>
            <div>
              <h2
                className="text-xl font-semibold"
                style={{ color: "var(--ice-white)" }}
              >
                Barbara Chen
              </h2>
              <p className="mt-1 text-sm" style={{ color: "var(--slate-400)" }}>
                B.A. Art History, Minor in Museum Studies
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--slate-500)" }}>
                New York, NY
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5, ease: easeOutExpo }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Link
            to="/demo/upload"
            className="accent-gradient inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-white transition-all duration-200"
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
            Start Demo
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/signup"
            className="inline-flex items-center rounded-xl border px-8 py-3.5 text-sm font-semibold transition-all duration-200"
            style={{
              borderColor: "var(--electric-blue)",
              color: "var(--electric-blue)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = "rgba(0, 201, 255, 0.08)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            Sign Up Now
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
