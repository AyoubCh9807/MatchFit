export type Session = {
  id: string;
  trainer_id: string;
  user_id: string;
  date: string;
  time: string;
  session_type: string | null;
  notes: string | null;
  status: "booked" | "completed" | "canceled";
  trainer_name: string | null;
  trainer_avatar_url: string | null;
};
