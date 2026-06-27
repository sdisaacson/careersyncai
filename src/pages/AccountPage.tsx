import { useState } from "react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Calendar,
  CreditCard,
  LogOut,
  Sparkles,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

function formatPrice(cents: number | null | undefined): string {
  if (cents == null) return "$0.00";
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AccountPage() {
  const { user, isLoading: authLoading, logout, isAuthenticated } = useAuth({
    redirectOnUnauthenticated: true,
  });

  const {
    data: subscription,
    isLoading: subscriptionLoading,
    refetch,
  } = trpc.subscription.getCurrentSubscription.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const cancelMutation = trpc.subscription.cancelSubscription.useMutation({
    onSuccess: () => refetch(),
  });
  const resumeMutation = trpc.subscription.resumeSubscription.useMutation({
    onSuccess: () => refetch(),
  });

  const [showCancelDialog, setShowCancelDialog] = useState(false);

  if (authLoading || subscriptionLoading) {
    return (
      <section
        className="flex min-h-screen items-center justify-center px-4"
        style={{ backgroundColor: "var(--deep-navy)" }}
      >
        <div className="text-center" style={{ color: "var(--slate-400)" }}>
          Loading your account...
        </div>
      </section>
    );
  }

  if (!user) {
    return null;
  }

  const status = subscription?.status ?? "inactive";
  const isActive = status === "active";
  const isCanceled = status === "canceled";

  const handleCancel = () => {
    cancelMutation.mutate();
    setShowCancelDialog(false);
  };

  return (
    <section
      className="min-h-screen px-4 py-20 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--deep-navy)" }}
    >
      <div className="mx-auto max-w-[900px] space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOutExpo }}
        >
          <h1
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            style={{ color: "var(--ice-white)" }}
          >
            Account
          </h1>
          <p className="mt-1" style={{ color: "var(--slate-400)" }}>
            Manage your profile, subscription, and billing.
          </p>
        </motion.div>

        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
        >
          <Card
            className="border"
            style={{
              backgroundColor: "var(--midnight)",
              borderColor: "var(--slate-700)",
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: "var(--ice-white)" }}>
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-5">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name ?? "User avatar"}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="flex h-16 w-16 items-center justify-center rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, #00C9FF 0%, #7C3AED 100%)",
                    }}
                  >
                    <User size={28} style={{ color: "#FFFFFF" }} />
                  </div>
                )}
                <div>
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: "var(--ice-white)" }}
                  >
                    {user.name ?? "CareerSync User"}
                  </h2>
                  <p className="text-sm" style={{ color: "var(--slate-400)" }}>
                    {user.email ?? "No email on file"}
                  </p>
                  <Badge
                    className="mt-2 text-xs capitalize"
                    variant="secondary"
                    style={{
                      backgroundColor: "var(--slate-800)",
                      color: "var(--slate-400)",
                    }}
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Subscription card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: easeOutExpo }}
        >
          <Card
            className="border"
            style={{
              backgroundColor: "var(--midnight)",
              borderColor: "var(--slate-700)",
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: "var(--ice-white)" }}>
                Subscription
              </CardTitle>
              <CardDescription style={{ color: "var(--slate-400)" }}>
                {subscription
                  ? "Your current plan and billing status."
                  : "You don’t have an active subscription."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {subscription ? (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p
                        className="text-2xl font-bold"
                        style={{ color: "var(--ice-white)" }}
                      >
                        {subscription.planName ?? "Unknown Plan"}
                      </p>
                      <p
                        className="mt-1 text-sm"
                        style={{ color: "var(--slate-400)" }}
                      >
                        {formatPrice(subscription.priceCents)}/
                        {subscription.interval ?? "month"}
                      </p>
                    </div>
                    <Badge
                      className="capitalize"
                      style={{
                        backgroundColor: isActive
                          ? "rgba(0, 201, 255, 0.15)"
                          : isCanceled
                            ? "rgba(239, 68, 68, 0.15)"
                            : "var(--slate-800)",
                        color: isActive
                          ? "var(--electric-blue)"
                          : isCanceled
                            ? "#EF4444"
                            : "var(--slate-400)",
                      }}
                    >
                      {status}
                    </Badge>
                  </div>

                  <div
                    className="grid gap-4 border-t pt-6 sm:grid-cols-2"
                    style={{ borderColor: "var(--slate-700)" }}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar
                        size={18}
                        style={{ color: "var(--electric-blue)" }}
                      />
                      <div>
                        <p className="text-xs" style={{ color: "var(--slate-500)" }}>
                          Renewal date
                        </p>
                        <p className="text-sm" style={{ color: "var(--ice-white)" }}>
                          {formatDate(subscription.currentPeriodEnd)}
                        </p>
                      </div>
                    </div>
                    {subscription.cancelAtPeriodEnd ? (
                      <div className="flex items-center gap-3">
                        <AlertCircle size={18} style={{ color: "#EF4444" }} />
                        <div>
                          <p className="text-xs" style={{ color: "var(--slate-500)" }}>
                            Cancellation
                          </p>
                          <p className="text-sm" style={{ color: "var(--ice-white)" }}>
                            Scheduled to cancel at period end
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {isActive && (
                      <Button
                        variant="outline"
                        style={{
                          borderColor: "var(--slate-600)",
                          color: "var(--ice-white)",
                          backgroundColor: "transparent",
                        }}
                        onClick={() => setShowCancelDialog(true)}
                      >
                        Cancel Subscription
                      </Button>
                    )}
                    {isCanceled && (
                      <Button
                        className="accent-gradient text-white"
                        onClick={() => resumeMutation.mutate()}
                        disabled={resumeMutation.isPending}
                      >
                        <Sparkles size={16} />
                        {resumeMutation.isPending
                          ? "Resuming..."
                          : "Resume Subscription"}
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <p
                    className="mb-4 text-sm"
                    style={{ color: "var(--slate-400)" }}
                  >
                    Choose a plan to unlock AI job matching, tailored resumes,
                    and interview prep.
                  </p>
                  <Button className="accent-gradient text-white" asChild>
                    <Link to="/signup">Choose a Plan</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Update payment method (cosmetic) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: easeOutExpo }}
        >
          <Card
            className="border"
            style={{
              backgroundColor: "var(--midnight)",
              borderColor: "var(--slate-700)",
            }}
          >
            <CardHeader>
              <CardTitle
                className="flex items-center gap-2"
                style={{ color: "var(--ice-white)" }}
              >
                <CreditCard size={20} style={{ color: "var(--electric-blue)" }} />
                Update Payment Method
              </CardTitle>
              <CardDescription style={{ color: "var(--slate-400)" }}>
                Cosmetic placeholder — no real payment details are saved.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="payment-name" style={{ color: "var(--slate-400)" }}>
                    Name on card
                  </Label>
                  <Input
                    id="payment-name"
                    placeholder="Jane Doe"
                    style={{
                      borderColor: "var(--slate-700)",
                      color: "var(--ice-white)",
                      backgroundColor: "var(--slate-800)",
                    }}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="payment-card" style={{ color: "var(--slate-400)" }}>
                    Card number
                  </Label>
                  <Input
                    id="payment-card"
                    placeholder="4242 4242 4242 4242"
                    style={{
                      borderColor: "var(--slate-700)",
                      color: "var(--ice-white)",
                      backgroundColor: "var(--slate-800)",
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-expiry" style={{ color: "var(--slate-400)" }}>
                    Expiry
                  </Label>
                  <Input
                    id="payment-expiry"
                    placeholder="MM / YY"
                    style={{
                      borderColor: "var(--slate-700)",
                      color: "var(--ice-white)",
                      backgroundColor: "var(--slate-800)",
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payment-cvc" style={{ color: "var(--slate-400)" }}>
                    CVC
                  </Label>
                  <Input
                    id="payment-cvc"
                    placeholder="123"
                    style={{
                      borderColor: "var(--slate-700)",
                      color: "var(--ice-white)",
                      backgroundColor: "var(--slate-800)",
                    }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button
                    type="submit"
                    variant="outline"
                    disabled
                    className="w-full sm:w-auto"
                    style={{
                      borderColor: "var(--slate-600)",
                      color: "var(--slate-500)",
                      backgroundColor: "transparent",
                    }}
                  >
                    Save Payment Method
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: easeOutExpo }}
        >
          <Button
            variant="outline"
            onClick={logout}
            style={{
              borderColor: "var(--slate-600)",
              color: "var(--ice-white)",
              backgroundColor: "transparent",
            }}
          >
            <LogOut size={18} />
            Log Out
          </Button>
        </motion.div>
      </div>

      {/* Cancel confirmation */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent
          className="border"
          style={{
            backgroundColor: "var(--midnight)",
            borderColor: "var(--slate-700)",
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: "var(--ice-white)" }}>
              Cancel Subscription?
            </DialogTitle>
            <DialogDescription style={{ color: "var(--slate-400)" }}>
              Your access will continue until the end of your current billing
              period. You can resume anytime before then.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowCancelDialog(false)}
              style={{ color: "var(--slate-400)" }}
            >
              Keep Subscription
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelMutation.isPending}
            >
              {cancelMutation.isPending ? "Canceling..." : "Confirm Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
