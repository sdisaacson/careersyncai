import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { CreditCard, Lock, Sparkles } from "lucide-react";
import PricingCard from "@/components/PricingCard";
import { PRICING_PLANS, getPlanById } from "@/lib/pricing";
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

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

export default function SignupPage() {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("pro");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const selectedPlan = getPlanById(selectedPlanId);

  const checkoutMutation =
    trpc.subscription.createCheckoutSession.useMutation({
      onSuccess: () => navigate("/account"),
    });

  const handleActivate = () => {
    if (!selectedPlan) return;
    checkoutMutation.mutate({
      planId: selectedPlan.id as "starter" | "pro" | "premium",
    });
  };

  return (
    <section
      className="min-h-screen px-4 py-20 sm:px-6 lg:px-8"
      style={{ backgroundColor: "var(--deep-navy)" }}
    >
      <div className="mx-auto max-w-[1200px]">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOutExpo }}
          className="mb-16 text-center"
        >
          <p
            className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.15em]"
            style={{ color: "var(--electric-blue)" }}
          >
            Pricing
          </p>
          <h1
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-[56px]"
            style={{ color: "var(--ice-white)", lineHeight: 1.1 }}
          >
            Choose Your Plan
          </h1>
          <p
            className="mx-auto mt-4 max-w-[600px] text-lg"
            style={{ color: "var(--slate-400)", lineHeight: 1.6 }}
          >
            Start with a 7-day free trial. Pick the plan that fits your job
            search and activate it instantly.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PRICING_PLANS.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.1 + i * 0.1,
                ease: easeOutExpo,
              }}
            >
              <PricingCard
                plan={plan}
                selected={selectedPlanId === plan.id}
                onSelect={() => setSelectedPlanId(plan.id)}
                buttonText={
                  selectedPlanId === plan.id ? "Selected" : "Select Plan"
                }
              />
            </motion.div>
          ))}
        </div>

        {/* Summary + checkout */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: easeOutExpo }}
          className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2"
        >
          {/* Selected plan summary */}
          <Card
            className="border"
            style={{
              backgroundColor: "var(--midnight)",
              borderColor: "var(--slate-700)",
            }}
          >
            <CardHeader>
              <CardTitle style={{ color: "var(--ice-white)" }}>
                Selected Plan
              </CardTitle>
              <CardDescription style={{ color: "var(--slate-400)" }}>
                You&apos;re about to subscribe to the {selectedPlan?.name} plan.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span style={{ color: "var(--slate-400)" }}>
                  {selectedPlan?.name}
                </span>
                <span
                  className="text-xl font-semibold"
                  style={{ color: "var(--ice-white)" }}
                >
                  {selectedPlan?.displayPrice}
                  <span
                    className="text-sm font-normal"
                    style={{ color: "var(--slate-500)" }}
                  >
                    /{selectedPlan?.interval}
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: "var(--slate-400)" }}>
                  Trial period
                </span>
                <span style={{ color: "var(--ice-white)" }}>7 days free</span>
              </div>
              <div
                className="mt-2 border-t pt-4"
                style={{ borderColor: "var(--slate-700)" }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="font-semibold"
                    style={{ color: "var(--ice-white)" }}
                  >
                    Due today
                  </span>
                  <span
                    className="text-xl font-bold"
                    style={{ color: "var(--electric-blue)" }}
                  >
                    $0.00
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mock Stripe card form */}
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
                Payment Details
              </CardTitle>
              <CardDescription style={{ color: "var(--slate-400)" }}>
                This is a cosmetic form for demo purposes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number" style={{ color: "var(--slate-400)" }}>
                  Card number
                </Label>
                <Input
                  id="card-number"
                  placeholder="4242 4242 4242 4242"
                  className="font-mono"
                  style={{
                    borderColor: "var(--slate-700)",
                    color: "var(--ice-white)",
                    backgroundColor: "var(--slate-800)",
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry" style={{ color: "var(--slate-400)" }}>
                    Expiry
                  </Label>
                  <Input
                    id="expiry"
                    placeholder="MM / YY"
                    className="font-mono"
                    style={{
                      borderColor: "var(--slate-700)",
                      color: "var(--ice-white)",
                      backgroundColor: "var(--slate-800)",
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc" style={{ color: "var(--slate-400)" }}>
                    CVC
                  </Label>
                  <Input
                    id="cvc"
                    placeholder="123"
                    className="font-mono"
                    style={{
                      borderColor: "var(--slate-700)",
                      color: "var(--ice-white)",
                      backgroundColor: "var(--slate-800)",
                    }}
                  />
                </div>
              </div>
              <div
                className="flex items-center gap-2 text-xs"
                style={{ color: "var(--slate-500)" }}
              >
                <Lock size={14} />
                Payments are handled securely by Stripe in production.
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55, ease: easeOutExpo }}
          className="mx-auto mt-10 max-w-[500px] text-center"
        >
          {isAuthenticated ? (
            <Button
              size="lg"
              className="w-full accent-gradient text-white"
              style={{
                boxShadow: "0 0 20px rgba(0, 201, 255, 0.25)",
              }}
              onClick={handleActivate}
              disabled={checkoutMutation.isPending}
            >
              {checkoutMutation.isPending ? (
                "Activating..."
              ) : (
                <>
                  <Sparkles size={18} />
                  Activate {selectedPlan?.name} Plan
                </>
              )}
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full accent-gradient text-white"
              style={{
                boxShadow: "0 0 20px rgba(0, 201, 255, 0.25)",
              }}
              asChild
            >
              <Link to="/register">
                Create account
              </Link>
            </Button>
          )}

          <p
            className="mt-3 text-sm"
            style={{ color: "var(--slate-500)" }}
          >
            {isAuthenticated
              ? "Signing up creates your subscription and activates the selected plan."
              : "After verifying your email and signing in, return here to activate your plan."}
          </p>

          <p
            className="mt-4 text-xs"
            style={{ color: "var(--slate-600)" }}
          >
            7-day free trial. Cancel anytime. Sample pricing only — no real
            charges are processed in this demo.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
