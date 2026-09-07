import { FastifyReply } from "fastify";
import { ApiResponse, PaginatedResult } from "../types";

/**
 * Send a standardised success response.
 */
export function sendSuccess<T>(
 reply: FastifyReply,
 data?: T,
 statusCode = 200,
 message?: string
): FastifyReply {
 const response: ApiResponse<T> = {
 success: true,
 data,
 message,
 };
 return reply.status(statusCode).send(response);
}

/**
 * Send a standardised error response.
 */
export function sendError(
 reply: FastifyReply,
 error: string,
 statusCode = 500,
 message?: string
): FastifyReply {
 const response: ApiResponse = {
 success: false,
 error,
 message,
 };
 return reply.status(statusCode).send(response);
}

/**
 * Send a paginated response.
 */
export function sendPaginated<T>(
 reply: FastifyReply,
 result: PaginatedResult<T>,
 message?: string
): FastifyReply {
 return sendSuccess(reply, result, 200, message);
}
