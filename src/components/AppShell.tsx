"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Flame, Megaphone, Home, FileText, BarChart2,
  Settings, Menu, X, Bell, Star,
} from "lucide-react";
import { CURRENT_AGENT, ALERTS } from "@/lib/data";

const NAV_ITEMS = [
  { href: "/dashboard",     icon: LayoutDashboard, label: "Dashboard" },
  { href: "/contacts",      icon: Users,           label: "Contacts" },
  { href: "/leads-chauds",  icon: Flame,           label: "Leads Chauds" },
  { href: "/campagnes",     icon: Megaphone,       label: "Campagnes" },
  { href: "/biens",         icon: Home,            label: "Biens" },
  { href: "/estimations",   icon: FileText,        label: "Estimations" },
  { href: "/analytiques",   icon: BarChart2,       label: "Analytiques" },
  { href: "/parametres",    icon: Settings,        label: "Paramètres" },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const unreadAlerts = ALERTS.filter((a) => !a.read).length;
  const hotLeads = 4;

  return (
    <div className="flex min-h-screen" style={{ background: "#F8FAFC" }}>
      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-50 flex flex-col w-60 transition-transform duration-200 lg:translate-x-0 lg:static lg:flex ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "#0F2340", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div
            className="flex items-center justify-center rounded-xl"
            style={{ width: 34, height: 34, background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)" }}
          >
            <Star size={16} style={{ color: "#C9A84C" }} fill="#C9A84C" />
          </div>
          <div>
            <div className="font-bold text-white text-base leading-tight tracking-tight">Kepler</div>
            <div style={{ fontSize: "0.65rem", color: "#64748B", letterSpacing: "0.04em" }}>CRM IMMOBILIER</div>
          </div>
          <button
            className="ml-auto lg:hidden btn-icon"
            style={{ color: "#64748B" }}
            onClick={() => setMobileOpen(false)}
          >
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`sidebar-link ${active ? "active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <Icon size={16} />
                <span>{label}</span>
                {label === "Leads Chauds" && hotLeads > 0 && (
                  <span
                    className="ml-auto text-xs font-bold rounded-full px-1.5 py-0.5"
                    style={{ background: "#EF4444", color: "white", fontSize: "0.65rem", minWidth: "18px", textAlign: "center" }}
                  >
                    {hotLeads}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Agent profile */}
        <div className="px-3 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3 px-2">
            <div
              className="flex items-center justify-center rounded-full text-white font-bold text-sm flex-shrink-0"
              style={{ width: 34, height: 34, background: "#C9A84C" }}
            >
              TM
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{CURRENT_AGENT.fullName}</div>
              <div className="text-xs truncate" style={{ color: "#64748B" }}>{CURRENT_AGENT.agencyName}</div>
            </div>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
              style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.2)" }}
            >
              Pro
            </span>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile + notifications) */}
        <header
          className="flex items-center gap-3 px-4 lg:px-6 py-3 border-b bg-white sticky top-0 z-30"
          style={{ borderColor: "#E2E8F0" }}
        >
          <button
            className="btn-icon lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={18} />
          </button>
          <div className="flex-1" />
          <button className="btn-icon relative">
            <Bell size={17} />
            {unreadAlerts > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 text-white rounded-full flex items-center justify-center"
                style={{ background: "#EF4444", fontSize: "0.55rem", width: 14, height: 14, fontWeight: 700 }}
              >
                {unreadAlerts}
              </span>
            )}
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
