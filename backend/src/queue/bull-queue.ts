import { Queue, Worker } from "bullmq";
import { redis } from "../lib/redis";

// ── Queue names ──────────────────────────────────────────────────────────────

export const QUEUE_NAMES = {
 SYNC: "sync-queue",
 REPORT: "report-queue",
 WEBHOOK: "webhook-queue",
} as const;

// ── Queue instances ─────────────────────────────────────────────────────────

export class BullQueue {
 static syncQueue: Queue;
 static reportQueue: Queue;
 static webhookQueue: Queue;

 static init() {
 BullQueue.syncQueue = new Queue(QUEUE_NAMES.SYNC, {
 connection: redis,
 defaultJobOptions: {
 attempts: 3,
 backoff: {
 type: "exponential",
 delay: 5000, // 5s, 25s, 125s
 },
 removeOnComplete: {
 count: 100,
 age: 24 * 3600, // Keep last 100 completed for 24h
 },
 removeOnFail: {
 age: 7 * 24 * 3600, // Keep failed jobs for 7 days
 },
 });
 }

 static reportQueue = new Queue(QUEUE_NAMES.REPORT, {
 connection: redis,
 defaultJobOptions: {
 attempts: 2,
 backoff: {
 type: "fixed",
 delay: 10000,
 },
 removeOnComplete: {
 count: 50,
 age: 7 * 24 * 3600,
 },
 removeOnFail: { age: 7 * 24 * 3600 },
 },
 });

 static webhookQueue = new Queue(QUEUE_NAMES.WEBHOOK, {
 connection: redis,
 defaultJobOptions: {
 attempts: 5,
 backoff: {
 type: "exponential",
 delay: 2000,
 },
 removeOnComplete: { count: 200, age: 24 * 3600 },
 removeOnFail: { age: 24 * 3600 },
 },
 });
}
