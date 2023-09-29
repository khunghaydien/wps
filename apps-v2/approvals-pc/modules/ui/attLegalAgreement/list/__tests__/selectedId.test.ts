import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  // @ts-ignore
  __set__,
  actions,
} from '../selectedIds';

const ACTION_TYPE = __get__('ACTION_TYPE');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer([], { type: '@@INIT' });
    expect(snapshotDiff([], next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.SET, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(prev, actions.set(['0001', '0002']));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.CLEAR, () => {
    // Arrange
    const prev = ['0001'];
    // Act
    const next = reducer(prev, actions.clear());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.REMOVE, () => {
    // Arrange
    const prev = ['0001', '0002', '0003'];
    // Act
    const next = reducer(prev, actions.remove('0001'));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
