import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  // @ts-ignore
  __set__,
  actions,
} from '../selectedId';

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
    const next = reducer(prev, actions.set('0001'));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.CLEAR, () => {
    // Arrange
    const prev = '0001';
    // Act
    const next = reducer(prev, actions.clear());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
