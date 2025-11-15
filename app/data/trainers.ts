import { Trainer } from "@/types/Trainer";

export const mockTrainers: Trainer[] = [
  {
    id: "a7f8c2b1-1234-4cde-9a87-1a2b3c4d5e6f",
    name: "Lina Moretti",
    avatar_url: "https://randomuser.me/api/portraits/women/44.jpg",
    clients: ["u1234567-89ab-cdef-0123-456789abcdef"],
    role: "Strength Coach",
    rating: 4.9,
    experience_years: 6,
    bio: "Specialized in functional strength and conditioning.",
    specialties: ["Strength", "Conditioning"],
    certifications: ["CPT", "Strength Specialist"],
    available_hours: ["Mon-Fri 10:00-14:00", "Mon-Fri 18:00-20:00"]
  },
  {
    id: "b4c9d7e2-5678-4f3a-8c9b-2e3f4a5b6c7d",
    name: "Tyrone Diaz",
    avatar_url: "https://randomuser.me/api/portraits/men/32.jpg",
    clients: ["u1234567-89ab-cdef-0123-456789abcdef"],
    role: "Boxing Coach",
    rating: 4.7,
    experience_years: 4,
    bio: "Focuses on boxing fundamentals and explosive power.",
    specialties: ["Boxing", "HIIT"],
    certifications: ["Boxing Level 2"],
    available_hours: ["Mon-Fri 09:00-11:00", "Mon-Fri 13:00-15:00"]
  },
  {
    id: "c2f7a6b8-9101-4e3f-9b7c-3d2e1f4a5b6c",
    name: "Elliot Campbell",
    avatar_url: "https://randomuser.me/api/portraits/women/68.jpg",
    clients: ["u1234567-89ab-cdef-0123-456789abcdef"],
    role: "Yoga Instructor",
    rating: 4.8,
    experience_years: 5,
    bio: "Yoga flow and mindfulness specialist.",
    specialties: ["Yoga", "Mobility"],
    certifications: ["Yoga RYT-300"],
    available_hours: ["Mon-Fri 07:00-11:00", "Mon-Fri 16:00-18:00"]
  },
  {
    id: "fecc19b7-9919-4241-bd42-d70bc239d919",
    name: "Kroko123",
    avatar_url: "https://randomuser.me/api/portraits/men/50.jpg",
    clients: [],
    role: "Calisthenics Trainer",
    rating: 4.5,
    experience_years: 3,
    bio: "Bodyweight training and street workout pro.",
    specialties: ["Calisthenics"],
    certifications: ["Calisthenics Level 1"],
    available_hours: ["Mon-Fri 15:00-17:00", "Mon-Fri 19:00-21:00"]
  }
];
