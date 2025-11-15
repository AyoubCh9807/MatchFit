import { Session } from "@/types/Session";

export const mockSessions: Session[] = [
  {
    id: "s1a2b3c4-d5e6-7f8g-9h0i-1234567890ab",
    trainer_id: "a7f8c2b1-1234-4cde-9a87-1a2b3c4d5e6f",
    user_id: "u1234567-89ab-cdef-0123-456789abcdef",
    date: "2025-11-20",
    time: "10:00",
    session_type: "Strength Training",
    notes: "Focus on upper body today, include warm-up and stretching.",
    status: "booked",
    trainer_name: "Lina Moretti",
    trainer_avatar_url: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: "s2b3c4d5-e6f7-8g9h-0i1j-234567890abc",
    trainer_id: "b4c9d7e2-5678-4f3a-8c9b-2e3f4a5b6c7d",
    user_id: "u1234567-89ab-cdef-0123-456789abcdef",
    date: "2025-11-21",
    time: "14:00",
    session_type: "HIIT / Cardio",
    notes: "Interval training, increase intensity gradually.",
    status: "booked",
    trainer_name: "Tyrone Diaz",
    trainer_avatar_url: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: "s3c4d5e6-f7g8-9h0i-1j2k-34567890abcd",
    trainer_id: "c2f7a6b8-9101-4e3f-9b7c-3d2e1f4a5b6c",
    user_id: "u1234567-89ab-cdef-0123-456789abcdef",
    date: "2025-11-22",
    time: "08:30",
    session_type: "Yoga / Mindfulness",
    notes: "Deep stretching and breathing exercises.",
    status: "completed",
    trainer_name: "Elliot Campbell",
    trainer_avatar_url: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: "s4d5e6f7-g8h9-0i1j-2k3l-4567890abcde",
    trainer_id: "fecc19b7-9919-4241-bd42-d70bc239d919",
    user_id: "u1234567-89ab-cdef-0123-456789abcdef",
    date: "2025-11-23",
    time: "16:00",
    session_type: "Weight Lifting",
    notes: "Full-body session. Track PR attempts.",
    status: "canceled",
    trainer_name: "Kroko123",
    trainer_avatar_url: "https://randomuser.me/api/portraits/men/50.jpg"
  }
];
