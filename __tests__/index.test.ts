import { TrackierConfig, TrackierSDK, TrackierEvent } from '../src/index';

describe('SDK Exports', () => {
  it('should export TrackierConfig class', () => {
    expect(TrackierConfig).toBeDefined();
    expect(typeof TrackierConfig).toBe('function');
  });

  it('should export TrackierSDK object', () => {
    expect(TrackierSDK).toBeDefined();
    expect(typeof TrackierSDK).toBe('object');
  });

  it('should export TrackierEvent class', () => {
    expect(TrackierEvent).toBeDefined();
    expect(typeof TrackierEvent).toBe('function');
  });

  it('should have all required TrackierSDK methods', () => {
    const requiredMethods = [
      'initialize',
      'setEnabled',
      'getTrackierId',
      'setUserId',
      'setUserEmail',
      'setUserName',
      'setUserPhone',
      'trackAsOrganic',
      'setLocalRefTrack',
      'setUserAdditionalDetails',
      'waitForATTUserAuthorization',
      'updateAppleAdsToken',
      'fireInstall',
      'parseDeepLink',
      'setIMEI',
      'setMacAddress',
      'getAd',
      'getAdID',
      'getAdSet',
      'getCampaign',
      'getCampaignID',
      'getChannel',
      'getP1',
      'getP2',
      'getP3',
      'getP4',
      'getP5',
      'getClickId',
      'getDlv',
      'getPid',
      'getIsRetargeting',
      'trackEvent',
      'createDynamicLink',
      'resolveDeeplinkUrl',
    ];

    requiredMethods.forEach(method => {
      expect(TrackierSDK[method]).toBeDefined();
      expect(typeof TrackierSDK[method]).toBe('function');
    });
  });

  it('should have all required TrackierConfig static properties', () => {
    expect(TrackierConfig.EnvironmentDevelopment).toBe('development');
    expect(TrackierConfig.EnvironmentProduction).toBe('production');
    expect(TrackierConfig.EnvironmentTesting).toBe('testing');
    expect(TrackierConfig.IN).toBe('in');
    expect(TrackierConfig.GLOBAL).toBe('global');
    expect(TrackierConfig.EncryptionType).toBeDefined();
    expect(TrackierConfig.EncryptionType.AES_GCM).toBe('AES_GCM');
  });

  it('should have all required TrackierEvent static properties', () => {
    const requiredEvents = [
      'LEVEL_ACHIEVED',
      'ADD_TO_CART',
      'ADD_TO_WISHLIST',
      'COMPLETE_REGISTRATION',
      'TUTORIAL_COMPLETION',
      'PURCHASE',
      'SUBSCRIBE',
      'START_TRIAL',
      'ACHIEVEMENT_UNLOCKED',
      'CONTENT_VIEW',
      'TRAVEL_BOOKING',
      'SHARE',
      'INVITE',
      'LOGIN',
      'UPDATE',
    ];

    requiredEvents.forEach(event => {
      expect(TrackierEvent[event]).toBeDefined();
      expect(typeof TrackierEvent[event]).toBe('string');
    });
  });
});
