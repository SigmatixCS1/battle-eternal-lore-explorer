import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    // Prevent Next.js from inferring a parent workspace root when multiple lockfiles exist.
    // This should point at the actual project root.
    root: path.join(__dirname),
  },
};

export default nextConfig;
