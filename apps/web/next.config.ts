import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // ADR 0001 D1/D5 and ADR 0002 constraint 6: the frontend must never bundle a
  // database driver or hold database credentials. No server-side data access to
  // PostgreSQL happens here; business data comes from the backend service over HTTP.
};

export default nextConfig;