import snapshotDiff from 'snapshot-diff';

import reducer, { actions, FETCH, initialState } from '../ids';

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  it(FETCH, () => {
    const next = reducer(
      initialState,
      actions.fetch(['abc', 'def', 'ghi', 'jkl'])
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
