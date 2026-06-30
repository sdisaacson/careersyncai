import { useState } from "react";
import { Link } from "react-router";
import { trpc } from "@/lib/trpc.tsx";
import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const forgotMutation = trpc.auth.forgotPassword.useMutation({
    onSuccess: () => {
      setSuccess(true);
    },
    onError: err => {
      setError(err.message ?? "Request failed. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    forgotMutation.mutate({ email });
  };

  if (success) {
    return (
      <AuthCard
        title="Check your email"
        description={
          <>
            If an account exists for <strong style={{ color: "#F5F7FA" }}>{email}</strong>, we sent
            password reset instructions.
          </>
        }
      >
        <div className="text-center text-sm">
          <Link to="/login" style={{ color: "#00C9FF" }} className="hover:underline">
            Back to sign in
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset password"
      description="Enter your email and we’ll send you reset instructions"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" style={{ color: "#F5F7FA" }}>Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              backgroundColor: "#1E293B",
              borderColor: "#334155",
              color: "#F5F7FA",
            }}
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <Button
          type="submit"
          className="accent-gradient w-full text-white"
          size="lg"
          disabled={forgotMutation.isPending}
        >
          {forgotMutation.isPending ? "Sending..." : "Send reset link"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm" style={{ color: "#94A3B8" }}>
        Remember your password?{" "}
        <Link to="/login" style={{ color: "#00C9FF" }} className="hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
