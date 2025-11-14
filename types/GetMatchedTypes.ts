export interface GoalsData {
  goals: string;
  fitnessLevel: "beginner" | "intermediate" | "advanced";
}

export interface HealthData {
  injuries: string;
  healthConditions: string;
}

export type Step = 1 | 2 | 3 ;
