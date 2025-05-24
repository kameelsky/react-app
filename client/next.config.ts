import type { NextConfig } from "next";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const nextConfig: NextConfig = {
    allowedDevOrigins: ["10.20.1.194"],
    env: {
        SECRET_KEY: process.env.SECRET_KEY,
        PRODUCTION: process.env.PRODUCTION,
        PRODUCTION_SERVER: process.env.PRODUCTION_SERVER,
    },
};

export default nextConfig;
