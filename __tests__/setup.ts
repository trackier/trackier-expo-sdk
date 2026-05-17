// Test setup file for Trackier Expo SDK

// Mock react-native modules
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Mock NativeModules
const mockNativeModules = {
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

jest.mock('react-native', () => ({
  NativeModules: mockNativeModules,
  NativeEventEmitter: jest.fn().mockImplementation(() => ({
    addListener: jest.fn(),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
  })),
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios || obj.default),
  },
}));

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
