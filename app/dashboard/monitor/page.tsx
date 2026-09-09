"use client";

import Link from "next/link";
import { Topbar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { FccStatusPill } from "@/components/ui/status-pill";
import { EmptyState } from "@/components/ui/kpi";
import { useDemo } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export default function MonitorListPage() {
  const { workOrders } = useDemo();
  const monitorable = workOrders.filter((w) => w.readings.length > 0);

  return (
    <div>
      <Topbar
        title="Gas-reading monitor"
        description="Every active 6-day monitoring window, at a glance"
      />
      <div className="px-6 py-8 lg:px-10">
        {monitorable.length === 0 ? (
          <EmptyState
            title="No fumigations in progress"
            description="Once a work order's fumigation description is complete, its 6-day monitoring window will appear here."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {monitorable.map((w) => {
              const critical = w.readings.some((r) => r.status === "critical");
              const daysLogged = w.readings.filter((r) => r.status !== "pending").length;
              return (
                <Link key={w.id} href={`/dashboard/monitor/${w.id}`}>
                  <Card className="h-full p-5 transition-shadow hover:shadow-elevated">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-display text-[17px] text-primon-950">{w.code}</p>
                        <p className="text-xs text-muted">{w.client}</p>
                      </div>
                      <FccStatusPill status={w.status} />
                    </div>
                    <div className="mt-5 flex items-end justify-between">
                      <div className="flex gap-1">
                        {w.readings.map((r) => (
                          <span
                            key={r.day}
                            className={
                              "h-6 w-2.5 rounded-full " +
                              (r.status === "pending"
                                ? "bg-slate-200"
                                : r.status === "critical"
                                ? "bg-status-critical"
                                : r.status === "action_taken"
                                ? "bg-status-action"
                                : "bg-status-compliant")
                            }
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted">{daysLogged}/6 days logged</p>
                    </div>
                    {critical && (
                      <p className="mt-3 text-xs font-medium text-status-critical">
                        Critical reading recorded — review required
                      </p>
                    )}
                    <p className="mt-3 text-[11px] text-muted">Placed {w.datePlaced ? formatDate(w.datePlaced) : "—"}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
