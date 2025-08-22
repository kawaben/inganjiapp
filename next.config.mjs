
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
  serverExternalPackages: ['@prisma/client', 'bcryptjs']
};

export default nextConfig;