"use client";

import { HealthData } from "@/types/GetMatchedTypes";

interface HealthInformationFormProps {
  data: HealthData;
  onChange: (data: HealthData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function HealthInformationForm({
  data,
  onChange,
  onNext,
  onBack,
}: HealthInformationFormProps) {
  // handle textarea change and push updates up to parent
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(); // tell parent to go to next step
  };

  return (
    <div className="bg-(--color-accent) border border-[#333333] rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-(--color-secondary)">
          Health Information
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-(--color-contrast) text-sm font-medium mb-2">
            Do you have any injuries or physical limitations?
          </label>
          <textarea
            minLength={5}
            maxLength={255}
            name="injuries"
            value={data.injuries}
            onChange={handleChange}
            placeholder="Tell us about any injuries, pain, or physical limitations... (e.g., lower back pain, knee injury, shoulder issues, etc.)"
            className="w-full p-4 bg-[#1e1e1e] border border-[#333333] rounded-lg text-(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#e6c200] resize-none"
            rows={4}
          />
          <p className="text-xs text-(--color-contrast) mt-1">
            Leave blank if none
          </p>
        </div>

        <div>
          <label className="block text-(--color-contrast) text-sm font-medium mb-2">
            Any health conditions we should know about?
          </label>
          <textarea
            name="healthConditions"
            value={data.healthConditions}
            onChange={handleChange}
            placeholder="Tell us about any health conditions... (e.g., diabetes, high blood pressure, asthma, etc.)"
            className="w-full p-4 bg-[#1e1e1e] border border-[#333333] rounded-lg text-(--foreground)] focus:outline-none focus:ring-2 focus:ring-[#e6c200] resize-none"
            rows={4}
          />
          <p className="text-xs text-(--color-contrast) mt-1">
            Leave blank if none
          </p>
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
            Continue →
          </button>
        </div>
      </form>
    </div>
  );
}
