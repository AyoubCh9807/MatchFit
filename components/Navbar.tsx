"use client";

import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/types/User";
import { Trainer } from "@/types/Trainer";

export const Navbar = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  //MESSAGES WILL BE ADDED LATER

  const userItems = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard" },
    { name: "Get Matched", icon: "🤝", path: "/get_matched" },
    // { name: "Messages", icon: "💬", path: "/messages" },
    { name: "My Sessions", icon: "👤", path: "/sessions" },
    { name: "Progress", icon: "📈", path: "/progress" },
    { name: "Settings", icon: "⚙️", path: "/settings" },
  ];

  const trainerItems = [
    { name: "Dashboard", icon: "🏠", path: "/dashboard" },
    { name: "Schedule", icon: "🏠", path: "/schedule" },
    // { name: "Messages", icon: "💬", path: "/messages" },
    { name: "My Clients", icon: "👤", path: "/clients" },
    { name: "My Certifications", icon: "📈", path: "/certifications" },
    { name: "Settings", icon: "⚙️", path: "/settings" },
  ];

  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [user, setUser] = useState<User | Trainer | null>(null);
  const [role, setRole] = useState<"client" | "trainer" | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Listen to auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSupabaseUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Load user on mount AND after auth change
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setSupabaseUser(data.user ?? null);
    };
    fetchUser();
  }, []);

  // Load profile and determine role
  useEffect(() => {
    if (!supabaseUser) {
      setUser(null);
      setRole(null);
      return;
    }

    const loadProfile = async () => {
      // Check if user exists in users table
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();

      if (userData) {
        setUser(userData);
        setRole("client");
        return;
      }

      // Otherwise, check trainers table
      const { data: trainerData } = await supabase
        .from("trainers")
        .select("*")
        .eq("id", supabaseUser.id)
        .single();

      if (trainerData) {
        setUser(trainerData);
        setRole("trainer");
      }
    };

    loadProfile();
  }, [supabaseUser]);

  const items = role === "trainer" ? trainerItems : userItems;

  return (
    <div className="flex min-h-screen font-sans bg-background text-foreground">
      {supabaseUser && (
        <aside className="fixed z-20 top-0 left-0 w-64 h-full bg-(--color-neutral) border-r border-[#333333] p-4 flex flex-col">
          <div className="mt-6">
            <nav className="space-y-2">
              {items.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setSelectedIndex(items.indexOf(item));
                    router.push(item.path)
                  }}
                  className={`
                    flex w-full items-center gap-3 px-4 py-3 rounded-lg transition text-left ${
                      selectedIndex === items.indexOf(item)
                        ? "bg-(--color-primary) text-(--color-secondary)"
                        : "text-(--color-contrast) hover:bg-[#333333]"
                    }
                    `}
                >
                  <span>{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>
      )}

      <div className={`flex flex-col flex-1 ${supabaseUser ? "ml-64" : ""}`}>
        {supabaseUser && (
          <header className="sticky top-0 z-10 bg-(--color-accent) border-b border-[#333333] px-6 py-4 flex justify-between items-center">
            <span className="text-2xl font-bold text-(--color-primary)">MATCHFIT</span>

            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-[#2d2d2d] text-(--color-contrast) hover:bg-[#333333] transition"
              >
                ← Back to Dashboard
              </button>

              <div className="flex items-center gap-2 bg-[#252525] px-3 py-2 rounded-full">
                <div className="w-8 h-8 rounded-full bg-(--color-primary) flex items-center justify-center text-(--color-secondary) font-bold text-xs">
                  {user?.name?.[0] ?? "E"}
                </div>
                <span className="text-sm font-medium">
                  {role ? `${role.toUpperCase()} - ` : ""}{user?.name ?? "Elliot"}
                </span>
              </div>
            </div>
          </header>
        )}

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
};
