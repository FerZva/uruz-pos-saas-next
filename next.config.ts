import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "uruzpos.s3.us-east-2.amazonaws.com",
    ], // Agrega el dominio aquí
  },
};

export default nextConfig;
