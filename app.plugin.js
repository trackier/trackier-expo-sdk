const { withAppBuildGradle, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

function withTrackierAndroid(config) {
  return withAppBuildGradle(config, (config) => {
    const dep = `implementation "com.google.android.gms:play-services-ads-identifier:18.2.0"`;

    if (!config.modResults.contents.includes('play-services-ads-identifier')) {
      config.modResults.contents = config.modResults.contents.replace(
        /dependencies\s*{/,
        `dependencies {\n    ${dep}`
      );
    }

    return config;
  });
}

function withTrackierIOS(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        'Podfile'
      );

      let podfile = fs.readFileSync(podfilePath, 'utf-8');

      if (!podfile.includes("pod 'TrackierSDK'")) {
        podfile += `\npod 'TrackierSDK'\n`;
        fs.writeFileSync(podfilePath, podfile);
      }

      return config;
    },
  ]);
}

module.exports = function withTrackier(config) {
  config = withTrackierAndroid(config);
  config = withTrackierIOS(config);
  return config;
};
