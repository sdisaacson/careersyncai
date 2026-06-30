import { useMemo, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Check, Loader2 } from "lucide-react";
import type { Job, Profile } from "@/db/schema";
import { trpc } from "@/lib/trpc.tsx";
import { generateInsights } from "@/lib/insightsEngine";
import { InsightCard } from "./InsightCard";

function relativeTime(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  const secs = Math.round((Date.now() - d.getTime()) / 1000);
  if (Number.isNaN(secs)) return "";
  if (secs < 60) return "just now";
  const mins = Math.round(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}

export function InsightsPanel({
  jobs,
  profile,
  profileId,
  isRealData,
}: {
  jobs: Job[];
  profile: Profile | null;
  profileId: number;
  isRealData: boolean;
}) {
  const insights = useMemo(
    () => generateInsights(jobs, profile),
    [jobs, profile]
  );

  const persisted = trpc.insights.getByProfile.useQuery(
    { profileId },
    { refetchOnWindowFocus: false }
  );
  const upsert = trpc.insights.upsertMany.useMutation({
    onSuccess: () => {
      void persisted.refetch();
    },
  });

  const [savedState, setSavedState] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const lastSavedRef = useRef<string>("");

  // Debounced persistence — only for real (DB-backed) data, and only when the
  // computed insight set actually changes.
  useEffect(() => {
    if (!isRealData || insights.length === 0) return;

    const payload = insights.map(i => ({
      insightType: i.insightType,
      title: i.title,
      description: i.description,
      severity: i.severity,
      data: i.data,
    }));
    const serialized = JSON.stringify(payload);
    if (serialized === lastSavedRef.current) return;

    const timeoutId = setTimeout(() => {
      lastSavedRef.current = serialized;
      setSavedState("saving");
      upsert.mutate(
        {
          profileId,
          userId: profile?.userId ?? 1,
          insights: payload,
        },
        {
          onSuccess: () => setSavedState("saved"),
          onError: () => setSavedState("idle"),
        }
      );
    }, 1000);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [insights, isRealData, profileId, profile?.userId]);

  const lastSavedAt = persisted.data?.[0]?.createdAt;

  return (
    <div
      className="rounded-2xl border p-5"
      style={{ backgroundColor: "#0F1620", borderColor: "#334155" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3
            className="flex items-center gap-2 text-base font-bold"
            style={{ color: "#F5F7FA" }}
          >
            <Sparkles size={16} style={{ color: "#00C9FF" }} />
            AI Insights
          </h3>
          <p className="mt-0.5 text-[11px]" style={{ color: "#64748B" }}>
            Patterns across your {jobs.length} filtered{" "}
            {jobs.length === 1 ? "role" : "roles"}
          </p>
        </div>

        {/* Save indicator */}
        {isRealData && (
          <AnimatePresence mode="wait">
            {savedState === "saving" && (
              <motion.span
                key="saving"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 text-[10px]"
                style={{ color: "#64748B" }}
              >
                <Loader2 size={11} className="animate-spin" />
                Saving
              </motion.span>
            )}
            {savedState === "saved" && (
              <motion.span
                key="saved"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-1 text-[10px]"
                style={{ color: "#22C55E" }}
              >
                <Check size={11} />
                Saved
              </motion.span>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Insights */}
      <div className="mt-4 space-y-3">
        {insights.length === 0 ? (
          <div
            className="rounded-xl border border-dashed p-6 text-center"
            style={{ borderColor: "#334155" }}
          >
            <Sparkles
              size={20}
              className="mx-auto"
              style={{ color: "#334155" }}
            />
            <p className="mt-2 text-xs" style={{ color: "#94A3B8" }}>
              Not enough data to surface insights yet
            </p>
            <p className="mt-1 text-[11px]" style={{ color: "#64748B" }}>
              Adjust your filters or complete your profile
            </p>
          </div>
        ) : (
          insights.map((insight, i) => (
            <InsightCard
              key={`${insight.insightType}-${i}`}
              insight={insight}
              index={i}
            />
          ))
        )}
      </div>

      {/* Footer / persistence note */}
      {isRealData && lastSavedAt && (
        <p className="mt-4 text-[10px]" style={{ color: "#475569" }}>
          Last saved to your history {relativeTime(lastSavedAt)}
        </p>
      )}
      {!isRealData && insights.length > 0 && (
        <p className="mt-4 text-[10px]" style={{ color: "#475569" }}>
          Preview data — insights are saved once real opportunities are loaded
        </p>
      )}
    </div>
  );
}
