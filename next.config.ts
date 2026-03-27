import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "hostel-server-api.onrender.com",  // ← যোগ করো
      },
    ],
  },
};

export default nextConfig;