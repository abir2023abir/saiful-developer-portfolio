import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Uploads land on Vercel Blob when STORAGE=blob, so next/image has to trust it.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  // content/ is read through a path built at runtime, which Next's file tracing
  // cannot follow — without this it is absent from the deployed function and
  // every page silently falls back to the bundled seed.
  outputFileTracingIncludes: {
    "/**": ["./content/**"],
  },
};

export default nextConfig;
