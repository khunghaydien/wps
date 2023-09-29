import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  // @ts-ignore
  __set__,
  ACTION_TYPE,
  actions,
} from '../checked';

const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff(undefined, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.SET, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(prev, actions.set(['0001', '0002']));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.SET_MAX, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(prev, actions.setMax(15));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.CLEAR, () => {
    // Arrange
    const prev = { max: 10, ids: ['0001', '0002'] };
    // Act
    const next = reducer(prev, actions.clear());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
