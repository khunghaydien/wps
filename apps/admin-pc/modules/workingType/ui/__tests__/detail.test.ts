// @ts-nocheck
import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  INITIALIZE,
  initialState,
  SET_SELECTED_HISTORY_ID,
  State,
} from '../detail';

describe('reducer()', () => {
  test('@@INIT', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(INITIALIZE, () => {
    // Arrange
    const prev: State = {
      // @ts-ignore
      selectedIndex: 0,
    };
    // Execute
    const next = reducer(prev, actions.initialize());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(SET_SELECTED_HISTORY_ID, () => {
    // Arrange
    const prev = initialState;
    // Execute
    // @ts-ignore
    const next = reducer(prev, actions.setSelectedHistoryId(0));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
