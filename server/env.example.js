'use strict';

const path = require('path');

module.exports = {
  PORT: process.env.PORT || 4200,
  HTTPS_DISABLED: !!process.env.HTTPS_DISABLED || false,
  PRIVATE_KEY: process.env.PRIVATE_KEY || "key.pem",
  PUBLIC_KEY: process.env.PUBLIC_KEY || "server.crt",
  BACKEND_URL: process.env.BACKEND_URL || "https://localhost:8087",
  DISTR_PATCH: process.env.DISTR_PATCH || "../distr"
};

module.exports.DISTR_PATCH = path.resolve(module.exports.DISTR_PATCH);