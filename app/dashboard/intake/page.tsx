"use client";

import { useState } from "react";
import Link from "next/link";
import { Inbox, Mail } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/kpi";
import { mockPendingSubmissions } from "@/lib/mock-data";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

const sourceLabel = {
  work_order: "Work order request",
  rfq: "Request for quote",
  rfw: "Request for work",
};

const sourceTone = {
  work_order: "bg-primon-100 text-primon-700",
  rfq: "bg-brass-100 text-brass-700",
  rfw: "bg-status-compliantTint text-status-compliant",
};

export default function IntakePage() {
  const [items, setItems] = useState(mockPendingSubmissions);
  const [handled, setHandled] = useState<Record<string, "converted" | "dismissed">>({});

  return (
    <div>
      <Topbar
        title="Website intake"
        description="Work order, RFQ and RFW submissions from the public Primon website"
      />

      <div className="px-6 py-8 lg:px-10">
        {items.length === 0 ? (
          <EmptyState
            title="Inbox is clear"
            description="New work order, RFQ and RFW submissions from primon.mw will appear here."
          />
        ) : (
          <div className="space-y-4">
            {items.map((s) => {
              const state = handled[s.id];
              return (
                <Card key={s.id} className={cn("p-5", state && "opacity-50")}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3.5">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primon-50 text-primon-700">
                        <Inbox className="h-4.5 w-4.5" strokeWidth={1.75} />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-primon-950">{s.name}</p>
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-medium", sourceTone[s.sourceType])}>
                            {sourceLabel[s.sourceType]}
                          </span>
                        </div>
                        <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                          <Mail className="h-3 w-3" /> {s.contact}
                        </p>
                        <p className="mt-2 text-sm text-ink">{s.cropOrService}</p>
                        <p className="mt-1 text-sm text-muted">{s.message}</p>
                        <p className="mt-2 text-[11px] text-muted">Received {formatDateTime(s.receivedAt)}</p>
                      </div>
                    </div>
                    {!state ? (
                      <div className="flex shrink-0 gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setHandled((h) => ({ ...h, [s.id]: "dismissed" }))}>
                          Dismiss
                        </Button>
                        <Link href="/dashboard/work-orders/new">
                          <Button size="sm" onClick={() => setHandled((h) => ({ ...h, [s.id]: "converted" }))}>
                            Convert to work order
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <span className="shrink-0 text-xs font-medium text-muted">
                        {state === "converted" ? "Converted" : "Dismissed"}
                      </span>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
