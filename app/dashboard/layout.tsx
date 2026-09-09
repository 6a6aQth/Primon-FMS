import { Sidebar } from "@/components/sidebar";
import { RoleSwitcher } from "@/components/role-switcher";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <div className="lg:pl-64">{children}</div>
      <RoleSwitcher />
    </div>
  );
}
