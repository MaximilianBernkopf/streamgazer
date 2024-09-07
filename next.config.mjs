/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/streamgazer",
    output: "export",
    reactStrictMode: true,
    distDir: "out",
    images: { "unoptimized": true },
};

export default nextConfig;
