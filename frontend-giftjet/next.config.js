const path = require('path');
require('dotenv').config();

module.exports = {
  env: {
    API_URL: "https://strapigift.herokuapp.com",
    API_BRAND: "https://mocchi-brand-be.herokuapp.com",
    API_AFFILIATE: "http://64.225.118.43:8090"
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      require("./scripts/generate-sitemap");
    }

    config.resolve.alias['components'] = path.join(__dirname, 'components');
    config.resolve.alias['styles'] = path.join(__dirname, 'styles');
    config.resolve.alias['public'] = path.join(__dirname, 'public');

    return config;
  },
};
