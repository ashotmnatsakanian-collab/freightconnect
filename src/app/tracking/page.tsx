"use client";
import { useEffect, useState, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { MapPin, RefreshCw, Navigation } from "lucide-react";

interface DriverWithPosition {
  id: string;
  firstName: string;
  lastName: string;
  positions: { latitude: number; longitude: number; city: string | null; createdAt: string }[];
  missionsAsDriver: { id: string; deliveryCity: string; status: string }[];
}

export default function TrackingPage() {
  const { user } = useAuthStore();
  const [drivers, setDrivers] = useState<DriverWithPosition[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletRef = useRef<unknown>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    const data = await api.get<DriverWithPosition[]>("/api/tracking");
    setDrivers(data);
    setLoading(false);
  }

  useEffect(() => {
    if (loading || !mapRef.current || mapLoaded) return;

    import("leaflet").then((L) => {
      if (!mapRef.current) return;

      // Fix leaflet icon URLs
      const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
      const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";
      L.default.Icon.Default.mergeOptions({ iconUrl, shadowUrl, iconRetinaUrl: iconUrl });

      const map = L.default.map(mapRef.current).setView([46.6, 2.33], 6);
      L.default.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
      }).addTo(map);

      const driverIcon = L.default.divIcon({
        className: "",
        html: `<div style="background:#f97316;color:white;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font-size:18px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);">🚛</div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      drivers.forEach((d) => {
        const pos = d.positions[0];
        if (!pos) return;
        const mission = d.missionsAsDriver[0];
        L.default.marker([pos.latitude, pos.longitude], { icon: driverIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family:sans-serif;min-width:160px">
              <strong style="color:#1e3a5f">${d.firstName} ${d.lastName}</strong><br/>
              <span style="color:#64748b;font-size:12px">📍 ${pos.city || "Position inconnue"}</span><br/>
              ${mission ? `<span style="color:#f97316;font-size:12px">→ ${mission.deliveryCity}</span>` : ""}
            </div>
          `);
      });

      leafletRef.current = map;
      setMapLoaded(true);
    });

    return () => {
      if (leafletRef.current) {
        (leafletRef.current as { remove: () => void }).remove();
        leafletRef.current = null;
        setMapLoaded(false);
      }
    };
  }, [loading, drivers]);

  const activeDrivers = drivers.filter((d) => d.positions.length > 0);

  return (
    <AppShell title="Suivi GPS de la flotte">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-slate-500 text-sm">
            {activeDrivers.length} chauffeur(s) avec position connue sur {drivers.length} au total
          </p>
          <button className="btn-secondary text-sm" onClick={load}>
            <RefreshCw className="w-4 h-4" /> Actualiser
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Drivers list */}
          <div className="card lg:col-span-1 space-y-2">
            <h2 className="font-bold text-slate-700 mb-3">Chauffeurs</h2>
            {drivers.map((d) => {
              const pos = d.positions[0];
              const mission = d.missionsAsDriver[0];
              return (
                <div key={d.id} className="p-3 rounded-lg border border-slate-100 hover:border-orange-200 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: pos ? "#10b981" : "#94a3b8" }}>
                      {d.firstName[0]}{d.lastName[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-700 text-sm">{d.firstName} {d.lastName}</div>
                      <div className="text-xs text-slate-400">
                        {pos ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {pos.city || "Position GPS"}
                          </span>
                        ) : (
                          <span className="text-slate-400">Position inconnue</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {mission && (
                    <div className="text-xs text-orange-500 flex items-center gap-1 mt-1">
                      <Navigation className="w-3 h-3" />
                      En route → {mission.deliveryCity}
                    </div>
                  )}
                  {!mission && (
                    <div className="text-xs text-slate-400 mt-1">Aucune mission en cours</div>
                  )}
                </div>
              );
            })}
            {drivers.length === 0 && !loading && (
              <div className="text-slate-400 text-sm text-center py-4">Aucun chauffeur</div>
            )}
          </div>

          {/* Map */}
          <div className="card lg:col-span-3 p-0 overflow-hidden" style={{ height: "500px" }}>
            <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
            {loading ? (
              <div className="h-full flex items-center justify-center text-slate-400">
                Chargement de la carte...
              </div>
            ) : (
              <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
            )}
          </div>
        </div>

        {/* Position update for drivers */}
        {user?.role === "driver" && <DriverPositionUpdate onUpdated={load} />}
      </div>
    </AppShell>
  );
}

function DriverPositionUpdate({ onUpdated }: { onUpdated: () => void }) {
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function updateManually() {
    if (!city.trim()) return;
    setLoading(true);
    await api.post("/api/tracking", {
      latitude: 48.856,
      longitude: 2.352,
      city,
      address: city,
    });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    setCity("");
    onUpdated();
    setLoading(false);
  }

  function useGPS() {
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await api.post("/api/tracking", {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          city: "Position GPS",
        });
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        onUpdated();
        setGeoLoading(false);
      },
      () => setGeoLoading(false)
    );
  }

  return (
    <div className="card">
      <h2 className="font-bold text-slate-700 mb-4">Mettre à jour ma position</h2>
      {success && (
        <div className="mb-3 p-3 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
          ✓ Position mise à jour avec succès !
        </div>
      )}
      <div className="flex gap-3">
        <input
          className="input flex-1"
          placeholder="Entrez votre ville actuelle..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && updateManually()}
        />
        <button className="btn-primary" onClick={updateManually} disabled={loading || !city.trim()}>
          <MapPin className="w-4 h-4" />
          {loading ? "..." : "Je suis à..."}
        </button>
        <button className="btn-secondary" onClick={useGPS} disabled={geoLoading}>
          <Navigation className="w-4 h-4" />
          {geoLoading ? "GPS..." : "GPS Auto"}
        </button>
      </div>
    </div>
  );
}
