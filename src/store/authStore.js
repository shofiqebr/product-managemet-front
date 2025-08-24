"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setAuth: ({ token, user, email }) => set({ token, user, email }),
      clearAuth: () => set({ token: null, user: null, email: null }),
    }),
    {
      name: "auth-store", // key in localStorage
    }
  )
);

export default useAuthStore;
