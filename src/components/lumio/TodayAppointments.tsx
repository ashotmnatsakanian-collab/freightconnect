"use client";
import { Clock, ChevronRight, CheckCircle2, Circle } from "lucide-react";
import type { Appointment } from "@/lib/mock-data";

interface Props {
  appointments: Appointment[];
}

const serviceColors: Record<string, { bg: string; text: string }> = {
  "Couleur + Mèches":     { bg: "#FDE68A", text: "#92400E" },
  "Coupe + Brushing":     { bg: "#DDD6FE", text: "#4C1D95" },
  "Soin Kératine":        { bg: "#BBF7D0", text: "#065F46" },
  "Balayage":             { bg: "#FDE68A", text: "#78350F" },
  "Coiffage Événement":   { bg: "#FBCFE8", text: "#9D174D" },
  "Coupe + Barbe":        { bg: "#BFDBFE", text: "#1E40AF" },
  "Coupe":                { bg: "#E0E7FF", text: "#3730A3" },
  "Skin Fade + Beard Design": { bg: "#1C1C1E", text: "#F5F5F0" },
  "Coupe + Taille Barbe": { bg: "#C7D2FE", text: "#312E81" },
  "Rasage Traditionnel":  { bg: "#D1FAE5", text: "#065F46" },
  "Pose Gel Complet":     { bg: "#FBCFE8", text: "#9D174D" },
  "Semi-Permanent":       { bg: "#FDE68A", text: "#92400E" },
  "Manucure Classique":   { bg: "#DDD6FE", text: "#4C1D95" },
  "Nail Art Élaboré":     { bg: "#FCE7F3", text: "#BE185D" },
  "Remplissage Gel":      { bg: "#D1FAE5", text: "#065F46" },
};

function getServiceColor(service: string) {
  return serviceColors[service] ?? { bg: "var(--bg)", text: "var(--text-muted)" };
}

export function TodayAppointments({ appointments }: Props) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return (
    <div className="card animate-fade-up" style={{ animationDelay: "0.15s" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg" style={{ background: "var(--bg)" }}>
            <Clock size={16} style={{ color: "var(--primary)" }} />
          </div>
          <div>
            <h3 className="font-bold text-base" style={{ color: "var(--text)" }}>
              Planning d'aujourd'hui
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {appointments.length} rendez-vous
            </p>
          </div>
        </div>
        <button className="btn-ghost text-xs">Agenda complet</button>
      </div>

      <div className="flex flex-col gap-2">
        {appointments.map((appt, i) => {
          const [h, m] = appt.time.split(":").map(Number);
          const apptMinutes = h * 60 + m;
          const isDone = apptMinutes + appt.duration < nowMinutes;
          const isCurrent = apptMinutes <= nowMinutes && nowMinutes < apptMinutes + appt.duration;
          const sc = getServiceColor(appt.service);

          return (
            <div
              key={appt.id}
              className="flex gap-3 items-start p-3 rounded-xl border transition-all hover:shadow-sm cursor-pointer animate-fade-up"
              style={{
                borderColor: isCurrent ? "var(--primary)" : "var(--border)",
                background: isCurrent ? "var(--bg)" : "transparent",
                animationDelay: `${0.18 + i * 0.06}s`,
                opacity: isDone ? 0.55 : 1,
              }}
            >
              {/* Time column */}
              <div className="flex flex-col items-center gap-1 w-12 shrink-0 pt-0.5">
                <span className="text-xs font-bold" style={{ color: isCurrent ? "var(--primary)" : "var(--text-muted)" }}>
                  {appt.time}
                </span>
                {isDone ? (
                  <CheckCircle2 size={14} className="text-green-500" />
                ) : (
                  <Circle size={14} style={{ color: isCurrent ? "var(--primary)" : "var(--border)" }} />
                )}
              </div>

              {/* Avatar */}
              <div
                className="avatar shrink-0"
                style={{
                  background: isCurrent ? "var(--primary)" : "var(--bg)",
                  color: isCurrent ? "white" : "var(--primary)",
                  fontSize: "0.75rem",
                }}
              >
                {appt.clientAvatar}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                    {appt.clientName}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm" style={{ color: "var(--primary)" }}>
                      {appt.price} €
                    </span>
                    <span
                      className="badge text-xs"
                      style={{ background: sc.bg, color: sc.text }}
                    >
                      {appt.service}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {appt.duration} min
                  </span>
                  {isCurrent && (
                    <span className="ml-1 text-xs px-2 py-0.5 rounded-full font-semibold text-white pulse-dot"
                      style={{ background: "var(--primary)" }}>
                      En cours
                    </span>
                  )}
                </div>

                <div
                  className="mt-1.5 text-xs px-2.5 py-1.5 rounded-lg italic"
                  style={{ background: "var(--bg)", color: "var(--text-muted)" }}
                >
                  {appt.styleNote}
                </div>
              </div>

              <ChevronRight size={16} style={{ color: "var(--border)", marginTop: "0.25rem" }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
