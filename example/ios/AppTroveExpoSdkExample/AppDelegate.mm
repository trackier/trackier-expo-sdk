#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"AppTroveExpoSdkExample";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  // Use localhost for iOS simulator (works better than 127.0.0.1)
  // For physical devices, you may need to use your machine's IP address
  NSString *bundlePath = @"http://localhost:8081/index.bundle?platform=ios&dev=true";
  NSURL *bundleURL = [NSURL URLWithString:bundlePath];
  NSLog(@"🔗 Bundle URL: %@", bundleURL);
  return bundleURL;
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
