"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { supabase } from "@/lib/supabase/supabaseClient";
import { logSentryError, initSentryUser } from "@/lib/sentry/sentry";
import { useRouter } from "next/navigation";

type FormData = {
  name: string;
  email: string;
  password: string;
  role: "trainer" | "client";
};

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async() => {
      const user = await (await supabase.auth.getUser()).data.user;
      if(user?.id) router.push("/dashboard");
    }
    
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: { role: "client" },
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(false);

  const onSubmit = async (data: FormData) => {
    try {
      if (isLoginMode) {
        // LOGIN FLOW
        const { data: loginData, error: loginError } =
          await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });
        if (loginError) throw loginError;
        if (!loginData.user) throw new Error("User not found after login");

        // Determine role
        const { data: trainerData } = await supabase
          .from("trainers")
          .select("id")
          .eq("id", loginData.user.id)
          .maybeSingle()

        const role: "trainer" | "client" = trainerData ? "trainer" : "client";

        // Set Sentry context
        initSentryUser({
          id: loginData.user.id,
          email: loginData.user.email,
          role,
        });

        console.log("✅ Logged in as", role, data.email);
        setSubmitted(true);
        router.push("/dashboard");
      } else {
        // SIGNUP FLOW
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            
            options: { data: { role: data.role, name: data.name },
            },
            
          });
        if (signUpError) throw signUpError;
        if (!signUpData.user) throw new Error("User not created");

        // Insert into table
        const table = data.role === "trainer" ? "trainers" : "users";
        const { error: insertError } = await supabase
          .from(table)
          .insert([
            {
              id: signUpData.user.id,
              name: data.name,
              created_at: new Date().toISOString(),
            },
          ]);
        if (insertError) throw insertError;

        // AUTO LOGIN AFTER SIGNUP
        const { data: loginData, error: loginError } =
          await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
          });
        if (loginError) throw loginError;
        if (!loginData.user)
          throw new Error("User not found after signup login");

        // Set Sentry context
        initSentryUser({
          id: loginData.user.id,
          email: data.email,
          role: data.role,
        });

        console.log(
          "✅ Account created and logged in as",
          data.role,
          data.email
        );
        setSubmitted(true);
        router.push("/dashboard");
      }
    } catch (error: any) {
      logSentryError(error, {
        page: "HomePage",
        context: { email: data.email, role: currentRole },
      });
      console.error("❌ Auth error:", error.message || error);
    }
  };

  const currentRole = watch("role");

  const handleRoleChange = (role: "trainer" | "client") => {
    setValue("role", role, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-(--background)] ext-(--foreground)] verflow-hidden font-sans">
      <div
        className="md:w-1/2 flex flex-col justify-center p-6 md:p-10 lg:p-16"
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)",
        }}
      >
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 text-(--color-primary)">
            MATCHFIT
          </h1>
          <p className="text-lg md:text-xl mb-8 text-(--color-contrast) leading-relaxed">
            AI-Powered Fitness Matching for Elite Trainers & Driven Clients
          </p>

          <div className="space-y-5">
            {[
              {
                icon: "✓",
                title: "Verified Experts",
                desc: "Certified professionals, rigorously vetted for excellence.",
              },
              {
                icon: "🤖",
                title: "Smart Matching",
                desc: "AI aligns you with the perfect trainer for your goals.",
              },
              {
                icon: "❤️",
                title: "Full Support",
                desc: "Training, nutrition, and recovery — all in one place.",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-0.5 w-7 h-7 rounded-full bg-(--color-primary) flex items-center justify-center text-(--color-secondary) font-bold text-sm">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-(--color-secondary)">
                    {item.title}
                  </h3>
                  <p className="text-(--color-contrast) text-sm mt-1">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="md:w-1/2 flex flex-col justify-center items-center p-4 md:p-6 bg-(--background)]">
        <div
          className="w-full max-w-md rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-(--color-secondary)">
              {isLoginMode ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-sm text-(--color-contrast) mt-1">
              {isLoginMode
                ? "Sign in to continue your journey."
                : "Join the future of fitness."}
            </p>
          </div>

          {!isLoginMode && (
            <>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleRoleChange("client")}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition ${
                    currentRole === "client"
                      ? "bg-(--color-primary) text-(--color-secondary) shadow"
                      : "bg-[#252525] text-(--color-contrast) hover:bg-[#2d2d2d]"
                  }`}
                >
                  👤 Client
                </button>
                <button
                  type="button"
                  onClick={() => handleRoleChange("trainer")}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition ${
                    currentRole === "trainer"
                      ? "bg-(--color-primary) text-(--color-secondary) shadow"
                      : "bg-[#252525] text-(--color-contrast) hover:bg-[#2d2d2d]"
                  }`}
                >
                  🏋️ Trainer
                </button>
              </div>

              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#333333]"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-(--color-accent) px-3 text-xs text-(--color-contrast)">
                    or continue with email
                  </span>
                </div>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLoginMode && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-(--color-contrast) text-sm font-medium mb-1"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  {...register("name", { required: "Name is required" })}
                  className={`w-full px-4 py-2.5 bg-[#1e1e1e] border border-[#333333] rounded-lg text-(--foreground)] ocus:outline-none focus:ring-2 focus:ring-[#e6c200] focus:border-(--color-primary) transition`}
                />
                {errors.name && (
                  <p className="text-(--color-error) text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-(--color-contrast) text-sm font-medium mb-1"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                {...register("email", { required: "Email is required" })}
                className={`w-full px-4 py-2.5 bg-[#1e1e1e] border border-[#333333] rounded-lg text-(--foreground)] ocus:outline-none focus:ring-2 focus:ring-[#e6c200] focus:border-(--color-primary) transition`}
              />
              {errors.email && (
                <p className="text-(--color-error) text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-(--color-contrast) text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                })}
                className={`w-full px-4 py-2.5 bg-[#1e1e1e] border border-[#333333] rounded-lg text-(--foreground)] ocus:outline-none focus:ring-2 focus:ring-[#e6c200] focus:border-(--color-primary) transition`}
              />
              {errors.password && (
                <p className="text-(--color-error) text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {!isLoginMode && (
              <div className="text-xs text-center text-(--color-contrast)">
                You’re signing up as:{" "}
                <span className="font-semibold text-(--color-primary)">
                  {currentRole === "trainer" ? "Trainer" : "Client"}
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-(--color-primary) text-(--color-secondary) font-bold rounded-lg shadow-lg hover:bg-[#e6c200] active:bg-[#ccac00] transition duration-200"
            >
              {isLoginMode ? "Sign In" : "Create Account"}
            </button>
          </form>

          {submitted && (
            <div className="mt-3 p-3 bg-[#0f2a1a] border border-[#4ade80] text-[#4ade80] rounded-lg text-center text-sm animate-fade-in">
              ✅{" "}
              {isLoginMode
                ? "Signed in successfully!"
                : "Account created! Check your email for comfirmation."}
            </div>
          )}

          <div className="text-center mt-3">
            <p className="text-sm text-(--color-contrast)">
              {isLoginMode ? "Don’t have an account?" : "Already a member?"}{" "}
              <button
                type="button"
                onClick={() => setIsLoginMode(!isLoginMode)}
                className="text-(--color-primary) font-medium hover:underline"
              >
                {isLoginMode ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
