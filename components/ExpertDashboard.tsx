"use client";

import Image from "next/image";
import { Trainer } from "@/types/Trainer";
import { mockSessions } from "@/app/data/sessions";
import { mockTrainers } from "@/app/data/trainers";

// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase/supabaseClient";
// import { useQuery } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";

export default function ExpertDashboard() {
  // -----------------------
  // REAL AUTH & FETCH LOGIC (COMMENTED OUT)
  // -----------------------
  /*
  const router = useRouter();
  const [authUserId, setAuthUserId] = useState<string | null>(null);

  // Authenticate
  useEffect(() => {
    const checkAuth = async () => {
      const { { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      setAuthUserId(user.id);
    };
    checkAuth();
  }, [router]);

  // Fetch trainer + session data
  const { isLoading, error, data } = useQuery({
    queryKey: ["trainer-dashboard", authUserId],
    queryFn: async () => {
      if (!authUserId) throw new Error("Not authenticated");

      const { trainer, error: trainerError } = await supabase
        .from("trainers")
        .select("*")
        .eq("id", authUserId)
        .single();
      if (trainerError || !trainer) throw new Error("Trainer profile not found");

      const today = new Date().toISOString().split("T")[0];
      const { todaySessions } = await supabase
        .from("sessions")
        .select("id, user_id, date, time, status, users!inner (name, avatar_url)")
        .eq("trainer_id", authUserId)
        .eq("date", today)
        .eq("status", "booked")
        .order("time", { ascending: true });

      const { count: completedCount } = await supabase
        .from("sessions")
        .select("*", { count: "exact" })
        .eq("trainer_id", authUserId)
        .eq("status", "completed");

      const { mockTrainers } = await supabase
        .from("sessions")
        .select("user_id, users!inner (name, avatar_url)")
        .eq("trainer_id", authUserId)
        .eq("status", "completed")
        .order("date", { ascending: false })
        .limit(3);

      const uniqueClients = Array.from(
        new Map(mockTrainers.map((c: any) => [c.user_id, c.users])).values()
      );

      return {
        trainer: trainer as Trainer,
        sessions: todaySessions as Session[],
        stats: {
          totalClients: trainer.clients?.length || 0,
          completedSessions: completedCount || 0,
          averageRating: trainer.rating || 0,
        },
        mockTrainers: uniqueClients,
      };
    },
    enabled: !!authUserId,
  });
  */

  // -----------------------
  // MOCK DATA
  // -----------------------


  const trainer: Trainer = {
    id: "t123",
    name: "Itercio Oscar",
    avatar_url: "",
    role: "Personal Trainer",
    rating: 4.9,
    experience_years: 5,
    bio: "Passionate about strength and functional training.",
    specialties: ["Strength", "Cardio", "Flexibility"],
    certifications: ["ACE", "NASM"],
    available_hours: ["08:00-12:00", "14:00-18:00"],
    clients: ["c1", "c2", "c3", "c4"],
  };

  const stats = {
    totalClients: trainer.clients.length,
    completedSessions: 12,
    averageRating: trainer.rating || 0,
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const statusColors: Record<string, string> = {
    booked: "bg-(--color-primary) text-(--color-neutral)",
    completed: "bg-(--color-success) text-(--color-neutral)",
    canceled: "bg-(--color-error) text-(--color-neutral)",
  };

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
          <h1 className="text-2xl font-bold text-(--color-secondary)">{trainer.name}</h1>
          <div className="flex items-center gap-3 mt-1">
            {trainer.rating != null && (
              <span className="text-(--color-primary) font-medium">★ {trainer.rating}</span>
            )}
            {trainer.specialties && trainer.specialties.length > 0 && (
              <span className="text-(--color-contrast) text-sm">
                • {trainer.specialties.slice(0, 2).join(", ")}
                {trainer.specialties.length > 2 && <span> +{trainer.specialties.length - 2}</span>}
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
        {mockSessions.length > 0 ? (
          <div className="space-y-3">
            {mockSessions.map((session, i) => (
              <div
                key={session.id}
                className="bg-(--color-accent) border border-[#333333] rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#252525] shrink-0 overflow-hidden">
                    {mockTrainers[i].avatar_url ? (
                      <Image
                        src={mockTrainers[i].avatar_url}
                        alt={mockTrainers[i].name}
                        width={40}
                        height={40}
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-(--color-primary) font-bold">
                        {mockTrainers[i].name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-(--color-secondary)">{mockTrainers[i].name}</p>
                    <p className="text-(--color-contrast) text-sm">{session.time}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-full">
                  Booked
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-(--color-contrast) italic">No sessions scheduled for today.</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: "Total Clients", value: stats.totalClients, icon: "👥" },
          { title: "Completed Sessions", value: stats.completedSessions, icon: "✅" },
          { title: "Avg. Rating", value: stats.averageRating ? `★ ${stats.averageRating}` : "—", icon: "⭐" },
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
              <p className="text-(--color-secondary) text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {mockTrainers.length > 0 && (
        <div className="bg-(--color-accent) border border-[#333333] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#333333]">
            <h2 className="text-lg font-semibold text-(--color-secondary)">Recent Clients</h2>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {mockTrainers.map((client: any, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#252525] shrink-0 overflow-hidden">
                    {client.avatar_url ? (
                      <Image
                        src={client.avatar_url}
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
                  <span className="text-(--color-secondary)">{client.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}