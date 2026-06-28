import { useRef, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { trpc } from "@/lib/trpc.tsx";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
    onError: (err) => {
      setError(err.message ?? "Verification failed. The link may be expired or invalid.");
    },
  });

  const resendMutation = trpc.auth.resendVerification.useMutation({
    onSuccess: () => {
      setError("A new verification link has been sent to your email.");
    },
    onError: (err) => {
      setError(err.message ?? "Failed to resend verification email. Please try again.");
    },
  });

  useEffect(() => {
    if (!token) {
      // Defer state update to avoid synchronous setState in effect body
      const timeoutId = setTimeout(() => setError("Missing verification token."), 0);
      return () => clearTimeout(timeoutId);
    }
    if (hasVerified.current) return;
    hasVerified.current = true;
    verifyMutation.mutate({ token });
  }, [token, verifyMutation]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle>
            {verified ? "Email verified" : "Verifying your email"}
          </CardTitle>
          <CardDescription>
            {verified
              ? "Your email has been verified. You can now sign in."
              : "Please wait while we verify your email address."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {error && <p role="alert" className="text-sm text-destructive mb-4">{error}</p>}
          {verified ? (
            <Button asChild className="w-full">
              <Link to="/login">Sign in</Link>
            </Button>
          ) : error ? (
            <div className="space-y-2 text-left">
              <Label htmlFor="resend-email">Email</Label>
              <Input
                id="resend-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={resendMutation.isPending || !email}
                onClick={() => resendMutation.mutate({ email })}
              >
                {resendMutation.isPending ? "Sending..." : "Resend verification email"}
              </Button>
            </div>
          ) : (
            <Button disabled className="w-full">
              Verifying...
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
