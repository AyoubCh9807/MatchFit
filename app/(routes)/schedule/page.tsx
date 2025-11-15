"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
// import { supabase } from "@/lib/supabase/supabaseClient";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_OPTIONS = Array.from({ length: 24 }, (_, i) =>
  `${i.toString().padStart(2, "0")}:00`
);

type SlotForm = {
  startDay: string;
  endDay: string;
  startTime: string;
  endTime: string;
};

// MOCK TRAINER DATA
const mockTrainer = {
  id: "a7f8c2b1-1234-4cde-9a87-1a2b3c4d5e6f",
  name: "Lina Moretti",
  available_hours: ["Mon-Fri 07:00–15:00"],
};

export default function SchedulePage() {
  const router = useRouter();
  // const queryClient = useQueryClient();

  // AUTH (mocked)
  const [authUserId, setAuthUserId] = useState<string | null>(mockTrainer.id);

  // MOCK FETCH TRAINER
  const [trainerData, setTrainerData] = useState(mockTrainer);

  // FORM
  const form = useForm<SlotForm>({
    defaultValues: {
      startDay: "Mon",
      endDay: "Fri",
      startTime: "07:00",
      endTime: "15:00",
    },
  });

  // ADD SLOT (mocked)
  const addSlot = async (values: SlotForm) => {
    const formatted = `${values.startDay}-${values.endDay} ${values.startTime}–${values.endTime}`;
    setTrainerData((prev) => ({
      ...prev,
      available_hours: [...(prev.available_hours || []), formatted],
    }));

    alert("Slot added (mock)!");
    // -------------------------
    // Real Supabase call commented
    // -------------------------
    /*
    if (!trainerData) return;

    const updated = [...(trainerData.available_hours || []), formatted];

    const { error } = await supabase
      .from("trainers")
      .update({ available_hours: updated })
      .eq("id", authUserId!);

    if (error) {
      alert("Failed to add availability");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["trainer-schedule", authUserId] });
    */
  };

  // REMOVE SLOT (mocked)
  const removeSlot = (slot: string) => {
    setTrainerData((prev) => ({
      ...prev,
      available_hours: prev.available_hours.filter((x) => x !== slot),
    }));

    alert("Slot removed (mock)!");
    // -------------------------
    // Real Supabase call commented
    // -------------------------
    /*
    const updated = trainerData?.available_hours.filter((x: string) => x !== slot);

    const { error } = await supabase
      .from("trainers")
      .update({ available_hours: updated })
      .eq("id", authUserId!);

    if (error) {
      alert("Failed to remove");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["trainer-schedule", authUserId] });
    */
  };

  const currentHours = trainerData.available_hours || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Availability (Mock)</h1>
        <p className="text-gray-400 mt-1">
          Manage your available time slots that clients can book.
        </p>
      </div>

      {/* Add Slot */}
      <section className="bg-[#222222] border border-[#333333] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Add Time Slot</h2>

        <form onSubmit={form.handleSubmit(addSlot)} className="space-y-4">
          {/* Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Start Day
              </label>
              <select
                {...form.register("startDay")}
                className="w-full px-4 py-2.5 bg-[#1e1e1e] border border-[#333333] rounded-lg"
              >
                {DAYS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                End Day
              </label>
              <select
                {...form.register("endDay")}
                className="w-full px-4 py-2.5 bg-[#1e1e1e] border border-[#333333] rounded-lg"
              >
                {DAYS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Start Time
              </label>
              <select
                {...form.register("startTime")}
                className="w-full px-4 py-2.5 bg-[#1e1e1e] border border-[#333333] rounded-lg"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                End Time
              </label>
              <select
                {...form.register("endTime")}
                className="w-full px-4 py-2.5 bg-[#1e1e1e] border border-[#333333] rounded-lg"
              >
                {TIME_OPTIONS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-[#FFD700] text-black font-medium rounded-lg hover:bg-[#e6c200] transition"
          >
            Add Slot
          </button>
        </form>
      </section>

      {/* Existing Slots */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Your Available Hours</h2>

        {currentHours.length === 0 ? (
          <p className="text-gray-400 italic">No availability added yet.</p>
        ) : (
          <div className="space-y-2">
            {currentHours.sort().map((slot: string, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between bg-[#222222] border border-[#333333] rounded-lg p-3"
              >
                <span className="text-white font-medium">{slot}</span>

                <button
                  onClick={() => removeSlot(slot)}
                  className="text-red-400 hover:text-red-500 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
