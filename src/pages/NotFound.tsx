import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/AuthCard";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <AuthCard title="404">
      <p className="mb-4 text-center" style={{ color: "#94A3B8" }}>
        Page not found
      </p>
      <Button asChild className="accent-gradient w-full text-white">
        <Link to="/">Back to Home</Link>
      </Button>
    </AuthCard>
  );
}
