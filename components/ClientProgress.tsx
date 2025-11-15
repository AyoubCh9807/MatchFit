"use client";

import Image from "next/image";
// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase/supabaseClient";
// import { useQuery } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string;
  email: string;
  age?: number | null;
  gender?: "male" | "female" | "other" | null;
  location?: string | null;
  fitness_level?: "Beginner" | "Intermediate" | "Advanced" | null;
  goals?: string | null; // single text string
  created_at?: string | null;
  experts?: string[];
};

export type EnrichedSession = {
  id: string;
  trainer_id: string;
  user_id: string;
  date: string;
  status: "completed" | "booked" | "canceled";
  trainer: {
    name: string;
    avatar_url: string | null;
  };
};

export default function ClientProgressMock() {
  // -----------------------
  // REAL AUTH & FETCH LOGIC (COMMENTED OUT)
  // -----------------------
  /*
  const router = useRouter();
  const [authUserId, setAuthUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/");
        return;
      }
      setAuthUserId(data.user.id);
    };
    checkAuth();
  }, [router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["progress-data", authUserId],
    queryFn: async () => {
      if (!authUserId) throw new Error("Not authenticated");

      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUserId)
        .single();

      if (profileError || !profile) throw new Error("User profile not found");

      const { data: sessionsData, error: sessionsError } = await supabase
        .from("sessions")
        .select(\`
          id,
          trainer_id,
          user_id,
          date,
          status,
          trainers!inner (
            name,
            avatar_url
          )
        \`)
        .eq("user_id", authUserId)
        .eq("status", "completed")
        .order("date", { ascending: false });

      if (sessionsError) throw sessionsError;

      const sessions: EnrichedSession[] = sessionsData.map((s: any) => ({
        id: s.id,
        trainer_id: s.trainer_id,
        user_id: s.user_id,
        date: s.date,
        status: s.status,
        trainer: {
          name: s.trainers.name,
          avatar_url: s.trainers.avatar_url,
        },
      }));

      return { user: profile as User, sessions };
    },
    enabled: !!authUserId,
  });
  */

  // -----------------------
  // MOCK DATA
  // -----------------------
  const user: User = {
    id: "u123",
    name: "Itercio",
    email: "itercio@example.com",
    fitness_level: "Intermediate",
    goals: "Lose weight, Build muscle",
  };

  const sessions: EnrichedSession[] = [
    {
      id: "s1",
      trainer_id: "t1",
      user_id: "u123",
      date: "2025-11-14",
      status: "completed",
      trainer: { name: "Alice", avatar_url: "" },
    },
    {
      id: "s2",
      trainer_id: "t2",
      user_id: "u123",
      date: "2025-11-13",
      status: "completed",
      trainer: { name: "Bob", avatar_url: "" },
    },
    {
      id: "s3",
      trainer_id: "t1",
      user_id: "u123",
      date: "2025-11-12",
      status: "completed",
      trainer: { name: "Alice", avatar_url: "" },
    },
  ];

  // Stats
  const completedSessions = sessions.length;
  const totalTrainers = new Set(sessions.map((s) => s.trainer_id)).size;
  const lastSession = sessions[0] || null;

  const trainerFrequency: Record<
    string,
    { count: number; trainer: EnrichedSession["trainer"] }
  > = {};
  sessions.forEach((s) => {
    if (!trainerFrequency[s.trainer_id])
      trainerFrequency[s.trainer_id] = { count: 0, trainer: s.trainer };
    trainerFrequency[s.trainer_id].count++;
  });
  const mostBooked =
    Object.values(trainerFrequency).sort((a, b) => b.count - a.count)[0] ||
    null;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-(--color-secondary)">
          Your Progress
        </h1>
        <p className="text-(--color-contrast) mt-1">
          Track your fitness journey, sessions, and milestones.
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Completed Sessions", value: completedSessions, icon: "✅" },
          { title: "Total Trainers", value: totalTrainers, icon: "👥" },
          {
            title: "Fitness Level",
            value: user.fitness_level || "—",
            icon: "📊",
          },
          { title: "Goals Set", value: user.goals ? 1 : 0, icon: "🎯" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-(--color-accent) border border-[#333333] rounded-xl p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-blue-900/20 rounded-lg flex items-center justify-center text-blue-300 text-xl">
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

      {/* Trainer Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Last Session */}
        <div className="bg-(--color-accent) border border-[#333333] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#333333]">
            <h2 className="text-lg font-semibold text-(--color-secondary)">
              Last Session
            </h2>
          </div>
          <div className="p-5">
            {lastSession ? (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#252525] shrink-0 overflow-hidden">
                  {lastSession.trainer.avatar_url ? (
                    <Image
                      src={lastSession.trainer.avatar_url}
                      alt={lastSession.trainer.name}
                      width={64}
                      height={64}
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-(--color-primary) font-bold">
                      {lastSession.trainer.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-(--color-secondary)">
                    {lastSession.trainer.name}
                  </h3>
                  <p className="text-(--color-contrast) text-sm">
                    {lastSession.date}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-(--color-contrast) italic">
                No completed sessions yet.
              </p>
            )}
          </div>
        </div>

        {/* Most Booked Trainer */}
        <div className="bg-(--color-accent) border border-[#333333] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#333333]">
            <h2 className="text-lg font-semibold text-(--color-secondary)">
              Most Booked Trainer
            </h2>
          </div>
          <div className="p-5">
            {mostBooked ? (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#252525] shrink-0 overflow-hidden">
                  {mostBooked.trainer.avatar_url ? (
                    <Image
                      src={mostBooked.trainer.avatar_url}
                      alt={mostBooked.trainer.name}
                      width={64}
                      height={64}
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-(--color-primary) font-bold">
                      {mostBooked.trainer.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-(--color-secondary)">
                    {mostBooked.trainer.name}
                  </h3>
                  <p className="text-(--color-contrast) text-sm">
                    {mostBooked.count}{" "}
                    {mostBooked.count === 1 ? "session" : "sessions"} together
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-(--color-contrast) italic">
                Not enough data yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {user.goals && user.goals.trim() !== "" && (
        <div className="bg-(--color-accent) border border-[#333333] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#333333]">
            <h2 className="text-lg font-semibold text-(--color-secondary)">
              Your Goals
            </h2>
          </div>
          <div className="p-5">
            <p className="text-(--color-contrast)">{user.goals}</p>
          </div>
        </div>
      )}
    </div>
  );
}
