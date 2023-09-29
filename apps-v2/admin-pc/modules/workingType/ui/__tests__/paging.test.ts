import snapshotDiff from 'snapshot-diff';

import reducer, { ACTION_TYPE, actions, initialState } from '../paging';

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(ACTION_TYPE.INIT, () => {
    const next = reducer(
      initialState,
      actions.initialize({
        current: 100,
        limit: 5000,
        limitPerPage: 100,
        isOverLimit: false,
      })
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(ACTION_TYPE.SET_CURRENT, () => {
    const next = reducer(initialState, actions.setCurrent(3));
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  it(ACTION_TYPE.RESET, () => {
    const prev = {
      current: 100,
      limit: 5000,
      limitPerPage: 100,
      isOverLimit: false,
    };
    const next = reducer(prev, actions.reset());
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
