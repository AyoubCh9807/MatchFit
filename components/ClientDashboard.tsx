"use client";

import { useState, useEffect } from "react";
import ExpertDashboardMock from "@/components/ExpertDashboard";

export default function ClientDashboardMock() {
  const [user, setUser] = useState<any | null>(null);
  const [stats, setStats] = useState({
    activeExperts: 2,
    pendingRequests: 1,
    progressLogs: 5,
  });
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [topTrainer, setTopTrainer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fakeUser = {
      id: "u1234567",
      name: "Itercio",
      avatar_url: "https://randomuser.me/api/portraits/men/75.jpg",
      goals: "Build Muscle, Run Half Marathon, Improve Endurance, Become the greatest of em all", 
      role: "client",
    };

    const fakeSessions = [
      {
        id: "s1",
        trainers: {
          name: "Lina Moretti",
          avatar_url: "https://randomuser.me/api/portraits/women/65.jpg",
        },
        date: "2025-11-10",
        time: "10:00",
        status: "completed",
      },
      {
        id: "s2",
        trainers: {
          name: "Tyrone Diaz",
          avatar_url: "https://randomuser.me/api/portraits/men/44.jpg",
        },
        date: "2025-11-12",
        time: "14:00",
        status: "booked",
      },
    ];

    setUser(fakeUser);
    setRecentSessions(fakeSessions);
    setTopTrainer(fakeSessions[0].trainers);
    setIsLoading(false);
  }, []);

  if (!user || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 rounded-full"></div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-(--background)] ext-(--foreground)] ont-sans overflow-x-hidden">
      <main className="flex-1 p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-(--color-primary)">
            Dashboard
          </h1>
          <p className="text-(--color-contrast) mt-1">
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
                <p className="text-(--color-contrast) text-sm font-medium">
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

        <div className="mb-8">
          <h2 className="text-xl font-bold text-(--color-secondary) mb-4">
            Recent Sessions
          </h2>
          {recentSessions.length === 0 ? (
            <p className="text-(--color-contrast) italic">
              No sessions yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {recentSessions.map((s) => (
                <li
                  key={s.id}
                  className="p-4 border border-[#333333] rounded-lg flex justify-between items-center bg-(--color-accent)"
                >
                  <div>
                    <p className="font-semibold text-(--color-secondary)">
                      {s.trainers.name}
                    </p>
                    <p className="text-(--color-contrast) text-sm">
                      {s.date} at {s.time}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      s.status === "completed"
                        ? "bg-green-900/30 text-green-300"
                        : s.status === "booked"
                        ? "bg-blue-900/30 text-blue-300"
                        : "bg-red-900/30 text-red-300"
                    }`}
                  >
                    {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {topTrainer && (
          <div className="mb-8 bg-(--color-accent) border border-[#333333] rounded-xl p-5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#252525] overflow-hidden shrink-0">
              <img
                src={topTrainer.avatar_url}
                alt={topTrainer.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-lg font-bold text-(--color-secondary)">
                Top Trainer
              </h3>
              <p className="text-(--color-contrast)">{topTrainer.name}</p>
            </div>
          </div>
        )}

        {user.goals && (
          <div className="mt-8 bg-(--color-accent) border border-[#333333] rounded-xl p-5">
            <h3 className="text-lg font-bold text-(--color-secondary) mb-3">
              Your Goals
            </h3>
            <p className="text-(--color-contrast)">{user.goals}</p> 
          </div>
        )}
      </main>
    </div>
  );
}
