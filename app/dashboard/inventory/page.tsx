"use client";

import { useState } from "react";
import { Minus, Plus, Boxes } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/store";
import { cn } from "@/lib/utils";

export default function InventoryPage() {
  const { stock, adjustStock } = useDemo();
  const [note, setNote] = useState<string | null>(null);

  function handleAdjust(id: string, delta: number, label: string) {
    adjustStock(id, delta);
    setNote(`${delta > 0 ? "Added" : "Deducted"} ${Math.abs(delta)} units — ${label}`);
    setTimeout(() => setNote(null), 2800);
  }

  return (
    <div>
      <Topbar
        title="Fumigant stock"
        description="Levels update automatically as formulations are used on active work orders"
      />

      <div className="px-6 py-8 lg:px-10">
        {note && (
          <div className="mb-6 rounded-lg border border-primon-200 bg-primon-50 px-4 py-3 text-sm text-primon-800">
            {note}
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stock.map((s) => {
            const low = s.quantityOnHand <= s.lowStockThreshold;
            const pct = Math.min(100, Math.round((s.quantityOnHand / (s.lowStockThreshold * 2.5)) * 100));
            return (
              <Card key={s.id} className="p-6">
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primon-50 text-primon-700">
                    <Boxes className="h-4.5 w-4.5" strokeWidth={1.75} />
                  </span>
                  {low && (
                    <span className="rounded-full bg-status-actionTint px-2.5 py-1 text-[10px] font-medium text-status-action">
                      Low stock
                    </span>
                  )}
                </div>
                <p className="mt-4 font-display text-lg text-primon-950">{s.formulation}</p>
                <p className="text-xs text-muted">
                  {s.fumigant} · {s.cropType === "both" ? "Tobacco & grain" : s.cropType}
                </p>

                <div className="mt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="num font-display text-3xl text-primon-950">{s.quantityOnHand}</span>
                    <span className="text-xs text-muted">{s.unit} on hand</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={cn("h-full rounded-full", low ? "bg-status-action" : "bg-status-compliant")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted">Reorder threshold: {s.lowStockThreshold} {s.unit}</p>
                </div>

                <div className="mt-5 flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => handleAdjust(s.id, -10, s.formulation)}
                  >
                    <Minus className="h-3.5 w-3.5" /> 10
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => handleAdjust(s.id, 50, s.formulation)}
                  >
                    <Plus className="h-3.5 w-3.5" /> 50
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
