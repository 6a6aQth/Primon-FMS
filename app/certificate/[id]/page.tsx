"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PrimonLogo } from "@/components/logo";
import { CertificateView } from "@/components/certificate-view";
import { DownloadCertificateButton } from "@/components/download-certificate-button";
import { EmptyState } from "@/components/ui/kpi";
import { useDemo } from "@/lib/store";
import { certificateFilename } from "@/lib/download-certificate";

export default function CertificatePage({ params }: { params: { id: string } }) {
  const { workOrders } = useDemo();
  const wo = workOrders.find((w) => w.id === params.id);
  const sheetRef = useRef<HTMLElement>(null);

  return (
    <main className="min-h-screen bg-canvas pb-20">
      <header className="no-print flex items-center justify-between border-b border-border bg-white px-6 py-5 lg:px-10">
        <div className="flex items-center gap-6">
          <PrimonLogo width={150} />
          <Link href="/dashboard" className="hidden items-center gap-1.5 text-xs font-medium text-primon-700 hover:text-primon-900 sm:flex">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to platform
          </Link>
        </div>
        {wo && (
          <DownloadCertificateButton
            targetRef={sheetRef}
            filename={certificateFilename(wo.certificateNumber, wo.code)}
          />
        )}
      </header>

      <div className="mx-auto px-4 py-8 lg:px-8">
        {wo ? (
          <CertificateView ref={sheetRef} workOrder={wo} />
        ) : (
          <EmptyState title="Certificate not found" description="This work order isn't in the current demo session." />
        )}
      </div>
    </main>
  );
}
