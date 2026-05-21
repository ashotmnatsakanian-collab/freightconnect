import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Lumio seed — database ready.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
