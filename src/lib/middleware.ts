import { NextRequest } from "next/server";
import { verifyToken, TokenPayload } from "./auth";

export function getAuthUser(req: NextRequest): TokenPayload | null {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  return verifyToken(token);
}

export function requireAuth(req: NextRequest, roles?: string[]): TokenPayload | Response {
  const user = getAuthUser(req);
  if (!user) {
    return new Response(JSON.stringify({ error: "Non authentifié" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (roles && !roles.includes(user.role)) {
    return new Response(JSON.stringify({ error: "Accès refusé" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return user;
}

export function isResponse(val: unknown): val is Response {
  return val instanceof Response;
}
