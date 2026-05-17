import { TrackierSDK, TrackierConfig, TrackierEvent } from '../src/index';
import { createMockTrackierConfig, createMockTrackierEvent } from './utils/test-helpers';

// Mock react-native modules
jest.mock('react-native', () => {
  const { mockNativeModules, mockNativeEventEmitter, mockPlatform } = require('./mocks/react-native');
  return {
    NativeModules: mockNativeModules,
    NativeEventEmitter: jest.fn().mockImplementation(() => mockNativeEventEmitter),
    Platform: mockPlatform,
  };
});

describe('TrackierSDK Integration Tests', () => {
  let config: TrackierConfig;

  beforeEach(() => {
    jest.clearAllMocks();
    config = createMockTrackierConfig();
  });

  describe('Complete SDK Workflow', () => {
    it('should complete full initialization and tracking workflow', async () => {
      // Initialize SDK
      TrackierSDK.initialize(config);
      
      // Set user information
      TrackierSDK.setUserId('user123');
      TrackierSDK.setUserEmail('user@example.com');
      TrackierSDK.setUserName('John Doe');
      
      // Set additional details
      const additionalDetails = { 
        age: '25', 
        location: 'US',
        preferences: { theme: 'dark' }
      };
      TrackierSDK.setUserAdditionalDetails(additionalDetails);
      
      // Track organic event
      TrackierSDK.trackAsOrganic(true);
      
      // Create and track custom event
      const event = createMockTrackierEvent({
        eventId: TrackierEvent.PURCHASE,
        orderId: 'order123',
        currency: 'USD',
        revenue: 99.99,
        param1: 'product_id',
        param2: 'category',
      });
      
      event.setEventValue('custom_property', 'custom_value');
      TrackierSDK.trackEvent(event);
      
      // Fire install
      TrackierSDK.fireInstall();
      
      // Verify all native module calls were made
      const { mockNativeModules } = require('./mocks/react-native');
      expect(mockNativeModules.TrackierExpoSdk.initializeSDK).toHaveBeenCalledWith(config);
      expect(mockNativeModules.TrackierExpoSdk.setUserId).toHaveBeenCalledWith('user123');
      expect(mockNativeModules.TrackierExpoSdk.setUserEmail).toHaveBeenCalledWith('user@example.com');
      expect(mockNativeModules.TrackierExpoSdk.setUserName).toHaveBeenCalledWith('John Doe');
      expect(mockNativeModules.TrackierExpoSdk.setUserAdditionalDetails).toHaveBeenCalledWith(additionalDetails);
      expect(mockNativeModules.TrackierExpoSdk.trackAsOrganic).toHaveBeenCalledWith(true);
      expect(mockNativeModules.TrackierExpoSdk.trackEvent).toHaveBeenCalledWith(event);
      expect(mockNativeModules.TrackierExpoSdk.fireInstall).toHaveBeenCalled();
    });

    it('should handle deferred deeplink callback workflow', () => {
      const mockCallback = jest.fn();
      
      // Set up deferred deeplink callback
      config.setDeferredDeeplinkCallbackListener(mockCallback);
      
      // Initialize SDK with callback
      TrackierSDK.initialize(config);
      
      // Parse deeplink
      const deeplink = 'https://example.com/deeplink?param1=value1';
      TrackierSDK.parseDeepLink(deeplink);
      
      // Verify callback was set up and deeplink was parsed
      expect(config.hasDeferredDeeplinkCallback).toBe(true);
      
      const { mockNativeModules } = require('./mocks/react-native');
      expect(mockNativeModules.TrackierExpoSdk.parseDeepLink).toHaveBeenCalledWith(deeplink);
    });

    it('should handle dynamic link creation and resolution workflow', async () => {
      const mockLink = 'https://example.com/dynamic-link';
      const mockResolution = { param1: 'value1', param2: 'value2' };
      
      // Mock native module responses
      const { mockNativeModules } = require('./mocks/react-native');
      mockNativeModules.TrackierExpoSdk.createDynamicLink.mockResolvedValue(mockLink);
      mockNativeModules.TrackierExpoSdk.resolveDeeplinkUrl.mockResolvedValue(mockResolution);
      
      // Create dynamic link
      const linkConfig = { 
        campaign: 'test-campaign',
        channel: 'email',
        param1: 'value1'
      };
      const createdLink = await TrackierSDK.createDynamicLink(linkConfig);
      
      // Resolve the link
      const resolvedData = await TrackierSDK.resolveDeeplinkUrl(createdLink);
      
      // Verify results
      expect(createdLink).toBe(mockLink);
      expect(resolvedData).toEqual(mockResolution);
      expect(mockNativeModules.TrackierExpoSdk.createDynamicLink).toHaveBeenCalledWith(linkConfig);
      expect(mockNativeModules.TrackierExpoSdk.resolveDeeplinkUrl).toHaveBeenCalledWith(mockLink);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle native module errors gracefully', async () => {
      const { mockNativeModules } = require('./mocks/react-native');
      const mockError = new Error('Native module error');
      
      // Mock error for getTrackierId
      mockNativeModules.TrackierExpoSdk.getTrackierId.mockRejectedValue(mockError);
      
      // Should not throw during initialization
      expect(() => TrackierSDK.initialize(config)).not.toThrow();
      
      // Should handle async errors
      await expect(TrackierSDK.getTrackierId()).rejects.toThrow('Native module error');
    });

    it('should handle invalid event data gracefully', () => {
      // Create event with invalid data
      const invalidEvent = createMockTrackierEvent({
        eventId: 'test-event',
        orderId: 123 as any, // Invalid type
        revenue: 'invalid' as any, // Invalid type
      });
      
      // Should not throw
      expect(() => TrackierSDK.trackEvent(invalidEvent)).not.toThrow();
      
      // Should not call native module with invalid data
      const { mockNativeModules } = require('./mocks/react-native');
      expect(mockNativeModules.TrackierExpoSdk.trackEvent).not.toHaveBeenCalled();
    });
  });

  describe('Platform-Specific Behavior', () => {
    it('should handle Android-specific behavior', () => {
      const { mockPlatform } = require('./mocks/react-native');
      mockPlatform.OS = 'android';
      
      const additionalDetails = { key1: 'value1' };
      TrackierSDK.setUserAdditionalDetails(additionalDetails);
      
      const { mockNativeModules } = require('./mocks/react-native');
      expect(mockNativeModules.TrackierExpoSdk.setUserAdditionalDetails).toHaveBeenCalledWith({
        userAdditionalMap: additionalDetails
      });
    });

    it('should handle iOS-specific behavior', () => {
      const { mockPlatform } = require('./mocks/react-native');
      mockPlatform.OS = 'ios';
      
      const additionalDetails = { key1: 'value1' };
      TrackierSDK.setUserAdditionalDetails(additionalDetails);
      
      const { mockNativeModules } = require('./mocks/react-native');
      expect(mockNativeModules.TrackierExpoSdk.setUserAdditionalDetails).toHaveBeenCalledWith(additionalDetails);
    });
  });

  describe('Configuration Validation', () => {
    it('should handle configuration with all optional parameters', () => {
      const fullConfig = createMockTrackierConfig({
        secretId: 'secret-id',
        secretKey: 'secret-key',
        manualMode: true,
        disableOrganicTrack: true,
        attributionParams: { param1: 'value1' },
        region: 'US',
        facebookAppId: 'fb123',
        androidId: 'android123',
        appId: 'app123',
        encryptionKey: 'encryption123',
        encryptionType: 'AES_CBC',
      });
      
      expect(() => TrackierSDK.initialize(fullConfig)).not.toThrow();
    });

    it('should handle configuration with invalid attribution params', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      config.setAttributionParams(null as any);
      expect(consoleSpy).toHaveBeenCalledWith('Invalid parameters passed to setAttributionParams');
      
      consoleSpy.mockRestore();
    });
  });
});
