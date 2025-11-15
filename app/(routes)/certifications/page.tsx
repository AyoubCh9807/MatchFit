"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";

// MOCK TRAINER
const mockTrainer = {
  id: "u1234567-89ab-cdef-0123-456789abcdef",
  name: "Itercio",
  certifications: ["NASM-CPT", "ACE Group Fitness"],
};

type CertificationForm = {
  certification: string;
};

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<string[]>(
    mockTrainer.certifications
  );

  const form = useForm<CertificationForm>({
    defaultValues: { certification: "" },
  });

  const addCertification = (formValues: CertificationForm) => {
    const certName = formValues.certification.trim();
    if (!certName) return;

    if (certifications.includes(certName)) {
      form.setError("certification", {
        message: "Certification already added",
      });
      return;
    }

    setCertifications([...certifications, certName]);
    form.reset();
  };

  const removeCertification = (cert: string) => {
    if (!confirm(`Remove certification "${cert}"?`)) return;
    setCertifications(certifications.filter((c) => c !== cert));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Certifications (Mock)</h1>
        <p className="text-gray-400 mt-1">
          Manage your professional credentials and qualifications.
        </p>
      </div>

      {/* Add Certification */}
      <section className="bg-[#222222] border border-[#333333] rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Add Certification</h2>
        <form onSubmit={form.handleSubmit(addCertification)} className="space-y-3">
          <div>
            <label
              htmlFor="certification"
              className="block text-gray-400 text-sm font-medium mb-2"
            >
              Certification Name
            </label>
            <input
              id="certification"
              {...form.register("certification", {
                required: "Certification name is required",
              })}
              className="w-full px-4 py-2.5 bg-[#1e1e1e] border border-[#333333] rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e6c200] transition"
              placeholder="e.g., NASM-CPT, ACE Group Fitness"
            />
            {form.formState.errors.certification && (
              <p className="text-red-400 text-xs mt-1">
                {form.formState.errors.certification.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-yellow-400 text-black font-medium rounded-lg hover:bg-[#e6c200] active:bg-[#ccac00] transition shadow-sm"
          >
            Add Certification
          </button>
        </form>
      </section>

      {/* Existing Certifications */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">Your Certifications</h2>
        {certifications.length === 0 ? (
          <p className="text-gray-400 italic">No certifications added yet.</p>
        ) : (
          <div className="space-y-2">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-[#222222] border border-[#333333] rounded-lg p-3"
              >
                <span className="text-white">{cert}</span>
                <button
                  onClick={() => removeCertification(cert)}
                  className="text-red-400 hover:text-red-500 text-sm font-medium"
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
