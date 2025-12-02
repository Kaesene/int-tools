/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Desabilitar ESLint durante build de produção
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Desabilitar type checking durante build de produção
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
