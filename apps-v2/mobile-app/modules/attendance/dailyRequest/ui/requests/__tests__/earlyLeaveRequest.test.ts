import snapshotDiff from 'snapshot-diff';

import { DAY_TYPE } from '@attendance/domain/models/AttDailyRecord';
import { defaultValue } from '@attendance/domain/models/AttDailyRequest/BaseAttDailyRequest';
import { create } from '@attendance/domain/models/AttDailyRequest/EarlyLeaveRequest';

import reducer, {
  actions,
  INITIALIZE,
  initialState,
  UPDATE,
} from '../earlyLeaveRequest';

const record = {
  id: 'abc',
  recordDate: '2020-01-01',
  dayType: DAY_TYPE.Workday,
  startTime: null,
  endTime: null,
  startStampTime: null,
  endStampTime: null,
  restTimes: [],
  requestTypeCodes: [],
  requestIds: [],
  contractedDetail: {
    endTime: 18 * 60,
  },
  ciliTimePeriods: [],
  ciloTimePeriods: [],
  coliTimePeriods: [],
  coloTimePeriods: [],
  remarks: '',
  isLeaveOfAbsence: false,
  insufficientRestTime: null,
  restHours: null,
  outStartTime: null,
  outEndTime: null,
  approver01Name: '',
  realWorkTime: 0,
};

describe('reducer()', () => {
  it('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff({}, next)).toMatchSnapshot();
  });
  describe(`${INITIALIZE}`, () => {
    it('should be executed without AttDailyRecord', () => {
      const request = create(defaultValue);
      const next = reducer(initialState, actions.initialize(request));
      expect(snapshotDiff(initialState, next)).toMatchSnapshot();
    });
    it('should be executed with AttDailyRecord', () => {
      const request = create(defaultValue);
      // @ts-ignore
      const next = reducer(initialState, actions.initialize(request, record));
      expect(snapshotDiff(initialState, next)).toMatchSnapshot();
    });
  });
  describe(`${UPDATE}`, () => {
    it('should not be executed if state is not initializing', () => {
      const next = reducer(initialState, actions.update('startTime', 9 * 60));
      expect(snapshotDiff(initialState, next)).toMatchSnapshot();
    });
    it('should be executed ', () => {
      // @ts-ignore
      const state = reducer(initialState, actions.initialize());
      const next = reducer(state, actions.update('startTime', 9 * 60));
      expect(snapshotDiff(state, next)).toMatchSnapshot();
    });
  });
});
