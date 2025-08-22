// src/env.mjs
import { z } from 'zod';

// Server-side schema
export const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
});

// Client-side schema
export const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

// Create separate validated objects
export const serverEnv = serverSchema.parse(
  typeof window === 'undefined' ? process.env : {}
);

export const clientEnv = clientSchema.parse(
  typeof window !== 'undefined' ? process.env : {}
);

export const env = {
  ...(typeof window === 'undefined'
    ? serverSchema.parse(process.env)
    : clientSchema.parse(process.env)),
};