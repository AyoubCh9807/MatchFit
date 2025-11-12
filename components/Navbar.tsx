"use client";

import { useRouter } from "next/navigation";

export const Navbar = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const sidebarItems = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard" },
    { name: "Get Matched", icon: "🤝", path: "/get-matched" },
    { name: "Messages", icon: "💬", path: "/messages" },
    { name: "My Expert", icon: "👤", path: "/my-expert" },
    { name: "Progress", icon: "📈", path: "/progress" },
    { name: "My Plans", icon: "📋", path: "/my-plans" },
  ];

  return (
    <div className="flex min-h-screen font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-(--color-neutral) border-r border-[#333333] p-4">
        <nav className="space-y-2 mt-6">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-(--color-contrast) hover:bg-[#2d2d2d] transition text-left"
            >
              <span>{item.icon}</span>
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-(--color-accent) border-b border-[#333333] px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-(--color-primary)">
              MATCHFIT
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[#2d2d2d] text-(--color-contrast) hover:bg-[#333333] transition"
            >
              ← Back to Dashboard
            </button>

            <button
              onClick={() => router.push("/expert-dashboard")}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-[#2d2d2d] text-(--color-contrast) hover:bg-[#333333] transition"
            >
              Switch to Expert View
            </button>

            <div className="flex items-center gap-2 bg-[#252525] px-3 py-2 rounded-full">
              <div className="w-8 h-8 rounded-full bg-(--color-primary) flex items-center justify-center text-(--color-secondary) font-bold text-xs">
                A
              </div>
              <span className="text-sm font-medium">Alex Johnson</span>
            </div>
          </div>
        </header>
        {/* RENDER CHILDREN */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};
