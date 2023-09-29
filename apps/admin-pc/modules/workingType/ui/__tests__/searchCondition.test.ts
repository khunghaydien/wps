// @flow

import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  INITIALIZE,
  initialState,
  SET,
} from '../searchCondition';

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(INITIALIZE, () => {
    const state = {
      targetDate: '2019-10-01',
    };
    const next = reducer(state, actions.initialize());
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });
  it(SET, () => {
    const next = reducer(
      initialState,
      // @ts-ignore
      actions.set({
        targetDate: '2019-10-01',
      })
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
