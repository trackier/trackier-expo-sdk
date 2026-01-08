// Polyfills for React Native environment
// This file should be imported first before any other modules

// Window polyfill for dependencies that expect browser environment
// Only set if not already defined to avoid conflicts
if (typeof global !== 'undefined' && typeof global.window === 'undefined') {
  global.window = global;
}
