const { PHASE_PRODUCTION_BUILD } = require('next/constants');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = (phase) => {
  if (phase === PHASE_PRODUCTION_BUILD) {
    // Add any additional configuration for the production build phase here
  }

  return nextConfig;
};
