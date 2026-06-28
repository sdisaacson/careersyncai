import { trpc } from "@/lib/trpc.tsx";
import { Button } from "@/components/ui/button";
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
import { Users, Shield, User } from "lucide-react";
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

export default function AdminUsersPage() {
  const utils = trpc.useUtils();
  const { data: users, isLoading } = trpc.admin.users.list.useQuery();

  const updateRole = trpc.admin.users.updateRole.useMutation({
    onSuccess: () => {
      utils.admin.users.list.invalidate();
    },
  });

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
          Users
        </h1>
        <p className="mt-2 text-base" style={{ color: slate400 }}>
          Manage registered accounts and assign admin privileges.
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
                  className="h-4 w-32"
                  style={{ backgroundColor: slate700 }}
                />
                <Skeleton
                  className="h-4 w-48"
                  style={{ backgroundColor: slate700 }}
                />
                <Skeleton
                  className="h-4 w-20"
                  style={{ backgroundColor: slate700 }}
                />
                <Skeleton
                  className="h-4 w-24"
                  style={{ backgroundColor: slate700 }}
                />
                <Skeleton
                  className="h-4 w-24"
                  style={{ backgroundColor: slate700 }}
                />
              </div>
            ))}
          </div>
        ) : !users || users.length === 0 ? (
          <Empty className="py-20" style={{ borderColor: slate700 }}>
            <EmptyHeader>
              <EmptyMedia variant="icon" style={{ backgroundColor: "rgba(0, 201, 255, 0.12)" }}>
                <Users className="h-6 w-6" style={{ color: "#00C9FF" }} />
              </EmptyMedia>
              <EmptyTitle style={{ color: iceWhite }}>No users found</EmptyTitle>
              <EmptyDescription>
                There are no registered users in the system yet.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow style={{ borderColor: slate700 }}>
                  <TableHead style={{ color: slate400 }}>Name</TableHead>
                  <TableHead style={{ color: slate400 }}>Email</TableHead>
                  <TableHead style={{ color: slate400 }}>Role</TableHead>
                  <TableHead style={{ color: slate400 }}>Created At</TableHead>
                  <TableHead style={{ color: slate400 }}>Last Sign In</TableHead>
                  <TableHead style={{ color: slate400 }} className="text-right">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => {
                  const isAdmin = user.role === "admin";
                  const nextRole = isAdmin ? "user" : "admin";

                  return (
                    <TableRow
                      key={user.id}
                      style={{ borderColor: slate700 }}
                      className="hover:bg-[rgba(148,163,184,0.06)]"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
                            style={{
                              backgroundColor: isAdmin
                                ? "rgba(0, 201, 255, 0.15)"
                                : "rgba(148, 163, 184, 0.15)",
                              color: isAdmin ? "#00C9FF" : "#94A3B8",
                            }}
                          >
                            {user.name?.charAt(0).toUpperCase() ?? "U"}
                          </div>
                          <span
                            className="font-medium"
                            style={{ color: iceWhite }}
                          >
                            {user.name ?? "Unnamed"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell style={{ color: slate400 }}>
                        {user.email ?? "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={isAdmin ? "default" : "secondary"}
                          className="gap-1"
                          style={{
                            backgroundColor: isAdmin
                              ? "rgba(0, 201, 255, 0.15)"
                              : "rgba(148, 163, 184, 0.15)",
                            color: isAdmin ? "#00C9FF" : "#94A3B8",
                            borderColor: "transparent",
                          }}
                        >
                          {isAdmin ? (
                            <Shield className="h-3 w-3" />
                          ) : (
                            <User className="h-3 w-3" />
                          )}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell style={{ color: slate400 }}>
                        {formatDate(user.createdAt)}
                      </TableCell>
                      <TableCell style={{ color: slate400 }}>
                        {formatDate(user.lastSignInAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={updateRole.isPending}
                          onClick={() =>
                            updateRole.mutate({ id: user.id, role: nextRole })
                          }
                          style={{
                            borderColor: "#334155",
                            color: isAdmin ? "#EF4444" : "#00C9FF",
                            backgroundColor: "transparent",
                          }}
                        >
                          Make {nextRole}
                        </Button>
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
