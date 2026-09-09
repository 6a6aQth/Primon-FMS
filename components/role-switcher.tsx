"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ChevronUp } from "lucide-react";
import { useDemo } from "@/lib/store";
import { DemoRole } from "@/lib/types";
import { cn } from "@/lib/utils";

const roles: { id: DemoRole; label: string; goesTo: string }[] = [
  { id: "ops_manager", label: "Operations Manager", goesTo: "/dashboard" },
  { id: "admin", label: "Admin", goesTo: "/dashboard" },
  { id: "supervisor", label: "Fumigation Supervisor", goesTo: "/dashboard/monitor" },
  { id: "client", label: "Client (Alliance One)", goesTo: "/portal" },
];

export function RoleSwitcher() {
  const [open, setOpen] = useState(false);
  const { role, setRole } = useDemo();
  const router = useRouter();

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-64 overflow-hidden rounded-xl border border-border bg-white shadow-elevated">
          <div className="border-b border-border bg-primon-50 px-4 py-3">
            <p className="text-xs font-medium text-primon-800">Demo — view as</p>
            <p className="mt-0.5 text-[11px] text-muted">
              Switches role only. No real accounts.
            </p>
          </div>
          <ul className="p-1.5">
            {roles.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => {
                    setRole(r.id);
                    setOpen(false);
                    router.push(r.goesTo);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-primon-50",
                    role === r.id ? "text-primon-800 font-medium" : "text-ink"
                  )}
                >
                  {r.label}
                  {role === r.id && (
                    <span className="h-1.5 w-1.5 rounded-full bg-brass-500" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-primon-950 px-4 py-3 text-xs font-medium text-white shadow-elevated transition-transform hover:scale-[1.02]"
      >
        <Sparkles className="h-3.5 w-3.5 text-brass-400" />
        Demo controls
        <ChevronUp className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
    </div>
  );
}
