import type { ReactNode } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type AuthCardProps = {
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
};

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div
      className="flex min-h-screen items-center justify-center px-4"
      style={{ backgroundColor: "#0B0E14" }}
    >
      <Card
        className="w-full max-w-sm border"
        style={{
          backgroundColor: "#111827",
          borderColor: "rgba(148, 163, 184, 0.08)",
        }}
      >
        <CardHeader className="text-center">
          <CardTitle style={{ color: "#F5F7FA" }}>{title}</CardTitle>
          {description && (
            <CardDescription style={{ color: "#94A3B8" }}>{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}

export default AuthCard;
