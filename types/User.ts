export type User = {
  id: string;                 
  name: string;
  avatar_url: string;
  email: string;
  age?: number | null;
  gender?: "male" | "female" | "other" | null;
  location?: string | null;
  fitness_level?: "Beginner" | "Intermediate" | "Advanced" | null;
  goals: string;
  created_at?: string | null;  
  experts?: string[];          
};
