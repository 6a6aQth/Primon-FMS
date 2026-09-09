import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stepper({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) {
  return (
    <ol className="flex items-center">
      {steps.map((label, i) => {
        const state = i < current ? "done" : i === current ? "active" : "todo";
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium",
                  state === "done" && "border-primon-800 bg-primon-800 text-white",
                  state === "active" && "border-primon-800 text-primon-800",
                  state === "todo" && "border-border text-muted"
                )}
              >
                {state === "done" ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-sm sm:block",
                  state === "todo" ? "text-muted" : "font-medium text-primon-950"
                )}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-4 h-px flex-1",
                  state === "done" ? "bg-primon-800" : "bg-border"
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
