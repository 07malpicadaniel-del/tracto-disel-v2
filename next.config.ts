import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🔥 Permitimos que Next.js acepte conexiones desde la IP de tu Arch Linux
  allowedDevOrigins: ['192.168.100.46'],
};

export default nextConfig;