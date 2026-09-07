import { JwtPayload } from "../types";

declare module "fastify-jwt" {
 interface FastifyJWT {
 payload: JwtPayload;
 }
}

export function extractAgencyUser(
 request: FastifyJWT.VerifiedReturnType
): JwtPayload {
 return request.user;
}
