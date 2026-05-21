"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SalonType = "femme" | "homme" | "mixte" | "nail";

interface LumioStore {
  salonType: SalonType;
  setSalonType: (t: SalonType) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}

export const useLumioStore = create<LumioStore>()(
  persist(
    (set) => ({
      salonType: "femme",
      setSalonType: (t) => set({ salonType: t }),
      sidebarOpen: true,
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
    }),
    { name: "lumio-store" }
  )
);
