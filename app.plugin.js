// Expo config plugin entry point
// This file is referenced by app.json/app.config.js:
//   ["outbrain-expo", { androidGmaAppId: "ca-app-pub-..." }]

let plugin;
try {
  plugin = require('./build/plugin/src/index').default;
} catch {
  throw new Error(
    'outbrain-expo: the plugin has not been built yet. Run `npm run build` in the outbrain-expo package directory.'
  );
}

module.exports = plugin;
