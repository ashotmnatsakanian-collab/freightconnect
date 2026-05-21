"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => { router.replace("/dashboard"); }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#1B3A5C" }}>
      <div className="text-white text-center">
        <div className="text-3xl font-bold mb-2" style={{ color: "#C9A84C" }}>✦ Kepler</div>
        <div style={{ color: "#94A3B8", fontSize: "0.875rem" }}>Chargement…</div>
      </div>
    </div>
  );
}
