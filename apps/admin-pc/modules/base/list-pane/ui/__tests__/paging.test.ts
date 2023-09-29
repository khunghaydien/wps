import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  INITIALIZE,
  initialState,
  SET_CURRENT,
} from '../paging';

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(INITIALIZE, () => {
    const next = reducer(
      initialState,
      actions.initialize(
        {
          // @ts-ignore
          page: 1,
          limitPerPage: 10,
          limit: 100,
        },
        true
      )
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });

  it(SET_CURRENT, () => {
    const state = {
      current: 1,
      isOverLimit: false,
    };
    // @ts-ignore
    const next = reducer(state, actions.setCurrent(5));
    expect(snapshotDiff(state, next)).toMatchSnapshot();
  });
});
