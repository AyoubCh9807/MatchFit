"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { User } from "@/types/User";

type ProfileForm = {
  name: string;
  email: string;
};

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

// -------------------------
// MOCK USER DATA
// -------------------------
const mockUser: User = {
  id: "u1234567-89ab-cdef-0123-456789abcdef",
  name: "Itercio",
  avatar_url: "https://randomuser.me/api/portraits/men/75.jpg",
  email: "oscar.itercio@example.com",
  age: 25,
  gender: "male",
  location: "Korea, Seoul",
  fitness_level: "Intermediate",
  goals: "I want to build muscle, improve endurance, and run a half marathon by next summer.",
  created_at: "2025-11-15T17:00:00.000Z",
  experts: [
    "a7f8c2b1-1234-4cde-9a87-1a2b3c4d5e6f",
    "b4c9d7e2-5678-4f3a-8c9b-2e3f4a5b6c7d",
  ],
};

export default function SettingsPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<User>(mockUser); // Mocked user
  const [profile, setProfile] = useState<User>(mockUser); // Mocked profile
  const [isUpdating, setIsUpdating] = useState(false);

  // -------------------------
  // FORMS
  // -------------------------
  const profileForm = useForm<ProfileForm>({
    defaultValues: { name: mockUser.name, email: mockUser.email },
  });

  const passwordForm = useForm<PasswordForm>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Populate profile form on mount
  useEffect(() => {
    profileForm.reset({
      name: profile.name || "",
      email: profile.email || "",
    });
  }, [profile, profileForm]);

  // -------------------------
  // MOCK FUNCTIONS
  // -------------------------
  const updateProfile = async (data: ProfileForm) => {
    setIsUpdating(true);
    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Mock update
    setProfile((prev) => ({ ...prev, name: data.name, email: data.email }));
    setAuthUser((prev) => ({ ...prev, name: data.name, email: data.email }));

    alert("Profile updated successfully!");

    setIsUpdating(false);

    // Real backend code commented
    /*
    if (!authUser) return;
    setIsUpdating(true);
    try { ... } catch(err) {...} finally { setIsUpdating(false); }
    */
  };

  const updatePassword = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      passwordForm.setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }

    setIsUpdating(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    alert("Password updated successfully!");
    passwordForm.reset();
    setIsUpdating(false);

    // Real backend code commented
    /*
    try { ... } catch(err) {...} finally { setIsUpdating(false); }
    */
  };

  const handleSignOut = () => {
    alert("Mock sign out");
    router.replace("/");

    // Real backend code commented
    /*
    try { await supabase.auth.signOut(); router.replace("/"); } catch(err) {...}
    */
  };

  const handleDeleteAccount = () => {
    if (!confirm("This will delete your account permanently. Continue?")) return;
    alert("Mock delete account - disabled in demo mode");

    // Real backend code commented
    /*
    try { throw new Error("Account deletion is disabled in demo mode"); } catch(err) {...}
    */
  };

  // -------------------------
  // JSX
  // -------------------------
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-white">Account Settings (Mock)</h1>
      <p className="text-gray-400">Manage your personal info, security, and preferences.</p>

      {/* PERSONAL INFO */}
      <section className="bg-[#222222] border border-[#333333] rounded-xl">
        <div className="px-6 py-4 border-b border-[#333333]">
          <h2 className="text-lg font-semibold text-white">Personal Information</h2>
        </div>
        <div className="p-6">
          <form onSubmit={profileForm.handleSubmit(updateProfile)} className="space-y-5">
            <div>
              <label className="block text-sm mb-2 text-gray-300">Full Name</label>
              <input
                {...profileForm.register("name", { required: "Name is required" })}
                className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-300">Email</label>
              <input
                type="email"
                {...profileForm.register("email", { required: "Email is required" })}
                className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg text-gray-200"
              />
            </div>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2 bg-[#FFD700] text-black rounded-lg font-medium"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </section>

      {/* SECURITY */}
      <section className="bg-[#222222] border border-[#333333] rounded-xl">
        <div className="px-6 py-4 border-b border-[#333333]">
          <h2 className="text-lg font-semibold text-white">Security</h2>
        </div>
        <div className="p-6">
          <form onSubmit={passwordForm.handleSubmit(updatePassword)} className="space-y-5">
            <div>
              <label className="block text-sm mb-2 text-gray-300">Current Password</label>
              <input
                type="password"
                {...passwordForm.register("currentPassword", { required: true })}
                className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-300">New Password</label>
              <input
                type="password"
                {...passwordForm.register("newPassword", { required: true })}
                className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg text-gray-200"
              />
            </div>
            <div>
              <label className="block text-sm mb-2 text-gray-300">Confirm New Password</label>
              <input
                type="password"
                {...passwordForm.register("confirmPassword", { required: true })}
                className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg text-gray-200"
              />
            </div>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2 bg-[#FFD700] text-black rounded-lg font-medium"
            >
              {isUpdating ? "Updating..." : "Update Password"}
            </button>
          </form>

          <hr className="my-6 border-[#333]" />

          <button
            onClick={handleSignOut}
            className="px-5 py-2 bg-[#252525] hover:bg-[#2a2a2a] rounded-lg text-gray-300 font-medium"
          >
            Sign Out
          </button>
        </div>
      </section>

      {/* DELETE ACCOUNT */}
      <section className="bg-[#222222] border border-red-500/40 rounded-xl">
        <div className="px-6 py-4 border-b border-red-500/40">
          <h2 className="text-lg font-semibold text-red-400">Delete Account</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-400 mb-4">
            This action cannot be undone. All your data will be permanently removed.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="px-5 py-2 bg-red-500/30 hover:bg-red-500/40 text-red-300 rounded-lg font-medium"
          >
            Delete My Account
          </button>
        </div>
      </section>
    </div>
  );
}
