/** @type {import('next').NextConfig} */

// next.config.js
const removeImports = require('next-remove-imports')();


const nextConfig = {
  reactStrictMode: true,
}

// module.exports = nextConfig
module.exports = removeImports(nextConfig);