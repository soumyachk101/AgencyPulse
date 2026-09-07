import { FastifyReply, FastifyRequest } from "fastify";
import bcrypt from "bcrypt";
import { z } from "zod";
import jwt from "@fastify/jwt";
import { prisma } from "../lib/prisma";
import { Role } from "@prisma/client";
import { sendSuccess, sendError } from "../lib/response";

// ── Schemas ───────────────────────────────────────────────────────────────────

const signupSchema = z.object({
 email: z.string().email(),
 password: z.string().min(8),
 name: z.string().optional(),
 agencyName: z.string().min(1),
 slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/),
});

const loginSchema = z.object({
 email: z.string().email(),
 password: z.string(),
});

// ── Auth routes ───────────────────────────────────────────────────────────────

export async function authRoutes(fastify: ReturnType<typeof import("fastify")>) {
 // Register JWT plugin
 await fastify.register(jwt, {
 secret: process.env.JWT_SECRET ?? "fallback-secret-change-in-production",
 sign: {
 expiresIn: process.env.JWT_EXPIRY ?? "7d",
 },
 });

 /**
 * POST /api/auth/signup
 * Create agency + owner user atomically.
 */
 fastify.post<{
 Body: z.infer<typeof signupSchema>;
 Reply: { success: boolean; data?: { userId: string; agencyId: string; email: string; token: string }; error?: string };
 }>("/signup", async (request, reply) => {
 try {
 const body = signupSchema.parse(request.body);

 // Check slug uniqueness
 const existingAgency = await prisma.agency.findUnique({
 where: { slug: body.slug },
 });
 if (existingAgency) {
 return sendError(reply, "Agency slug already taken", 409);
 }

 // Check email uniqueness
 const existingUser = await prisma.user.findUnique({
 where: { email: body.email },
 });
 if (existingUser) {
 return sendError(reply, "Email already registered", 409);
 }

 const hashedPassword = await bcrypt.hash(body.password, 10);

 // Create agency + owner user atomically
 const { agency, owner } = await prisma.$transaction(async (tx) => {
 const newAgency = await tx.agency.create({
 data: {
 name: body.agencyName,
 slug: body.slug,
 ownerId: "placeholder", // Updated below
 },
 });

 const owner = await tx.user.create({
 data: {
 email: body.email,
 password: hashedPassword,
 name: body.name,
 agencyId: newAgency.id,
 role: "OWNER",
 },
 });

 await tx.agency.update({
 where: { id: newAgency.id },
 data: { ownerId: owner.id },
 });

 return { agency: newAgency, owner };
 });

 const token = reply.jwtSign({
 userId: owner.id,
 email: owner.email,
 role: owner.role,
 agencyId: agency.id,
 });

 return sendSuccess(reply, {
 userId: owner.id,
 agencyId: agency.id,
 email: owner.email,
 token,
 });
 } catch (err) {
 if (err instanceof z.ZodError) {
 const messages = err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ");
 return sendError(reply, "Validation failed", 400, messages);
 }
 return sendError(reply, "Signup failed", 500, err instanceof Error ? err.message : "Unknown error");
 }
 });

 /**
 * POST /api/auth/login
 */
 fastify.post<{
 Body: z.infer<typeof loginSchema>;
 Reply: { success: boolean; data?: { userId: string; agencyId: string; email: string; role: string; token: string }; error?: string };
 }>("/login", async (request, reply) => {
 try {
 const { email, password } = loginSchema.parse(request.body);

 const user = await prisma.user.findUnique({
 where: { email },
 });

 if (!user || !user.password) {
 return sendError(reply, "Invalid credentials", 401);
 }

 const valid = await bcrypt.compare(password, user.password);
 if (!valid) {
 return sendError(reply, "Invalid credentials", 401);
 }

 const token = reply.jwtSign({
 userId: user.id,
 email: user.email,
 role: user.role,
 agencyId: user.agencyId,
 });

 return sendSuccess(reply, {
 userId: user.id,
 agencyId: user.agencyId,
 email: user.email,
 role: user.role,
 token,
 });
 } catch (err) {
 if (err instanceof z.ZodError) {
 return sendError(reply, "Validation failed", 400);
 }
 return sendError(reply, "Login failed", 500, err instanceof Error ? err.message : "Unknown error");
 }
 });

 /**
 * POST /api/auth/session
 * Verify token and return user info.
 */
 fastify.get("/session", { onRequest: [fastify.authenticate] }, async (request, reply) => {
 try {
 const payload = request.user as {
 userId: string;
 email: string;
 role: Role;
 agencyId: string;
 };

 const user = await prisma.user.findUnique({
 where: { id: payload.userId },
 select: { id: true, email: true, name: true, role: true, agencyId: true, createdAt: true },
 });

 if (!user) {
 return sendError(reply, "User not found", 404);
 }

 return sendSuccess(reply, user);
 } catch {
 return sendError(reply, "Session invalid", 401);
 }
 });

 /**
 * GET /api/auth/me
 */
 fastify.get("/me", { onRequest: [fastify.authenticate] }, async (request, reply) => {
 try {
 const payload = request.user as { userId: string };

 const user = await prisma.user.findUnique({
 where: { id: payload.userId },
 select: {
 id: true,
 email: true,
 name: true,
 role: true,
 agencyId: true,
 createdAt: true,
 },
 });

 if (!user) {
 return sendError(reply, "User not found", 404);
 }

 return sendSuccess(reply, user);
 } catch {
 return sendError(reply, "Failed to fetch user", 500);
 }
 });
}