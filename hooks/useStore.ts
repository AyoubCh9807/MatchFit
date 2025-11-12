import { create } from "zustand";

interface Store {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useStore = create<Store>((set) => ({
  sidebarOpen: false,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen }))
}));
