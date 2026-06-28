import { trpc } from "@/lib/trpc.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, CreditCard, XCircle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const iceWhite = "var(--ice-white)";
const slate400 = "var(--slate-400)";
const midnight = "var(--midnight)";
const slate700 = "var(--slate-700)";

export default function AdminDashboardPage() {
  const { data, isLoading } = trpc.admin.dashboard.useQuery();

  const stats = [
    {
      label: "Total Users",
      value: data?.totalUsers ?? 0,
      icon: Users,
      color: "#00C9FF",
    },
    {
      label: "Active Subscriptions",
      value: data?.activeSubscriptions ?? 0,
      icon: CreditCard,
      color: "#22C55E",
    },
    {
      label: "Canceled Subscriptions",
      value: data?.canceledSubscriptions ?? 0,
      icon: XCircle,
      color: "#EF4444",
    },
  ];

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
          Admin Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-base" style={{ color: slate400 }}>
          Welcome back. Here&apos;s a quick overview of platform activity.
        </p>
      </motion.div>

      <motion.div
        className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08 } },
        }}
      >
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card
                key={i}
                className="border-0 shadow-none"
                style={{ backgroundColor: midnight }}
              >
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24" style={{ backgroundColor: slate700 }} />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-20" style={{ backgroundColor: slate700 }} />
                </CardContent>
              </Card>
            ))
          : stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5, ease: easeOutExpo },
                  },
                }}
              >
                <Card
                  className="relative overflow-hidden border-0 transition-all duration-300 hover:-translate-y-1"
                  style={{
                    backgroundColor: midnight,
                    borderLeft: `3px solid ${stat.color}`,
                  }}
                >
                  <div
                    className="pointer-events-none absolute right-0 top-0 h-24 w-24 opacity-10"
                    style={{
                      background: `radial-gradient(circle at 100% 0%, ${stat.color} 0%, transparent 70%)`,
                    }}
                  />
                  <CardHeader className="pb-2">
                    <CardTitle
                      className="text-sm font-medium"
                      style={{ color: slate400 }}
                    >
                      {stat.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end justify-between">
                      <span
                        className="font-mono text-3xl font-bold"
                        style={{ color: stat.color }}
                      >
                        {stat.value.toLocaleString()}
                      </span>
                      <stat.icon
                        className="h-5 w-5"
                        style={{ color: stat.color, opacity: 0.8 }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3, ease: easeOutExpo }}
        className="mt-8 rounded-2xl border p-6 sm:p-8"
        style={{
          backgroundColor: midnight,
          borderColor: slate700,
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ backgroundColor: "rgba(0, 201, 255, 0.12)" }}
          >
            <TrendingUp className="h-5 w-5" style={{ color: "#00C9FF" }} />
          </div>
          <div>
            <h2
              className="text-lg font-semibold"
              style={{ color: iceWhite }}
            >
              Platform Overview
            </h2>
            <p className="text-sm" style={{ color: slate400 }}>
              Use the sidebar to manage users, subscriptions, and system
              settings.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
