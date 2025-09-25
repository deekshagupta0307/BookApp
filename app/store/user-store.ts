import { create } from "zustand";

interface UserState {
  firstName: string;
  email: string;
  password: string;
  setFirstName: (name: string) => void;
  setCredentials: (email: string, password: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  firstName: "",
  email: "",
  password: "",
  setFirstName: (name) => set({ firstName: name }),
  setCredentials: (email, password) => set({ email, password }),
}));
