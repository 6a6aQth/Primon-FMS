"use client";

import { QRCodeSVG } from "qrcode.react";

export function CertificateQr({
  value,
  size = 160,
}: {
  value: string;
  size?: number;
}) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5">
      <div className="border border-[#E3E7F0] bg-white p-2.5">
        <QRCodeSVG
          value={value}
          size={size}
          level="M"
          marginSize={2}
          bgColor="#ffffff"
          fgColor="#090F24"
          title="Scan to verify this certificate"
        />
      </div>
      <span className="text-[9px] tracking-wide text-muted">Scan to verify</span>
    </div>
  );
}
