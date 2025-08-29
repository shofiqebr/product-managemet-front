"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      role:null,
      setAuth: ({ token, user, email, role }) => set({ token, user, email, role }),
      clearAuth: () => set({ token: null, user: null, email: null , role: null}),
    }),
    {
      name: "auth-store", // key in localStorage
    }
  )
);

export default useAuthStore;
