"use client";
import { Trainer } from "@/types/Trainer";
import { Session } from "@/types/Session";
import Image from "next/image";

// -----------------------
// MOCK DATA
// -----------------------
const trainer: Trainer = {
  id: "t123",
  name: "Alex Morgan",
  avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
  experience_years: 5,
  rating: 4.8,
  clients: ["u1", "u2", "u3", "u4"],
};

const sessions: Session[] = [
  {
    id: "s1",
    trainer_id: "t123",
    user_id: "u1",
    date: "2025-11-14",
    time: "10:00",
    session_type: "Strength",
    notes: null,
    status: "completed",
    trainer_name: trainer.name,
    trainer_avatar_url: trainer.avatar_url,
  },
  {
    id: "s2",
    trainer_id: "t123",
    user_id: "u2",
    date: "2025-11-13",
    time: "12:00",
    session_type: "HIIT",
    notes: null,
    status: "completed",
    trainer_name: trainer.name,
    trainer_avatar_url: trainer.avatar_url,
  },
  {
    id: "s3",
    trainer_id: "t123",
    user_id: "u1",
    date: "2025-11-12",
    time: "09:00",
    session_type: "Nutrition",
    notes: null,
    status: "completed",
    trainer_name: trainer.name,
    trainer_avatar_url: trainer.avatar_url,
  },
  {
    id: "s4",
    trainer_id: "t123",
    user_id: "u3",
    date: "2025-11-10",
    time: "14:00",
    session_type: "Strength",
    notes: null,
    status: "completed",
    trainer_name: trainer.name,
    trainer_avatar_url: trainer.avatar_url,
  },
];

// -----------------------
// COMPUTED STATS
// -----------------------
const completedSessions = sessions.length;
const totalClients = trainer.clients.length;
const lastSession = sessions[0] || null;

// Compute most frequent client
const clientFrequency: Record<string, { count: number; userId: string }> = {};
sessions.forEach((s) => {
  if (!clientFrequency[s.user_id]) clientFrequency[s.user_id] = { count: 0, userId: s.user_id };
  clientFrequency[s.user_id].count++;
});
const mostFrequentClient = Object.values(clientFrequency).sort((a, b) => b.count - a.count)[0] || null;

// -----------------------
// COMPONENT
// -----------------------
export default function ExpertProgressMock() {
  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-(--color-secondary)">
          Your Progress
        </h1>
        <p className="text-(--color-contrast) mt-1">
          Track your training impact, client sessions, and milestones.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Completed Sessions", value: completedSessions, icon: "✅" },
          { title: "Total Clients", value: totalClients, icon: "👥" },
          {
            title: "Experience",
            value: trainer.experience_years ? `${trainer.experience_years} yrs` : "—",
            icon: "🏅",
          },
          {
            title: "Avg. Rating",
            value: trainer.rating ? `★ ${trainer.rating}` : "—",
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                  {lastSession.trainer_avatar_url ? (
                    <Image
                      src={lastSession.trainer_avatar_url}
                      alt={lastSession.trainer_name || "Trainer"}
                      width={64}
                      height={64}
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-(--color-primary) font-bold">
                      {lastSession.trainer_name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-(--color-secondary)">
                    {lastSession.trainer_name}
                  </h3>
                  <p className="text-(--color-contrast) text-sm">{lastSession.date} at {lastSession.time}</p>
                </div>
              </div>
            ) : (
              <p className="text-(--color-contrast) italic">No completed sessions yet.</p>
            )}
          </div>
        </div>

        <div className="bg-(--color-accent) border border-[#333333] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-[#333333]">
            <h2 className="text-lg font-semibold text-(--color-secondary)">
              Most Frequent Client
            </h2>
          </div>
          <div className="p-5">
            {mostFrequentClient ? (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#252525] shrink-0 flex items-center justify-center text-(--color-primary) font-bold">
                  D
                </div>
                <div>
                  <h3 className="font-bold text-(--color-secondary)">Dexter</h3>
                  <p className="text-(--color-contrast) text-sm">
                    {mostFrequentClient.count} {mostFrequentClient.count === 1 ? "session" : "sessions"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-(--color-contrast) italic">Not enough data yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
