/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@coshub/ui",
    "@coshub/utils",
    "@coshub/types",
    "@coshub/sdk",
  ],
  experimental: {
    externalDir: true,
  },
};

module.exports = nextConfig;
