import snapshotDiff from 'snapshot-diff';

import reducer, { actions, initialState, SET, UNSET } from '../dailyStampTime';

describe('reducer()', () => {
  describe('@init', () => {
    it('@@init', () => {
      // @ts-ignore
      const next = reducer(undefined, { type: '@@INIT' });
      expect(snapshotDiff({}, next)).toMatchSnapshot();
    });
  });
  describe(`${SET}`, () => {
    it('Status where In is possible', () => {
      const dailyStampTime = {
        isEnableStartStamp: true,
        isEnableEndStamp: false,
        isEnableRestartStamp: false,
        commuteForwardCount: null,
        commuteBackwardCount: null,
      };
      const next = reducer(initialState, actions.set(dailyStampTime));
      expect(snapshotDiff(initialState, next)).toMatchSnapshot();
    });
    it('Status where Out is possible', () => {
      const dailyStampTime = {
        isEnableStartStamp: false,
        isEnableEndStamp: true,
        isEnableRestartStamp: false,
        commuteForwardCount: null,
        commuteBackwardCount: null,
      };
      const next = reducer(initialState, actions.set(dailyStampTime));
      expect(snapshotDiff(initialState, next)).toMatchSnapshot();
    });
    it('Status where Re-In is possible', () => {
      const dailyStampTime = {
        isEnableStartStamp: false,
        isEnableEndStamp: false,
        isEnableRestartStamp: true,
        commuteForwardCount: null,
        commuteBackwardCount: null,
      };
      const next = reducer(initialState, actions.set(dailyStampTime));
      expect(snapshotDiff(initialState, next)).toMatchSnapshot();
    });
    it('Status where In and Out is possible', () => {
      const state = {
        isEnableStartStamp: false,
        isEnableEndStamp: false,
        isEnableRestartStamp: true,
        commuteForwardCount: null,
        commuteBackwardCount: null,
      };
      const dailyStampTime = {
        isEnableStartStamp: true,
        isEnableEndStamp: true,
        isEnableRestartStamp: false,
        commuteForwardCount: null,
        commuteBackwardCount: null,
      };
      const next = reducer(state, actions.set(dailyStampTime));
      expect(snapshotDiff(state, next)).toMatchSnapshot();
    });
  });
  describe(`${UNSET}`, () => {
    it('UNSET', () => {
      const state = {
        isEnableStartStamp: false,
        isEnableEndStamp: false,
        isEnableRestartStamp: true,
        commuteForwardCount: null,
        commuteBackwardCount: null,
      };
      const next = reducer(initialState, actions.unset());
      expect(snapshotDiff(state, next)).toMatchSnapshot();
    });
  });
});
