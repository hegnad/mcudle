import { PHASE_PRODUCTION_BUILD } from 'next/constants.js';

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

export default (phase) => {
  if (phase === PHASE_PRODUCTION_BUILD) {
    // Add any additional configuration for the production build phase here
  }

  return nextConfig;
};
