import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../page';

const ACTION_TYPE = __get__('ACTION_TYPE');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.START_LOADING, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(initialState, actions.startLoading());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.FINISH_LOADING, () => {
    // Arrange
    const prev = {
      ...initialState,
      loading: true,
    };

    // Act
    const next = reducer(initialState, actions.finishLoading());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.OPEN, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(initialState, actions.openRequest());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.CLOSE, () => {
    // Arrange
    const prev = {
      ...initialState,
      isOpen: true,
    };
    // Act
    const next = reducer(initialState, actions.closeRequest());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
