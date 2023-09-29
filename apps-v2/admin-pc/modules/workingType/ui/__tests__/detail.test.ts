import snapshotDiff from 'snapshot-diff';

import reducer, { ACTION_TYPE, actions, initialState, State } from '../detail';

describe('reducer()', () => {
  test('@@INIT', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.INIT, () => {
    // Arrange
    const prev: State = {
      selectedIndex: 0,
      selectedHistoryId: 'h01',
    };
    // Execute
    const next = reducer(prev, actions.initialize());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.SET_SELECTED_HISTORY_ID, () => {
    // Arrange
    const prev = initialState;
    // Execute
    const next = reducer(prev, actions.setSelectedHistoryId('h01'));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
