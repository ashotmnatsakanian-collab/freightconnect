"use client";
import { Sidebar } from "@/components/lumio/Sidebar";
import { Topbar } from "@/components/lumio/Topbar";
import { useLumioStore } from "@/lib/store";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { salonType, sidebarOpen } = useLumioStore();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", salonType);
  }, [salonType]);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Sidebar />
      <Topbar />
      <main
        className="pt-16 transition-all duration-300 min-h-screen"
        style={{ marginLeft: sidebarOpen ? "220px" : "64px" }}
      >
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
