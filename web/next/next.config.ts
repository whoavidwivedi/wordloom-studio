import path from "node:path"
import { fileURLToPath } from "node:url"

import type { NextConfig } from "next"

// The monorepo root (two levels up). Pinned so Turbopack doesn't guess a parent
// folder when this checkout sits inside another one (e.g. a git worktree), which
// breaks file watching and hot reload.
const monorepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  turbopack: {
    root: monorepoRoot,
  },
  experimental: {
    // Rewrite barrel imports to per-icon modules so only used icons ship.
    optimizePackageImports: ["lucide-react", "radix-ui"],
  },
}

export default nextConfig
