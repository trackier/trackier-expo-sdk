const { withAppBuildGradle, withDangerousMod, withAndroidManifest } = require('@expo/config-plugins');
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

function withTrackierAndroidQueries(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    if (!androidManifest.manifest.queries) {
      androidManifest.manifest.queries = [];
    }

    const packagesToAdd = [
      'com.facebook.katana',
      'com.facebook.lite',
      'com.instagram.android',
    ];

    let existingPackages = [];
    if (Array.isArray(androidManifest.manifest.queries)) {
      androidManifest.manifest.queries.forEach(query => {
        if (query.package && Array.isArray(query.package)) {
          query.package.forEach(pkg => {
            if (pkg.$ && pkg.$['android:name']) {
              existingPackages.push(pkg.$['android:name']);
            }
          });
        }
      });
    }

    const newPackages = packagesToAdd.filter(p => !existingPackages.includes(p));

    if (newPackages.length > 0) {
      let queriesTag = androidManifest.manifest.queries.find(q => q.package);
      if (!queriesTag) {
        queriesTag = { package: [] };
        androidManifest.manifest.queries.push(queriesTag);
      }

      if (!queriesTag.package) {
        queriesTag.package = [];
      }

      newPackages.forEach(pkgName => {
        queriesTag.package.push({
          $: { 'android:name': pkgName }
        });
      });
    }

    return config;
  });
}

// function withTrackierIOS(config) {
//   return withDangerousMod(config, [
//     'ios',
//     async (config) => {
//       const podfilePath = path.join(
//         config.modRequest.platformProjectRoot,
//         'Podfile'
//       );

//       let podfile = fs.readFileSync(podfilePath, 'utf-8');

//       if (!podfile.includes("pod 'TrackierSDK'")) {
//         podfile += `\npod 'TrackierSDK'\n`;
//         fs.writeFileSync(podfilePath, podfile);
//       }

//       return config;
//     },
//   ]);
// }

module.exports = function withTrackier(config) {
  config = withTrackierAndroid(config);
  config = withTrackierAndroidQueries(config);
  //config = withTrackierIOS(config);
  return config;
};
