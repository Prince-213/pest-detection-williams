import { create } from "zustand";

export const useStore = create((set) => ({
  email: "",

  updateEmail: (newEmail: string) => set({ bears: newEmail })
}));
