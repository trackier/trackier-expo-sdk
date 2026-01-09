#import <React/RCTBridgeModule.h>
#import "React/RCTEventEmitter.h"
#import <React/RCTLog.h>

@interface RCT_EXTERN_MODULE(AppTroveExpoSdk, NSObject)

RCT_EXTERN_METHOD(initializeSDK:(NSDictionary *)dict)

RCT_EXTERN_METHOD(trackEvent:(NSDictionary *)dict)

RCT_EXTERN_METHOD(setEnabled:(BOOL *)value)

RCT_EXTERN_METHOD(setUserId:(NSString *)userId)

RCT_EXTERN_METHOD(setUserEmail:(NSString *)userEmail)

RCT_EXTERN_METHOD(setUserName:(NSString *)userName)

RCT_EXTERN_METHOD(setUserPhone:(NSString *)userPhone)

RCT_EXTERN_METHOD(trackAsOrganic:(BOOL *)value)

RCT_EXTERN_METHOD(fireInstall)

RCT_EXTERN_METHOD(parseDeepLink: (NSString *)url)

RCT_EXTERN_METHOD(setLocalRefTrack:(BOOL *)value withDelim: (NSString *)delimeter)

RCT_EXTERN_METHOD(setUserAdditionalDetails:(NSDictionary *)userAdditionalMap)

RCT_EXTERN_METHOD(waitForATTUserAuthorization:(NSInteger *)timeoutInterval)

RCT_EXTERN_METHOD(updateAppleAdsToken:(NSString *)token)

RCT_EXTERN_METHOD(updatePostbackConversion:(NSInteger *)conversionValue)

RCT_EXTERN_METHOD(subscribeDeeplink)

RCT_EXTERN_METHOD(getAd:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getAdID:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getCampaign:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getCampaignID:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getAdSet:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getChannel:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getP1:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getP2:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getP3:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getP4:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getP5:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getClickId:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getDlv:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getPid:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getIsRetargeting:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getAppTroveId:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(createDynamicLink:(NSDictionary *)config resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(resolveDeeplinkUrl:(NSString *)url resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

@end

