import snapshotDiff from 'snapshot-diff';

import reducer, { actions, DISABLE, ENABLE } from '../blocking';

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ENABLE, () => {
    const initialState = { enabled: false };
    const next = reducer(initialState, actions.enable());
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test(DISABLE, () => {
    const initialState = { enabled: true };
    const next = reducer(initialState, actions.disable());
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
