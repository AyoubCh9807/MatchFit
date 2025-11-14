"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PreferencesFormProps {
  onBack: () => void; 
  onComplete: (data: { trainingPreferences: string }) => void; 
}

export default function PreferencesForm({
  onBack,
  onComplete,
}: PreferencesFormProps) {
  const [formData, setFormData] = useState({
    trainingPreferences: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, trainingPreferences: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="bg-(--color-accent) border border-[#333333] rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-(--color-primary) rounded-full flex items-center justify-center text-(--color-secondary) font-bold text-sm">
          💙
        </div>
        <h2 className="text-xl font-bold text-(--color-secondary)">
          Preferences
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-(--color-contrast) text-sm font-medium mb-2">
            What type of training do you prefer?
          </label>
          <textarea
            value={formData.trainingPreferences}
            onChange={handleChange}
            placeholder="Tell us about your training preferences... (e.g., strength training, HIIT, yoga, outdoor activities, swimming, etc.)"
            className="w-full p-4 bg-[#1e1e1e] border border-[#333333] rounded-lg text-(--foreground)] ocus:outline-none focus:ring-2 focus:ring-[#e6c200] resize-none"
            rows={4}
          />
          <p className="text-xs text-(--color-contrast) mt-1">
            This helps us match you better
          </p>
        </div>

        <div className="bg-[#1e1e1e] border border-[#333333] rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs">
              🤖
            </div>
            <div>
              <h3 className="font-semibold text-(--color-secondary)">
                Ready to find your match!
              </h3>
              <p className="text-(--color-contrast) text-sm mt-1">
                Once you complete this, our AI will analyze your needs and
                recommend verified experts who are perfect for you.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 px-4 rounded-lg font-medium text-sm bg-[#252525] text-(--color-contrast) hover:bg-[#2d2d2d] transition"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 py-3 px-4 rounded-lg font-medium text-sm bg-(--color-primary) text-(--color-secondary) hover:bg-[#e6c200] active:bg-[#ccac00] transition"
          >
            Get Matched →
          </button>
        </div>
      </form>
    </div>
  );
}
