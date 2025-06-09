/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  // For GitHub Pages
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : ''
}

module.exports = nextConfig