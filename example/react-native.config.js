const path = require('path');
const pkg = require('../package.json');

module.exports = {
  project: {
    ios: {
      sourceDir: path.join(__dirname, 'ios'),
      podfile: path.join(__dirname, 'ios', 'Podfile'),
      project: path.join(__dirname, 'ios', 'AppTroveExpoSdkExample.xcodeproj'),
    },
    android: {
      sourceDir: path.join(__dirname, 'android'),
      packageName: 'apptroveexposdk.example',
    },
  },
  dependencies: {
    [pkg.name]: {
      root: path.join(__dirname, '..'),
    },
  },
};
