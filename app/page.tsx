"use client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-(--background)] ext-(--foreground)] ont-sans overflow-x-hidden">
      <div className="relative py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-(--color-primary)">
            MATCHFIT
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-(--color-contrast) max-w-3xl mx-auto leading-relaxed">
            AI-Powered Fitness Matching for Elite Trainers & Driven Clients
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/get_matched"
              className="px-8 py-4 bg-(--color-primary) text-(--color-secondary) font-bold rounded-lg shadow-lg hover:bg-[#e6c200] transition"
            >
              Get Matched
            </Link>
            <Link
              href="/sessions"
              className="px-8 py-4 bg-transparent border-2 border-(--color-primary) text-(--color-primary) font-bold rounded-lg hover:bg-(--color-primary) hover:text-(--color-secondary) transition"
            >
              View Sessions
            </Link>
          </div>
        </div>
      </div>

      <div className="py-16 px-4 bg-(--color-neutral)">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-(--color-secondary) mb-12">
            How MatchFit Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "AI-Powered Matching",
                desc: "Our intelligent system analyzes your goals, injuries, and preferences to find your perfect match.",
              },
              {
                icon: "✅",
                title: "Verified Experts",
                desc: "All trainers are certified, vetted, and rated by real clients — no guesswork.",
              },
              {
                icon: "❤️",
                title: "Holistic Support",
                desc: "Coordinated training, nutrition, and recovery guidance in one place.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-16 h-16 rounded-full bg-(--color-primary) mx-auto flex items-center justify-center text-(--color-secondary) font-bold text-2xl mb-4">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-(--color-secondary) mb-3">
                  {item.title}
                </h3>
                <p className="text-(--color-contrast)">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-(--color-secondary) mb-12">
            For Everyone Who's Serious About Fitness
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-(--color-accent) border border-[#333333] rounded-2xl p-8">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg mb-4">
                👤
              </div>
              <h3 className="text-2xl font-bold text-(--color-secondary) mb-4">
                For Clients
              </h3>
              <ul className="space-y-3 text-(--color-contrast)">
                <li className="flex items-start gap-2">
                  <span className="text-(--color-primary) mt-0.5">✓</span>
                  <span>Find your perfect trainer in minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-(--color-primary) mt-0.5">✓</span>
                  <span>Track progress and sessions in one dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-(--color-primary) mt-0.5">✓</span>
                  <span>Book, reschedule, or cancel with ease</span>
                </li>
              </ul>
            </div>

            <div className="bg-(--color-accent) border border-[#333333] rounded-2xl p-8">
              <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-lg mb-4">
                🏋️
              </div>
              <h3 className="text-2xl font-bold text-(--color-secondary) mb-4">
                For Trainers
              </h3>
              <ul className="space-y-3 text-(--color-contrast)">
                <li className="flex items-start gap-2">
                  <span className="text-(--color-primary) mt-0.5">✓</span>
                  <span>Get matched with ideal clients automatically</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-(--color-primary) mt-0.5">✓</span>
                  <span>Manage schedule, clients, and sessions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-(--color-primary) mt-0.5">✓</span>
                  <span>Showcase certifications and specialties</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 px-4 bg-(--color-neutral)">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-(--color-secondary) mb-4">
            Already a member?
          </h2>
          <p className="text-(--color-contrast) mb-6">
            Sign in to access your dashboard, sessions, and progress.
          </p>
          <button
            onClick={() => router.push("/auth")}
            className="px-6 py-3 bg-(--color-primary) text-(--color-secondary) font-bold rounded-lg shadow hover:bg-[#e6c200] active:bg-[#ccac00] transition"
          >
            Log In
          </button>
        </div>
      </div>

      <footer className="py-8 px-4 border-t border-[#333333] text-center text-(--color-contrast) text-sm">
        <p>© {new Date().getFullYear()} MatchFit. All rights reserved.</p>
      </footer>
    </div>
  );
}
