const path = require('path');
const { getDefaultConfig } = require('@react-native/metro-config');
const { getConfig } = require('react-native-builder-bob/metro-config');
const pkg = require('../package.json');

const root = path.resolve(__dirname, '..');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const defaultConfig = getDefaultConfig(__dirname);

const config = getConfig(defaultConfig, {
  root,
  pkg,
  project: __dirname,
});

// Configure resolver to handle window polyfill
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver?.extraNodeModules,
  },
};

// Configure transformer
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Add custom server middleware to handle root route
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Handle root route
      if (req.url === '/' || req.url === '') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            status: 'ok',
            message: 'Metro Bundler is running',
            bundleUrl: '/index.bundle?platform=ios&dev=true',
            instructions:
              'Use /index.bundle?platform=ios&dev=true to get the bundle',
          })
        );
        return;
      }
      // Handle /status endpoint
      if (req.url === '/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', bundler: 'metro' }));
        return;
      }
      // Continue with default middleware
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
