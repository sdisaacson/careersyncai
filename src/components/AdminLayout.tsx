import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LOGIN_PATH } from "@/const";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Settings,
  Menu,
  Shield,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/users", label: "Users", icon: Users },
  { path: "/admin/subscriptions", label: "Subscriptions", icon: CreditCard },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

const sidebarBg = "var(--midnight)";
const sidebarBorder = "var(--slate-700)";
const iceWhite = "var(--ice-white)";
const slate400 = "var(--slate-400)";
const electricBlue = "var(--electric-blue)";

export default function AdminLayout() {
  const { user, isLoading, isAuthenticated } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: LOGIN_PATH,
  });
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoading) {
    return (
      <div
        className="flex min-h-[60vh] items-center justify-center"
        style={{ color: slate400 }}
      >
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-3"
        >
          <Shield className="h-6 w-6" />
          <span className="text-sm font-medium">Loading admin portal...</span>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md rounded-2xl border p-8 text-center"
          style={{
            backgroundColor: "var(--midnight)",
            borderColor: sidebarBorder,
          }}
        >
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
          >
            <Shield className="h-8 w-8" style={{ color: "#EF4444" }} />
          </div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: iceWhite }}
          >
            Access Denied — Admins Only
          </h1>
          <p className="mt-3 text-sm" style={{ color: slate400 }}>
            You don&apos;t have permission to view this area. Contact an
            administrator if you believe this is an error.
          </p>
          <Button
            asChild
            className="mt-6"
            style={{
              background:
                "linear-gradient(135deg, #00C9FF 0%, #3B82F6 50%, #7C3AED 100%)",
            }}
          >
            <Link to="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  const activeLabel =
    navItems.find(item => item.path === location.pathname)?.label ??
    "Dashboard";

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b px-6">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-lg font-bold text-sm"
          style={{
            background:
              "linear-gradient(135deg, #00C9FF 0%, #3B82F6 50%, #7C3AED 100%)",
            color: "#fff",
          }}
        >
          CS
        </div>
        <span
          className="text-lg font-semibold tracking-tight"
          style={{ color: iceWhite }}
        >
          CareerSync Admin
        </span>
      </div>

      <nav className="flex-1 overflow-auto px-3 py-4">
        <ul className="space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[rgba(0,201,255,0.12)]"
                      : "hover:bg-[rgba(148,163,184,0.1)]"
                  )}
                  style={{ color: isActive ? electricBlue : slate400 }}
                >
                  <item.icon
                    className="h-[18px] w-[18px] shrink-0"
                    style={{ color: isActive ? electricBlue : slate400 }}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t p-4" style={{ borderColor: sidebarBorder }}>
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
            style={{
              backgroundColor: "rgba(0, 201, 255, 0.15)",
              color: electricBlue,
            }}
          >
            {user.name?.charAt(0).toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0">
            <p
              className="truncate text-sm font-medium"
              style={{ color: iceWhite }}
            >
              {user.name ?? "Admin"}
            </p>
            <p className="truncate text-xs" style={{ color: slate400 }}>
              {user.email ?? "admin@careersync.app"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="flex min-h-full w-full"
      style={{ backgroundColor: "var(--deep-navy)" }}
    >
      {/* Desktop sidebar */}
      <aside
        className="hidden min-h-full w-64 shrink-0 border-r lg:block"
        style={{
          backgroundColor: sidebarBg,
          borderColor: sidebarBorder,
        }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile header + sheet */}
      <div className="flex min-h-full flex-1 flex-col">
        <div
          className="flex h-14 items-center justify-between border-b px-4 lg:hidden"
          style={{
            backgroundColor: sidebarBg,
            borderColor: sidebarBorder,
          }}
        >
          <span className="text-sm font-semibold" style={{ color: iceWhite }}>
            {activeLabel}
          </span>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation"
                className="text-[var(--slate-400)] hover:bg-[rgba(148,163,184,0.1)] hover:text-[var(--ice-white)]"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-64 p-0"
              style={{
                backgroundColor: sidebarBg,
                borderColor: sidebarBorder,
              }}
            >
              <SheetHeader className="sr-only">
                <SheetTitle>Admin navigation</SheetTitle>
              </SheetHeader>
              {sidebarContent}
            </SheetContent>
          </Sheet>
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
