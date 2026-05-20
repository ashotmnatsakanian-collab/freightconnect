"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store";

export default function Home() {
  const router = useRouter();
  const { user, initFromStorage } = useAuthStore();

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#1e3a5f" }}>
      <div className="text-white text-center">
        <div className="text-4xl font-bold mb-2">🚛 FreightConnect</div>
        <div style={{ color: "#93c5fd" }}>Chargement...</div>
      </div>
    </div>
  );
}
