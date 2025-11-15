"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trainer } from "@/types/Trainer";
import { User } from "@/types/User";

type Session = {
  id: string;
  user_id: string;
  date: string;
  time: string;
  status: "booked" | "completed" | "canceled";
  user: {
    name: string;
    avatar_url: string | null;
  };
};

export default function ExpertDashboard() {
  const router = useRouter();
  const [authUserId, setAuthUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      setAuthUserId(user.id);
    };
    checkAuth();
  }, [router]);

  // Fetch data
  const { data, isLoading, error } = useQuery({
    queryKey: ["trainer-dashboard", authUserId],
    queryFn: async () => {
      if (!authUserId) throw new Error("Not authenticated");

      // Trainer profile
      const { data: trainerData, error: trainerError } = await supabase
        .from("trainers")
        .select("*")
        .eq("id", authUserId)
        .single();
      if (trainerError || !trainerData)
        throw new Error("Trainer profile not found");

      // Today's sessions
      const today = new Date().toISOString().split("T")[0];
      const { data: todaySessionsData } = await supabase
        .from("sessions")
        .select(
          `
          id,
          user_id,
          date,
          time,
          status,
          users!inner (name, avatar_url)
        `
        )
        .eq("trainer_id", authUserId)
        .eq("date", today)
        .eq("status", "booked")
        .order("time", { ascending: true });

      // Map to Session[]
      const sessions: Session[] = (todaySessionsData || []).map((s: any) => ({
        id: s.id,
        user_id: s.user_id,
        date: s.date,
        time: s.time,
        status: s.status,
        user: s.users[0] || { name: "Unknown", avatar_url: null },
      }));

      // Completed sessions count
      const { count: completedCount } = await supabase
        .from("sessions")
        .select("*", { count: "exact" })
        .eq("trainer_id", authUserId)
        .eq("status", "completed");

      // Recent clients (last 3)
      const { data: recentClientsData } = await supabase
        .from("sessions")
        .select(`user_id, users!inner (name, avatar_url)`)
        .eq("trainer_id", authUserId)
        .eq("status", "completed")
        .order("date", { ascending: false })
        .limit(3);

      const recentClients: User[] = Array.from(
        new Map(
          (recentClientsData || []).map((c: any) => [c.user_id, c.users[0]])
        ).values()
      );

      return {
        trainer: trainerData as Trainer,
        sessions,
        stats: {
          totalClients: trainerData.clients?.length || 0,
          completedSessions: completedCount || 0,
          averageRating: trainerData.rating || 0,
        },
        recentClients,
      };
    },
    enabled: !!authUserId,
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[#252525] animate-pulse"></div>
          <div>
            <div className="h-6 bg-[#2d2d2d] rounded w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-[#2d2d2d] rounded w-32 animate-pulse"></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-(--color-accent) border border-[#333333] rounded-xl p-5 animate-pulse"
            >
              <div className="h-4 bg-[#252525] rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-[#252525] rounded w-2/3"></div>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-(--color-accent) border border-[#333333] rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-[#252525] rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#252525]"></div>
                  <div className="h-4 bg-[#252525] rounded w-24"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-(--color-accent) border border-[#333333] rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-[#252525] rounded w-1/3 mb-4"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-[#252525] rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-red-900/20 border border-red-900/50 text-red-300 p-4 rounded-lg">
          ❌ {error?.message || "Failed to load dashboard."}
        </div>
      </div>
    );
  }

  const { trainer, sessions, stats, recentClients } = data;
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#252525] shrink-0 overflow-hidden">
          {trainer.avatar_url ? (
            <Image
              src={trainer.avatar_url}
              alt={trainer.name}
              width={64}
              height={64}
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-(--color-primary) font-bold text-2xl">
              {trainer.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-(--color-secondary)">
            {trainer.name}
          </h1>
          <div className="flex items-center gap-3 mt-1">
            {trainer.rating != null && (
              <span className="text-(--color-primary) font-medium">
                ★ {trainer.rating}
              </span>
            )}
            {trainer.specialties && trainer.specialties.length > 0 && (
              <span className="text-(--color-contrast) text-sm">
                • {trainer.specialties.slice(0, 2).join(", ")}
                {trainer.specialties.length > 2 && (
                  <span> +{trainer.specialties.length - 2}</span>
                )}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Today */}
      <div>
        <h2 className="text-lg font-semibold text-(--color-secondary) mb-3">
          Today • {today}
        </h2>
        {sessions.length > 0 ? (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-(--color-accent) border border-[#333333] rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#252525] shrink-0 overflow-hidden">
                    {session.user.avatar_url ? (
                      <Image
                        src={session.user.avatar_url}
                        alt={session.user.name}
                        width={40}
                        height={40}
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-(--color-primary) font-bold">
                        {session.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-(--color-secondary)">
                      {session.user.name}
                    </p>
                    <p className="text-(--color-contrast) text-sm">
                      {session.time}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full">
                  Booked
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-(--color-contrast) italic">
            No sessions scheduled for today.
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Total Clients", value: stats.totalClients, icon: "👥" },
          {
            title: "Completed Sessions",
            value: stats.completedSessions,
            icon: "✅",
          },
          {
            title: "Avg. Rating",
            value: stats.averageRating ? `★ ${stats.averageRating}` : "—",
            icon: "⭐",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-(--color-accent) border border-[#333333] rounded-xl p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-purple-900/20 rounded-lg flex items-center justify-center text-purple-300 text-xl">
              {stat.icon}
            </div>
            <div>
              <p className="text-(--color-contrast) text-sm">{stat.title}</p>
              <p className="text-(--color-secondary) text-xl font-bold">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Clients */}
      {recentClients.length > 0 && (
        <div className="bg-(--color-accent) border border-[#333333] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#333333]">
            <h2 className="text-lg font-semibold text-(--color-secondary)">
              Recent Clients
            </h2>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {recentClients.map((client: User, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#252525] shrink-0 overflow-hidden">
                    {client.avatar_url ? (
                      <Image
                        src={
                          client.avatar_url ||
                          "https://randomuser.me/api/portraits/lego/1.jpg"
                        }
                        alt={client.name}
                        width={40}
                        height={40}
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-(--color-primary) font-bold">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="text-(--color-secondary)">
                    {client.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
