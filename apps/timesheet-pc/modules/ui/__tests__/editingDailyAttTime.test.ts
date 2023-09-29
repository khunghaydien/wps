import snapshotDiff from 'snapshot-diff';

// @ts-ignore
import reducer, { __get__, actions } from '../editingDailyAttTime';
import dailyAttTime from './mocks/dailyAttTime';

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
    const prev = {};
    // Act
    const next = reducer(initialState, actions.set(dailyAttTime));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTIONS.UNSET, () => {
    // Arrange
    const prev = dailyAttTime;
    // Act
    const next = reducer(dailyAttTime, actions.unset());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTIONS.UPDATE, () => {
    // Arrange
    const prev = dailyAttTime;
    // Act
    const next = reducer(dailyAttTime, actions.update('endTime', '24:00'));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTIONS.UPDATE_REST_TIME, () => {
    // Arrange
    const prev = dailyAttTime;
    // Act
    const next = reducer(
      dailyAttTime,
      actions.updateRestTime(0, 'start', '07:00')
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTIONS.ADD_REST_TIME, () => {
    // Arrange
    const prev = dailyAttTime;
    // Act
    const next = reducer(dailyAttTime, actions.addRestTime());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTIONS.DELETE_REST_TIME, () => {
    // Arrange
    const prev = dailyAttTime;
    // Act
    const next = reducer(dailyAttTime, actions.deleteRestTime(3));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
