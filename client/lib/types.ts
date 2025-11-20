export interface ChoiceOption {
  id: string;
  text: string;
}

export interface DecisionPoint {
  step: number;
  context: string;
  prompt: string;
  choices: ChoiceOption[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimated_time: number;
  decision_points: DecisionPoint[];
}

export interface FrameworkAnalysis {
  utilitarian: string;
  deontological: string;
  virtue_ethics: string;
  care_ethics: string;
}

export interface DecisionResponse {
  session_id: string;
  analysis: FrameworkAnalysis;
  consequence: string | null;
  next_step: number | null;
  is_final: boolean;
}
