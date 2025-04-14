import React from 'react';

export interface HealthEntry {
  id: number;
  steps: number | null;
  water: number | null;
  heartRate: number | null;
  timestamp: string;
}

export interface FormState {
  waterLiters: string;
  waterGlasses: string;
  heartRate: string;
  steps: string;
  timestamp: string;
}

export interface FormErrors {
  steps: string;
  waterLiters: string;
  waterGlasses: string;
  heartRate: string;
  timestamp: string;
  form: string;
}

export interface HealthDataTableProps {
  data: HealthEntry[];
  handleEdit: (entry: HealthEntry) => void;
  handleDelete: (id: number) => void;
}

export interface HeaderProps {
  onExport: () => void;
  switchMode: () => void;
  darkMode: boolean;
  selectedPeriod: string;
  setSelectedPeriod: React.Dispatch<React.SetStateAction<string>>;
}

export interface LineChartProps {
  data: HealthEntry[];
  selectedMetric: string;
} 

