import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prisma's native client must not be bundled by webpack/turbopack
  serverExternalPackages: ["@prisma/client", ".prisma", ".prisma/client"],

  // Allow images from S3 and CloudFront
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.ap-south-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
