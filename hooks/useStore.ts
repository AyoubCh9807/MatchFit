import { create } from "zustand";

interface Store {
  role: "client" | "trainer";
  setRole: (role: "client" | "trainer") => void;
}

export const useStore = create<Store>((set) => ({
  role: "client",
  setRole: (role) => set({ role }),
}));
