"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { User as SupabaseUser } from "@supabase/supabase-js";
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

export default function SettingsPage() {
  const router = useRouter();
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Define hooks at the top level
  const profileForm = useForm<ProfileForm>({
    defaultValues: { name: "", email: "" },
  });

  const passwordForm = useForm<PasswordForm>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        router.replace("/");
        return;
      }
      setAuthUser(session.user);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!authUser) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err: any) {
        alert(`Error loading profile: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [authUser]);

  // Populate form when profile loads
  useEffect(() => {
    if (authUser && profile) {
      profileForm.reset({
        name: profile.name || "",
        email: authUser.email || "",
      });
    }
  }, [authUser, profile, profileForm]);

  const updateProfile = async (data: ProfileForm) => {
    if (!authUser) return;
    setIsUpdating(true);

    try {
      // Update email if changed
      if (data.email !== authUser.email) {
        const { error } = await supabase.auth.updateUser({ email: data.email });
        if (error) throw error;
      }

      // Update profile name
      const { error: profileError } = await supabase
        .from("users")
        .update({ name: data.name })
        .eq("id", authUser.id);

      if (profileError) throw profileError;

      // Refresh user data
      const { data: updatedUser } = await supabase.auth.getUser();
      setAuthUser(updatedUser.user);

      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(`Update error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePassword = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      passwordForm.setError("confirmPassword", { message: "Passwords do not match" });
      return;
    }

    // Verify current password by attempting to sign in
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: authUser?.email || "",
        password: data.currentPassword,
      });

      if (signInError) {
        passwordForm.setError("currentPassword", { message: "Current password is incorrect" });
        return;
      }

      setIsUpdating(true);
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });
      
      if (error) throw error;

      passwordForm.reset();
      alert("Password updated successfully!");
    } catch (err: any) {
      alert(`Password update error: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace("/");
    } catch (err: any) {
      alert(`Sign out error: ${err.message}`);
    }
  };

  const handleDeleteAccount = async () => {
    if (!authUser) return;
    if (!confirm("This will delete your account permanently. Continue?")) return;

    try {
      // In production, you'd call a server function to delete the account
      // For demo, we'll simulate a failure
      throw new Error("Account deletion is disabled in demo mode");
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Loading skeleton UI
  if (loading || !authUser || !profile) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-[#222222] border border-[#333333] rounded-xl p-6 animate-pulse"
          >
            <div className="h-6 bg-[#2d2d2d] rounded w-1/4 mb-5"></div>
            <div className="space-y-4">
              <div className="h-10 bg-[#252525] rounded"></div>
              <div className="h-10 bg-[#252525] rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-white">Account Settings</h1>
      <p className="text-gray-400">
        Manage your personal info, security, and preferences.
      </p>

      {/* PERSONAL INFO */}
      <section className="bg-[#222222] border border-[#333333] rounded-xl">
        <div className="px-6 py-4 border-b border-[#333333]">
          <h2 className="text-lg font-semibold text-white">Personal Information</h2>
        </div>

        <div className="p-6">
          <form
            onSubmit={profileForm.handleSubmit(updateProfile)}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm mb-2 text-gray-300">Full Name</label>
              <input
                {...profileForm.register("name", { required: "Name is required" })}
                className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg text-gray-200 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition"
                placeholder="Your name"
              />
              {profileForm.formState.errors.name && (
                <p className="text-red-400 text-sm mt-1">{profileForm.formState.errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-300">Email</label>
              <input
                type="email"
                {...profileForm.register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: "Invalid email address"
                  }
                })}
                className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg text-gray-200 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition"
                placeholder="you@example.com"
                disabled={isUpdating}
              />
              {profileForm.formState.errors.email && (
                <p className="text-red-400 text-sm mt-1">{profileForm.formState.errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className={`px-5 py-2 bg-[#FFD700] text-black rounded-lg font-medium transition ${
                isUpdating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#E6C200]'
              }`}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
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
          <form
            onSubmit={passwordForm.handleSubmit(updatePassword)}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm mb-2 text-gray-300">Current Password</label>
              <input
                type="password"
                {...passwordForm.register("currentPassword", { 
                  required: "Current password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg text-gray-200 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition"
                placeholder="Enter current password"
                disabled={isUpdating}
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-red-400 text-sm mt-1">{passwordForm.formState.errors.currentPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-300">New Password</label>
              <input
                type="password"
                {...passwordForm.register("newPassword", { 
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters"
                  }
                })}
                className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg text-gray-200 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition"
                placeholder="Enter new password"
                disabled={isUpdating}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-red-400 text-sm mt-1">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-300">Confirm New Password</label>
              <input
                type="password"
                {...passwordForm.register("confirmPassword", { 
                  required: "Please confirm your password",
                  validate: (value, formValues) => value === formValues.newPassword || "Passwords do not match"
                })}
                className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg text-gray-200 focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] transition"
                placeholder="Confirm new password"
                disabled={isUpdating}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isUpdating}
              className={`px-5 py-2 bg-[#FFD700] text-black rounded-lg font-medium transition ${
                isUpdating ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#E6C200]'
              }`}
            >
              {isUpdating ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          <hr className="my-6 border-[#333]" />

          <button
            onClick={handleSignOut}
            disabled={isUpdating}
            className="px-5 py-2 bg-[#252525] hover:bg-[#2a2a2a] rounded-lg text-gray-300 transition font-medium"
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
          <p className="text-gray-400 mb-4">This action cannot be undone. All your data will be permanently removed.</p>
          <button
            onClick={handleDeleteAccount}
            className="px-5 py-2 bg-red-500/30 hover:bg-red-500/40 text-red-300 rounded-lg transition font-medium"
          >
            Delete My Account
          </button>
        </div>
      </section>
    </div>
  );
}