"use client";
import ClientProgressMock from "@/components/ClientProgress";
import ExpertProgressMock from "@/components/ExpertProgress";
import { useStore } from "@/hooks/useStore";

export default function Dashboard() {
  const role = useStore((state) => state.role);

  return (
    <main className="flex-1 overflow-y-auto p-6">
      {role === "trainer" ? <ExpertProgressMock /> : <ClientProgressMock />}
    </main>
  );
}
