import type { NextConfig } from 'next';

// Fully static: `next build` writes plain HTML, CSS, JS and the synced files to out/.
// No API routes, no middleware, no image optimization and nothing that runs per request.
const nextConfig: NextConfig = {
  output: 'export',
  // /projects/x/ is emitted as /projects/x/index.html, which any static host serves.
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
