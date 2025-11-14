"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useRouter } from "next/navigation";

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

  const [authUser, setAuthUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session?.user) {
          router.push("/");
          return;
        }

        setAuthUser(session.user);
      }
    );

    return () => subscription.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!authUser) return;

    const loadProfile = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      setProfile(data);
      setLoading(false);
    };

    loadProfile();
  }, [authUser]);

  const updateProfile = async (data: ProfileForm) => {
    if (!authUser) return;

    try {
      if (data.email !== authUser.email) {
        const { error } = await supabase.auth.updateUser({ email: data.email });
        if (error) throw error;
        alert("Please confirm your new email address.");
      }

      const { error: profileError } = await supabase
        .from("users")
        .update({ name: data.name })
        .eq("id", authUser.id);

      if (profileError) throw profileError;

      alert("Profile updated successfully!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const updatePassword = async (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: data.newPassword,
      });
      if (error) throw error;

      passwordForm.reset();
      alert("Password updated successfully!");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleDeleteAccount = async () => {
    if (!authUser) return;
    if (!confirm("This will delete your account permanently. Continue?"))
      return;

    try {
      alert("Feature not implemented for demo purposes");
    } catch (err: any) {
      alert(err.message);
    }
  };

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
    if (authUser && profile) {
      profileForm.reset({
        name: profile.name,
        email: authUser.email,
      });
    }
  }, [authUser, profile]);

  if (loading || !authUser || !profile) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-8">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-(--color-accent) border border-[#333333] rounded-xl p-6 animate-pulse"
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
      <h1 className="text-2xl font-bold text-(--color-secondary)">
        Account Settings
      </h1>
      <p className="text-(--color-contrast)">
        Manage your personal info, security, and preferences.
      </p>

      {/* PERSONAL INFO */}
      <section className="bg-(--color-accent) border border-[#333333] rounded-xl">
        <div className="px-6 py-4 border-b border-[#333333]">
          <h2 className="text-lg font-semibold">Personal Information</h2>
        </div>

        <div className="p-6">
          <form
            onSubmit={profileForm.handleSubmit(updateProfile)}
            className="space-y-5"
          >
            <div>
              <label className="block text-sm mb-2">Full Name</label>
              <input
                {...profileForm.register("name")}
                className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm mb-2">Email</label>
              <input
                type="email"
                {...profileForm.register("email")}
                className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-(--color-primary) text-black rounded-lg"
            >
              Save Changes
            </button>
          </form>
        </div>
      </section>

      <section className="bg-(--color-accent) border border-[#333333] rounded-xl">
        <div className="px-6 py-4 border-b border-[#333333]">
          <h2 className="text-lg font-semibold">Security</h2>
        </div>

        <div className="p-6">
          <form
            onSubmit={passwordForm.handleSubmit(updatePassword)}
            className="space-y-5"
          >
            <input
              type="password"
              placeholder="Current Password"
              {...passwordForm.register("currentPassword")}
              className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg"
            />

            <input
              type="password"
              placeholder="New Password"
              {...passwordForm.register("newPassword")}
              className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              {...passwordForm.register("confirmPassword")}
              className="w-full px-4 py-2 bg-[#1e1e1e] border border-[#333] rounded-lg"
            />

            <button
              type="submit"
              className="px-5 py-2 bg-(--color-primary) text-black rounded-lg"
            >
              Update Password
            </button>
          </form>

          <hr className="my-6 border-[#333]" />

          <button
            onClick={handleSignOut}
            className="px-5 py-2 bg-[#252525] rounded-lg"
          >
            Sign Out
          </button>
        </div>
      </section>

      {/* DELETE ACCOUNT */}
      <section className="bg-(--color-accent) border border-red-500/40 rounded-xl">
        <div className="px-6 py-4 border-b border-red-500/40">
          <h2 className="text-lg font-semibold text-red-400">Delete Account</h2>
        </div>

        <div className="p-6">
          <button
            onClick={handleDeleteAccount}
            className="px-5 py-2 bg-red-500/30 text-red-300 rounded-lg"
          >
            Delete My Account
          </button>
        </div>
      </section>
    </div>
  );
}
