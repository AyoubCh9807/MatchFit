export type Session = {
  id: string;
  trainer_id: string;
  user_id: string;
  date: string;
  status: "completed" | "booked" | "canceled";
  trainer_name?: string;
  trainer_avatar_url?: string;
};