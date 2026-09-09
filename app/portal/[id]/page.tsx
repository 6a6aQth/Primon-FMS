"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CertificateView } from "@/components/certificate-view";
import { DownloadCertificateButton } from "@/components/download-certificate-button";
import { EmptyState } from "@/components/ui/kpi";
import { useDemo } from "@/lib/store";
import { certificateFilename } from "@/lib/download-certificate";

export default function PortalWorkOrderPage({ params }: { params: { id: string } }) {
  const { workOrders, updateWorkOrder } = useDemo();
  const wo = workOrders.find((w) => w.id === params.id);
  const sheetRef = useRef<HTMLElement>(null);

  if (!wo) {
    return <EmptyState title="Not found" description="This work order isn't in the current demo session." />;
  }

  return (
    <div>
      <div className="no-print mb-6 flex items-center justify-between">
        <Link href="/portal" className="flex items-center gap-1.5 text-xs font-medium text-primon-700 hover:text-primon-950">
          <ArrowLeft className="h-3.5 w-3.5" /> Your shipments
        </Link>
        {wo.status === "certified" && (
          <DownloadCertificateButton
            targetRef={sheetRef}
            filename={certificateFilename(wo.certificateNumber, wo.code)}
            label="Download certified FCC"
          />
        )}
      </div>

      <CertificateView
        ref={sheetRef}
        workOrder={wo}
        editableSi
        onSaveSi={(si) => updateWorkOrder(wo.id, { si })}
      />
    </div>
  );
}
