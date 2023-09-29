import snapshotDiff from 'snapshot-diff';

import reducer, {
  actions,
  INITIALIZE,
  initialState,
  RESET_SELECTED_CODE,
  SET_SELECTED_CODE,
  State,
} from '../list';

describe('reducer()', () => {
  test('@@INIT', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(INITIALIZE, () => {
    // Arrange
    const prev: State = {
      selectedCode: 'code-0',
    };
    // Execute
    const next = reducer(prev, actions.initialize());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(SET_SELECTED_CODE, () => {
    // Arrange
    const prev = initialState;
    // Execute
    const next = reducer(prev, actions.setSelectedIndex('code-1'));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(RESET_SELECTED_CODE, () => {
    // Arrange
    const prev = {
      selectedCode: 'code-0',
    };
    // Execute
    const next = reducer(prev, actions.resetSelectedIndex());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
