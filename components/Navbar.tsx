"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/types/User";
import { Trainer } from "@/types/Trainer";
import { useStore } from "@/hooks/useStore";

export const Navbar = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();

  const { role, setRole } = useStore();
  const [user, setUser] = useState<User | Trainer | null>(null);

  useEffect(() => {
    setUser({
      id: "u1234567-89ab-cdef-0123-456789abcdef",
      name: "Itercio",
      avatar_url: "https://randomuser.me/api/portraits/men/75.jpg",
      email: "oscar.itercio@example.com",
      age: 25,
      gender: "male",
      location: "Korea, Seoul",
      fitness_level: "Intermediate",
      goals:
        "I want to build muscle, improve endurance, and run a half marathon by next summer.",
      created_at: "2025-11-15T17:00:00.000Z",
      experts: [
        "a7f8c2b1-1234-4cde-9a87-1a2b3c4d5e6f",
        "b4c9d7e2-5678-4f3a-8c9b-2e3f4a5b6c7d",
      ],
    });
    setRole("client");
  }, []);

  useEffect(() => {
    localStorage.setItem("role", role ?? "client");
  }, [role]);

  // Don't render navbar on "/" route
  if (pathname === "/") return <>{children}</>;

  // ...rest of your component logic (menu items, JSX)
  const userItems = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard" },
    { name: "Get Matched", icon: "🤝", path: "/get_matched" },
    { name: "My Sessions", icon: "👤", path: "/sessions" },
    { name: "Progress", icon: "📈", path: "/progress" },
    { name: "Settings", icon: "⚙️", path: "/settings" },
  ];

  const trainerItems = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard" },
    { name: "Schedule", icon: "🏠", path: "/schedule" },
    { name: "My Clients", icon: "👤", path: "/clients" },
    { name: "My Certifications", icon: "📈", path: "/certifications" },
    { name: "Settings", icon: "⚙️", path: "/settings" },
  ];

  const items = role === "trainer" ? trainerItems : userItems;

  return (
    <div className="flex min-h-screen font-sans bg-background text-foreground">
      <aside className="fixed z-20 top-0 left-0 w-64 h-full bg-(--color-neutral) border-r border-[#333333] p-4 flex flex-col">
        <nav className="mt-6 space-y-2">
          {items.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                router.push(item.path);
              }}
              className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg transition text-left ${
                pathname === item.path
                  ? "bg-(--color-primary) text-(--color-secondary)"
                  : "text-(--color-contrast) hover:bg-[#333333]"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className={`flex flex-col flex-1 ${"ml-64"}`}>
        <header className="sticky top-0 z-10 bg-(--color-accent) border-b border-[#333333] px-6 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-(--color-primary)">MATCHFIT</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[#2d2d2d] text-(--color-contrast) hover:bg-[#333333] transition"
            >
              ← Back to Dashboard
            </button>

            <button
              onClick={() => setRole(role === "trainer" ? "client" : "trainer")}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[#2d2d2d] text-(--color-contrast) hover:bg-[#333333] transition"
            >
              Switch to Expert View
            </button>

            <div className="flex items-center gap-2 bg-[#252525] px-3 py-2 rounded-full">
              <div className="w-8 h-8 rounded-full bg-(--color-primary) flex items-center justify-center text-(--color-secondary) font-bold text-xs">
                {user?.name?.[0] ?? "E"}
              </div>
              <span className="text-sm font-medium">
                {role ? `${role.toUpperCase()} - ` : ""}
                {user?.name ?? "Elliot"}
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};
