"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Sparkles,
  Gift,
  Share2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Scissors,
} from "lucide-react";
import { useLumioStore } from "@/lib/store";

const NAV = [
  { href: "/dashboard",     icon: LayoutDashboard, label: "Dashboard" },
  { href: "/clients",       icon: Users,            label: "Clients" },
  { href: "/agenda",        icon: Calendar,         label: "Agenda" },
  { href: "/consultation",  icon: Sparkles,         label: "Consultation IA" },
  { href: "/fidelite",      icon: Gift,             label: "Fidélité" },
  { href: "/instagram",     icon: Share2,           label: "Contenu Social" },
  { href: "/settings",      icon: Settings,         label: "Paramètres" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useLumioStore();

  return (
    <aside
      className="fixed left-0 top-0 h-full flex flex-col z-40 transition-all duration-300"
      style={{
        width: sidebarOpen ? "220px" : "64px",
        background: "var(--primary-dark, var(--primary))",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <Scissors size={16} color="white" />
        </div>
        {sidebarOpen && (
          <span className="text-white font-bold text-lg tracking-tight">Lumio</span>
        )}
      </div>

      {/* Salon name chip */}
      {sidebarOpen && (
        <div className="px-4 py-3">
          <div
            className="px-3 py-2 rounded-lg text-xs font-medium"
            style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
          >
            ✦ Salon Belle Époque
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 pt-2 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`sidebar-link ${active ? "active" : ""}`}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon size={17} className="shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="mx-2 mb-4 flex items-center justify-center p-2 rounded-xl border border-white/15 text-white/60 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
      >
        {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>
    </aside>
  );
}
