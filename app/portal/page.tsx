"use client";

import Link from "next/link";
import { FccStatusPill } from "@/components/ui/status-pill";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/kpi";
import { useDemo } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function PortalHomePage() {
  const { workOrders } = useDemo();
  const mine = workOrders.filter((w) => w.client.includes("Alliance One"));

  return (
    <div>
      <p className="text-sm text-brass-600">Welcome back</p>
      <h1 className="mt-1 font-display text-3xl text-primon-950">
        Alliance One Tobacco Malawi
      </h1>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Track fumigation progress on your shipments and complete shipping
        instructions at any stage before certification.
      </p>

      <div className="mt-8 space-y-4">
        {mine.length === 0 ? (
          <EmptyState title="No shipments yet" description="Fumigation requests will appear here once logged by Primon." />
        ) : (
          mine.map((w) => {
            const daysLogged = w.readings.filter((r) => r.status !== "pending").length;
            return (
              <Link key={w.id} href={`/portal/${w.id}`}>
                <Card className="p-6 transition-shadow hover:shadow-elevated">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-display text-lg text-primon-950">{w.code}</p>
                      <p className="text-xs text-muted">
                        {w.si.tobaccoType || w.cropType} · {w.si.quantity || "quantity pending"}
                      </p>
                    </div>
                    <FccStatusPill status={w.status} />
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-primon-700"
                          style={{ width: `${(daysLogged / 6) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="shrink-0 text-xs text-muted">{daysLogged}/6 days monitored</span>
                  </div>
                  <p className="mt-3 text-[11px] text-muted">Created {formatDate(w.createdAt)}</p>
                </Card>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
