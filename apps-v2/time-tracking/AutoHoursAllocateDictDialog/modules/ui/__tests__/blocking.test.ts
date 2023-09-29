import snapshotDiff from 'snapshot-diff';

import reducer, { actions, ActionType } from '../blocking';

describe('reducer()', () => {
  test('@@init', () => {
    // Act
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });

    // Assert
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });

  test(ActionType.ENABLE, () => {
    // Arrange
    const prev = { enabled: false };

    // Arrange
    const next = reducer(prev, actions.enable());

    // Act
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });

  test(ActionType.DISABLE, () => {
    // Arrange
    const prev = { enabled: true };

    // Act
    const next = reducer(prev, actions.disable());

    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
