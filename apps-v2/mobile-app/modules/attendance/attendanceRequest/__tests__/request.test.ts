import snapshotDiff from 'snapshot-diff';

import STATUS from '@apps/domain/models/approval/request/Status';
import { createTimesheet } from '@attendance/domain/models/__tests__/mocks/timesheet';
import { ACTIONS_FOR_FIX } from '@attendance/domain/models/AttFixSummaryRequest';
import { Timesheet } from '@attendance/domain/models/Timesheet';

import reducer, {
  // @ts-ignore
  __get__,
  actions,
} from '../request';

const ACTION_TYPES = __get__('ACTION_TYPES');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  test(ACTION_TYPES.INITIALIZE, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(
      prev,
      actions.initialize(
        createTimesheet({
          status: STATUS.NotRequested,
        } as unknown as Timesheet)
      )
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPES.SET_COMMENT, () => {
    // Arrange
    const prev = initialState;
    // Act
    const next = reducer(prev, actions.setComment('New Comment'));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPES.UNSET_COMMENT, () => {
    // Arrange
    const prev = {
      ...initialState,
      comment: 'Old Comment',
    };
    // Act
    const next = reducer(initialState, actions.unsetComment());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPES.CLEAR, () => {
    // Arrange
    const prev = {
      summaryId: '0001',
      requestId: '0002',
      status: STATUS.Approved,
      comment: 'Old Comment',
      performableActionForFix: ACTIONS_FOR_FIX.Submit,
    };
    // Act
    const next = reducer(prev, actions.clear());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
