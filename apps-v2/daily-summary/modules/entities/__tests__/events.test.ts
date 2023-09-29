import snapshotDiff from 'snapshot-diff';

import reducer, { ACTION_TYPES, actions, initialState } from '../events';
import events from './mocks/events.mock';

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });

    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });

  test(ACTION_TYPES.SET_TARGET_DATE, () => {
    // @ts-ignore
    const next = reducer(initialState, actions.setTargetDate('2020-02-05'));

    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });

  describe(ACTION_TYPES.FETCH_SUCCESS, () => {
    test('targetDate matched', () => {
      const init = { ...initialState, targetDate: '2020-02-05' };
      const next = reducer(
        init,
        actions.fetchSuccess(events as any, '2020-02-05')
      );

      expect(snapshotDiff(init, next)).toMatchSnapshot();
    });
    test('targetDate did not match', () => {
      const init = { ...initialState, targetDate: '2020-02-05' };
      const next = reducer(
        init,
        actions.fetchSuccess(events as any, '2020-02-06')
      );

      expect(next).toEqual(init);
    });
  });

  test(ACTION_TYPES.RESET, () => {
    const init = reducer(
      { ...initialState, targetDate: '2020-02-05' },
      actions.fetchSuccess(events as any, '2020-02-05')
    );
    const next = reducer(initialState, actions.reset());

    expect(snapshotDiff(init, next)).toMatchSnapshot();
  });
});
