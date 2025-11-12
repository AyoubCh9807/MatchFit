"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { initSentryUser } from "@/lib/sentry/sentry";
import { useRouter } from "next/navigation";

export default function GetMatchedPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState(1); // Step 1: Goals → Step 2: Fitness Level → Step 3: Preferences (future)
  const [formData, setFormData] = useState({
    goals: "",
    fitnessLevel: "beginner",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/");
        return;
      }

      setUser(user);
      initSentryUser({
        id: user.id,
        email: user.email,
        role: "client",
      });
    };

    fetchUser();
  }, [router]);

  const handleGoalChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, goals: e.target.value });
  };

  const handleFitnessLevelChange = (level: string) => {
    setFormData({ ...formData, fitnessLevel: level });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Update user profile in Supabase
      const { error } = await supabase
        .from("users")
        .update({
          fitness_goals: formData.goals,
          fitness_level: formData.fitnessLevel,
          matched_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      // Redirect to next step or matching results
      setTimeout(() => {
        router.push("/match-results");
      }, 800);
    } catch (err) {
      console.error("Failed to save match preferences:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-(--background)] ext-(--foreground)] -6 flex items-center justify-center">
        <div className="animate-spin w-10 h-10 border-4 border-(--color-primary) rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--background)] text-foreground tont-sans overflow-x-hidden">


      <div className="flex">


        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-(--color-secondary)">Let's Find Your Perfect Match</h1>
            <p className="text-(--color-contrast) mt-1">
              Tell us about your fitness goals and needs so we can match you with the right experts.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 flex items-center gap-2">
            <div className={`w-1/3 h-2 rounded-full ${step >= 1 ? 'bg-(--color-primary)' : 'bg-[#333333]'}`}></div>
            <div className={`w-1/3 h-2 rounded-full ${step >= 2 ? 'bg-(--color-primary)' : 'bg-[#333333]'}`}></div>
            <div className={`w-1/3 h-2 rounded-full ${step >= 3 ? 'bg-(--color-primary)' : 'bg-[#333333]'}`}></div>
          </div>

          {/* Form Card */}
          <div className="bg-(--color-accent) border border-[#333333] rounded-xl p-6 shadow-lg">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-(--color-primary) rounded-full flex items-center justify-center text-(--color-secondary) font-bold text-sm">
                  🎯
                </div>
                <h2 className="text-xl font-bold text-(--color-secondary)">Your Goals</h2>
              </div>
              <p className="text-(--color-contrast) mb-4">
                What are your fitness goals?
              </p>
              <textarea
                value={formData.goals}
                onChange={handleGoalChange}
                placeholder="Tell us what you want to achieve... (e.g., lose weight, build muscle, improve endurance, prepare for a marathon, etc.)"
                className="w-full p-4 bg-[#1e1e1e] border border-[#333333] rounded-lg text-(--foreground)] ocus:outline-none focus:ring-2 focus:ring-[#e6c200] resize-none"
                rows={4}
              />
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-(--color-contrast) mb-3">Fitness Level</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {["beginner", "intermediate", "advanced"].map((level) => (
                  <button
                    key={level}
                    onClick={() => handleFitnessLevelChange(level)}
                    className={`py-3 px-4 rounded-lg text-sm font-medium transition ${
                      formData.fitnessLevel === level
                        ? "bg-(--color-primary) text-(--color-secondary) shadow"
                        : "bg-[#252525] text-(--color-contrast) hover:bg-[#2d2d2d]"
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg font-semibold transition ${
                isSubmitting
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-(--color-primary) text-(--color-secondary) hover:bg-[#e6c200] active:bg-[#ccac00]"
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 animate-spin rounded-full border-2 border-(--color-secondary) mr-2"></div>
                  Saving...
                </span>
              ) : (
                "Continue →"
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}