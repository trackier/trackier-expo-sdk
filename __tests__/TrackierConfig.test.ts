import { TrackierConfig } from '../src/index';
import { createMockTrackierConfig } from './utils/test-helpers';

describe('TrackierConfig', () => {
  let config: TrackierConfig;

  beforeEach(() => {
    config = new TrackierConfig('test-app-token', TrackierConfig.EnvironmentDevelopment);
  });

  describe('Constructor', () => {
    it('should initialize with appToken and environment', () => {
      expect(config.appToken).toBe('test-app-token');
      expect(config.environment).toBe(TrackierConfig.EnvironmentDevelopment);
    });

    it('should have default values for optional properties', () => {
      expect(config.secretId).toBe('');
      expect(config.secretKey).toBe('');
      expect(config.manualMode).toBe(false);
      expect(config.disableOrganicTrack).toBe(false);
      expect(config.attributionParams).toEqual({});
      expect(config.region).toBe('');
      expect(config.facebookAppId).toBe('');
      expect(config.androidId).toBe('');
      expect(config.appId).toBe('');
      expect(config.encryptionKey).toBe('');
      expect(config.encryptionType).toBe('AES_GCM');
    });
  });

  describe('Static Properties', () => {
    it('should have correct environment constants', () => {
      expect(TrackierConfig.EnvironmentDevelopment).toBe('development');
      expect(TrackierConfig.EnvironmentProduction).toBe('production');
      expect(TrackierConfig.EnvironmentTesting).toBe('testing');
    });

    it('should have correct region constants', () => {
      expect(TrackierConfig.IN).toBe('in');
      expect(TrackierConfig.GLOBAL).toBe('global');
    });

    it('should have correct encryption type constants', () => {
      expect(TrackierConfig.EncryptionType.AES_GCM).toBe('AES_GCM');
    });
  });

  describe('setAppSecret', () => {
    it('should set secretId and secretKey', () => {
      config.setAppSecret('test-key', 'test-value');
      expect(config.secretId).toBe('test-key');
      expect(config.secretKey).toBe('test-value');
    });
  });

  describe('setManualMode', () => {
    it('should set manualMode to true', () => {
      config.setManualMode(true);
      expect(config.manualMode).toBe(true);
    });

    it('should set manualMode to false', () => {
      config.setManualMode(false);
      expect(config.manualMode).toBe(false);
    });
  });

  describe('disableOrganicTracking', () => {
    it('should set disableOrganicTrack to true', () => {
      config.disableOrganicTracking(true);
      expect(config.disableOrganicTrack).toBe(true);
    });

    it('should set disableOrganicTrack to false', () => {
      config.disableOrganicTracking(false);
      expect(config.disableOrganicTrack).toBe(false);
    });
  });

  describe('setDeferredDeeplinkCallbackListener', () => {
    const mockCallback = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should set hasDeferredDeeplinkCallback to true and add listener', () => {
      config.setDeferredDeeplinkCallbackListener(mockCallback);
      expect(config.hasDeferredDeeplinkCallback).toBe(true);
    });
  });

  describe('setAttributionParams', () => {
    it('should set attributionParams with valid object', () => {
      const params = { param1: 'value1', param2: 'value2' };
      config.setAttributionParams(params);
      expect(config.attributionParams).toEqual(params);
    });

    it('should handle null parameters', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      config.setAttributionParams(null as any);
      expect(consoleSpy).toHaveBeenCalledWith('Invalid parameters passed to setAttributionParams');
      consoleSpy.mockRestore();
    });

    it('should handle non-object parameters', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      config.setAttributionParams('invalid' as any);
      expect(consoleSpy).toHaveBeenCalledWith('Invalid parameters passed to setAttributionParams');
      consoleSpy.mockRestore();
    });
  });

  describe('setRegion', () => {
    it('should set region', () => {
      config.setRegion('US');
      expect(config.region).toBe('US');
    });
  });

  describe('setFacebookAppId', () => {
    it('should set facebookAppId', () => {
      config.setFacebookAppId('123456789');
      expect(config.facebookAppId).toBe('123456789');
    });
  });

  describe('setAndroidId', () => {
    it('should set androidId', () => {
      config.setAndroidId('android123');
      expect(config.androidId).toBe('android123');
    });
  });

  describe('setAppId', () => {
    it('should set appId', () => {
      config.setAppId('app123');
      expect(config.appId).toBe('app123');
    });
  });

  describe('setEncryptionKey', () => {
    it('should set encryptionKey', () => {
      config.setEncryptionKey('encryption123');
      expect(config.encryptionKey).toBe('encryption123');
    });
  });

  describe('setEncryptionType', () => {
    it('should set encryptionType', () => {
      config.setEncryptionType('AES_CBC');
      expect(config.encryptionType).toBe('AES_CBC');
    });
  });
});
