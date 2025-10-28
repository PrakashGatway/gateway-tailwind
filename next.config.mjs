/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-*",
      "react-hook-form",
      "clsx",
      "tailwind-merge",
      "framer-motion",
      "react-slick",
      "react-day-picker",
      "sweetalert2",
      "yet-another-react-lightbox",
      "vaul",
      "keen-slider"],
  },

  compiler: {
    removeConsole: true,
  },

  compress: true,

  reactStrictMode: false,

  trailingSlash: false,

  poweredByHeader: false,

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/study-in-:country",   // pattern for incoming requests
        destination: "/study-in/:country", // actual Next.js page
      },
    ];
  },
}

export default nextConfig
