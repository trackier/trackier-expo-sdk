// Set up window polyfill FIRST before any imports
// This must run before any module that might access window
(function () {
  'use strict';
  if (typeof global !== 'undefined' && typeof global.window === 'undefined') {
    try {
      global.window = global;
    } catch (e) {
      // Silently fail if we can't set window
    }
  }
})();

import { AppRegistry } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
