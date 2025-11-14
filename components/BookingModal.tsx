"use client";

import { useState, useEffect, useRef } from "react";
import { Trainer } from "@/types/Trainer";
import { User } from "@/types/User";

interface BookingModalProps {
  user : User
  trainer: Trainer;
  isOpen: boolean;
  onClose: () => void;
  onBook: (bookingData: {
    date: string;
    time: string;
    sessionType?: string;
    notes?: string;
    user: User;
  }) => Promise<void>;
}

export const BookingModal = ({
    trainer,
    isOpen,
    onClose,
    onBook,
    user,
}: BookingModalProps) => {
  const [step, setStep] = useState<"form" | "success">("form");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [notes, setNotes] = useState("");
  const [isBooking, setIsBooking] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length) (focusable[0] as HTMLElement).focus();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    setIsBooking(true);
    try {
      await onBook({ date, time, sessionType, notes, user });
      setStep("success");
    } catch (err) {
      alert("Failed to book session. Please try again.");
      console.error(err);
    } finally {
      setIsBooking(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="w-full max-w-md bg-(--color-accent) border border-[#333333] rounded-2xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        {step === "form" ? (
          <>
            <div className="p-5 border-b border-[#333333] flex justify-between items-center">
              <div>
                <h2
                  id="booking-modal-title"
                  className="text-xl font-bold text-(--color-secondary)"
                >
                  Book a Session with {trainer.name}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {trainer.rating != null && (
                    <span className="text-sm text-(--color-primary) font-medium">
                      ★ {trainer.rating}
                    </span>
                  )}
                  {trainer.specialties && trainer.specialties.length > 0 && (
                    <span className="text-xs text-(--color-contrast)">
                      • {trainer.specialties.join(", ")}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-[#252525] flex items-center justify-center text-(--color-contrast) hover:bg-[#2d2d2d] transition"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-5">
              <div>
                <label className="block text-(--color-contrast) text-sm font-medium mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={today}
                  className="
    w-full p-3 
    bg-[#1e1e1e] 
    border border-[#333333] 
    rounded-lg 
    text-foreground
    font-sans 
    text-sm 
    focus:outline-none 
    focus:ring-2 focus:ring-[#e6c200] 
    placeholder-transparent
  "
                />
              </div>

              <div>
                <label className="block text-(--color-contrast) text-sm font-medium mb-2">
                  Time Slot
                </label>
                {trainer.available_hours &&
                trainer.available_hours.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {trainer.available_hours.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        className={`py-2 px-3 text-sm rounded-lg transition ${
                          time === slot
                            ? "bg-(--color-primary) text-(--color-secondary) font-medium"
                            : "bg-[#252525] text-(--color-contrast) hover:bg-[#2d2d2d]"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-(--color-contrast) text-sm">
                    No available times.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-(--color-contrast) text-sm font-medium mb-2">
                  Session Focus (Optional)
                </label>
                <input
                  type="text"
                  value={sessionType}
                  onChange={(e) => setSessionType(e.target.value)}
                  placeholder="e.g., Strength, HIIT, Mobility"
                  className="w-full p-3 bg-[#1e1e1e] border border-[#333333] rounded-lg text-(--foreground)] ocus:outline-none focus:ring-2 focus:ring-[#e6c200]"
                />
              </div>

              <div>
                <label className="block text-(--color-contrast) text-sm font-medium mb-2">
                  Special Requests (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell your trainer about injuries, goals, or preferences..."
                  className="w-full p-3 bg-[#1e1e1e] border border-[#333333] rounded-lg text-(--foreground)] ocus:outline-none focus:ring-2 focus:ring-[#e6c200] resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-lg font-medium text-sm bg-[#252525] text-(--color-contrast) hover:bg-[#2d2d2d] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isBooking || !date || !time}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition ${
                    isBooking || !date || !time
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                      : "bg-(--color-primary) text-(--color-secondary) hover:bg-[#e6c200] active:bg-[#ccac00]"
                  }`}
                >
                  {isBooking ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-green-400 text-2xl">✅</span>
            </div>
            <h2 className="text-xl font-bold text-(--color-secondary) mb-2">
              Session Booked!
            </h2>
            <p className="text-(--color-contrast) mb-6">
              Your session with{" "}
              <span className="text-(--color-primary)">
                {trainer.name}
              </span>{" "}
              is confirmed.
              <br />
              <span className="font-medium">
                {date} at {time}
              </span>
            </p>
            <button
              onClick={onClose}
              className="py-2.5 px-6 bg-(--color-primary) text-(--color-secondary) font-semibold rounded-lg hover:bg-[#e6c200] active:bg-[#ccac00] transition"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
