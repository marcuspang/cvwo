/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["i.pravatar.cc"],
  },
  env: {
    BACKEND_URL: process.env.BACKEND_URL,
  },
};
