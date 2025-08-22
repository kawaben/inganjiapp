// src/env.d.ts
import type { z } from 'zod';
import { serverSchema, clientSchema } from './env.mjs';

type ServerEnv = z.infer<typeof serverSchema>;
type ClientEnv = z.infer<typeof clientSchema>;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends ServerEnv, ClientEnv {}
  }
}

export {};