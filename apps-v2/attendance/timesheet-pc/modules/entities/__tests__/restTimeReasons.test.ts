import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  clear,
  set,
  State,
} from '../restTimeReasons';

const ACTION_TYPE = __get__('ACTION_TYPE');
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
    const next = reducer(prev, set(['record1', 'record2'] as unknown as State));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.CLEAR, () => {
    // Arrange
    const prev = ['record1', 'record2'] as unknown as State;
    // Act
    const next = reducer(prev, clear());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
