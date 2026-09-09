"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadCertificatePdf } from "@/lib/download-certificate";

export function DownloadCertificateButton({
  targetRef,
  filename,
  label = "Download PDF",
}: {
  targetRef: { current: HTMLElement | null };
  filename: string;
  label?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDownload() {
    const el = targetRef.current;
    if (!el || busy) return;
    setError(null);
    setBusy(true);
    try {
      await downloadCertificatePdf(el, filename);
    } catch (err) {
      console.error(err);
      setError("Could not generate PDF. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button size="sm" variant="secondary" onClick={handleDownload} disabled={busy} className="no-print">
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Download className="h-3.5 w-3.5" />
        )}
        {busy ? "Preparing PDF…" : label}
      </Button>
      {error && <p className="text-[11px] text-status-critical">{error}</p>}
    </div>
  );
}
