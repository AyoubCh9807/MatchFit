"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { initSentryUser } from "@/lib/sentry/sentry";
import { useRouter } from "next/navigation";

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    activeExperts: 0,
    pendingRequests: 0,
    progressLogs: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchingView, setIsSwitchingView] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/"); // Redirect to login if not authenticated
          return;
        }

        setUser(user);

        // Initialize Sentry
        initSentryUser({
          id: user.id,
          email: user.email,
          role: "client",
        });
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleSwitchView = () => {
    setIsSwitchingView(true);
    // In real app: check if user has trainer role, then redirect
    setTimeout(() => {
      router.push("/expert-dashboard");
      setIsSwitchingView(false);
    }, 600);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-(--background)] ext-(--foreground)] -6 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-(--color-primary) rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--background)] ext-(--foreground)] ont-sans overflow-x-hidden">
      <div className="flex">
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-sans font-bold text-(--color-secondary)">
              Dashboard
            </h1>
            <p className="text-(--color-contrast) font-sans mt-1">
              Welcome back! Here’s your fitness journey overview.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                title: "Active Experts",
                value: stats.activeExperts,
                icon: "👥",
                bg: "bg-blue-900/30",
              },
              {
                title: "Pending Requests",
                value: stats.pendingRequests,
                icon: "📅",
                bg: "bg-yellow-900/30",
              },
              {
                title: "Progress Logs",
                value: stats.progressLogs,
                icon: "📈",
                bg: "bg-green-900/30",
              },
            ].map((card, i) => (
              <div
                key={i}
                className="p-5 rounded-xl bg-(--color-accent) border border-[#333333] flex items-center justify-between"
              >
                <div>
                  <p className="text-(--color-contrast) font-sans text-sm font-medium">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-(--color-secondary) mt-1">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`${card.bg} w-12 h-12 rounded-lg flex items-center justify-center text-white`}
                >
                  {card.icon}
                </div>
              </div>
            ))}
          </div>

          <div
            className="rounded-xl p-6 shadow-lg border border-[#333333]"
            style={{
              background: "linear-gradient(135deg, #1e1e1e 0%, #252525 100%)",
            }}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-(--color-primary) rounded-lg flex items-center justify-center text-(--color-secondary) font-bold text-lg">
                🎯
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-sans font-bold text-(--color-secondary)">
                  Ready to Get Matched?
                </h3>
                <p className="font-sans text-(--color-contrast) mt-2">
                  Tell us your goals, and our AI will connect you with a
                  verified trainer or dietitian who fits your needs.
                </p>
                <button
                  onClick={() => router.push("/match")}
                  className="mt-4 px-6 py-2.5 bg-(--color-primary) text-(--color-secondary) font-semibold rounded-lg shadow hover:bg-[#e6c200] active:bg-[#ccac00] transition duration-200"
                >
                  Find My Perfect Match
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
