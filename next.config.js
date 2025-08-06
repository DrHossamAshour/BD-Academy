/** @type {import('next').NextConfig} */
const nextConfig = {
  // App directory is now the default in Next.js 14
  
  // Configure allowed image domains for Same.new AI assets and Vimeo
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ext.same-assets.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.vimeocdn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vumbnail.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.app.goo.gl',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig 