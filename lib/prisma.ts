import { PrismaClient } from "@prisma/client";

// Extend the global object to include a custom property for Prisma in TypeScript
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Check if an existing instance of Prisma Client exists in the global scope.
// If it exists, reuse it. Otherwise, create a new instance.
export const prisma =
  globalForPrisma.prisma || // Use the existing instance if it exists
  new PrismaClient({});

// In development mode, attach the Prisma Client instance to the global object.
// This ensures the same instance is reused during hot-reloading.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
