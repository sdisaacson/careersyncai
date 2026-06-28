import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc.tsx";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Settings, Save, CheckCircle2, Info } from "lucide-react";
import { motion } from "framer-motion";

const easeOutExpo = [0.16, 1, 0.3, 1] as [number, number, number, number];

const iceWhite = "var(--ice-white)";
const slate400 = "var(--slate-400)";
const midnight = "var(--midnight)";
const slate700 = "var(--slate-700)";

const SETTING_KEYS = {
  moonshotApiKey: "moonshot_api_key",
  stripePublishableKey: "stripe_publishable_key",
  stripeSecretKey: "stripe_secret_key",
  defaultPlanId: "default_plan_id",
} as const;

const PLAN_OPTIONS = [
  { value: "starter", label: "Starter" },
  { value: "pro", label: "Pro" },
  { value: "premium", label: "Premium" },
];

export default function AdminSettingsPage() {
  const utils = trpc.useUtils();
  const { data: settings, isLoading } = trpc.settings.getAll.useQuery();

  const [values, setValues] = useState<Record<string, string>>({
    [SETTING_KEYS.moonshotApiKey]: "",
    [SETTING_KEYS.stripePublishableKey]: "",
    [SETTING_KEYS.stripeSecretKey]: "",
    [SETTING_KEYS.defaultPlanId]: "starter",
  });

  const [saved, setSaved] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!settings || initialized.current) return;
    initialized.current = true;
    const map = new Map(settings.map((s) => [s.key, s.value ?? ""]));
    // Sync form defaults from fetched settings; this runs once after initial load.
    setValues({
      [SETTING_KEYS.moonshotApiKey]: map.get(SETTING_KEYS.moonshotApiKey) ?? "",
      [SETTING_KEYS.stripePublishableKey]:
        map.get(SETTING_KEYS.stripePublishableKey) ?? "",
      [SETTING_KEYS.stripeSecretKey]:
        map.get(SETTING_KEYS.stripeSecretKey) ?? "",
      [SETTING_KEYS.defaultPlanId]:
        map.get(SETTING_KEYS.defaultPlanId) ?? "starter",
    });
  }, [settings]);

  const updateSettings = trpc.settings.updateMany.useMutation({
    onSuccess: () => {
      utils.settings.getAll.invalidate();
      setSaved(true);
      const timer = setTimeout(() => setSaved(false), 4000);
      return () => clearTimeout(timer);
    },
  });

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (saved) setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate(values);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeOutExpo }}
      >
        <h1
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          style={{ color: iceWhite }}
        >
          Settings
        </h1>
        <p className="mt-2 text-base" style={{ color: slate400 }}>
          Configure integrations and default plan preferences.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: easeOutExpo }}
        className="mt-6"
      >
        <Alert
          className="mb-6 border-dashed"
          style={{
            backgroundColor: "rgba(0, 201, 255, 0.06)",
            borderColor: "rgba(0, 201, 255, 0.25)",
            color: iceWhite,
          }}
        >
          <Info className="h-4 w-4" style={{ color: "#00C9FF" }} />
          <AlertTitle className="text-sm font-semibold">
            Demo integrations
          </AlertTitle>
          <AlertDescription className="text-sm" style={{ color: slate400 }}>
            The fields below are placeholder integrations for the current demo.
            In production, move secrets to environment variables or a secure
            vault.
          </AlertDescription>
        </Alert>

        <Card
          className="border-0 shadow-none"
          style={{ backgroundColor: midnight }}
        >
          <CardHeader>
            <CardTitle
              className="flex items-center gap-2 text-lg font-semibold"
              style={{ color: iceWhite }}
            >
              <Settings className="h-5 w-5" style={{ color: "#00C9FF" }} />
              Application Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton
                      className="h-4 w-32"
                      style={{ backgroundColor: slate700 }}
                    />
                    <Skeleton
                      className="h-10 w-full"
                      style={{ backgroundColor: slate700 }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="moonshot_api_key" style={{ color: iceWhite }}>
                    Moonshot API Key
                  </Label>
                  <Input
                    id="moonshot_api_key"
                    type="password"
                    placeholder="sk-..."
                    value={values[SETTING_KEYS.moonshotApiKey]}
                    onChange={(e) =>
                      handleChange(SETTING_KEYS.moonshotApiKey, e.target.value)
                    }
                    className="border-[var(--slate-700)] bg-transparent text-[var(--ice-white)] placeholder:text-[var(--slate-500)] focus-visible:border-[#00C9FF]"
                  />
                  <p className="text-xs" style={{ color: slate400 }}>
                    Used to power LLM-based resume and interview features.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="stripe_publishable_key"
                    style={{ color: iceWhite }}
                  >
                    Stripe Publishable Key
                  </Label>
                  <Input
                    id="stripe_publishable_key"
                    type="text"
                    placeholder="pk_live_..."
                    value={values[SETTING_KEYS.stripePublishableKey]}
                    onChange={(e) =>
                      handleChange(
                        SETTING_KEYS.stripePublishableKey,
                        e.target.value
                      )
                    }
                    className="border-[var(--slate-700)] bg-transparent text-[var(--ice-white)] placeholder:text-[var(--slate-500)] focus-visible:border-[#00C9FF]"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="stripe_secret_key"
                    style={{ color: iceWhite }}
                  >
                    Stripe Secret Key
                  </Label>
                  <Input
                    id="stripe_secret_key"
                    type="password"
                    placeholder="sk_live_..."
                    value={values[SETTING_KEYS.stripeSecretKey]}
                    onChange={(e) =>
                      handleChange(SETTING_KEYS.stripeSecretKey, e.target.value)
                    }
                    className="border-[var(--slate-700)] bg-transparent text-[var(--ice-white)] placeholder:text-[var(--slate-500)] focus-visible:border-[#00C9FF]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default_plan_id" style={{ color: iceWhite }}>
                    Default Plan ID
                  </Label>
                  <Select
                    value={values[SETTING_KEYS.defaultPlanId]}
                    onValueChange={(value) =>
                      handleChange(SETTING_KEYS.defaultPlanId, value)
                    }
                  >
                    <SelectTrigger
                      id="default_plan_id"
                      className="w-full border-[var(--slate-700)] bg-transparent text-[var(--ice-white)]"
                    >
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent
                      className="border-[var(--slate-700)]"
                      style={{ backgroundColor: midnight }}
                    >
                      {PLAN_OPTIONS.map((plan) => (
                        <SelectItem
                          key={plan.value}
                          value={plan.value}
                          className="text-[var(--ice-white)] focus:bg-[rgba(148,163,184,0.15)] focus:text-[var(--ice-white)]"
                        >
                          {plan.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs" style={{ color: slate400 }}>
                    Default plan assigned to new subscriptions.
                  </p>
                </div>

                {saved && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium"
                    style={{
                      backgroundColor: "rgba(34, 197, 94, 0.1)",
                      borderColor: "rgba(34, 197, 94, 0.3)",
                      color: "#22C55E",
                    }}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Settings saved successfully.
                  </motion.div>
                )}

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={updateSettings.isPending}
                    className="gap-2"
                    style={{
                      background:
                        "linear-gradient(135deg, #00C9FF 0%, #3B82F6 50%, #7C3AED 100%)",
                      color: "#fff",
                    }}
                  >
                    {updateSettings.isPending ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
