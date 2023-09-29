import snapshotDiff from 'snapshot-diff';

// @ts-ignore
import reducer, { __get__, actions } from '../targetDate';

const ACTIONS = __get__('ACTIONS');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff(undefined, next)).toMatchSnapshot();
  });
  test(ACTIONS.SET, () => {
    // Arrange
    const prev = '';
    // Act
    const next = reducer(initialState, actions.set('2020-04-21'));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTIONS.UNSET, () => {
    // Arrange
    const prev = '2020-04-21';
    // Act
    const next = reducer(initialState, actions.unset());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
