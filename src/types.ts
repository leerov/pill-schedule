export interface Step {
  day: string;
  dose: string;
  unit: string;
  detail: string;
  maintenance?: boolean;
}

export interface Phase {
  label: string;
  days: number;
  times: string[];
  maintenance?: boolean;
}

export interface Medication {
  id: string;
  name: string;
  sub: string;
  icon: 'tablet-round' | 'tablet-oval' | 'capsule';
  color: string;
  startDate: string;
  takenCount: number;
  steps: Step[];
  phases: Phase[];
}

export interface FormPhase {
  day: string;
  dose: string;
  unit: string;
  days: number;
  detail: string;
  maintenance: boolean;
  times: string[];
}