/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["picsum.photos", "res.cloudinary.com"],
    },
    async rewrites() {
        return [
          {
            source: "/umami.js",
            destination: `${process.env.UMAMI_URL}/script.js`,
          },
          {
            source: "/api/send",
            destination: `${process.env.UMAMI_URL}/api/send`,
          },
        ];
    }
};

export default nextConfig;
