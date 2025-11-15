"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TIME_OPTIONS = Array.from(
  { length: 24 },
  (_, i) => `${i.toString().padStart(2, "0")}:00`
);

type SlotForm = {
  startDay: string;
  endDay: string;
  startTime: string;
  endTime: string;
};

export default function SchedulePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [authUserId, setAuthUserId] = useState<string | null>(null);

  // AUTH
  useEffect(() => {
    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      setAuthUserId(user.id);
    };

    check();
  }, [router]);

  // FETCH TRAINER
  const { data, isLoading, error } = useQuery({
    queryKey: ["trainer-schedule", authUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trainers")
        .select("id, available_hours")
        .eq("id", authUserId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!authUserId,
  });

  // FORM
  const form = useForm<SlotForm>({
    defaultValues: {
      startDay: "Mon",
      endDay: "Fri",
      startTime: "07:00",
      endTime: "15:00",
    },
  });

  // ADD SLOT
  const addSlot = async (values: SlotForm) => {
    if (!data) return;

    const formatted = `${values.startDay}-${values.endDay} ${values.startTime}–${values.endTime}`;

    const updated = [...(data.available_hours || []), formatted];

    const { error } = await supabase
      .from("trainers")
      .update({ available_hours: updated })
      .eq("id", authUserId!);

    if (error) {
      alert("Failed to add availability");
      return;
    }

    if (authUserId) {
      queryClient.invalidateQueries({
        queryKey: ["trainer-schedule", authUserId],
      });
    }
  };

  // REMOVE SLOT
  const removeSlot = async (slot: string) => {
    const updated = data?.available_hours.filter((x: string) => x !== slot);

    const { error } = await supabase
      .from("trainers")
      .update({ available_hours: updated })
      .eq("id", authUserId!);

    if (error) {
      alert("Failed to remove");
      return;
    }

    if (authUserId) {
      queryClient.invalidateQueries({
        queryKey: ["trainer-schedule", authUserId],
      });
    }
  };

  if (isLoading) {
    return <div className="p-6 max-w-2xl mx-auto">Loading schedule...</div>;
  }

  if (error || !data) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="bg-red-900/20 border border-red-900/50 text-red-300 p-4 rounded-lg">
          ❌ {error?.message || "Failed to load schedule."}
        </div>
      </div>
    );
  }

  const currentHours = data.available_hours || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-(--color-secondary)">
          Availability
        </h1>
        <p className="text-(--color-contrast) mt-1">
          Manage your available time slots that clients can book.
        </p>
      </div>

      {/* Add Slot */}
      <section className="bg-(--color-accent) border border-[#333333] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-(--color-secondary) mb-4">
          Add Time Slot
        </h2>

        <form onSubmit={form.handleSubmit(addSlot)} className="space-y-4">
          {/* Days */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-(--color-contrast) text-sm font-medium mb-2">
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
              <label className="block text-(--color-contrast) text-sm font-medium mb-2">
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
              <label className="block text-(--color-contrast) text-sm font-medium mb-2">
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
              <label className="block text-(--color-contrast) text-sm font-medium mb-2">
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
            className="px-5 py-2.5 bg-(--color-primary) text-(--color-secondary) font-medium rounded-lg hover:bg-[#e6c200] transition"
          >
            Add Slot
          </button>
        </form>
      </section>

      {/* Existing Slots */}
      <section>
        <h2 className="text-lg font-semibold text-(--color-secondary) mb-3">
          Your Available Hours
        </h2>

        {currentHours.length === 0 ? (
          <p className="text-(--color-contrast) italic">
            No availability added yet.
          </p>
        ) : (
          <div className="space-y-2">
            {currentHours.sort().map((slot: string, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between bg-(--color-accent) border border-[#333333] rounded-lg p-3"
              >
                <span className="text-(--color-secondary) font-medium">
                  {slot}
                </span>

                <button
                  onClick={() => removeSlot(slot)}
                  className="text-(--color-error) hover:text-red-400 text-sm font-medium"
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
