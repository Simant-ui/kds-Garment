import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'xiiyytznaobogpbznqdx.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'ywfyvunybzwjmwcposwi.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'nepalgarments.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      }
    ],
  },
};

export default nextConfig;
