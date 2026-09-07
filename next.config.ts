import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Uploads land on Vercel Blob when STORAGE=blob, so next/image has to trust it.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
