import { FastifyReply, FastifyRequest } from "fastify";
import { JwtPayload } from "fastify-jwt";

declare module "fastify" {
 interface FastifyRequest {
 jwtVerify(): Promise<FastifyJWT.VerifiedReturnType>;
 }
}

import { sendError } from "../lib/response";
import { Role } from "../types";

interface AuthenticatedRequest extends FastifyRequest {
 user: JwtPayload;
}

/**
 * Require a valid JWT. Attaches `request.user` with agency-scoped claims.
 */
export async function requireAuth(
 request: FastifyRequest,
 reply: FastifyReply
): Promise<void> {
 try {
 await request.jwtVerify();
 const req = request as AuthenticatedRequest;
 // jwtVerify populates request.user automatically via Fastify decorator
 if (!req.user) {
 sendError(reply, "Unauthorized", 401, "Invalid token payload");
 }
 } catch {
 sendError(reply, "Unauthorized", 401, "Invalid or expired token");
 }
}

/**
 * Require OWNER or ADMIN role.
 */
export function requireAdmin(
 request: FastifyRequest,
 reply: FastifyReply
): void {
 const user = (request as unknown as AuthenticatedRequest).user;
 if (!user) {
 sendError(reply, "Unauthorized", 401);
 return;
 }
 if (user.role !== ("OWNER" as Role) && user.role !== ("ADMIN" as Role)) {
 sendError(reply, "Forbidden", 403, "Admin access required");
 }
}

/**
 * Require OWNER role.
 */
export function requireOwner(
 request: FastifyRequest,
 reply: FastifyReply
): void {
 const user = (request as unknown as AuthenticatedRequest).user;
 if (!user) {
 sendError(reply, "Unauthorized", 401);
 return;
 }
 if (user.role !== ("OWNER" as Role)) {
 sendError(reply, "Forbidden", 403, "Owner access required");
 }
}
