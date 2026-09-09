import { cn } from "@/lib/utils";
import { DayStatus, FccStatus } from "@/lib/types";
import { dayStatusMeta, fccStatusMeta } from "@/lib/status";

export function FccStatusPill({ status }: { status: FccStatus }) {
  const m = fccStatusMeta[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        m.bg,
        m.text,
        m.border
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}

export function DayStatusPill({ status }: { status: DayStatus }) {
  const m = dayStatusMeta[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        m.bg,
        m.text,
        m.border
      )}
    >
      {m.label}
    </span>
  );
}
