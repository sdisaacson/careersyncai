import { trpc } from "@/lib/trpc.tsx";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { CreditCard, Check, X } from "lucide-react";
import { motion } from "framer-motion";

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const iceWhite = "var(--ice-white)";
const slate400 = "var(--slate-400)";
const midnight = "var(--midnight)";
const slate700 = "var(--slate-700)";

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(date);
  }
}

function formatPrice(cents: number | null | undefined): string {
  if (cents == null) return "—";
  return `$${(cents / 100).toFixed(2)}`;
}

function statusColor(
  status: string | null | undefined
): { bg: string; text: string } {
  switch (status) {
    case "active":
      return { bg: "rgba(34, 197, 94, 0.15)", text: "#22C55E" };
    case "canceled":
      return { bg: "rgba(239, 68, 68, 0.15)", text: "#EF4444" };
    case "past_due":
      return { bg: "rgba(245, 158, 11, 0.15)", text: "#F59E0B" };
    case "inactive":
    default:
      return { bg: "rgba(148, 163, 184, 0.15)", text: "#94A3B8" };
  }
}

export default function AdminSubscriptionsPage() {
  const { data: subscriptions, isLoading } =
    trpc.admin.subscriptions.list.useQuery();

  return (
    <div className="mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
      >
        <h1
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ color: iceWhite }}
        >
          Subscriptions
        </h1>
        <p className="mt-2 text-base" style={{ color: slate400 }}>
          Review subscription status, billing intervals, and renewal dates.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
        className="mt-6 overflow-hidden rounded-xl border"
        style={{ backgroundColor: midnight, borderColor: slate700 }}
      >
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton
                  className="h-4 w-20"
                  style={{ backgroundColor: slate700 }}
                />
                <Skeleton
                  className="h-4 w-28"
                  style={{ backgroundColor: slate700 }}
                />
                <Skeleton
                  className="h-4 w-20"
                  style={{ backgroundColor: slate700 }}
                />
                <Skeleton
                  className="h-4 w-16"
                  style={{ backgroundColor: slate700 }}
                />
                <Skeleton
                  className="h-4 w-16"
                  style={{ backgroundColor: slate700 }}
                />
                <Skeleton
                  className="h-4 w-24"
                  style={{ backgroundColor: slate700 }}
                />
                <Skeleton
                  className="h-4 w-20"
                  style={{ backgroundColor: slate700 }}
                />
              </div>
            ))}
          </div>
        ) : !subscriptions || subscriptions.length === 0 ? (
          <Empty className="py-20" style={{ borderColor: slate700 }}>
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                style={{ backgroundColor: "rgba(0, 201, 255, 0.12)" }}
              >
                <CreditCard className="h-6 w-6" style={{ color: "#00C9FF" }} />
              </EmptyMedia>
              <EmptyTitle style={{ color: iceWhite }}>
                No subscriptions found
              </EmptyTitle>
              <EmptyDescription>
                There are no subscription records in the system yet.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor: slate700 }}>
                  <TableHead style={{ color: slate400 }}>User ID</TableHead>
                  <TableHead style={{ color: slate400 }}>Plan</TableHead>
                  <TableHead style={{ color: slate400 }}>Status</TableHead>
                  <TableHead style={{ color: slate400 }}>Price</TableHead>
                  <TableHead style={{ color: slate400 }}>Interval</TableHead>
                  <TableHead style={{ color: slate400 }}>
                    Current Period End
                  </TableHead>
                  <TableHead style={{ color: slate400 }}>
                    Cancel at Period End
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((sub) => {
                  const colors = statusColor(sub.status);
                  return (
                    <TableRow
                      key={sub.id}
                      style={{ borderColor: slate700 }}
                      className="hover:bg-[rgba(148,163,184,0.06)]"
                    >
                      <TableCell
                        className="font-mono text-xs"
                        style={{ color: slate400 }}
                      >
                        {sub.userId}
                      </TableCell>
                      <TableCell style={{ color: iceWhite }}>
                        {sub.planName ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className="capitalize"
                          style={{
                            backgroundColor: colors.bg,
                            color: colors.text,
                            borderColor: "transparent",
                          }}
                        >
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell style={{ color: slate400 }}>
                        {formatPrice(sub.priceCents)}
                      </TableCell>
                      <TableCell style={{ color: slate400 }}>
                        {sub.interval ?? "—"}
                      </TableCell>
                      <TableCell style={{ color: slate400 }}>
                        {formatDate(sub.currentPeriodEnd)}
                      </TableCell>
                      <TableCell>
                        {sub.cancelAtPeriodEnd ? (
                          <span
                            className="inline-flex items-center gap-1 text-xs font-medium"
                            style={{ color: "#EF4444" }}
                          >
                            <X className="h-3.5 w-3.5" />
                            Yes
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 text-xs font-medium"
                            style={{ color: "#22C55E" }}
                          >
                            <Check className="h-3.5 w-3.5" />
                            No
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
