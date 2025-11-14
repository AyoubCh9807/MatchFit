"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Session = {
  id: string;
  trainer_id: string;
  user_id: string;
  date: string;
  time: string;
  session_type: string | null;
  notes: string | null;
  status: "booked" | "completed" | "canceled";
  trainer_name: string | null;
  trainer_avatar_url: string | null;
};

export default function MySessionsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }
      setUser(user);
    };
    fetchUser();
  }, [router]);

  const { data: sessions = [], isLoading, error } = useQuery({
    queryKey: ["sessions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("sessions")
        .select(`
          *,
          trainers (name, avatar_url)
        `)
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (error) throw error;

      return data.map((s) => ({
        ...s,
        trainer_name: s.trainers?.name || "Unknown Trainer",
        trainer_avatar_url: s.trainers?.avatar_url || null,
      })) as Session[];
    },
    enabled: !!user,
  });

  const handleCancel = async (sessionId: string) => {
    if (!confirm("Are you sure you want to cancel this session?")) return;

    try {
      const { error } = await supabase
        .from("sessions")
        .update({ status: "canceled" })
        .eq("id", sessionId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["sessions", user?.id] });
    } catch (err) {
      alert("Failed to cancel session. Please try again.");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-(--color-accent) border border-[#333333] rounded-xl p-5 animate-pulse">
              <div className="h-5 bg-[#2d2d2d] rounded w-1/4 mb-3"></div>
              <div className="h-4 bg-[#2d2d2d] rounded w-full mb-2"></div>
              <div className="h-4 bg-[#2d2d2d] rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-900/20 border border-red-900/50 text-red-300 p-4 rounded-lg">
          ❌ Failed to load sessions. Please refresh.
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: Session["status"]) => {
    const base = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case "booked":
        return `${base} bg-blue-900/30 text-blue-300`;
      case "completed":
        return `${base} bg-green-900/30 text-green-300`;
      case "canceled":
        return `${base} bg-red-900/30 text-red-300`;
      default:
        return `${base} bg-[#252525] text-(--color-contrast)`;
    }
  };

  const isUpcoming = (date: string, time: string) => {
    const sessionDateTime = new Date(`${date}T${time}`);
    return sessionDateTime > new Date();
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-(--color-secondary)">My Sessions</h1>
        <p className="text-(--color-contrast)">Manage your upcoming and past training sessions.</p>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center max-w-lg mx-auto">
          {/* Decorative Icon */}
          <div 
            className="w-24 h-24 rounded-full mb-6 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0.05) 100%)',
              border: '1px solid var(--color-primary)',
            }}
          >
            <span className="text-(--color-primary) text-4xl">🏋️‍♂️</span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl font-bold text-(--color-secondary) mb-3">
            No Sessions Yet
          </h2>

          {/* Subtext */}
          <p className="text-(--color-contrast) mb-6">
            Your fitness journey starts here. Book a session with a verified trainer and take the first step toward your goals.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => router.push("/get_matched")}
            className="px-6 py-3 bg-(--color-primary) text-(--color-secondary) font-semibold rounded-lg shadow hover:bg-[#e6c200] active:bg-[#ccac00] transition duration-200"
          >
            Find Your Trainer
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
            onClick={() => router.push("/get_matched/" + session.id)}
              key={session.id}
              className="bg-(--color-accent) border border-[#333333] rounded-xl p-5 hover:border-(--color-primary) transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#252525] shrink-0 flex items-center justify-center overflow-hidden">
                    {session.trainer_avatar_url ? (
                      <img
                        src={session.trainer_avatar_url}
                        alt={session.trainer_name!}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-(--color-primary) font-bold">
                        {session.trainer_name?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-(--color-secondary)">{session.trainer_name}</h3>
                    <p className="text-(--color-contrast) text-sm">
                      {session.date} • {session.time}
                    </p>
                    {session.session_type && (
                      <p className="text-(--color-contrast) text-sm mt-1">
                        Focus: {session.session_type}
                      </p>
                    )}
                  </div>
                </div>
                <span className={getStatusBadge(session.status)}>
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </span>
              </div>

              {session.notes && (
                <div className="mt-3 p-3 bg-[#1e1e1e] rounded-lg">
                  <p className="text-(--color-contrast) text-sm">
                    <span className="font-medium">Notes:</span> {session.notes}
                  </p>
                </div>
              )}

              {session.status === "booked" && isUpcoming(session.date, session.time) && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleCancel(session.id)}
                    className="px-4 py-2 text-sm bg-red-900/30 text-red-300 rounded-lg hover:bg-red-900/50 transition"
                  >
                    Cancel Session
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}