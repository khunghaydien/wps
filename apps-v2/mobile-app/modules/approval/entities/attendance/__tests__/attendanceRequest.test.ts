import snapshotDiff from 'snapshot-diff';

import { defaultValue } from '@attendance/domain/models/approval/__tests__/mocks/AttAttendanceRequestDetail.mock';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../attendanceRequest';

const ACTION_TYPES = __get__('ACTION_TYPES');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTION_TYPES.SET, () => {
    // Arrange
    const prev = {};
    // Act
    const next = reducer(prev, actions.set(defaultValue));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPES.CLEAR, () => {
    // Arrange
    const prev = defaultValue;
    // Act
    const next = reducer(prev, actions.clear());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
