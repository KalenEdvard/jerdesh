import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  generateBuildId: async () => `build-${Date.now()}`,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              // framer-motion требует unsafe-eval
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              // Supabase storage для загрузки/показа файлов
              "img-src 'self' blob: data: https://*.supabase.co",
              // Supabase API + realtime
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
              "font-src 'self'",
              "object-src 'none'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
