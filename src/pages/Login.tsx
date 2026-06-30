import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { trpc } from "@/lib/trpc.tsx";
import { AuthCard } from "@/components/AuthCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      navigate("/dashboard");
    },
    onError: err => {
      setError(err.message ?? "Login failed. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate({ email, password });
  };

  return (
    <AuthCard
      title="Sign in"
      description="Enter your email and password to continue"
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
        <div className="space-y-2">
          <Label htmlFor="password" style={{ color: "#F5F7FA" }}>Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
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
          disabled={loginMutation.isPending}
        >
          {loginMutation.isPending ? "Signing in..." : "Sign in"}
        </Button>
      </form>
      <div className="mt-6 flex items-center justify-between text-sm">
        <Link to="/register" style={{ color: "#00C9FF" }} className="hover:underline">
          Create account
        </Link>
        <Link
          to="/forgot-password"
          style={{ color: "#00C9FF" }}
          className="hover:underline"
        >
          Forgot password?
        </Link>
      </div>
    </AuthCard>
  );
}
