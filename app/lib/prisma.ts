
import { PrismaClient } from '@prisma/client';
import { serverEnv } from '../../env.mjs'; 

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: serverEnv.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error']
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (serverEnv.NODE_ENV !== 'production') globalThis.prisma = prisma;

export { prisma };