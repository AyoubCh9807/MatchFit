"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Client = {
  id: string;
  name: string;
  avatar_url: string | null;
  fitness_level: "Beginner" | "Intermediate" | "Advanced" | null;
  goals: string;
  email: string;
};

export default function ClientsPage() {
  const router = useRouter();
  const [authUserId, setAuthUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Authenticate
  useEffect(() => {
    const checkAuth = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        router.push("/");
        return;
      }
      setAuthUserId(data.user.id);
    };
    checkAuth();
  }, [router]);

  // Fetch trainer's clients
  const { data, isLoading, error } = useQuery({
    queryKey: ["trainer-clients", authUserId],
    enabled: !!authUserId,
    queryFn: async () => {
      if (!authUserId) throw new Error("Not authenticated");

      // Get trainer client IDs
      const { data: trainerData, error: trainerError } = await supabase
        .from("trainers")
        .select("clients")
        .eq("id", authUserId)
        .single();

      if (trainerError) throw trainerError;
      if (!trainerData?.clients || trainerData.clients.length === 0) {
        return [];
      }

      // Fetch client details
      const { data: clientsData, error: clientsError } = await supabase
        .from("users")
        .select("id, name, avatar_url, fitness_level, goals, email")
        .in("id", trainerData.clients);

      if (clientsError) throw clientsError;
      return clientsData as Client[];
    },
  });

  // Filter clients by search
  const filteredClients = data
    ? data.filter((client) =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // --------------------------
  // UI
  // --------------------------
  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="h-8 bg-[#2d2d2d] rounded w-1/3 mb-4 animate-pulse"></div>
          <div className="w-96 h-10 bg-[#252525] rounded-lg animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-(--color-accent) border border-[#333333] rounded-xl p-5 animate-pulse"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#252525]"></div>
                <div>
                  <div className="h-5 bg-[#2d2d2d] rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-[#2d2d2d] rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-[#252525] rounded"></div>
                <div className="h-3 bg-[#252525] rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="bg-red-900/20 border border-red-900/50 text-red-300 p-4 rounded-lg">
          ❌ {error?.message || "Failed to load clients."}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-(--color-secondary)">
          My Clients
        </h1>
        <p className="text-(--color-contrast) mt-1">
          Manage and view details of all your clients.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <label
          htmlFor="client-search"
          className="block text-(--color-contrast) text-sm font-medium mb-2"
        >
          Search Clients
        </label>
        <input
          id="client-search"
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 bg-[#1e1e1e] border border-[#333333] rounded-lg text-(--foreground)] ocus:outline-none focus:ring-2 focus:ring-[#e6c200] transition"
        />
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#252525] mb-4">
            <span className="text-(--color-primary) text-2xl">👥</span>
          </div>
          <h3 className="text-(--color-secondary) font-semibold text-lg mb-1">
            {searchTerm ? "No clients match your search" : "No clients yet"}
          </h3>
          <p className="text-(--color-contrast)">
            {searchTerm
              ? "Try a different name."
              : "Clients will appear here once they book sessions with you."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-(--color-accent) border border-[#333333] rounded-xl p-5 hover:border-(--color-primary) transition"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#252525] shrink-0 overflow-hidden">
                  {client.avatar_url ? (
                    <Image
                      src={client.avatar_url}
                      alt={client.name}
                      width={48}
                      height={48}
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-(--color-primary) font-bold">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-(--color-secondary) truncate">
                    {client.name}
                  </h3>
                  <p className="text-(--color-contrast) text-sm">
                    {client.email}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {client.fitness_level && (
                  <div>
                    <span className="text-(--color-contrast) text-sm">
                      Fitness Level
                    </span>
                    <p className="text-(--color-secondary) font-medium">
                      {client.fitness_level}
                    </p>
                  </div>
                )}

                {client.goals && client.goals.trim() !== "" && (
                  <div>
                    <span className="text-(--color-contrast) text-sm">
                      Goals
                    </span>
                    <p className="text-(--color-secondary) mt-1 whitespace-pre-line">
                      {client.goals}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
