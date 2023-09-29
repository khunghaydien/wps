import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../warning';

const ACTION_TYPES = __get__('ACTION_TYPES');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTION_TYPES.SET_MESSAGES, () => {
    // Arrange
    const prev = initialState;
    const messages: string[] = [];
    for (let i = 0; i < 3; i++) {
      messages.push('Messages ' + i);
    }
    // Act
    const next = reducer(
      prev,
      actions.setMessages(messages, (_: boolean) => {})
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPES.CLEAR, () => {
    // Arrange
    const messages: string[] = [];
    for (let i = 0; i < 3; i++) {
      messages.push('Messages ' + i);
    }
    const prev = {
      messages,
      callback: (_: boolean) => {},
    };
    // Act
    const next = reducer(prev, actions.clear());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
