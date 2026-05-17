import { TrackierSDK, TrackierConfig } from '../src/index';
import { createMockTrackierConfig, createMockTrackierEvent, expectNativeModuleCalled, mockNativeModuleResponse } from './utils/test-helpers';

// Mock react-native modules
jest.mock('react-native', () => {
  const { mockNativeModules, mockNativeEventEmitter, mockPlatform } = require('./mocks/react-native');
  return {
    NativeModules: mockNativeModules,
    NativeEventEmitter: jest.fn().mockImplementation(() => mockNativeEventEmitter),
    Platform: mockPlatform,
  };
});

describe('TrackierSDK', () => {
  let mockConfig: TrackierConfig;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConfig = createMockTrackierConfig();
  });

  describe('initialize', () => {
    it('should call native module initializeSDK with config', () => {
      TrackierSDK.initialize(mockConfig);
      expectNativeModuleCalled('initializeSDK', mockConfig);
    });
  });

  describe('setEnabled', () => {
    it('should call native module setEnabled with true', () => {
      TrackierSDK.setEnabled(true);
      expectNativeModuleCalled('setEnabled', true);
    });

    it('should call native module setEnabled with false', () => {
      TrackierSDK.setEnabled(false);
      expectNativeModuleCalled('setEnabled', false);
    });
  });

  describe('getTrackierId', () => {
    it('should return trackier ID from native module', async () => {
      const mockId = 'trackier-123';
      mockNativeModuleResponse('getTrackierId', mockId);
      
      const result = await TrackierSDK.getTrackierId();
      expect(result).toBe(mockId);
    });

    it('should handle native module errors', async () => {
      const mockError = new Error('Native module error');
      const { mockNativeModules } = require('./mocks/react-native');
      mockNativeModules.TrackierExpoSdk.getTrackierId.mockRejectedValue(mockError);
      
      await expect(TrackierSDK.getTrackierId()).rejects.toThrow('Native module error');
    });
  });

  describe('User Management', () => {
    it('should set user ID', () => {
      TrackierSDK.setUserId('user123');
      expectNativeModuleCalled('setUserId', 'user123');
    });

    it('should set user email', () => {
      TrackierSDK.setUserEmail('user@example.com');
      expectNativeModuleCalled('setUserEmail', 'user@example.com');
    });

    it('should set user name', () => {
      TrackierSDK.setUserName('John Doe');
      expectNativeModuleCalled('setUserName', 'John Doe');
    });

    it('should set user phone', () => {
      TrackierSDK.setUserPhone('+1234567890');
      expectNativeModuleCalled('setUserPhone', '+1234567890');
    });
  });

  describe('Organic Tracking', () => {
    it('should track as organic with true', () => {
      TrackierSDK.trackAsOrganic(true);
      expectNativeModuleCalled('trackAsOrganic', true);
    });

    it('should track as organic with false', () => {
      TrackierSDK.trackAsOrganic(false);
      expectNativeModuleCalled('trackAsOrganic', false);
    });
  });

  describe('Local Reference Tracking', () => {
    it('should set local ref track with value and delimiter', () => {
      TrackierSDK.setLocalRefTrack('ref123', '|');
      expectNativeModuleCalled('setLocalRefTrack', 'ref123', '|');
    });
  });

  describe('User Additional Details', () => {
    it('should set user additional details for Android', () => {
      const { mockPlatform } = require('./mocks/react-native');
      mockPlatform.OS = 'android';
      
      const additionalDetails = { key1: 'value1', key2: 'value2' };
      TrackierSDK.setUserAdditionalDetails(additionalDetails);
      expectNativeModuleCalled('setUserAdditionalDetails', { userAdditionalMap: additionalDetails });
    });

    it('should set user additional details for iOS', () => {
      const { mockPlatform } = require('./mocks/react-native');
      mockPlatform.OS = 'ios';
      
      const additionalDetails = { key1: 'value1', key2: 'value2' };
      TrackierSDK.setUserAdditionalDetails(additionalDetails);
      expectNativeModuleCalled('setUserAdditionalDetails', additionalDetails);
    });
  });

  describe('ATT User Authorization', () => {
    it('should wait for ATT user authorization with timeout', () => {
      TrackierSDK.waitForATTUserAuthorization(5000);
      expectNativeModuleCalled('waitForATTUserAuthorization', 5000);
    });
  });

  describe('Apple Ads Token', () => {
    it('should update Apple ads token', () => {
      TrackierSDK.updateAppleAdsToken('apple-token-123');
      expectNativeModuleCalled('updateAppleAdsToken', 'apple-token-123');
    });
  });

  describe('Install Tracking', () => {
    it('should fire install', () => {
      TrackierSDK.fireInstall();
      expectNativeModuleCalled('fireInstall');
    });
  });

  describe('Deep Link Parsing', () => {
    it('should parse deep link', () => {
      TrackierSDK.parseDeepLink('https://example.com/deeplink');
      expectNativeModuleCalled('parseDeepLink', 'https://example.com/deeplink');
    });
  });

  describe('Device Information', () => {
    it('should set IMEI', () => {
      TrackierSDK.setIMEI('imei1', 'imei2');
      expectNativeModuleCalled('setIMEI', 'imei1', 'imei2');
    });

    it('should set MAC address', () => {
      TrackierSDK.setMacAddress('mac-address-123');
      expectNativeModuleCalled('setMacAddress', 'mac-address-123');
    });
  });

  describe('Attribution Data Getters', () => {
    const mockAttributionData = {
      ad: 'test-ad',
      adID: 'test-ad-id',
      adSet: 'test-ad-set',
      campaign: 'test-campaign',
      campaignID: 'test-campaign-id',
      channel: 'test-channel',
      p1: 'test-p1',
      p2: 'test-p2',
      p3: 'test-p3',
      p4: 'test-p4',
      p5: 'test-p5',
      clickId: 'test-click-id',
      dlv: 'test-dlv',
      pid: 'test-pid',
      isRetargeting: true,
    };

    beforeEach(() => {
      const { mockNativeModules } = require('./mocks/react-native');
      Object.entries(mockAttributionData).forEach(([key, value]) => {
        const methodName = key === 'isRetargeting' ? 'getIsRetargeting' : `get${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        mockNativeModules.TrackierExpoSdk[methodName].mockReturnValue(value);
      });
    });

    it('should get ad', () => {
      expect(TrackierSDK.getAd()).toBe('test-ad');
    });

    it('should get ad ID', () => {
      expect(TrackierSDK.getAdID()).toBe('test-ad-id');
    });

    it('should get ad set', () => {
      expect(TrackierSDK.getAdSet()).toBe('test-ad-set');
    });

    it('should get campaign', () => {
      expect(TrackierSDK.getCampaign()).toBe('test-campaign');
    });

    it('should get campaign ID', () => {
      expect(TrackierSDK.getCampaignID()).toBe('test-campaign-id');
    });

    it('should get channel', () => {
      expect(TrackierSDK.getChannel()).toBe('test-channel');
    });

    it('should get P1', () => {
      expect(TrackierSDK.getP1()).toBe('test-p1');
    });

    it('should get P2', () => {
      expect(TrackierSDK.getP2()).toBe('test-p2');
    });

    it('should get P3', () => {
      expect(TrackierSDK.getP3()).toBe('test-p3');
    });

    it('should get P4', () => {
      expect(TrackierSDK.getP4()).toBe('test-p4');
    });

    it('should get P5', () => {
      expect(TrackierSDK.getP5()).toBe('test-p5');
    });

    it('should get click ID', () => {
      expect(TrackierSDK.getClickId()).toBe('test-click-id');
    });

    it('should get DLV', () => {
      expect(TrackierSDK.getDlv()).toBe('test-dlv');
    });

    it('should get PID', () => {
      expect(TrackierSDK.getPid()).toBe('test-pid');
    });

    it('should get is retargeting', () => {
      expect(TrackierSDK.getIsRetargeting()).toBe(true);
    });
  });

  describe('Event Tracking', () => {
    it('should track valid event', () => {
      const event = createMockTrackierEvent({
        eventId: 'test-event',
        orderId: 'order123',
        currency: 'USD',
        revenue: 99.99,
      });

      TrackierSDK.trackEvent(event);
      expectNativeModuleCalled('trackEvent', event);
    });

    it('should not track event with invalid string parameters', () => {
      const event = createMockTrackierEvent({
        eventId: 'test-event',
        orderId: 123 as any, // Invalid type
        revenue: 99.99,
      });

      TrackierSDK.trackEvent(event);
      
      // Should not call native module with invalid data
      const { mockNativeModules } = require('./mocks/react-native');
      expect(mockNativeModules.TrackierExpoSdk.trackEvent).not.toHaveBeenCalled();
    });

    it('should not track event with invalid revenue type', () => {
      const event = createMockTrackierEvent({
        eventId: 'test-event',
        revenue: 'invalid' as any, // Invalid type
      });

      TrackierSDK.trackEvent(event);
      
      // Should not call native module with invalid data
      const { mockNativeModules } = require('./mocks/react-native');
      expect(mockNativeModules.TrackierExpoSdk.trackEvent).not.toHaveBeenCalled();
    });

    it('should track event with null/undefined parameters', () => {
      const event = createMockTrackierEvent({
        eventId: 'test-event',
        orderId: null,
        currency: undefined,
        revenue: 99.99,
      });

      TrackierSDK.trackEvent(event);
      expectNativeModuleCalled('trackEvent', event);
    });
  });

  describe('Dynamic Link Creation', () => {
    it('should create dynamic link', async () => {
      const mockLink = 'https://example.com/dynamic-link';
      const config = { param1: 'value1' };
      
      mockNativeModuleResponse('createDynamicLink', mockLink);
      
      const result = await TrackierSDK.createDynamicLink(config);
      expect(result).toBe(mockLink);
      expectNativeModuleCalled('createDynamicLink', config);
    });

    it('should handle dynamic link creation errors', async () => {
      const config = { param1: 'value1' };
      const mockError = new Error('Dynamic link creation failed');
      
      const { mockNativeModules } = require('./mocks/react-native');
      mockNativeModules.TrackierExpoSdk.createDynamicLink.mockRejectedValue(mockError);
      
      await expect(TrackierSDK.createDynamicLink(config)).rejects.toThrow('Dynamic link creation failed');
    });
  });

  describe('Deeplink URL Resolution', () => {
    it('should resolve deeplink URL', async () => {
      const mockResult = { param1: 'value1', param2: 'value2' };
      const url = 'https://example.com/deeplink';
      
      mockNativeModuleResponse('resolveDeeplinkUrl', mockResult);
      
      const result = await TrackierSDK.resolveDeeplinkUrl(url);
      expect(result).toEqual(mockResult);
      expectNativeModuleCalled('resolveDeeplinkUrl', url);
    });

    it('should handle deeplink resolution errors', async () => {
      const url = 'https://example.com/deeplink';
      const mockError = new Error('Deeplink resolution failed');
      
      const { mockNativeModules } = require('./mocks/react-native');
      mockNativeModules.TrackierExpoSdk.resolveDeeplinkUrl.mockRejectedValue(mockError);
      
      await expect(TrackierSDK.resolveDeeplinkUrl(url)).rejects.toThrow('Deeplink resolution failed');
    });
  });
});
