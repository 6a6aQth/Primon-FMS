import { InputHTMLAttributes, LabelHTMLAttributes, SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Label(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      {...props}
      className={cn("mb-1.5 block text-xs font-medium text-primon-900", props.className)}
    />
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cn(
        "h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-ink placeholder:text-muted/60 outline-none transition-colors focus:border-primon-500",
        props.className
      )}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-10 w-full rounded-lg border border-border bg-white px-3 text-sm text-ink outline-none transition-colors focus:border-primon-500",
        props.className
      )}
    />
  );
}

export function FormRow({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label>
        {label}
        {required && <span className="ml-0.5 text-status-critical">*</span>}
      </Label>
      {children}
    </div>
  );
}
