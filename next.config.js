const path = require('path');
require('dotenv').config();

module.exports = {
  env: {
    API_BRAND: "https://mocchi-brand-be.herokuapp.com",
  },
  webpack: (config) => {
    config.resolve.alias['components'] = path.join(__dirname, 'components');
    config.resolve.alias['styles'] = path.join(__dirname, 'styles');
    config.resolve.alias['public'] = path.join(__dirname, 'public');

    return config;
  },
};