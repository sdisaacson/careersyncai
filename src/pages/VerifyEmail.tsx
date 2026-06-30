import { useRef, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { trpc } from "@/lib/trpc.tsx";
import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const paramEmail = searchParams.get("email") ?? "";
  const [email, setEmail] = useState(paramEmail);
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const hasVerified = useRef(false);

  const verifyMutation = trpc.auth.verifyEmail.useMutation({
    onSuccess: () => {
      setVerified(true);
    },
    onError: err => {
      setError(
        err.message ??
          "Verification failed. The link may be expired or invalid."
      );
    },
  });

  const resendMutation = trpc.auth.resendVerification.useMutation({
    onSuccess: () => {
      setError("A new verification link has been sent to your email.");
    },
    onError: err => {
      setError(
        err.message ?? "Failed to resend verification email. Please try again."
      );
    },
  });

  useEffect(() => {
    if (!token) {
      // Defer state update to avoid synchronous setState in effect body
      const timeoutId = setTimeout(
        () => setError("Missing verification token."),
        0
      );
      return () => clearTimeout(timeoutId);
    }
    if (hasVerified.current) return;
    hasVerified.current = true;
    verifyMutation.mutate({ token });
  }, [token, verifyMutation]);

  return (
    <AuthCard
      title={verified ? "Email verified" : "Verifying your email"}
      description={
        verified
          ? "Your email has been verified. You can now sign in."
          : "Please wait while we verify your email address."
      }
    >
      {error && (
        <p role="alert" className="text-destructive mb-4 text-sm">
          {error}
        </p>
      )}
      {verified ? (
        <Button asChild className="accent-gradient w-full text-white">
          <Link to="/login">Sign in</Link>
        </Button>
      ) : error ? (
        <div className="space-y-2 text-left">
          <Label htmlFor="resend-email" style={{ color: "#F5F7FA" }}>Email</Label>
          <Input
            id="resend-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              backgroundColor: "#1E293B",
              borderColor: "#334155",
              color: "#F5F7FA",
            }}
          />
          <Button
            type="button"
            className="w-full border"
            style={{
              backgroundColor: "transparent",
              borderColor: "#334155",
              color: "#F5F7FA",
            }}
            disabled={resendMutation.isPending || !email}
            onClick={() => resendMutation.mutate({ email })}
          >
            {resendMutation.isPending
              ? "Sending..."
              : "Resend verification email"}
          </Button>
        </div>
      ) : (
        <Button disabled className="w-full">
          Verifying...
        </Button>
      )}
    </AuthCard>
  );
}
