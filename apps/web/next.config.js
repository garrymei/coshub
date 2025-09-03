const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@coshub/ui",
    "@coshub/utils",
    "@coshub/types",
    "@coshub/sdk",
  ],
  // 允许从 monorepo 外部导入（如 packages/*）
  experimental: {
    externalDir: true,
  },
  // 依赖 Next 对 transpilePackages 的处理，不再强制 alias 到 src
};

module.exports = nextConfig;
