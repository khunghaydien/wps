import snapshotDiff from 'snapshot-diff';

import AttRecord from '../../../models/AttRecord';

// @ts-ignore
import reducer, { __get__, actions } from '../editingDailyRemarks';

const ACTIONS = __get__('ACTIONS');
const initialState = __get__('initialState');

describe('reducer()', () => {
  test('@@init', () => {
    // @ts-ignore
    const next = reducer(undefined, { type: '@@INIT' });
    expect(snapshotDiff(undefined, next)).toMatchSnapshot();
  });
  test(ACTIONS.SET, () => {
    const record = AttRecord.createFromParam(
      {
        approver01Name: '',
        ciliTimePeriods: [],
        ciloTimePeriods: [],
        coliTimePeriods: [],
        coloTimePeriods: [],
        contractedDetail: undefined,
        dayType: undefined,
        earlyLeaveEndTime: undefined,
        earlyStartWorkApplyDefaultEndTime: undefined,
        endStampTime: undefined,
        endTime: undefined,
        insufficientRestTime: undefined,
        isLeaveOfAbsence: false,
        lateArrivalStartTime: undefined,
        outEndTime: undefined,
        outStartTime: undefined,
        overtimeWorkApplyDefaultStartTime: undefined,
        realWorkTime: undefined,
        requestIds: [],
        requestTypeCodes: [],
        rest1EndTime: undefined,
        rest1StartTime: undefined,
        rest2EndTime: undefined,
        rest2StartTime: undefined,
        rest3EndTime: undefined,
        rest3StartTime: undefined,
        rest4EndTime: undefined,
        rest4StartTime: undefined,
        rest5EndTime: undefined,
        rest5StartTime: undefined,
        restHours: undefined,
        startStampTime: undefined,
        id: 'a0D2v00001DXpnZEAT',
        recordDate: '2020-04-03',
        startTime: 540,
        remarks: '',
        commuteForwardCount: null,
        commuteBackwardCount: null,
      },
      false
    );

    // Arrange
    const prev = {};
    // Act
    const next = reducer(initialState, actions.set(record));
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
  test(ACTIONS.UNSET, () => {
    // Arrange
    const prev = {
      recordId: 'a0D2v00001DXpnZEAT',
      recordDate: '2020-04-03',
      remarks: '',
    };
    // Act
    const next = reducer(prev, actions.unset());
    // Assert
    expect(snapshotDiff(prev, next)).toMatchSnapshot();
  });
});
