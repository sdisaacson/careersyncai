import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { trpc } from "@/lib/trpc.tsx";
import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const resetMutation = trpc.auth.resetPassword.useMutation({
    onSuccess: () => {
      setSuccess(true);
    },
    onError: err => {
      setError(
        err.message ??
          "Password reset failed. The link may be expired or invalid."
      );
    },
  });

  useEffect(() => {
    if (!token) {
      // Defer state update to avoid synchronous setState in effect
      const timeoutId = setTimeout(() => setError("Missing reset token."), 0);
      return () => clearTimeout(timeoutId);
    }
  }, [token]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError("Missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    resetMutation.mutate({ token, password });
  };

  if (success) {
    return (
      <AuthCard
        title="Password updated"
        description="Your password has been reset. You can now sign in with your new password."
      >
        <Button asChild className="accent-gradient w-full text-white">
          <Link to="/login">Sign in</Link>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="New password"
      description="Enter a new password for your account"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password" style={{ color: "#F5F7FA" }}>New password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              backgroundColor: "#1E293B",
              borderColor: "#334155",
              color: "#F5F7FA",
            }}
          />
          <p className="text-xs" style={{ color: "#64748B" }}>
            Must be at least 8 characters
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm-password" style={{ color: "#F5F7FA" }}>Confirm new password</Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            style={{
              backgroundColor: "#1E293B",
              borderColor: "#334155",
              color: "#F5F7FA",
            }}
          />
          <p className="text-xs" style={{ color: "#64748B" }}>
            Must be at least 8 characters
          </p>
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
          disabled={resetMutation.isPending || !token}
        >
          {resetMutation.isPending ? "Resetting..." : "Reset password"}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link to="/login" style={{ color: "#00C9FF" }} className="hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthCard>
  );
}
