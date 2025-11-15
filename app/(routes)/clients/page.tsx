"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// MOCK CLIENTS
const mockClients = [
  {
    id: "u1234567-89ab-cdef-0123-456789abcdef",
    name: "Itercio",
    avatar_url: "https://randomuser.me/api/portraits/men/75.jpg",
    fitness_level: "Intermediate",
    goals: "I want to build muscle, improve endurance, and run a half marathon by next summer.",
    email: "oscar.itercio@example.com",
  },
  {
    id: "u2345678-90ab-cdef-1234-567890abcdef",
    name: "Alice Johnson",
    avatar_url: "https://randomuser.me/api/portraits/women/65.jpg",
    fitness_level: "Beginner",
    goals: "Lose 5kg and improve flexibility.",
    email: "alice.johnson@example.com",
  },
  {
    id: "u3456789-01ab-cdef-2345-678901abcdef",
    name: "Marcus Tan",
    avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
    fitness_level: "Advanced",
    goals: "Maintain muscle mass and run a marathon.",
    email: "marcus.tan@example.com",
  },
];

export default function ClientsPage() {
  const router = useRouter();
  const [authUserId, setAuthUserId] = useState<string | null>(mockClients[0].id);
  const [searchTerm, setSearchTerm] = useState("");

  // --------------------------
  // Real auth call commented
  // --------------------------
  /*
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
  */

  // --------------------------
  // Filter clients by search
  // --------------------------
  const filteredClients = mockClients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Clients (Mock)</h1>
        <p className="text-gray-400 mt-1">
          Manage and view details of all your clients.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <label
          htmlFor="client-search"
          className="block text-gray-400 text-sm font-medium mb-2"
        >
          Search Clients
        </label>
        <input
          id="client-search"
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2.5 bg-[#1e1e1e] border border-[#333333] rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e6c200] transition"
        />
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#252525] mb-4">
            <span className="text-yellow-400 text-2xl">👥</span>
          </div>
          <h3 className="text-white font-semibold text-lg mb-1">
            {searchTerm ? "No clients match your search" : "No clients yet"}
          </h3>
          <p className="text-gray-400">
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
              className="bg-[#222222] border border-[#333333] rounded-xl p-5 hover:border-yellow-400 transition"
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
                    <div className="w-full h-full flex items-center justify-center text-yellow-400 font-bold">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-white truncate">{client.name}</h3>
                  <p className="text-gray-400 text-sm">{client.email}</p>
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {client.fitness_level && (
                  <div>
                    <span className="text-gray-400 text-sm">Fitness Level</span>
                    <p className="text-white font-medium">{client.fitness_level}</p>
                  </div>
                )}

                {client.goals && client.goals.trim() !== "" && (
                  <div>
                    <span className="text-gray-400 text-sm">Goals</span>
                    <p className="text-white mt-1 whitespace-pre-line">{client.goals}</p>
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
