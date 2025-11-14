"use client";


import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabaseClient";
import { initSentryUser } from "@/lib/sentry/sentry";
import { useRouter } from "next/navigation";
import { GoalsForm } from "@/components/GoalsForm";
import HealthInformationForm from "@/components/HealthForm";
import { HealthData, Step } from "@/types/GetMatchedTypes";
import { GoalsData } from "@/types/GetMatchedTypes";
import PreferencesForm from "@/components/PreferencesForm";
import { MatchGrid } from "@/components/MatchGrid";
import { Trainer } from "@/types/Trainer";

export default function GetMatchedPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ready, setReady] = useState<boolean>(false);
  const [msg, setMsg] = useState<string | null>(null);

  const [matching, setMatching] = useState<Trainer[]>([
  {
    id: "a7f8c2b1-1234-4cde-9a87-1a2b3c4d5e6f",
    name: "Lina Moretti",
    avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
    role: "Strength & Conditioning Coach",
    rating: 4.8,
    experience_years: 6,
    bio: "Certified trainer specialized in building functional strength and sustainable habits for athletes and professionals.",
    specialties: ["Strength Training", "Functional Fitness", "Mobility"],
    certifications: ["NASM CPT", "CrossFit Level 1"],
    available_hours: ["Mon-Fri 8:00-16:00", "Sat 9:00-13:00"],
    clients: [],
  },
  {
    id: "b4c9d7e2-5678-4f3a-8c9b-2e3f4a5b6c7d",
    name: "Marcus Tan",
    avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
    role: "HIIT & Cardio Expert",
    rating: 4.9,
    experience_years: 8,
    bio: "Former professional sprinter helping clients improve endurance, explosiveness, and overall athleticism.",
    specialties: ["HIIT", "Cardio", "Explosive Training"],
    certifications: ["ACE Personal Trainer", "Precision Nutrition Level 1"],
    available_hours: ["Tue-Sun 10:00-18:00"],
    clients: [],
  },
  {
    id: "c2f7a6b8-9101-4e3f-9b7c-3d2e1f4a5b6c",
    name: "Sofia Delgado",
    avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
    role: "Yoga & Mindfulness Instructor",
    rating: 4.7,
    experience_years: 5,
    bio: "Yoga teacher blending physical practice with mindful meditation to improve balance, strength, and mental clarity.",
    specialties: ["Vinyasa Yoga", "Breathwork", "Mindfulness"],
    certifications: ["RYT 500", "Meditation Coach Certification"],
    available_hours: ["Mon-Fri 7:00-15:00"],
    clients: [],
  },
])

  const [goalsData, setGoalsData] = useState<GoalsData>({
    goals: "",
    fitnessLevel: "beginner",
  });

  const [healthData, setHealthData] = useState<HealthData>({
    injuries: "",
    healthConditions: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return router.push("/");
      setUser(user);
      initSentryUser({ id: user.id, email: user.email, role: "client" });
    };
    fetchUser();
  }, [router]);

  const nextStep = () => setStep((s) => (s < 3 ? ((s + 1) as Step) : s));
  const prevStep = () => setStep((s) => (s > 1 ? ((s - 1) as Step) : s));

  const handleMatching = () => {
    setIsSubmitting(true);
    try {
      setReady(true);
    } catch(error) {
      setMsg(error instanceof Error ? error.message : "error: Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  

  if (!user) return <div>Loading...</div>;

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
            <h1 className="text-2xl font-bold text-(--color-secondary)">
              Let's Find Your Perfect Match
            </h1>
            <p className="text-(--color-contrast) mt-1">
              Tell us about your fitness goals and needs so we can match you
              with the right experts.
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 flex items-center gap-2">
            <div
              className={`w-1/3 h-2 rounded-full ${
                step >= 1 ? "bg-(--color-primary)" : "bg-[#333333]"
              }`}
            ></div>
            <div
              className={`w-1/3 h-2 rounded-full ${
                step >= 2 ? "bg-(--color-primary)" : "bg-[#333333]"
              }`}
            ></div>
            <div
              className={`w-1/3 h-2 rounded-full ${
                step >= 3 ? "bg-(--color-primary)" : "bg-[#333333]"
              }`}
            ></div>
          </div>
          {!ready && step === 1 && (
            <GoalsForm
              data={goalsData as GoalsData}
              onChange={setGoalsData}
              onNext={nextStep}
            />
          )}
          {!ready && step === 2 && (
            <HealthInformationForm
              data={healthData}
              onChange={setHealthData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {!ready && step === 3 && (
            <PreferencesForm onBack={() => {setStep(2)}} onComplete={() => {
              handleMatching();
            }} />
          )}
          {ready && <MatchGrid matches={matching} />}

          {/*
          THE PLAN:
          push the user into a /get_matched/results route that will have the matches mapped in an array
          and there would be a filter for filtering the matches based on the user's preferences
          */} 

        </main>
      </div>
    </div>
  );
}
