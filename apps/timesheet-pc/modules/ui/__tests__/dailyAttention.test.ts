import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../dailyAttentions';

const ACTIONS = __get__('ACTIONS');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTIONS.SET, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(initialState, actions.set(['message1', 'message2']));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTIONS.UNSET, () => {
    // Arrange
    const prev = { message: ['message1', 'message2'] };
    // Act
    const next = reducer(initialState, actions.unset());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
