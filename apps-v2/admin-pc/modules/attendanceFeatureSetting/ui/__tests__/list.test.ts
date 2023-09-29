import snapshotDiff from 'snapshot-diff';

import reducer, { ACTION_TYPE, actions, initialState, State } from '../list';

describe('reducer()', () => {
  test('@@INIT', () => {
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.INIT, () => {
    const prev: State = {
      selectedCode: 'code-0',
    };

    const next = reducer(prev, actions.initialize());

    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.SET_SELECTED_INDEX, () => {
    const prev = initialState;

    const next = reducer(prev, actions.setSelectedCode('code-1'));

    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.RESET_SELECTED_INDEX, () => {
    const prev = {
      selectedCode: 'code-0',
    };

    const next = reducer(prev, actions.resetSelectedCode());

    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
