import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { PricingPlan } from "@/lib/pricing";

interface PricingCardProps {
  plan: PricingPlan;
  selected?: boolean;
  onSelect?: () => void;
  buttonText?: string;
}

export default function PricingCard({
  plan,
  selected,
  onSelect,
  buttonText,
}: PricingCardProps) {
  const isHighlighted = plan.highlighted;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card
        className={cn(
          "relative flex h-full flex-col overflow-hidden border transition-all duration-300",
          selected && "border-[var(--electric-blue)]",
          isHighlighted && "border-[var(--electric-blue)]"
        )}
        style={{
          backgroundColor: "var(--midnight)",
          borderColor: isHighlighted
            ? "var(--electric-blue)"
            : selected
              ? "var(--electric-blue)"
              : "var(--slate-700)",
          boxShadow: isHighlighted
            ? "0 0 30px rgba(0, 201, 255, 0.25), inset 0 0 0 1px rgba(0, 201, 255, 0.35)"
            : selected
              ? "0 0 20px rgba(0, 201, 255, 0.15)"
              : "none",
        }}
      >
        {/* Glow overlay */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, rgba(0, 201, 255, 0.08) 0%, transparent 60%)",
          }}
        />

        <CardHeader className="relative z-10">
          <div className="flex items-start justify-between">
            <div>
              <h3
                className="text-xl font-semibold"
                style={{ color: "var(--ice-white)" }}
              >
                {plan.name}
              </h3>
              <p
                className="mt-1 text-sm leading-relaxed"
                style={{ color: "var(--slate-400)" }}
              >
                {plan.description}
              </p>
            </div>
            {plan.badge && (
              <Badge
                variant="default"
                className="shrink-0 text-xs"
                style={{
                  backgroundColor: "var(--electric-blue)",
                  color: "var(--deep-navy)",
                }}
              >
                {plan.badge}
              </Badge>
            )}
          </div>

          <div className="mt-4 flex items-baseline gap-1">
            <span
              className="text-4xl font-bold tracking-tight"
              style={{ color: "var(--ice-white)" }}
            >
              {plan.displayPrice}
            </span>
            <span
              className="text-sm font-medium"
              style={{ color: "var(--slate-500)" }}
            >
              /{plan.interval}
            </span>
          </div>
        </CardHeader>

        <CardContent className="relative z-10 flex flex-1 flex-col">
          <ul className="mb-6 flex flex-col gap-3">
            {plan.features.map(feature => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm"
                style={{ color: "var(--slate-400)" }}
              >
                <Check
                  size={18}
                  className="mt-0.5 shrink-0"
                  style={{ color: "var(--electric-blue)" }}
                />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {onSelect && (
            <Button
              className={cn(
                "mt-auto w-full transition-all duration-200",
                selected || isHighlighted
                  ? "accent-gradient text-white hover:shadow-lg"
                  : ""
              )}
              variant={selected || isHighlighted ? "default" : "outline"}
              style={
                selected || isHighlighted
                  ? {
                      boxShadow: "0 0 20px rgba(0, 201, 255, 0.2)",
                    }
                  : {
                      borderColor: "var(--slate-600)",
                      color: "var(--ice-white)",
                      backgroundColor: "transparent",
                    }
              }
              onClick={onSelect}
            >
              {buttonText ?? (selected ? "Selected" : `Choose ${plan.name}`)}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
