// Mock for react-native modules
export const mockNativeModules = {
  TrackierExpoSdk: {
    initializeSDK: jest.fn(),
    setEnabled: jest.fn(),
    getTrackierId: jest.fn(),
    setUserId: jest.fn(),
    setUserEmail: jest.fn(),
    setUserName: jest.fn(),
    setUserPhone: jest.fn(),
    trackAsOrganic: jest.fn(),
    setLocalRefTrack: jest.fn(),
    setUserAdditionalDetails: jest.fn(),
    waitForATTUserAuthorization: jest.fn(),
    updateAppleAdsToken: jest.fn(),
    fireInstall: jest.fn(),
    parseDeepLink: jest.fn(),
    setIMEI: jest.fn(),
    setMacAddress: jest.fn(),
    getAd: jest.fn(),
    getAdID: jest.fn(),
    getAdSet: jest.fn(),
    getCampaign: jest.fn(),
    getCampaignID: jest.fn(),
    getChannel: jest.fn(),
    getP1: jest.fn(),
    getP2: jest.fn(),
    getP3: jest.fn(),
    getP4: jest.fn(),
    getP5: jest.fn(),
    getClickId: jest.fn(),
    getDlv: jest.fn(),
    getPid: jest.fn(),
    getIsRetargeting: jest.fn(),
    trackEvent: jest.fn(),
    createDynamicLink: jest.fn(),
    resolveDeeplinkUrl: jest.fn(),
  },
};

export const mockNativeEventEmitter = {
  addListener: jest.fn(),
  removeListener: jest.fn(),
  removeAllListeners: jest.fn(),
};

export const mockPlatform = {
  OS: 'ios',
  select: jest.fn((obj) => obj.ios || obj.default),
};
