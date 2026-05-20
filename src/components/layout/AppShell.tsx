"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/store";
import { Sidebar } from "./Sidebar";
import { Menu, X, Bell, User } from "lucide-react";
import { api } from "@/lib/api";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
}

export function AppShell({ children, title }: AppShellProps) {
  const router = useRouter();
  const { user, initFromStorage } = useAuthStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);

  const fetchNotifs = useCallback(async () => {
    try {
      const data = await api.get<Notification[]>("/api/notifications");
      setNotifications(data);
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!user) return;
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000);
    return () => clearInterval(interval);
  }, [user, fetchNotifs]);

  async function markAllRead() {
    await api.patch("/api/notifications", {}).catch(() => {});
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          {title && (
            <h1 className="text-lg font-bold" style={{ color: "#1e3a5f" }}>{title}</h1>
          )}
          <div className="ml-auto flex items-center gap-2">
            {/* Notification bell */}
            <div className="relative">
              <button className="btn-ghost p-2 relative" onClick={() => { setShowNotifs((v) => !v); if (!showNotifs && unreadCount > 0) markAllRead(); }}>
                <Bell className="w-5 h-5 text-slate-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-white text-xs font-bold flex items-center justify-center"
                    style={{ background: "#f97316", fontSize: "10px" }}>
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
              {showNotifs && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-bold text-slate-700">Notifications</span>
                    <button className="text-xs text-slate-400 hover:text-slate-600" onClick={markAllRead}>Tout marquer lu</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-sm">Aucune notification</div>
                    ) : (
                      notifications.map((n) => (
                        <div key={n.id} className={`px-4 py-3 border-b border-slate-50 ${!n.read ? "bg-orange-50" : ""}`}>
                          <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: !n.read ? "#f97316" : "#cbd5e1" }} />
                            <div>
                              <div className="text-sm font-semibold text-slate-700">{n.title}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{n.body}</div>
                              <div className="text-xs text-slate-400 mt-1">{format(new Date(n.createdAt), "d MMM HH:mm", { locale: fr })}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Profile link */}
            <Link href="/profile" className="btn-ghost p-2">
              <User className="w-5 h-5 text-slate-500" />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Mobile close */}
      {mobileOpen && (
        <button
          className="fixed top-4 right-4 z-50 md:hidden bg-white rounded-full p-2 shadow"
          onClick={() => setMobileOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
