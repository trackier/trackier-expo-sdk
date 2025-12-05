import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const LINKING_ERROR =
  `The package 'apptrove-expo-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

// Fail fast if native module is not available instead of silently masking errors
const module_apptrove = NativeModules.AppTroveExpoSdk
  ? NativeModules.AppTroveExpoSdk
  : new Proxy(
    {},
    {
      get() {
        throw new Error(LINKING_ERROR);
      },
    }
  );

// Lazy-initialize NativeEventEmitter only when needed, not at module load time
// This prevents accessing React Native modules before they're registered
let module_apptrove_emitter: NativeEventEmitter | null = null;

function getEventEmitter(): NativeEventEmitter | null {
  if (module_apptrove_emitter === null) {
    try {
      if (Platform.OS === 'android') {
        module_apptrove_emitter = new NativeEventEmitter();
      } else if (Platform.OS === 'ios' && NativeModules.AppTroveExpoSdk) {
        module_apptrove_emitter = new NativeEventEmitter(
          NativeModules.AppTroveExpoSdk
        );
      }
    } catch (e) {
      // Silently fail if NativeEventEmitter can't be created
      // This can happen if React Native modules aren't fully initialized yet
      console.warn('Failed to create NativeEventEmitter:', e);
      return null;
    }
  }
  return module_apptrove_emitter;
}

class AppTroveConfig {
  appToken: string;
  environment: string;
  secretId: string = '';
  secretKey: string = '';
  manualMode: boolean = false;
  disableOrganicTrack: boolean = false;
  hasDeferredDeeplinkCallback?: boolean;
  attributionParams: Record<string, string> = {};
  region: string = '';
  facebookAppId: string = ''; // Default Facebook App ID
  androidId: string = ''; // Default Android ID
  appId: string = ''; // Default App ID
  encryptionKey: string = ''; // Default Encryption Key
  encryptionType: string = 'AES_GCM'; // Default Encryption Type

  static EnvironmentDevelopment: string = 'development';
  static EnvironmentProduction: string = 'production';
  static EnvironmentTesting: string = 'testing';
  static IN: string = 'in';
  static GLOBAL: string = 'global';

  static EncryptionType = {
    AES_GCM: 'AES_GCM',
  };

  constructor(appToken: string, environment: string) {
    this.appToken = appToken;
    this.environment = environment;
  }

  setAppSecret(key: string, value: string): void {
    this.secretId = key;
    this.secretKey = value;
  }

  setManualMode(value: boolean): void {
    this.manualMode = value;
  }

  disableOrganicTracking(value: boolean): void {
    this.disableOrganicTrack = value;
  }

  setDeferredDeeplinkCallbackListener(
    deferredDeeplinkCallbackListener: (url: string) => void
  ): void {
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      const emitter = getEventEmitter();
      if (emitter !== null) {
        this.hasDeferredDeeplinkCallback = true;
        emitter.addListener(
          'apptrove_deferredDeeplink',
          deferredDeeplinkCallbackListener
        );
      }
    }
  }

  setAttributionParams(params: Record<string, string>): void {
    if (typeof params !== 'object' || params === null) {
      console.error('Invalid parameters passed to setAttributionParams');
      return;
    }
    this.attributionParams = params;
  }

  setRegion(value: string): void {
    this.region = value;
  }

  setFacebookAppId(value: string): void {
    this.facebookAppId = value;
  }

  setAndroidId(value: string): void {
    this.androidId = value;
  }

  setAppId(value: string): void {
    this.appId = value;
  }

  setEncryptionKey(value: string): void {
    this.encryptionKey = value;
  }

  setEncryptionType(value: string): void {
    this.encryptionType = value;
  }
}

interface AppTroveSDKProps {
  initialize(config: AppTroveConfig): void;
  setEnabled(value: boolean): void;
  getAppTroveId(): Promise<string>;
  setUserId(userId: string): void;
  setUserEmail(userEmail: string): void;
  setUserName(userName: string): void;
  setUserPhone(userPhone: string): void;
  trackAsOrganic(value: boolean): void;
  setLocalRefTrack(value: string, delimiter: string): void;
  setUserAdditionalDetails(userAdditionalMap: Record<string, any>): void;
  waitForATTUserAuthorization(timeoutInterval: number): void;
  updateAppleAdsToken(token: string): void;
  updatePostbackConversion(conversionValue: number): void;
  subscribeDeeplink(): void;
  fireInstall(): void;
  parseDeepLink(value: string): void;
  setIMEI(imei1: string, imei2: string): void;
  setMacAddress(value: string): void;
  getAd(): Promise<string>;
  getAdID(): Promise<string>;
  getAdSet(): Promise<string>;
  getCampaign(): Promise<string>;
  getCampaignID(): Promise<string>;
  getChannel(): Promise<string>;
  getP1(): Promise<string>;
  getP2(): Promise<string>;
  getP3(): Promise<string>;
  getP4(): Promise<string>;
  getP5(): Promise<string>;
  getClickId(): Promise<string>;
  getDlv(): Promise<string>;
  getPid(): Promise<string>;
  getIsRetargeting(): Promise<boolean>;
  trackEvent(event: AppTroveEvent): void;
  createDynamicLink(config: Record<string, any>): Promise<string>;
  resolveDeeplinkUrl(url: string): Promise<Record<string, any>>;
}

let AppTroveSDK: AppTroveSDKProps = {
  initialize: function (config: AppTroveConfig) {
    module_apptrove.initializeSDK(config);
  },

  setEnabled: function (value: boolean) {
    module_apptrove.setEnabled(value);
  },

  getAppTroveId: async function () {
    const id = await module_apptrove.getAppTroveId();
    return id;
  },

  setUserId: function (userId: string) {
    module_apptrove.setUserId(userId);
  },

  setUserEmail: function (userEmail: string) {
    module_apptrove.setUserEmail(userEmail);
  },

  setUserName: function (userName: string) {
    module_apptrove.setUserName(userName);
  },

  setUserPhone: function (userPhone: string) {
    module_apptrove.setUserPhone(userPhone);
  },

  trackAsOrganic: function (value: boolean) {
    module_apptrove.trackAsOrganic(value);
  },

  setLocalRefTrack: function (value: string, delimiter: string) {
    module_apptrove.setLocalRefTrack(value, delimiter);
  },

  setUserAdditionalDetails: function (userAdditionalMap: Record<string, any>) {
    if (Platform.OS === 'android') {
      module_apptrove.setUserAdditionalDetails({ userAdditionalMap });
    } else if (Platform.OS === 'ios') {
      module_apptrove.setUserAdditionalDetails(userAdditionalMap);
    }
  },

  waitForATTUserAuthorization: function (timeoutInterval: number) {
    module_apptrove.waitForATTUserAuthorization(timeoutInterval);
  },

  updateAppleAdsToken: function (token: string) {
    module_apptrove.updateAppleAdsToken(token);
  },

  updatePostbackConversion: function (conversionValue: number) {
    module_apptrove.updatePostbackConversion(conversionValue);
  },

  subscribeDeeplink: function () {
    module_apptrove.subscribeDeeplink();
  },

  fireInstall: function () {
    module_apptrove.fireInstall();
  },

  parseDeepLink: function (value: string) {
    module_apptrove.parseDeepLink(value);
  },

  setIMEI: function (imei1: string, imei2: string) {
    module_apptrove.setIMEI(imei1, imei2);
  },

  setMacAddress: function (value: string) {
    module_apptrove.setMacAddress(value);
  },

  getAd: async function () {
    return await module_apptrove.getAd();
  },

  getAdID: async function () {
    return await module_apptrove.getAdID();
  },

  getAdSet: async function () {
    return await module_apptrove.getAdSet();
  },

  getCampaign: async function () {
    return await module_apptrove.getCampaign();
  },

  getCampaignID: async function () {
    return await module_apptrove.getCampaignID();
  },

  getChannel: async function () {
    return await module_apptrove.getChannel();
  },

  getP1: async function () {
    return await module_apptrove.getP1();
  },

  getP2: async function () {
    return await module_apptrove.getP2();
  },

  getP3: async function () {
    return await module_apptrove.getP3();
  },

  getP4: async function () {
    return await module_apptrove.getP4();
  },

  getP5: async function () {
    return await module_apptrove.getP5();
  },

  getClickId: async function () {
    return await module_apptrove.getClickId();
  },

  getDlv: async function () {
    return await module_apptrove.getDlv();
  },

  getPid: async function () {
    return await module_apptrove.getPid();
  },

  getIsRetargeting: async function () {
    return await module_apptrove.getIsRetargeting();
  },

  trackEvent: function (apptroveEvent: AppTroveEvent) {
    let isValidArgs = true;
    const props = [
      'eventId',
      'orderId',
      'currency',
      'couponCode',
      'param1',
      'param2',
      'param3',
      'param4',
      'param5',
      'param6',
      'param7',
      'param8',
      'param9',
      'param10',
    ];

    props.forEach((v) => {
      const value = (apptroveEvent as any)[v];
      if (value === null || value === undefined) {
        return;
      }
      if (typeof value !== 'string') {
        isValidArgs = false;
        return;
      }
    });

    if (
      !isValidArgs ||
      (typeof apptroveEvent.revenue !== 'undefined' &&
        typeof apptroveEvent.revenue !== 'number')
    ) {
      return;
    }

    module_apptrove.trackEvent(apptroveEvent);
  },

  createDynamicLink: async function (
    config: Record<string, any>
  ): Promise<string> {
    return await module_apptrove.createDynamicLink(config);
  },

  resolveDeeplinkUrl: async function (
    url: string
  ): Promise<Record<string, any>> {
    return await module_apptrove.resolveDeeplinkUrl(url);
  },
};

class AppTroveEvent {
  eventId: string;
  orderId: string | null = null;
  currency: string | null = null;
  discount: number = 0;
  couponCode: string | null = null;
  param1: string | null = null;
  param2: string | null = null;
  param3: string | null = null;
  param4: string | null = null;
  param5: string | null = null;
  param6: string | null = null;
  param7: string | null = null;
  param8: string | null = null;
  param9: string | null = null;
  param10: string | null = null;
  revenue: number = 0;
  ev: Record<string, any> = {};

  static LEVEL_ACHIEVED: string = '1CFfUn3xEY';
  static ADD_TO_CART: string = 'Fy4uC1_FlN';
  static ADD_TO_WISHLIST: string = 'AOisVC76YG';
  static COMPLETE_REGISTRATION: string = 'mEqP4aD8dU';
  static TUTORIAL_COMPLETION: string = '99VEGvXjN7';
  static PURCHASE: string = 'Q4YsqBKnzZ';
  static SUBSCRIBE: string = 'B4N_In4cIP';
  static START_TRIAL: string = 'jYHcuyxWUW';
  static ACHIEVEMENT_UNLOCKED: string = 'xTPvxWuNqm';
  static CONTENT_VIEW: string = 'Jwzois1ays';
  static TRAVEL_BOOKING: string = 'yP1-ipVtHV';
  static SHARE: string = 'dxZXGG1qqL';
  static INVITE: string = '7lnE3OclNT';
  static LOGIN: string = 'o91gt1Q0PK';
  static UPDATE: string = 'sEQWVHGThl';

  constructor(eventId: string) {
    this.eventId = eventId;
  }

  setEventValue(key: string, value: any): void {
    if (typeof key !== 'string') {
      return;
    }
    this.ev[key] = value;
  }
}

// AppTroveSDK.initialize = function(config: AppTroveConfig): void {
//   module_apptrove.initializeSDK(config);
// };

module.exports = {
  AppTroveConfig,
  AppTroveSDK,
  AppTroveEvent
}