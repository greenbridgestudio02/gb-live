import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "easymidi",
    "@julusian/midi",
  ],
};

export default nextConfig;