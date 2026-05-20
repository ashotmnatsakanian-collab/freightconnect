"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/store";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Send, MessageCircle, Users } from "lucide-react";

interface Conversation {
  contact: { id: string; firstName: string; lastName: string; role: string };
  lastMessage: string;
  lastAt: string;
  unread: number;
}

interface Message {
  id: string;
  content: string;
  createdAt: string;
  sender: { id: string; firstName: string; lastName: string; role: string };
}

interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

const ROLE_LABEL: Record<string, string> = {
  admin: "Admin", dispatcher: "Dispatcher", driver: "Chauffeur",
};

export default function MessagesPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeContact, setActiveContact] = useState<{ id: string; firstName: string; lastName: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showContacts, setShowContacts] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadConversations = useCallback(async () => {
    const data = await api.get<Conversation[]>("/api/messages");
    setConversations(data);
  }, []);

  const loadMessages = useCallback(async (contactId: string) => {
    const data = await api.get<Message[]>(`/api/messages?with=${contactId}`);
    setMessages(data);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  }, []);

  useEffect(() => {
    loadConversations();
    api.get<Driver[]>("/api/drivers").then(setDrivers).catch(() => {});
  }, [loadConversations]);

  useEffect(() => {
    if (!activeContact) return;
    loadMessages(activeContact.id);
    const interval = setInterval(() => loadMessages(activeContact.id), 5000);
    return () => clearInterval(interval);
  }, [activeContact, loadMessages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !activeContact) return;
    setSending(true);
    await api.post("/api/messages", { receiverId: activeContact.id, content: text });
    setText("");
    loadMessages(activeContact.id);
    loadConversations();
    setSending(false);
  }

  function selectContact(c: { id: string; firstName: string; lastName: string }) {
    setActiveContact(c);
    setShowContacts(false);
    setMessages([]);
  }

  const allContacts = [
    ...drivers,
    ...conversations
      .map((c) => c.contact)
      .filter((c) => !drivers.find((d) => d.id === c.id) && c.id !== user?.id),
  ].filter((c) => c.id !== user?.id);

  const uniqueContacts = allContacts.filter((c, i, self) => self.findIndex((x) => x.id === c.id) === i);

  return (
    <AppShell title="Messagerie">
      <div className="flex gap-4 h-[calc(100vh-140px)] min-h-96">

        {/* Sidebar conversations */}
        <div className="w-72 flex-shrink-0 flex flex-col card p-0 overflow-hidden">
          <div className="p-4 border-b border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-slate-700">Conversations</h2>
              <button className="btn-ghost text-xs p-1.5" onClick={() => setShowContacts((v) => !v)} title="Nouvelle conversation">
                <Users className="w-4 h-4" />
              </button>
            </div>
            {/* Nouveau contact */}
            {showContacts && (
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="px-3 py-2 bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                  Démarrer une conversation
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {uniqueContacts.length === 0 ? (
                    <div className="px-3 py-3 text-sm text-slate-400">Aucun contact disponible</div>
                  ) : (
                    uniqueContacts.map((c) => (
                      <button key={c.id} onClick={() => selectContact(c)}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-left border-b border-slate-100 last:border-0">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                          style={{ background: "#1e3a5f" }}>
                          {c.firstName[0]}{c.lastName[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-700">{c.firstName} {c.lastName}</div>
                          <div className="text-xs text-slate-400">{ROLE_LABEL[c.role] ?? c.role}</div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Liste conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 p-4 text-center">
                <MessageCircle className="w-8 h-8 mb-2" />
                <div className="text-sm">Aucune conversation</div>
                <div className="text-xs mt-1">Cliquez sur l'icône contacts pour commencer</div>
              </div>
            ) : (
              conversations.map((c) => (
                <button key={c.contact.id}
                  onClick={() => selectContact(c.contact)}
                  className={`w-full flex items-center gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 text-left transition-colors ${activeContact?.id === c.contact.id ? "bg-orange-50 border-l-2 border-l-orange-400" : ""}`}>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                      style={{ background: activeContact?.id === c.contact.id ? "#f97316" : "#1e3a5f" }}>
                      {c.contact.firstName[0]}{c.contact.lastName[0]}
                    </div>
                    {c.unread > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: "#f97316" }}>
                        {c.unread}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 text-sm truncate">
                        {c.contact.firstName} {c.contact.lastName}
                      </span>
                      <span className="text-xs text-slate-400 flex-shrink-0 ml-1">
                        {format(new Date(c.lastAt), "HH:mm", { locale: fr })}
                      </span>
                    </div>
                    <div className={`text-xs truncate mt-0.5 ${c.unread > 0 ? "font-semibold text-slate-700" : "text-slate-400"}`}>
                      {c.lastMessage}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Zone de chat */}
        <div className="flex-1 flex flex-col card p-0 overflow-hidden">
          {!activeContact ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
              <MessageCircle className="w-16 h-16 mb-4 opacity-40" />
              <div className="font-semibold text-lg text-slate-400">Sélectionnez une conversation</div>
              <div className="text-sm mt-1 text-slate-300">ou démarrez-en une nouvelle avec vos chauffeurs</div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3"
                style={{ background: "#f8fafc" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ background: "#f97316" }}>
                  {activeContact.firstName[0]}{activeContact.lastName[0]}
                </div>
                <div>
                  <div className="font-bold text-slate-700">{activeContact.firstName} {activeContact.lastName}</div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center text-slate-300 text-sm py-8">
                    Démarrez la conversation 👋
                  </div>
                )}
                {messages.map((m) => {
                  const mine = m.sender.id === user?.id;
                  return (
                    <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xs lg:max-w-md xl:max-w-lg`}>
                        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${mine
                          ? "text-white rounded-br-sm"
                          : "bg-white border border-slate-200 text-slate-700 rounded-bl-sm"}`}
                          style={mine ? { background: "#1e3a5f" } : {}}>
                          {m.content}
                        </div>
                        <div className={`text-xs text-slate-400 mt-1 ${mine ? "text-right" : "text-left"}`}>
                          {format(new Date(m.createdAt), "HH:mm", { locale: fr })}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form onSubmit={sendMessage} className="border-t border-slate-100 p-3 flex gap-2">
                <input
                  className="input flex-1"
                  placeholder="Écrire un message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  autoComplete="off"
                />
                <button type="submit" className="btn-primary px-4" disabled={sending || !text.trim()}>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </AppShell>
  );
}
