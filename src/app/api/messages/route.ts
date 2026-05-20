import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, isResponse } from "@/lib/middleware";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (isResponse(auth)) return auth;

  const { searchParams } = new URL(req.url);
  const withUserId = searchParams.get("with");

  if (withUserId) {
    // Conversation between two users
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: auth.userId, receiverId: withUserId },
          { senderId: withUserId, receiverId: auth.userId },
        ],
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    // Mark received messages as read
    await prisma.message.updateMany({
      where: { senderId: withUserId, receiverId: auth.userId, read: false },
      data: { read: true },
    });

    return NextResponse.json(messages);
  }

  // Get all conversations (last message per contact)
  const sent = await prisma.message.findMany({
    where: { senderId: auth.userId },
    include: { receiver: { select: { id: true, firstName: true, lastName: true, role: true } } },
    orderBy: { createdAt: "desc" },
  });

  const received = await prisma.message.findMany({
    where: { receiverId: auth.userId },
    include: { sender: { select: { id: true, firstName: true, lastName: true, role: true } } },
    orderBy: { createdAt: "desc" },
  });

  // Build unique conversation list
  const contactMap = new Map<string, { contact: { id: string; firstName: string; lastName: string; role: string }; lastMessage: string; lastAt: string; unread: number }>();

  for (const m of sent) {
    const key = m.receiver.id;
    if (!contactMap.has(key)) {
      contactMap.set(key, { contact: m.receiver, lastMessage: m.content, lastAt: m.createdAt.toISOString(), unread: 0 });
    }
  }

  for (const m of received) {
    const key = m.sender.id;
    const existing = contactMap.get(key);
    const unreadIncr = m.read ? 0 : 1;
    if (!existing || new Date(m.createdAt) > new Date(existing.lastAt)) {
      contactMap.set(key, {
        contact: m.sender,
        lastMessage: m.content,
        lastAt: m.createdAt.toISOString(),
        unread: (existing?.unread ?? 0) + unreadIncr,
      });
    } else if (!m.read) {
      existing.unread += 1;
    }
  }

  return NextResponse.json(Array.from(contactMap.values()).sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime()));
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (isResponse(auth)) return auth;

  const { receiverId, content } = await req.json();
  if (!receiverId || !content?.trim()) {
    return NextResponse.json({ error: "Destinataire et message requis" }, { status: 400 });
  }

  const message = await prisma.message.create({
    data: { senderId: auth.userId, receiverId, content: content.trim() },
    include: { sender: { select: { id: true, firstName: true, lastName: true, role: true } } },
  });

  return NextResponse.json(message, { status: 201 });
}
