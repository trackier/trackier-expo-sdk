import { TrackierEvent } from '../src/index';
import { createMockTrackierEvent } from './utils/test-helpers';

describe('TrackierEvent', () => {
  let event: TrackierEvent;

  beforeEach(() => {
    event = new TrackierEvent('test-event-id');
  });

  describe('Constructor', () => {
    it('should initialize with eventId', () => {
      expect(event.eventId).toBe('test-event-id');
    });

    it('should have default values for optional properties', () => {
      expect(event.orderId).toBeNull();
      expect(event.currency).toBeNull();
      expect(event.discount).toBe(0);
      expect(event.couponCode).toBeNull();
      expect(event.param1).toBeNull();
      expect(event.param2).toBeNull();
      expect(event.param3).toBeNull();
      expect(event.param4).toBeNull();
      expect(event.param5).toBeNull();
      expect(event.param6).toBeNull();
      expect(event.param7).toBeNull();
      expect(event.param8).toBeNull();
      expect(event.param9).toBeNull();
      expect(event.param10).toBeNull();
      expect(event.revenue).toBe(0);
      expect(event.ev).toEqual({});
    });
  });

  describe('Static Event Constants', () => {
    it('should have correct event constants', () => {
      expect(TrackierEvent.LEVEL_ACHIEVED).toBe('1CFfUn3xEY');
      expect(TrackierEvent.ADD_TO_CART).toBe('Fy4uC1_FlN');
      expect(TrackierEvent.ADD_TO_WISHLIST).toBe('AOisVC76YG');
      expect(TrackierEvent.COMPLETE_REGISTRATION).toBe('mEqP4aD8dU');
      expect(TrackierEvent.TUTORIAL_COMPLETION).toBe('99VEGvXjN7');
      expect(TrackierEvent.PURCHASE).toBe('Q4YsqBKnzZ');
      expect(TrackierEvent.SUBSCRIBE).toBe('B4N_In4cIP');
      expect(TrackierEvent.START_TRIAL).toBe('jYHcuyxWUW');
      expect(TrackierEvent.ACHIEVEMENT_UNLOCKED).toBe('xTPvxWuNqm');
      expect(TrackierEvent.CONTENT_VIEW).toBe('Jwzois1ays');
      expect(TrackierEvent.TRAVEL_BOOKING).toBe('yP1-ipVtHV');
      expect(TrackierEvent.SHARE).toBe('dxZXGG1qqL');
      expect(TrackierEvent.INVITE).toBe('7lnE3OclNT');
      expect(TrackierEvent.LOGIN).toBe('o91gt1Q0PK');
      expect(TrackierEvent.UPDATE).toBe('sEQWVHGThl');
    });
  });

  describe('setEventValue', () => {
    it('should set event value with valid key', () => {
      event.setEventValue('testKey', 'testValue');
      expect(event.ev.testKey).toBe('testValue');
    });

    it('should set event value with number', () => {
      event.setEventValue('numberKey', 123);
      expect(event.ev.numberKey).toBe(123);
    });

    it('should set event value with object', () => {
      const obj = { nested: 'value' };
      event.setEventValue('objectKey', obj);
      expect(event.ev.objectKey).toEqual(obj);
    });

    it('should not set event value with invalid key type', () => {
      const initialEv = { ...event.ev };
      event.setEventValue(123 as any, 'testValue');
      expect(event.ev).toEqual(initialEv);
    });

    it('should not set event value with null key', () => {
      const initialEv = { ...event.ev };
      event.setEventValue(null as any, 'testValue');
      expect(event.ev).toEqual(initialEv);
    });
  });

  describe('Event Properties', () => {
    it('should allow setting all event properties', () => {
      const testEvent = createMockTrackierEvent({
        orderId: 'order123',
        currency: 'USD',
        discount: 10.5,
        couponCode: 'SAVE10',
        param1: 'param1Value',
        param2: 'param2Value',
        param3: 'param3Value',
        param4: 'param4Value',
        param5: 'param5Value',
        param6: 'param6Value',
        param7: 'param7Value',
        param8: 'param8Value',
        param9: 'param9Value',
        param10: 'param10Value',
        revenue: 99.99,
      });

      expect(testEvent.orderId).toBe('order123');
      expect(testEvent.currency).toBe('USD');
      expect(testEvent.discount).toBe(10.5);
      expect(testEvent.couponCode).toBe('SAVE10');
      expect(testEvent.param1).toBe('param1Value');
      expect(testEvent.param2).toBe('param2Value');
      expect(testEvent.param3).toBe('param3Value');
      expect(testEvent.param4).toBe('param4Value');
      expect(testEvent.param5).toBe('param5Value');
      expect(testEvent.param6).toBe('param6Value');
      expect(testEvent.param7).toBe('param7Value');
      expect(testEvent.param8).toBe('param8Value');
      expect(testEvent.param9).toBe('param9Value');
      expect(testEvent.param10).toBe('param10Value');
      expect(testEvent.revenue).toBe(99.99);
    });
  });
});
