/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30, // Kembali ke nilai default
    },
  },
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
      },
    ],
  },
  rewrites: () => {
    return [
      {
        source: "/hashtag/:tag",
        destination: "/search?q=%23:tag",
      },
    ];
  },
  // Konfigurasi dasar
  poweredByHeader: false,
  compress: true,
};

export default nextConfig;
