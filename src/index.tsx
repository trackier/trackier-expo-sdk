import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

// const LINKING_ERROR =
//   `The package 'trackier-expo-sdk' doesn't seem to be linked. Make sure: \n\n` +
//   Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
//   '- You rebuilt the app after installing the package\n' +
//   '- You are not using Expo Go\n';

// const TrackierExpoSdk = NativeModules.TrackierExpoSdk
//   ? NativeModules.TrackierExpoSdk
//   : new Proxy(
//       {},
//       {
//         get() {
//           throw new Error(LINKING_ERROR);
//         },
//       }
//     );

//var TrackierSDK = {};

const module_trackier = NativeModules.TrackierExpoSdk;

let module_trackier_emitter: NativeEventEmitter | null = null;

if (Platform.OS === "android") {
	module_trackier_emitter = new NativeEventEmitter();
} else if (Platform.OS === "ios") {
	module_trackier_emitter = new NativeEventEmitter(NativeModules.TrackierExpoSdk);
}

class TrackierConfig {
  appToken: string;
  environment: string;
  secretId: string = '';
  secretKey: string = '';
  manualMode: boolean = false;
  disableOrganicTrack: boolean = false;
  hasDeferredDeeplinkCallback?: boolean;

  static EnvironmentDevelopment: string = "development";
  static EnvironmentProduction: string = "production";
  static EnvironmentTesting: string = "testing";

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

  setDeferredDeeplinkCallbackListener(deferredDeeplinkCallbackListener: (url: string) => void): void {
      if (Platform.OS === "android" || Platform.OS === "ios") {
        if (module_trackier_emitter !== null) {
          this.hasDeferredDeeplinkCallback = true;
          module_trackier_emitter.addListener('trackier_deferredDeeplink', deferredDeeplinkCallbackListener);
      }
    }
  }
}

interface TrackierSDKProps {
  initialize(trackierConfig: TrackierConfig): void;
  setEnabled(value: boolean): void;
  getTrackierId(): Promise<string>;
  setUserId(userId: string): void;
  setUserEmail(userEmail: string): void;
  setUserName(userName: string): void;
  setUserPhone(userPhone: string): void;
  trackAsOrganic(value: boolean): void;
  setLocalRefTrack(value: string, delimiter: string): void;
  setUserAdditionalDetails(key: string, value: string): void;
  waitForATTUserAuthorization(timeoutInterval: number): void;
  fireInstall(): void;
  parseDeepLink(value: string): void;
  setIMEI(imei1: string, imei2: string): void;
  setMacAddress(value: string): void;
  getAd(): string;
  getAdID(): string;
  getAdSet(): string;
  getCampaign(): string;
  getCampaignID(): string;
  getChannel(): string;
  getP1(): string;
  getP2(): string;
  getP3(): string;
  getP4(): string;
  getP5(): string;
  getClickId(): string;
  getDlv(): string;
  getPid(): string;
  getIsRetargeting(): boolean;
  trackEvent(trackierEvent: TrackierEvent): void;
}

let TrackierSDK: TrackierSDKProps = {
  initialize: function (trackierConfig: TrackierConfig) {
      module_trackier.initializeSDK(trackierConfig);
  },

  setEnabled: function (value: boolean) {
      module_trackier.setEnabled(value);
  },

  getTrackierId: async function () {
      const id = await module_trackier.getTrackierId();
      return id;
  },

  setUserId: function (userId: string) {
      module_trackier.setUserId(userId);
  },

  setUserEmail: function (userEmail: string) {
      module_trackier.setUserEmail(userEmail);
  },

  setUserName: function (userName: string) {
      module_trackier.setUserName(userName);
  },

  setUserPhone: function (userPhone: string) {
      module_trackier.setUserPhone(userPhone);
  },

  trackAsOrganic: function (value: boolean) {
      module_trackier.trackAsOrganic(value);
  },

  setLocalRefTrack: function (value: string, delimiter: string) {
      module_trackier.setLocalRefTrack(value, delimiter);
  },

  setUserAdditionalDetails: function (key: string, value: string) {
      module_trackier.setUserAdditionalDetails(key, value);
  },

  waitForATTUserAuthorization: function (timeoutInterval: number) {
      module_trackier.waitForATTUserAuthorization(timeoutInterval);
  },

  fireInstall: function () {
      module_trackier.fireInstall();
  },

  parseDeepLink: function (value: string) {
      module_trackier.parseDeepLink(value);
  },

  setIMEI: function (imei1: string, imei2: string) {
      module_trackier.setIMEI(imei1, imei2);
  },

  setMacAddress: function (value: string) {
      module_trackier.setMacAddress(value);
  },

  getAd: function () {
      return module_trackier.getAd();
  },

  getAdID: function () {
      return module_trackier.getAdID();
  },

  getAdSet: function () {
      return module_trackier.getAdSet();
  },

  getCampaign: function () {
      return module_trackier.getCampaign();
  },

  getCampaignID: function () {
      return module_trackier.getCampaignID();
  },

  getChannel: function () {
      return module_trackier.getChannel();
  },

  getP1: function () {
      return module_trackier.getP1();
  },

  getP2: function () {
      return module_trackier.getP2();
  },

  getP3: function () {
      return module_trackier.getP3();
  },

  getP4: function () {
      return module_trackier.getP4();
  },

  getP5: function () {
      return module_trackier.getP5();
  },

  getClickId: function () {
      return module_trackier.getClickId();
  },

  getDlv: function () {
      return module_trackier.getDlv();
  },

  getPid: function () {
      return module_trackier.getPid();
  },

  getIsRetargeting: function () {
      return module_trackier.getIsRetargeting();
  },

  trackEvent: function (trackierEvent: TrackierEvent) {
    let isValidArgs = true;
    const props = ['eventId', 'orderId', 'currency', 'couponCode', 'param1', 'param2', 'param3', 'param4', 'param5', 'param6', 'param7', 'param8', 'param9', 'param10'];

    props.forEach((v) => {
        const value = (trackierEvent as any)[v];
        if (value === null || value === undefined) {
            return;
        }
        if (typeof value !== 'string') {
            isValidArgs = false;
            return;
        }
    });

    if (!isValidArgs || (typeof trackierEvent.revenue !== 'undefined' && typeof trackierEvent.revenue !== 'number')) {
        return;
    }

    module_trackier.trackEvent(trackierEvent);
}
};

class TrackierEvent {
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


  static LEVEL_ACHIEVED: string = "1CFfUn3xEY";
  static ADD_TO_CART: string = "Fy4uC1_FlN";
  static ADD_TO_WISHLIST: string = "AOisVC76YG";
  static COMPLETE_REGISTRATION: string = "mEqP4aD8dU";
  static TUTORIAL_COMPLETION : string= "99VEGvXjN7";
  static PURCHASE: string = "Q4YsqBKnzZ";
  static SUBSCRIBE: string = "B4N_In4cIP";
  static START_TRIAL: string = "jYHcuyxWUW";
  static ACHIEVEMENT_UNLOCKED: string = "xTPvxWuNqm";
  static CONTENT_VIEW: string = "Jwzois1ays";
  static TRAVEL_BOOKING: string = "yP1-ipVtHV";
  static SHARE: string = "dxZXGG1qqL";
  static INVITE: string = "7lnE3OclNT";
  static LOGIN: string = "o91gt1Q0PK";
  static UPDATE: string = "sEQWVHGThl";

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

TrackierSDK.initialize = function(trackierConfig: TrackierConfig): void {
  module_trackier.initializeSDK(trackierConfig);
};

module.exports = {
	TrackierConfig,
	TrackierSDK, 
  TrackierEvent
}