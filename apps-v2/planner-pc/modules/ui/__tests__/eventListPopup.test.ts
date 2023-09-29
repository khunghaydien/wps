import snapshotDiff from 'snapshot-diff';

import reducer, { actions, initialState } from '../eventListPopup';

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test('OPEN_POPUP', () => {
    const next = reducer(
      initialState,
      actions.open(new Date('2019-09-28T15:00:00.000Z'), 215, 20)
    );
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
  test('CLOSE_POPUP', () => {
    const next = reducer(initialState, actions.close());
    expect(snapshotDiff(initialState, next)).toMatchSnapshot();
  });
});
