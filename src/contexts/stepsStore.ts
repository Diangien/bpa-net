import { create } from "zustand";

interface StepperState {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

interface StepperRegistoState {
  currentStepRegisto: number;
  setCurrentStepRegisto: (step: number) => void;
}

export const useStepperStore = create<StepperState>((set) => ({
  currentStep: 1,
  setCurrentStep: (step) => set({ currentStep: step }),
}));


export const useStepperRegistoStore = create<StepperRegistoState>((set) => ({
  currentStepRegisto: 1,
  setCurrentStepRegisto: (step) => set({ currentStepRegisto: step }),
}));
