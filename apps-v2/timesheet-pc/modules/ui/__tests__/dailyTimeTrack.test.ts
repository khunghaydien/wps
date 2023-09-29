import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../dailyTimeTrack';

const ACTIONS = __get__('ACTIONS');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTIONS.START_LOADING, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(initialState, actions.startLoading());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTIONS.END_LOADING, () => {
    // Arrange
    const prev = {
      isLoading: true,
    };
    // Act
    const next = reducer(initialState, actions.endLoading());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
