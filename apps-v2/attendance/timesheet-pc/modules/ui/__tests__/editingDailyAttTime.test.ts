import snapshotDiff from 'snapshot-diff';

import { DailyObjectivelyEventLog } from '@attendance/domain/models/DailyObjectivelyEventLog';

import reducer, {
  // @ts-ignore
  __get__,
  ACTION_TYPE,
  actions,
  State,
} from '../editingDailyAttTime';
import dailyAttTime from './mocks/dailyAttTime';
import { time } from '@attendance/__tests__/helpers';

const initialState = __get__('initialState');

jest.mock('nanoid', () => {
  let i = 1;
  return {
    __esModule: true,
    default: () => `${i++}`,
  };
});

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff(undefined, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.SET, () => {
    // Arrange
    const prev = {};
    // Act
    const next = reducer(initialState, actions.set(dailyAttTime));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.UNSET, () => {
    // Arrange
    const prev = dailyAttTime;
    // Act
    const next = reducer(dailyAttTime, actions.unset());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.UPDATE, () => {
    // Arrange
    const prev = dailyAttTime;
    // Act
    const next = reducer(dailyAttTime, actions.update('endTime', '24:00'));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(`${ACTION_TYPE.UPDATE_DEVIATED_TIME_REASON} entering`, () => {
    // Arrange
    const prev = dailyAttTime;
    // Act
    const next = reducer(
      dailyAttTime,
      actions.updateDeviationReason('entering', 'text', 'reason')
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(`${ACTION_TYPE.UPDATE_DEVIATED_TIME_REASON} leaving`, () => {
    // Arrange
    const prev = dailyAttTime;
    // Act
    const next = reducer(
      dailyAttTime,
      actions.updateDeviationReason('leaving', 'text', 'reason')
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.ADD_REST_TIME, () => {
    // Arrange
    const prev = dailyAttTime;
    // Act
    const next = reducer(dailyAttTime, actions.addRestTime());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.DELETE_REST_TIME, () => {
    // Arrange
    const prev = dailyAttTime;
    // Act
    const next = reducer(dailyAttTime, actions.deleteRestTime(1));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.UPDATE_REST_TIME, () => {
    // Arrange
    const prev = dailyAttTime;
    // Act
    const next = reducer(
      dailyAttTime,
      actions.updateRestTime(1, {
        id: dailyAttTime.restTimes.at(1).id,
        startTime: time(12, 0),
        endTime: time(13, 0),
        restReason: {
          id: 'a0A2800000FmMQCEA1',
          name: 'お昼休み',
          code: '001',
        },
      })
    );
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTION_TYPE.UPDATE_REST_TIMES, () => {
    // Arrange
    const prev = dailyAttTime;
    // Act
    const newRestTimes = dailyAttTime.restTimes;
    newRestTimes[0] = {
      id: null,
      startTime: time(7, 0),
      endTime: time(13, 0),
      restReason: {
        id: 'a0A2800000FmMQCEA1',
        name: 'お昼休み',
        code: '001',
      },
    };
    const next = reducer(dailyAttTime, actions.updateRestTimes(newRestTimes));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });

  describe(ACTION_TYPE.UPDATE_DAILY_OBJECTIVELY_EVENT_LOG, () => {
    it('should update', () => {
      // Arrange
      const prev = {
        ...dailyAttTime,
        dailyObjectivelyEventLog: {
          id: 'XXXX',
          name: 'ZZZZ',
          deviatedEnteringTimeReason: {
            value: null,
            text: 'Old EnteringReason',
          },
          deviatedLeavingTimeReason: {
            value: null,
            text: 'Old LeavingReason',
          },
        },
      } as unknown as State;
      // Act
      const next = reducer(
        prev,
        actions.updateDailyObjectivelyEventLog({
          id: 'YYYY',
          name: 'WWWW',
          deviatedEnteringTimeReason: {
            value: null,
            text: 'New EnteringReason',
          },
          deviatedLeavingTimeReason: {
            value: null,
            text: 'New LeavingReason',
          },
        } as unknown as DailyObjectivelyEventLog)
      );
      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
    it('should update if payload is null', () => {
      // Arrange
      const prev = {
        ...dailyAttTime,
        dailyObjectivelyEventLog: {
          id: 'XXXX',
          name: 'ZZZZ',
          deviatedEnteringTimeReason: {
            value: null,
            text: 'Old EnteringReason',
          },
          deviatedLeavingTimeReason: {
            value: null,
            text: 'Old LeavingReason',
          },
        },
      } as unknown as State;
      // Act
      const next = reducer(prev, actions.updateDailyObjectivelyEventLog(null));
      // Assert
      expect(snapshotDiff(prev, next)).toMatchSnapshot();
    });
  });
});
