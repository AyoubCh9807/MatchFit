export type Trainer = {
  id: string;
  name: string;
  avatar_url: string;
  role?: string | null;
  rating?: number | null;
  experience_years?: number | null;
  bio?: string | null;
  specialties?: string[] | null;
  certifications?: string[] | null;
  available_hours?: string[] | null;
  clients: string[];
};
