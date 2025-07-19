/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  eslint: {
    ignoreDuringBuilds: process.env.NEXT_PUBLIC_IGNORE_BUILD_ERROR === "true",
  },
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  webpack: config => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push("pino-pretty", "lokijs", "encoding");
    
    // Add path aliases for webpack
    config.resolve.alias = {
      ...config.resolve.alias,
      "~": __dirname,
    };
    
    return config;
  },
};

module.exports = nextConfig;
