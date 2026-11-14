import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Lint errors should not block production builds; run `next lint` in CI instead.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
