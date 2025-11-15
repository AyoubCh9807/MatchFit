"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase/supabaseClient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Trainer } from "@/types/Trainer";

type CertificationForm = {
  certification: string;
};

export default function CertificationsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [authUserId, setAuthUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/");
        return;
      }

      setAuthUserId(user.id);
    };

    checkAuth();
  }, [router]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["trainer-certifications", authUserId],
    enabled: !!authUserId,
    queryFn: async () => {
      if (!authUserId) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("trainers")
        .select("id, name, certifications")
        .eq("id", authUserId)
        .single();

      if (error) throw error;
      return data as Trainer;
    },
  });

  const form = useForm<CertificationForm>({
    defaultValues: { certification: "" },
  });


  const addCertification = async (formValues: CertificationForm) => {
    if (!data) return;

    const certName = formValues.certification.trim();

    const newCerts = data.certifications?.includes(certName)
      ? data.certifications
      : [...(data.certifications || []), certName];

    try {
      const { error } = await supabase
        .from("trainers")
        .update({ certifications: newCerts })
        .eq("id", authUserId!);

      if (error) throw error;

      queryClient.invalidateQueries({
        queryKey: ["trainer-certifications", authUserId],
      });

      form.reset();
    } catch (err) {
      console.error(err);
      alert("Failed to add certification.");
    }
  };

  const removeCertification = async (cert: string) => {
    if (!confirm("Remove this certification?")) return;
    if (!data) return;

    const updatedCerts = (data.certifications || []).filter(
      (c) => c !== cert
    );

    try {
      const { error } = await supabase
        .from("trainers")
        .update({ certifications: updatedCerts })
        .eq("id", authUserId!);

      if (error) throw error;

      queryClient.invalidateQueries({
        queryKey: ["trainer-certifications", authUserId],
      });
    } catch (err) {
      console.error(err);
      alert("Failed to remove certification.");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto space-y-6">
        <div className="h-8 bg-[#2d2d2d] rounded w-1/3 mb-4 animate-pulse"></div>
        <div className="bg-(--color-accent) border border-[#333333] rounded-xl p-6 animate-pulse">
          <div className="h-4 bg-[#252525] rounded w-full mb-2"></div>
          <div className="h-4 bg-[#252525] rounded w-5/6 mb-2"></div>
          <div className="h-10 bg-[#252525] rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <div className="bg-red-900/20 border border-red-900/50 text-red-300 p-4 rounded-lg">
          ❌ {error?.message || "Failed to load certifications."}
        </div>
      </div>
    );
  }

  const currentCerts = data.certifications || [];

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-(--color-secondary)">Certifications</h1>
        <p className="text-(--color-contrast) mt-1">
          Manage your professional credentials and qualifications.
        </p>
      </div>

      <section className="bg-(--color-accent) border border-[#333333] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-(--color-secondary) mb-4">Add Certification</h2>
        <form onSubmit={form.handleSubmit(addCertification)} className="space-y-3">
          <div>
            <label htmlFor="certification" className="block text-(--color-contrast) text-sm font-medium mb-2">
              Certification Name
            </label>
            <input
              id="certification"
              {...form.register("certification", {
                required: "Certification name is required",
                validate: (value) =>
                  !currentCerts.includes(value.trim()) || "Certification already added",
              })}
              className="w-full px-4 py-2.5 bg-[#1e1e1e] border border-[#333333] rounded-lg text-(--foreground)] ocus:outline-none focus:ring-2 focus:ring-[#e6c200] transition"
              placeholder="e.g., NASM-CPT, ACE Group Fitness"
            />
            {form.formState.errors.certification && (
              <p className="text-(--color-error) text-xs mt-1">
                {form.formState.errors.certification.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-(--color-primary) text-(--color-secondary) font-medium rounded-lg hover:bg-[#e6c200] active:bg-[#ccac00] transition shadow-sm"
          >
            Add Certification
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-(--color-secondary) mb-3">Your Certifications</h2>
        {currentCerts.length === 0 ? (
          <p className="text-(--color-contrast) italic">No certifications added yet.</p>
        ) : (
          <div className="space-y-2">
            {currentCerts.map((cert, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-(--color-accent) border border-[#333333] rounded-lg p-3"
              >
                <span className="text-(--color-secondary)">{cert}</span>
                <button
                  onClick={() => removeCertification(cert)}
                  className="text-(--color-error) hover:text-red-400 text-sm font-medium"
                  aria-label={`Remove ${cert}`}
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