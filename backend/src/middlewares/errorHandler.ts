import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { logger } from "../monitoring/logger";
import { sendError } from "../lib/response";

/**
 * Global error handler - logs the error and sends a clean response.
 */
export async function errorHandler(
 error: FastifyError,
 request: FastifyRequest,
 reply: FastifyReply
): Promise<void> {
 const statusCode = error.statusCode ?? 500;
 const message = error.message ?? "Internal server error";

 // Log full error in development, minimal in production
 if (statusCode >= 500) {
 logger.error(
 {
 err: error,
 url: request.url,
 method: request.method,
 params: request.params,
 query: request.query,
 },
 "Unhandled server error"
 );
 } else {
 logger.warn(
 {
 message: error.message,
 url: request.url,
 method: request.method,
 statusCode,
 },
 "Client error"
 );
 }

 // In production, don't leak for 500s
 const publicMessage =
 statusCode >= 500 && process.env.NODE_ENV === "production"
 ? "Something went wrong. Please try again later."
 : message;

 sendError(reply, publicMessage, statusCode, error.validation?.message);
}
