export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  interval: "month" | "year";
  displayPrice: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for trying out CareerSync on your first job search.",
    priceCents: 900,
    interval: "month",
    displayPrice: "$9",
    features: [
      "1 full job-search campaign per month",
      "Up to 50 matched opportunities",
      "5 tailored resumes",
      "Export to PDF & Word",
      "Basic interview prep",
      "Email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Best for active job seekers who want full AI research power.",
    priceCents: 1900,
    interval: "month",
    displayPrice: "$19",
    features: [
      "Unlimited job-search campaigns",
      "Up to 150 matched opportunities",
      "25 tailored resumes per month",
      "AI-generated cover letters",
      "Advanced AI interview",
      "Priority email support",
      "Export to PDF & Word",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "premium",
    name: "Premium",
    description: "For career switchers and executives who want white-glove results.",
    priceCents: 4900,
    interval: "month",
    displayPrice: "$49",
    features: [
      "Everything in Pro",
      "Up to 500 matched opportunities",
      "Unlimited tailored resumes",
      "AI-generated cover letters",
      "Dedicated support queue",
    ],
  },
];

export function getPlanById(id: string): PricingPlan | undefined {
  return PRICING_PLANS.find((p) => p.id === id);
}
