import * as Sentry from "@sentry/node";
import pino from "pino";

/**
 * Sentry error tracking setup.
 * Initialises Sentry if SENTRY_DSN is configured.
 */
export function initSentry(app: unknown): void {
 const dsn = process.env.SENTRY_DSN;

 if (!dsn) {
 console.log("Sentry not configured — skipping initialisation");
 return;
 }

 Sentry.init({
 dsn,
 environment: process.env.NODE_ENV ?? "development",
 tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
 });

 if (typeof app === "object" && app !== null && "addHook" in app) {
 (app as { addHook: (hook: string, handler: (err: Error, req: unknown, res: unknown, next: () => void) => void) => void }).addHook(
 "onError",
 Sentry.Handlers.errorHandler
 );
 }

 console.log("Sentry initialised");
}

/**
 * Retrieve Sentry instance for manual error reporting.
 */
export { Sentry };

/**
 * Logger instance using Pino.
 */
export const logger = pino({
 level: process.env.NODE_ENV === "production" ? "info" : "debug",
});
