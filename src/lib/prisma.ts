import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  const authToken = process.env.DATABASE_AUTH_TOKEN;

  const adapter = url?.startsWith("file:")
    ? new PrismaLibSql({ url })
    : url?.startsWith("libsql://")
    ? new PrismaLibSql({ url, authToken })
    : new PrismaLibSql({ url: `file:${path.resolve(process.cwd(), "dev.db")}` });

  return new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };
export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
