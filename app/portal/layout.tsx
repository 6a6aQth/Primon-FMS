import { PrimonLogo } from "@/components/logo";
import { RoleSwitcher } from "@/components/role-switcher";
import Link from "next/link";

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b border-border bg-white px-6 py-5 lg:px-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/portal">
            <PrimonLogo width={160} />
          </Link>
          <span className="rounded-full border border-border bg-primon-50 px-3 py-1.5 text-xs font-medium text-primon-800">
            Client portal
          </span>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">{children}</div>
      <RoleSwitcher />
    </div>
  );
}
