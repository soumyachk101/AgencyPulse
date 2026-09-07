import { PrismaClient } from "@prisma/client";
import { logger } from "../monitoring/logger";

const prisma = new PrismaClient({
 log: [
 {
 emit: "event",
 level: "query",
 },
 {
 emit: "event",
 level: "error",
 },
 {
 emit: "event",
 level: "warn",
 },
 ],
});

// Log slow queries in development
prisma.$on("query", (e: { query: string; duration: number }) => {
 if (process.env.NODE_ENV !== "production") {
 logger.debug(
 {
 query: e.query,
 duration: `${e.duration}ms`,
 },
 "Database query"
 );
 }
});

prisma.$on("error", (e: Error) => {
 logger.error(e, "Prisma error");
});

prisma.$on("warn", (e: { message: string }) => {
 logger.warn(e.message, "Prisma warning");
});

export { prisma };
