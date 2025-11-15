"use client";

import { GoalsData } from "@/types/GetMatchedTypes";
import { useState } from "react";

interface GoalsFormProps {
  data: GoalsData;
  onChange: (data: GoalsData) => void;
  onNext: () => void;
}

export const GoalsForm = ({ data, onChange, onNext }: GoalsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async () => {
    try {
      setIsSubmitting(true);
      onNext();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-(--color-accent) border border-[#333333] rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-(--color-primary) rounded-full flex items-center justify-center text-(--color-secondary) font-bold text-sm">
          🎯
        </div>
        <h2 className="text-xl font-bold text-(--color-secondary)">
          Your Goals
        </h2>
      </div>

      <p className="text-(--color-contrast) mb-4">
        What are your fitness goals?
      </p>

      <div className="relative">
        <textarea
          minLength={10}
          maxLength={255}
          value={data.goals}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            onChange({ ...data, goals: e.target.value })
          }
          placeholder="Tell us what you want to achieve... (e.g., lose weight, build muscle, improve endurance, prepare for a marathon, etc.)"
          className="w-full p-4 bg-[#1e1e1e] border border-[#333333] rounded-lg text--foreground focus:outline-none focus:ring-2 focus:ring-[#e6c200] resize-none mb-2"
          rows={4}
        />
        <p
          className={`text-sm text-right ${
            data.goals.length < 10
              ? "text-(--color-error)"
              : data.goals.length > 255
              ? "text-(--color-error)" // error
              : "text-(--color-success)" // success
          }`}
        >
          {data.goals.length} / 255
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-medium text-(--color-contrast) mb-3">
          Fitness Level
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {["beginner", "intermediate", "advanced"].map((level) => (
            <button
              key={level}
              type="button"
              onClick={() =>
                onChange({
                  ...data,
                  fitnessLevel: level as
                    | "beginner"
                    | "intermediate"
                    | "advanced",
                })
              }
              className={`py-3 px-4 rounded-lg text-sm font-medium transition ${
                data.fitnessLevel === level
                  ? "bg-(--color-primary) text-(--color-secondary) shadow"
                  : "bg-[#252525] text-(--color-contrast) hover:bg-[#2d2d2d]"
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={isSubmitting}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          isSubmitting
            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
            : "bg-(--color-primary) text-(--color-secondary) hover:bg-[#e6c200] active:bg-[#ccac00]"
        }`}
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <div className="w-5 h-5 animate-spin rounded-full border-2 border-(--color-secondary) border-t-transparent mr-2"></div>
            Saving...
          </span>
        ) : (
          "Continue →"
        )}
      </button>
    </div>
  );
};
