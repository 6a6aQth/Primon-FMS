"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, TriangleAlert, ShieldCheck, FileCheck2 } from "lucide-react";
import { Topbar } from "@/components/topbar";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GasDayGauge } from "@/components/gas-day-gauge";
import { FccStatusPill } from "@/components/ui/status-pill";
import { FormRow, Label, TextInput } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/kpi";
import { useDemo } from "@/lib/store";
import { GasReading } from "@/lib/types";
import { LETHAL_THRESHOLD } from "@/lib/status";
import { formatDate } from "@/lib/utils";

export default function MonitorDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { workOrders, updateWorkOrder } = useDemo();
  const wo = workOrders.find((w) => w.id === params.id);

  const [logging, setLogging] = useState<number | null>(null);
  const [form, setForm] = useState({ airspace: "", probeCase: "", ambientTemp: "", productTemp: "", humidity: "" });
  const [actionDay, setActionDay] = useState<number | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  if (!wo) {
    return (
      <div>
        <Topbar title="Gas-reading monitor" />
        <div className="px-6 py-8 lg:px-10">
          <EmptyState title="Work order not found" description="It may have been removed in this demo session." />
        </div>
      </div>
    );
  }

  const nextPendingDay = wo.readings.find((r) => r.status === "pending")?.day ?? null;
  const allResolved =
    wo.readings.length === 6 && wo.readings.every((r) => r.status === "compliant" || r.status === "action_taken");
  const hasOpenCritical = wo.readings.some((r) => r.status === "critical");

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }

  function submitReading(day: number) {
    const airspace = parseInt(form.airspace, 10);
    const probeCase = parseInt(form.probeCase, 10);
    if (Number.isNaN(airspace) || Number.isNaN(probeCase)) return;

    const status: GasReading["status"] =
      airspace < LETHAL_THRESHOLD || probeCase < LETHAL_THRESHOLD ? "critical" : "compliant";

    const readings = wo!.readings.map((r) =>
      r.day === day
        ? {
            ...r,
            airspace,
            probeCase,
            ambientTemp: form.ambientTemp ? parseFloat(form.ambientTemp) : null,
            productTemp: form.productTemp ? parseFloat(form.productTemp) : null,
            humidity: form.humidity ? parseFloat(form.humidity) : null,
            status,
          }
        : r
    );

    updateWorkOrder(wo!.id, {
      readings,
      status: status === "critical" ? "flagged" : wo!.status,
    });

    if (status === "critical") {
      showToast(`Day ${day} flagged critical — Operations Manager notified in-app and by email.`);
    } else {
      showToast(`Day ${day} reading saved — compliant.`);
    }

    setLogging(null);
    setForm({ airspace: "", probeCase: "", ambientTemp: "", productTemp: "", humidity: "" });
  }

  function submitCorrectiveAction(day: number) {
    if (!actionNote.trim()) return;
    const readings = wo!.readings.map((r) =>
      r.day === day
        ? {
            ...r,
            status: "action_taken" as const,
            correctiveAction: {
              note: actionNote,
              loggedBy: "Grace Phiri",
              loggedAt: new Date().toISOString(),
            },
          }
        : r
    );
    const stillCritical = readings.some((r) => r.status === "critical");
    updateWorkOrder(wo!.id, {
      readings,
      status: stillCritical ? "flagged" : "under_review",
    });
    showToast(`Corrective action logged for Day ${day}.`);
    setActionDay(null);
    setActionNote("");
  }

  function certify() {
    const certNo = `FCC-2026-${String(Math.floor(100000 + Math.random() * 900000))}`;
    updateWorkOrder(wo!.id, {
      status: "certified",
      certificateNumber: certNo,
      certifiedAt: new Date().toISOString(),
      aerationBegan: wo!.aerationBegan || new Date().toISOString(),
      aerationCompleted: wo!.aerationCompleted || new Date().toISOString(),
      durationHours: wo!.durationHours || 168,
    });
    router.push(`/certificate/${wo!.id}`);
  }

  return (
    <div className="pb-16">
      <Topbar
        title={wo.code}
        description={wo.client}
        action={<FccStatusPill status={wo.status} />}
      />

      <div className="px-6 py-8 lg:px-10">
        <Link
          href="/dashboard/monitor"
          className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-primon-700 hover:text-primon-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All monitored work orders
        </Link>

        {toast && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-primon-200 bg-white px-4 py-3 text-sm text-primon-900 shadow-card">
            <ShieldCheck className="h-4 w-4 text-brass-500" />
            {toast}
          </div>
        )}

        <Card className="mb-6 p-6">
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
            <div>
              <p className="text-xs text-muted">Fumigant</p>
              <p className="mt-1 text-sm font-medium text-ink">{wo.fumigation.fumigantName}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Formulation</p>
              <p className="mt-1 text-sm font-medium text-ink">{wo.fumigation.formulation}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Type</p>
              <p className="mt-1 text-sm font-medium capitalize text-ink">{wo.fumigation.fumigationType.replace("_", " ")}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Date fumigant placed</p>
              <p className="mt-1 text-sm font-medium text-ink">{wo.datePlaced ? formatDate(wo.datePlaced) : "—"}</p>
            </div>
          </div>
        </Card>

        {hasOpenCritical && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-status-critical/30 bg-status-criticalTint px-5 py-4">
            <TriangleAlert className="h-5 w-5 shrink-0 text-status-critical" />
            <p className="text-sm text-status-critical">
              A reading below {LETHAL_THRESHOLD}ppm is currently unresolved. Log a corrective action to continue toward certification.
            </p>
          </div>
        )}

        <Card>
          <CardHeader
            title="6-day monitoring window"
            description="Airspace and Probe/Case readings, checked against the 600ppm lethal threshold."
          />
          <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 lg:grid-cols-6">
            {wo.readings.map((r) => (
              <div key={r.day} className="space-y-2">
                <GasDayGauge reading={r} />
                {r.status === "pending" && r.day === nextPendingDay && (
                  <Button size="sm" variant="secondary" className="w-full" onClick={() => setLogging(r.day)}>
                    Log reading
                  </Button>
                )}
                {r.status === "critical" && (
                  <Button size="sm" variant="danger" className="w-full" onClick={() => setActionDay(r.day)}>
                    Log action
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        {logging !== null && (
          <Card className="mt-6 p-6">
            <p className="mb-4 font-display text-lg text-primon-950">Log Day {logging} reading</p>
            <div className="grid gap-5 sm:grid-cols-5">
              <FormRow label="Airspace (ppm)" required>
                <TextInput
                  type="number"
                  autoFocus
                  value={form.airspace}
                  onChange={(e) => setForm({ ...form, airspace: e.target.value })}
                />
              </FormRow>
              <FormRow label="Probe/Case (ppm)" required>
                <TextInput
                  type="number"
                  value={form.probeCase}
                  onChange={(e) => setForm({ ...form, probeCase: e.target.value })}
                />
              </FormRow>
              <FormRow label="Ambient temp (°C)">
                <TextInput
                  type="number"
                  value={form.ambientTemp}
                  onChange={(e) => setForm({ ...form, ambientTemp: e.target.value })}
                />
              </FormRow>
              <FormRow label="Product temp (°C)">
                <TextInput
                  type="number"
                  value={form.productTemp}
                  onChange={(e) => setForm({ ...form, productTemp: e.target.value })}
                />
              </FormRow>
              <FormRow label="Relative humidity (%)">
                <TextInput
                  type="number"
                  value={form.humidity}
                  onChange={(e) => setForm({ ...form, humidity: e.target.value })}
                />
              </FormRow>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setLogging(null)}>
                Cancel
              </Button>
              <Button onClick={() => submitReading(logging)} disabled={!form.airspace || !form.probeCase}>
                Save reading
              </Button>
            </div>
          </Card>
        )}

        {actionDay !== null && (
          <Card className="mt-6 border-status-critical/30 p-6">
            <p className="mb-1 font-display text-lg text-primon-950">Corrective action — Day {actionDay}</p>
            <p className="mb-4 text-xs text-muted">
              Describe the action taken to restore gas concentration above {LETHAL_THRESHOLD}ppm.
            </p>
            <Label>Action taken</Label>
            <textarea
              className="h-24 w-full rounded-lg border border-border p-3 text-sm outline-none focus:border-primon-500"
              placeholder="e.g. Additional fumigant dosing applied; re-sealed and re-checked."
              value={actionNote}
              onChange={(e) => setActionNote(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setActionDay(null)}>
                Cancel
              </Button>
              <Button onClick={() => submitCorrectiveAction(actionDay)} disabled={!actionNote.trim()}>
                Confirm action
              </Button>
            </div>
          </Card>
        )}

        <div className="mt-8 flex items-center justify-between rounded-xl border border-border bg-white p-6 shadow-card">
          <div className="flex items-center gap-3">
            <FileCheck2 className="h-5 w-5 text-brass-600" />
            <div>
              <p className="text-sm font-medium text-primon-950">
                {allResolved ? "Ready to certify" : "Certification pending"}
              </p>
              <p className="text-xs text-muted">
                {allResolved
                  ? "All 6 days resolved. Certifying locks the record and generates the QR code."
                  : "Complete all 6 daily readings, resolving any critical flags, before certifying."}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/certificate/${wo.id}`}>
              <Button variant="secondary">Preview certificate</Button>
            </Link>
            <Button variant="brass" onClick={certify} disabled={!allResolved || wo.status === "certified"}>
              {wo.status === "certified" ? "Certified" : "Certify FCC"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
