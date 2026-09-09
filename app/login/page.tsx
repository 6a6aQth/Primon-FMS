"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PrimonLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Label, TextInput } from "@/components/ui/input";
import { useDemo } from "@/lib/store";
import { DemoRole } from "@/lib/types";
import { cn } from "@/lib/utils";
import { HardHat, ShieldCheck, UserCog, Building2 } from "lucide-react";

const roleOptions: {
  id: DemoRole;
  label: string;
  desc: string;
  icon: typeof HardHat;
  goesTo: string;
}[] = [
    {
      id: "ops_manager",
      label: "Operations Manager",
      desc: "Complete certificates, review flags",
      icon: ShieldCheck,
      goesTo: "/dashboard",
    },
    {
      id: "admin",
      label: "Admin",
      desc: "Full access, plus stock oversight",
      icon: UserCog,
      goesTo: "/dashboard",
    },
    {
      id: "supervisor",
      label: "Fumigation Supervisor",
      desc: "Log daily gas readings on site",
      icon: HardHat,
      goesTo: "/dashboard/monitor",
    },
    {
      id: "client",
      label: "Client",
      desc: "Track and download your certificate",
      icon: Building2,
      goesTo: "/portal",
    },
  ];

export default function LoginPage() {
  const [selected, setSelected] = useState<DemoRole>("ops_manager");
  const { setRole } = useDemo();
  const router = useRouter();

  function handleSignIn() {
    setRole(selected);
    const target = roleOptions.find((r) => r.id === selected)?.goesTo ?? "/dashboard";
    router.push(target);
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <section className="relative hidden flex-col justify-between bg-primon-950 p-12 text-primon-100 lg:flex">
        <PrimonLogo width={190} />
        <div className="max-w-sm">
          <p className="font-display text-[26px] leading-snug text-white">
            "The gas has to reach a lethal dose above 600, consistently, for six days.
            That's what makes a fumigation successful."
          </p>
          <p className="mt-4 text-sm text-primon-400">— Operations standard, Primon Enterprises</p>
        </div>
        <p className="text-xs text-primon-500">
          Setting standard in pest management services since 2010.
        </p>
      </section>

      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <PrimonLogo width={170} />
          </div>
          <p className="text-sm text-brass-600">Welcome back</p>
          <h1 className="mt-1 font-display text-3xl text-primon-950">Sign in to Primon FMS</h1>
          <p className="mt-2 text-sm text-muted">
            This is a demonstration build — choose a role below to preview that
            person's view of the system.
          </p>

          <div className="mt-8 space-y-2.5">
            {roleOptions.map((r) => {
              const Icon = r.icon;
              const active = selected === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelected(r.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-colors",
                    active
                      ? "border-primon-800 bg-primon-50"
                      : "border-border bg-white hover:border-primon-200"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                      active ? "bg-primon-800 text-white" : "bg-primon-50 text-primon-700"
                    )}
                  >
                    <Icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-primon-950">
                      {r.label}
                    </span>
                    <span className="block text-xs text-muted">{r.desc}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-8 space-y-3.5 border-t border-border pt-6">
            <div>
              <Label>Email</Label>
              <TextInput defaultValue="demo@primon.mw" disabled />
            </div>
            <div>
              <Label>Password</Label>
              <TextInput type="password" defaultValue="••••••••••" disabled />
            </div>
          </div>

          <Button size="lg" className="mt-6 w-full" onClick={handleSignIn}>
            Sign in as {roleOptions.find((r) => r.id === selected)?.label}
          </Button>
        </div>
      </section>
    </main>
  );
}
