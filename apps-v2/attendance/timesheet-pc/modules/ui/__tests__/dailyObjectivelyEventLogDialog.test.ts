import snapshotDiff from 'snapshot-diff';

import reducer, {
  // @ts-ignore
  __get__,
  close,
  open,
} from '../dailyObjectivelyEventLogDialog';

const ACTION_TYPE = __get__('ACTION_TYPE');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff(undefined, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.OPEN, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(prev, open());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.CLOSE, () => {
    // Arrange
    const prev = true;
    // Act
    const next = reducer(prev, close());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
