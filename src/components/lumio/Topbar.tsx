"use client";
import { Bell, Search, Menu } from "lucide-react";
import { useLumioStore } from "@/lib/store";
import { SalonTypeSelector } from "./SalonTypeSelector";

export function Topbar() {
  const { setSidebarOpen, sidebarOpen } = useLumioStore();

  return (
    <header
      className="fixed top-0 right-0 h-16 flex items-center justify-between px-4 lg:px-6 z-30 border-b transition-all"
      style={{
        left: sidebarOpen ? "220px" : "64px",
        background: "var(--bg-card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Left: mobile menu + salon selector */}
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg)] cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={18} style={{ color: "var(--text-muted)" }} />
        </button>
        <SalonTypeSelector />
      </div>

      {/* Right: search + notifs + avatar */}
      <div className="flex items-center gap-2">
        <button
          className="p-2 rounded-xl border transition-all hover:border-[var(--primary)] cursor-pointer"
          style={{ borderColor: "var(--border)" }}
        >
          <Search size={16} style={{ color: "var(--text-muted)" }} />
        </button>

        <button
          className="relative p-2 rounded-xl border transition-all hover:border-[var(--primary)] cursor-pointer"
          style={{ borderColor: "var(--border)" }}
        >
          <Bell size={16} style={{ color: "var(--text-muted)" }} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "var(--danger, #E8445A)" }}
          />
        </button>

        <div
          className="avatar ml-1 text-white text-xs cursor-pointer"
          style={{ background: "var(--primary)" }}
          title="Propriétaire du salon"
        >
          BE
        </div>
      </div>
    </header>
  );
}
