import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [new URL('https://static.ulisesv.com/imgs/**')],
  },
  /* config options here */
};

export default nextConfig;
