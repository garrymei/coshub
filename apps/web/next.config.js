/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@coshub/ui', '@coshub/utils'],
}

module.exports = nextConfig
