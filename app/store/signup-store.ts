import { create } from "zustand";

type SignupState = {
  bookName: string;
  author: string;
  totalPages: string;
  everydayPages: string;
  weeklyPages: Record<string, string>;

  setBookName: (val: string) => void;
  setAuthor: (val: string) => void;
  setTotalPages: (val: string) => void;
  setEverydayPages: (val: string) => void;
  setWeeklyPages: (day: string, val: string) => void;
};

export const useSignupStore = create<SignupState>((set) => ({
  bookName: "",
  author: "",
  totalPages: "",
  everydayPages: "",
  weeklyPages: {},

  setBookName: (val: string) => set({ bookName: val }),
  setAuthor: (val: string) => set({ author: val }),
  setTotalPages: (val: string) => set({ totalPages: val }),
  setEverydayPages: (val: string) => set({ everydayPages: val }),
  setWeeklyPages: (day: string, val: string) =>
    set((state) => ({
      weeklyPages: { ...state.weeklyPages, [day]: val },
    })),
}));
