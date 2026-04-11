import type { NextConfig } from "next";

const WP_HOSTNAME = (process.env.WP_URL ?? "https://design2wp.in")
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Allow images from WordPress (Hostinger), S3, and CloudFront
  images: {
    remotePatterns: [
      // WordPress uploads (Hostinger)
      {
        protocol: "https",
        hostname: WP_HOSTNAME,
        pathname: "/wp-content/uploads/**",
      },
      // AWS S3
      {
        protocol: "https",
        hostname: "*.s3.ap-south-1.amazonaws.com",
      },
      // CloudFront CDN
      {
        protocol: "https",
        hostname: "*.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
