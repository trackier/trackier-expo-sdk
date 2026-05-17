// Test helper utilities
import { TrackierConfig, TrackierEvent } from '../../src/index';

export const createMockTrackierConfig = (overrides: Partial<TrackierConfig> = {}): TrackierConfig => {
  const config = new TrackierConfig('test-app-token', TrackierConfig.EnvironmentDevelopment);
  return Object.assign(config, overrides);
};

export const createMockTrackierEvent = (overrides: Partial<TrackierEvent> = {}): TrackierEvent => {
  const event = new TrackierEvent('test-event-id');
  return Object.assign(event, overrides);
};

export const mockNativeModuleResponse = (methodName: string, response: any) => {
  const { mockNativeModules } = require('../mocks/react-native');
  mockNativeModules.TrackierExpoSdk[methodName].mockResolvedValue(response);
};

export const mockNativeModuleError = (methodName: string, error: Error) => {
  const { mockNativeModules } = require('../mocks/react-native');
  mockNativeModules.TrackierExpoSdk[methodName].mockRejectedValue(error);
};

export const expectNativeModuleCalled = (methodName: string, ...args: any[]) => {
  const { mockNativeModules } = require('../mocks/react-native');
  expect(mockNativeModules.TrackierExpoSdk[methodName]).toHaveBeenCalledWith(...args);
};

export const expectNativeModuleCalledTimes = (methodName: string, times: number) => {
  const { mockNativeModules } = require('../mocks/react-native');
  expect(mockNativeModules.TrackierExpoSdk[methodName]).toHaveBeenCalledTimes(times);
};

export const resetAllMocks = () => {
  const { mockNativeModules } = require('../mocks/react-native');
  Object.values(mockNativeModules.TrackierExpoSdk).forEach((mock: any) => {
    if (jest.isMockFunction(mock)) {
      mock.mockReset();
    }
  });
};
