/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  basePath: process.env.NEXT_BASE_PATH ?? "/admin",
}

export default nextConfig
