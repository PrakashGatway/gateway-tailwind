/** @type {import('next').NextConfig} */
const nextConfig = {
  
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
    unoptimized: true
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
      {
        source: "/gallary",   // pattern for incoming requests
        destination: "/gallery", // actual Next.js page
      },
      {
        source: "/spoken-english",
        destination: "/course/spoken-english",
      }
    ];
  },
  redirects: async () => [
    {
      source: "/article/hindi-to-english-translation-app",
      destination:
        "/blog-description/hindi-to-english-translation-app",
      permanent: true,
    }
  ]
}

export default nextConfig
