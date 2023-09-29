import snapshotDiff from 'snapshot-diff';

import reducer, { actions } from '../earlyLeaveRequest';
import { AdvanceRequest } from './mock-data/earlyLeaveRequests';

// @ts-ignore
const initialState = reducer.__get__('initialState');
// @ts-ignore
const INITIALIZE = reducer.__get__('INITIALIZE');
// @ts-ignore
const UPDATE = reducer.__get__('UPDATE');

const testRequest = {
  request: AdvanceRequest,
};

describe('reducer()', () => {
  describe('@init', () => {
    it('@@init', () => {
      // @ts-ignore
      const next = reducer(undefined, { type: '@@INIT' });
      expect(snapshotDiff({}, next)).toMatchSnapshot();
    });
  });
  describe(`${INITIALIZE}`, () => {
    it('INITIALIZE', () => {
      const next = reducer(initialState, actions.initialize(AdvanceRequest));
      expect(snapshotDiff(initialState, next)).toMatchSnapshot();
    });
  });
  describe(`${UPDATE}`, () => {
    it('UPDATE', () => {
      const next = reducer(
        testRequest,
        actions.update('reason', 'testですtestです。')
      );
      expect(snapshotDiff(initialState, next)).toMatchSnapshot();
    });
  });
});
