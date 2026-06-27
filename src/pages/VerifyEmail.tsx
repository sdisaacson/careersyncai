import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [error, setError] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);

  const verifyMutation = trpc.auth.verifyEmail.useMutation({
    onSuccess: () => {
      setVerified(true);
    },
    onError: (err) => {
      setError(err.message ?? "Verification failed. The link may be expired or invalid.");
    },
  });

  useEffect(() => {
    if (!token) {
      setError("Missing verification token.");
      return;
    }
    verifyMutation.mutate({ token });
  }, [token]);

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
          {error && <p className="text-sm text-destructive mb-4">{error}</p>}
          {verified ? (
            <Button asChild className="w-full">
              <Link to="/login">Sign in</Link>
            </Button>
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
