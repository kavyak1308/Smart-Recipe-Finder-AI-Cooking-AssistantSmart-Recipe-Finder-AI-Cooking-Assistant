import type { NextConfig } from "next";

const allowedDevOrigins = [
  "localhost",
  "127.0.0.1",
  "*.run.app",
  "**.run.app",
  "*.asia-northeast1.run.app",
  "*.us-central1.run.app",
  "*.us-west1.run.app",
  "*.europe-west1.run.app",
];

if (process.env.APP_URL) {
  try {
    const appHost = new URL(process.env.APP_URL).hostname;
    if (appHost && !allowedDevOrigins.includes(appHost)) {
      allowedDevOrigins.push(appHost);
    }
  } catch {
    // Ignore malformed APP_URL
  }
}

const nextConfig: NextConfig = {
  allowedDevOrigins,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
