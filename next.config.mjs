/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'cloud.appwrite.io', pathname: '/v1/storage/**' },
    ],
  },
  async redirects() {
    return [
      { source: '/revamp', destination: '/', permanent: true },
      { source: '/revamp/:path*', destination: '/:path*', permanent: true },
      { source: '/de/revamp', destination: '/de', permanent: true },
      { source: '/de/revamp/:path*', destination: '/de/:path*', permanent: true },
      { source: '/blog', destination: '/#writing', permanent: true },
      { source: '/blog/:slug', destination: '/writing/:slug', permanent: true },
      { source: '/projects/:slug', destination: '/writing/:slug', permanent: true },
    ];
  },
};

export default nextConfig;
