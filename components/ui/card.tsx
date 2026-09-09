import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-white shadow-card",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-medium text-brass-600">{eyebrow}</p>
        )}
        <h3 className="font-display text-lg text-primon-900">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Field({
  label,
  value,
  placeholder,
}: {
  label: string;
  value?: string | number;
  placeholder?: string;
}) {
  const empty = value === undefined || value === null || value === "";
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd
        className={cn(
          "mt-1 text-sm",
          empty ? "italic text-muted/70" : "text-ink"
        )}
      >
        {empty ? placeholder ?? "Not yet provided" : value}
      </dd>
    </div>
  );
}
