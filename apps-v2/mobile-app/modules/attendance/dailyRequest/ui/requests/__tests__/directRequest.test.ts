import snapshotDiff from 'snapshot-diff';

import { MAX_STANDARD_REST_TIME_COUNT } from '@apps/attendance/domain/models/RestTime';
import { defaultValue } from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import { create } from '@attendance/domain/models/AttDailyRequest/DirectRequest';
import { defaultValue as workingType } from '@attendance/domain/models/WorkingType';

import reducer, {
  actions,
  CLEAR,
  INITIALIZE,
  initialState,
  UPDATE,
} from '../directRequest';

jest.mock('nanoid', () => {
  let i = 1;
  return {
    __esModule: true,
    default: () => `${i++}`,
  };
});

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  describe(`${INITIALIZE}`, () => {
    it('should be executed', () => {
      const request = create(defaultValue, workingType, '2022-02-22');
      const next = reducer(
        initialState,
        actions.initialize(request, MAX_STANDARD_REST_TIME_COUNT)
      );
      expect(snapshotDiff(initialState, next)).toMatchSnapshot();
    });
  });
  describe(`${UPDATE}`, () => {
    it('should not be executed if state is not initializing', () => {
      const next = reducer(initialState, actions.update('startTime', 9 * 60));
      expect(snapshotDiff(initialState, next)).toMatchSnapshot();
    });
    it('should be executed ', () => {
      // @ts-ignore
      const request = create(defaultValue, workingType, '2022-02-22');
      const state = reducer(
        initialState,
        actions.initialize(request, MAX_STANDARD_REST_TIME_COUNT)
      );
      const next = reducer(state, actions.update('startTime', 9 * 60));
      expect(snapshotDiff(state, next)).toMatchSnapshot();
    });
  });
  describe(`${CLEAR}`, () => {
    it('should be executed', () => {
      // @ts-ignore
      const request = create(defaultValue, workingType, '2022-02-22');
      const state = reducer(
        initialState,
        actions.initialize(request, MAX_STANDARD_REST_TIME_COUNT)
      );
      const next = reducer(state, actions.clear());
      expect(snapshotDiff(state, next)).toMatchSnapshot();
    });
  });
});
