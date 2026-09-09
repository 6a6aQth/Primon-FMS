"use client";

import { GasReading } from "@/lib/types";
import { dayStatusMeta, LETHAL_THRESHOLD } from "@/lib/status";
import { cn } from "@/lib/utils";

const SCALE_MAX = 1100;

function Bar({
  value,
  label,
  color,
}: {
  value: number | null;
  label: string;
  color: string;
}) {
  const pct = value === null ? 0 : Math.min(100, (value / SCALE_MAX) * 100);
  const thresholdPct = (LETHAL_THRESHOLD / SCALE_MAX) * 100;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative h-32 w-3.5 overflow-visible rounded-full bg-slate-100">
        <div
          className="pointer-events-none absolute left-[-6px] right-[-6px] border-t border-dashed border-brass-500/70"
          style={{ bottom: `${thresholdPct}%` }}
        />
        <div className="absolute inset-0 flex items-end overflow-hidden rounded-full">
          {value !== null && (
            <div
              style={{ "--fill-to": `${pct}%` } as React.CSSProperties}
              className={cn("w-full animate-fill-bar rounded-full", color)}
            />
          )}
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-wide text-muted">{label}</span>
      <span className="num text-xs font-medium text-ink">
        {value === null ? "—" : `${value}`}
      </span>
    </div>
  );
}

export function GasDayGauge({ reading }: { reading: GasReading }) {
  const meta = dayStatusMeta[reading.status];

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-white p-4 transition-shadow",
        meta.border
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-primon-900">Day {reading.day}</span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-medium",
            meta.bg,
            meta.text
          )}
        >
          {meta.label}
        </span>
      </div>

      <div className="flex justify-center gap-5 border-b border-border pb-3">
        <Bar value={reading.airspace} label="Airspace" color={meta.bar} />
        <Bar value={reading.probeCase} label="Probe" color={meta.bar} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-muted">
        <span>Ambient {reading.ambientTemp ?? "—"}°C</span>
        <span>Product {reading.productTemp ?? "—"}°C</span>
        <span className="col-span-2">Humidity {reading.humidity ?? "—"}%</span>
      </div>
    </div>
  );
}
