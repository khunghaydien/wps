import snapshotDiff from 'snapshot-diff';

import { none } from '@attendance/domain/models/approval/AttDailyRequestDetail/__tests__/mocks';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../dailyRequest';

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
    const next = reducer(prev, actions.set(none));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
