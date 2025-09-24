/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn-thumbnail.komiku.org', 'www.sankavollerei.com', 'cdn1.komiku.org', 'komiku.org', 'img.komiku.org'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn-thumbnail.komiku.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.sankavollerei.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn1.komiku.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'komiku.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.komiku.org',
        port: '',
        pathname: '/**',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: false,
  },
  experimental: {
    serverComponentsExternalPackages: ['axios'],
  },
}

module.exports = nextConfig
