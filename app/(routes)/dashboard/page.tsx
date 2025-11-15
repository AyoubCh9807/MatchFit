"use client";
import ClientDashboardMock from "@/components/ClientDashboard";
import ExpertDashboardMock from "@/components/ExpertDashboard";
import { useStore } from "@/hooks/useStore";

export default function Dashboard() {
  const role = useStore((state) => state.role);

  return (
    <main className="flex-1 overflow-y-auto p-6">
      {role === "trainer" ? <ExpertDashboardMock /> : <ClientDashboardMock />}
    </main>
  );
}
