import * as TogglePrimitive from "@radix-ui/react-toggle";
import { cn } from "@/lib/utils";
import { toggleVariants } from "@/components/ui/toggle-variants";

function Toggle({
  className,
  variant,
  size,
  ...props
}: import("@/components/ui/toggle-variants").ToggleProps) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle };
