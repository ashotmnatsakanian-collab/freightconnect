"use client";
import { useLumioStore } from "@/lib/store";
import { useEffect } from "react";
export default function Page() {
  const { salonType } = useLumioStore();
  useEffect(() => { document.documentElement.setAttribute("data-theme", salonType); }, [salonType]);
  return (
    <div className="flex items-center justify-center py-24">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Page en cours de développement…</p>
    </div>
  );
}
