"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { initSentryUser } from "@/lib/sentry/sentry";
import { useRouter } from "next/navigation";
import { User } from "@/types/User";
import ExpertDashboard from "../expert_dashboard/page";

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | any | null>(null);
  const [stats, setStats] = useState({
    activeExperts: 0,
    pendingRequests: 0,
    progressLogs: 0,
  });
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [topTrainer, setTopTrainer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get auth user
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) {
          router.push("/");
          return;
        }
        setUser(authUser);

        // Initialize Sentry
        initSentryUser({
          id: authUser.id,
          email: authUser.email,
          role: "client",
        });

        // Fetch user profile
        const { data: userProfile } = await supabase
          .from("users")
          .select("experts, goals")
          .eq("id", authUser.id)
          .single();

        const activeExperts = userProfile?.experts?.length || 0;

        // Fetch sessions
        const { data: sessions } = await supabase
          .from("sessions")
          .select("*, trainers(id, name, avatar_url)")
          .eq("user_id", authUser.id)
          .order("date", { ascending: false });

        const pendingRequests = sessions?.filter(s => s.status === "booked").length || 0;
        const progressLogs = sessions?.filter(s => s.status === "completed").length || 0;

        setStats({ activeExperts, pendingRequests, progressLogs });
        setRecentSessions(sessions?.slice(0, 5) || []);

        // Determine top trainer by completed sessions
        const trainerCounts: Record<string, { count: number; trainer: any }> = {};
        sessions?.forEach(s => {
          if (s.status === "completed") {
            if (!trainerCounts[s.trainer_id]) trainerCounts[s.trainer_id] = { count: 0, trainer: s.trainers };
            trainerCounts[s.trainer_id].count++;
          }
        });
        const top = Object.values(trainerCounts).sort((a, b) => b.count - a.count)[0];
        setTopTrainer(top?.trainer || null);

      } catch (err) {
        console.error("Failed to load dashboard:", err);
        router.push("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if(user && user.role) {
    return <ExpertDashboard/>
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-(--background)] ext-(--foreground)] lex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-(--color-primary) rounded-full"></div>
      </div>
    );
  }

  if(user.role)

  return (
    <div className="min-h-screen bg-(--background)] ext-(--foreground)] ont-sans overflow-x-hidden">
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-(--color-secondary)">Dashboard</h1>
          <p className="text-(--color-contrast) mt-1">
            Welcome back! Here’s your fitness journey overview.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { title: "Active Experts", value: stats.activeExperts, icon: "👥", bg: "bg-blue-900/30" },
            { title: "Pending Requests", value: stats.pendingRequests, icon: "📅", bg: "bg-yellow-900/30" },
            { title: "Progress Logs", value: stats.progressLogs, icon: "📈", bg: "bg-green-900/30" },
          ].map((card, i) => (
            <div key={i} className="p-5 rounded-xl bg-(--color-accent) border border-[#333333] flex items-center justify-between">
              <div>
                <p className="text-(--color-contrast) text-sm font-medium">{card.title}</p>
                <p className="text-2xl font-bold text-(--color-secondary) mt-1">{card.value}</p>
              </div>
              <div className={`${card.bg} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                {card.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => router.push("/get_matched")}
            className="px-4 py-2 bg-(--color-primary) text-(--color-secondary) font-semibold rounded-lg shadow hover:bg-[#e6c200] transition"
          >
            Book Session
          </button>
          <button
            onClick={() => router.push("/get_matched")}
            className="px-4 py-2 bg-(--color-accent) text-(--color-secondary) font-semibold rounded-lg shadow hover:bg-[#d4a700] transition"
          >
            Update Goals
          </button>
          <button
            onClick={() => router.push("/progress")}
            className="px-4 py-2 bg-(--color-secondary) text-(--color-background) font-semibold rounded-lg shadow hover:bg-[#c4b900] transition"
          >
            View Progress
          </button>
        </div>

        {/* Recent Sessions */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-(--color-secondary) mb-4">Recent Sessions</h2>
          {recentSessions.length === 0 ? (
            <p className="text-(--color-contrast) italic">No sessions yet.</p>
          ) : (
            <ul className="space-y-3">
              {recentSessions.map(s => (
                <li key={s.id} className="p-4 border border-[#333333] rounded-lg flex justify-between items-center bg-(--color-accent)">
                  <div>
                    <p className="font-semibold text-(--color-secondary)">{s.trainers?.name || "Unknown Trainer"}</p>
                    <p className="text-(--color-contrast) text-sm">{s.date} at {s.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-sm ${
                    s.status === "completed" ? "bg-green-700" :
                    s.status === "booked" ? "bg-yellow-700" :
                    "bg-red-700"
                  } text-white`}>
                    {s.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Top Trainer */}
        {topTrainer && (
          <div className="mb-8 p-5 border border-[#333333] rounded-xl bg-(--color-accent) flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#252525] overflow-hidden shrink-0">
              {topTrainer.avatar_url ? (
                <img src={topTrainer.avatar_url} alt={topTrainer.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-(--color-primary) font-bold">
                  {topTrainer.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-bold text-(--color-secondary)">Top Trainer</h3>
              <p className="text-(--color-contrast)">{topTrainer.name}</p>
            </div>
          </div>
        )}

        {/* Ready to Get Matched */}
        <div className="rounded-xl p-6 shadow-lg border border-[#333333]" style={{ background: "linear-gradient(135deg, #1e1e1e 0%, #252525 100%)" }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-(--color-primary) rounded-lg flex items-center justify-center text-(--color-secondary) font-bold text-lg">🎯</div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-(--color-secondary)">Ready to Get Matched?</h3>
              <p className="text-(--color-contrast) mt-2">
                Tell us your goals, and our AI will connect you with a verified trainer or dietitian who fits your needs.
              </p>
              <button
                onClick={() => router.push("/get_matched")}
                className="mt-4 px-6 py-2.5 bg-(--color-primary) text-(--color-secondary) font-semibold rounded-lg shadow hover:bg-[#e6c200] active:bg-[#ccac00] transition duration-200"
              >
                Find My Perfect Match
              </button>
            </div>
          </div>
        </div>

        {/* Goals Display */}
        {user.goals?.length > 0 && (
          <div className="mt-8 p-5 border border-[#333333] rounded-xl bg-(--color-accent)">
            <h3 className="text-lg font-bold text-(--color-secondary) mb-3">Your Goals</h3>
            <div className="flex flex-wrap gap-2">
              {user.goals.map((goal: string, i: number) => (
                <span key={i} className="px-3 py-1.5 bg-[#252525] text-(--color-contrast) text-sm rounded-full">
                  {goal}
                </span>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
