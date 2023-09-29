import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../loadingDailyObjectivelyEventLog';

const ACTION_TYPE = __get__('ACTION_TYPE');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff(undefined, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.START, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(prev, actions.start());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.FINISH, () => {
    // Arrange
    const prev = true;
    // Act
    const next = reducer(prev, actions.finish());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
