"use client";

import { useEffect, useState } from "react";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/supabaseClient";
import { Trainer } from "@/types/Trainer";
import { BookingModal } from "@/components/BookingModal";
import { logSentryError, initSentryUser } from "@/lib/sentry/sentry";
import { User } from "@/types/User";
import { useQuery } from "@tanstack/react-query";

export default function TrainerProfilePage() {
  const params = useParams();
  const trainerID = params?.trainerID as string;
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<boolean>(false);

  const { data: currentUser, isLoading: userLoading } = useQuery<User, Error>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      // 1️⃣ Get auth user
      const { data: authData, error: authError } =
        await supabase.auth.getUser();
      if (authError || !authData.user) throw new Error("Not logged in");

      //Get user row from users table
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (error || !data) throw new Error("User not found");

      //Initialize Sentry
      initSentryUser({ id: data.id, email: data.email, role: "client" });

      return data as User;
    },
  });

  useEffect(() => {
    const fetchTrainer = async () => {
      try {
        const { data, error } = await supabase
          .from("trainers")
          .select("*")
          .eq("id", trainerID)
          .single();

        if (error) throw error;
        if (!data) return notFound();

        setTrainer(data as Trainer);
      } catch (err: any) {
        console.error("Failed to load trainer:", err);
        setError("Trainer not found.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrainer();
  }, [trainerID]);

  // Booking function
  const onBook = async (data: {
    date: string;
    time: string;
    sessionType?: string;
    notes?: string;
    user: User;
  }) => {
    if (!trainer || !data.user) return;

    const selectedSlot = data.time;
    const trainerID = trainer.id;
    const userID = data.user.id;

    try {
      // Insert session in database
      const { data: newSession, error: sessionError } = await supabase
        .from("sessions")
        .insert({
          trainer_id: trainerID,
          user_id: userID,
          date: data.date,
          time: data.time,
          session_type: data.sessionType,
          notes: data.notes,
        })
        .select()
        .single();

      if (sessionError) throw sessionError;
      // Update trainer: remove selected slot & add user to clients
      const { data: updatedTrainer, error: trainerError } = await supabase
        .from("trainers")
        .update({
          available_hours: trainer.available_hours?.filter(
            (slot) => slot !== selectedSlot
          ),
          clients: [...(trainer.clients || []), userID],
        })
        .eq("id", trainerID)
        .select()
        .single();

      if (trainerError) throw trainerError;

      // Update user: append trainer to experts
      const { data: updatedUser, error: userError } = await supabase
        .from("users")
        .update({
          experts: [...(data.user.experts || []), trainerID],
        })
        .eq("id", userID)
        .select()
        .single();

      if (userError) throw userError;
    } catch (err) {
      logSentryError(err, {
        page: "TrainerProfilePage",
        context: { trainerID, userID, selectedSlot },
      });
      console.error("Booking failed", err);
      throw err;
    }
  };

  if (isLoading || userLoading) {
    return <div>Loading...</div>;
  }

  if (error || !trainer || !currentUser) {
    return <div>Profile or user not found.</div>;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-(--background)] ext-(--foreground)] -6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-(--color-accent) border border-[#333333] rounded-2xl p-8 animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-32 h-32 rounded-full bg-[#252525]"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-[#2d2d2d] rounded w-1/3"></div>
                <div className="h-4 bg-[#2d2d2d] rounded w-1/4"></div>
                <div className="h-4 bg-[#2d2d2d] rounded w-full"></div>
                <div className="h-4 bg-[#2d2d2d] rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !trainer) {
    return (
      <div className="min-h-screen bg-(--background)] ext-(--foreground)] -6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#252525] mb-4">
            <span className="text-(--color-primary) text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-bold text-(--color-secondary) mb-2">
            Profile Not Found
          </h2>
          <p className="text-(--color-contrast)">
            The trainer you’re looking for doesn’t exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--background)] ext-(--foreground)] -4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 text-(--color-primary) font-medium hover:underline"
        >
          ← Back to Matches
        </button>

        <div className="bg-(--color-accent) border border-[#333333] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-6 md:p-8 border-b border-[#333333]">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="shrink-0">
                <div className="w-32 h-32 rounded-full bg-[#252525] flex items-center justify-center overflow-hidden">
                  {trainer.avatar_url ? (
                    <Image
                      src={trainer.avatar_url}
                      alt={trainer.name}
                      width={128}
                      height={128}
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-(--color-primary) font-bold text-4xl">
                      {trainer.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start gap-4 justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-(--color-secondary) truncate">
                      {trainer.name}
                    </h1>
                    {trainer.experience_years != null && (
                      <p className="text-(--color-contrast) mt-1">
                        {trainer.experience_years}+ years of experience
                      </p>
                    )}
                  </div>
                  {trainer.rating != null && (
                    <div className="bg-(--color-primary) text-(--color-secondary) font-bold px-3 py-1 rounded-full w-12 h-12 flex items-center justify-center text-lg">
                      {trainer.rating >= 10 ? "★" : trainer.rating}
                    </div>
                  )}
                </div>

                {trainer.specialties && trainer.specialties.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm text-(--color-contrast) font-medium mb-2">
                      Specialties
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {trainer.specialties.map((spec, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-[#252525] text-(--color-contrast) text-sm rounded-full"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {trainer.bio && (
            <div className="p-6 md:p-8 border-b border-[#333333]">
              <h2 className="text-lg font-semibold text-(--color-secondary) mb-3">
                About
              </h2>
              <p className="text-(--color-contrast) whitespace-pre-line">
                {trainer.bio}
              </p>
            </div>
          )}

          {trainer.certifications && trainer.certifications.length > 0 && (
            <div className="p-6 md:p-8">
              <h2 className="text-lg font-semibold text-(--color-secondary) mb-3">
                Certifications
              </h2>
              <ul className="space-y-2">
                {trainer.certifications.map((cert, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-(--color-contrast)"
                  >
                    <span className="text-(--color-primary) mt-0.5">✓</span>
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {booking && (
            <BookingModal
              trainer={trainer}
              isOpen={booking}
              onClose={() => {
                setBooking(false);
              }}
              onBook={onBook}
              user={currentUser}
            />
          )}

          <div className="p-6 md:p-8 bg-[#1e1e1e] border-t border-[#333333]">
            <button
              onClick={() => {
                setBooking(true);
              }}
              className="w-full max-w-xs mx-auto py-3 px-6 bg-(--color-primary) text-(--color-secondary) font-bold rounded-lg hover:bg-[#e6c200] active:bg-[#ccac00] transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#e6c200]"
            >
              Book a Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
