"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  LayoutDashboard, Package, Truck, Map, FileText,
  Users, Building2, LogOut, ChevronRight, MessageCircle, CalendarDays
} from "lucide-react";

const navItems = {
  admin: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/admin/companies", icon: Building2, label: "Entreprises" },
    { href: "/admin/users", icon: Users, label: "Utilisateurs" },
    { href: "/messages", icon: MessageCircle, label: "Messagerie" },
  ],
  dispatcher: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/missions", icon: Package, label: "Missions" },
    { href: "/calendar", icon: CalendarDays, label: "Calendrier" },
    { href: "/freight", icon: Truck, label: "Bourse de fret" },
    { href: "/tracking", icon: Map, label: "Suivi GPS" },
    { href: "/documents", icon: FileText, label: "Documents" },
    { href: "/drivers", icon: Users, label: "Chauffeurs" },
    { href: "/messages", icon: MessageCircle, label: "Messagerie" },
  ],
  driver: [
    { href: "/driver", icon: LayoutDashboard, label: "Mes missions" },
    { href: "/driver/availability", icon: Truck, label: "Ma disponibilité" },
    { href: "/driver/requests", icon: Package, label: "Demandes reçues" },
    { href: "/driver/documents", icon: FileText, label: "Mes documents" },
    { href: "/messages", icon: MessageCircle, label: "Messagerie" },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      try {
        const convs = await api.get<{ unread: number }[]>("/api/messages");
        setUnread(convs.reduce((sum, c) => sum + (c.unread || 0), 0));
      } catch { /* ignore */ }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, [user]);

  if (!user) return null;
  const items = navItems[user.role as keyof typeof navItems] ?? [];

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <aside className="flex flex-col h-full" style={{ background: "#1e3a5f", width: "240px", minWidth: "240px" }}>
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#f97316" }}>
            <Truck className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg">FreightConnect</span>
        </div>
        {user.company && (
          <div className="mt-2 text-xs truncate" style={{ color: "#93c5fd" }}>{user.company.name}</div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const active = pathname === item.href ||
            (item.href !== "/dashboard" && item.href !== "/driver" && pathname.startsWith(item.href));
          const isMessages = item.href === "/messages";
          return (
            <Link key={item.href} href={item.href}
              className={`sidebar-link ${active ? "active" : ""}`}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {isMessages && unread > 0 && (
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: "#f97316" }}>
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
              {active && !isMessages && <ChevronRight className="w-3 h-3 opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 mb-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ background: "#f97316" }}>
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-medium truncate">{user.firstName} {user.lastName}</div>
            <div className="text-xs capitalize" style={{ color: "#94a3b8" }}>
              {user.role === "admin" ? "Administrateur" : user.role === "dispatcher" ? "Dispatcher" : "Chauffeur"}
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="sidebar-link w-full">
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}
