import defaultPermission from '../../../../domain/models/access-control/Permission';
import STATUS from '../../../../domain/models/approval/request/Status';
import { CODE } from '../../../../domain/models/attendance/AttDailyRequestType';
import AttRecord from '../../../models/AttRecord';
import DailyRequestConditions from '../../../models/DailyRequestConditions';
import { AttDailyRecordFromRemote } from '@apps/domain/models/attendance/AttDailyRecord';

import dummyRequestsMap from './attDailyRequestMap';

const availableRequestTypes = {
  Leave: { code: CODE.Leave, name: '休暇申請' },
  HolidayWork: {
    code: CODE.HolidayWork,
    name: '休日出勤申請',
  },
  OvertimeWork: {
    code: CODE.OvertimeWork,
    name: '残業申請',
  },
  EarlyStartWork: {
    code: CODE.EarlyStartWork,
    name: '早朝勤務申請',
  },
  Absence: {
    code: CODE.Absence,
    name: '欠勤申請',
  },
  Pattern: {
    code: CODE.Pattern,
    name: '勤務時間変更申請',
  },
};

const otherConditions = {
  isSummaryLocked: false,
  isByDelegate: false,
  userPermission: defaultPermission,
};

const commonAttRecordParam: AttDailyRecordFromRemote = {
  approver01Name: '',
  ciliTimePeriods: [],
  ciloTimePeriods: [],
  coliTimePeriods: [],
  coloTimePeriods: [],
  contractedDetail: undefined,
  earlyLeaveEndTime: undefined,
  earlyStartWorkApplyDefaultEndTime: undefined,
  endStampTime: undefined,
  endTime: undefined,
  id: '',
  insufficientRestTime: undefined,
  isLeaveOfAbsence: false,
  lateArrivalStartTime: undefined,
  outEndTime: undefined,
  outStartTime: undefined,
  overtimeWorkApplyDefaultStartTime: undefined,
  realWorkTime: undefined,
  remarks: undefined,
  requestIds: [],
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
  startTime: undefined,
  recordDate: '2017-08-01',
  dayType: AttRecord.DAY_TYPE.WORKDAY,
  requestTypeCodes: Object.entries(availableRequestTypes).map(
    (reqType) => reqType[1].code
  ),
  commuteForwardCount: null,
  commuteBackwardCount: null,
};

const commonRequestMapParam = {
  Rejected: dummyRequestsMap[STATUS.Rejected],
  ApprovalIn: dummyRequestsMap[STATUS.ApprovalIn],
  Approved: dummyRequestsMap[STATUS.Approved],
  Removed: dummyRequestsMap[STATUS.Recalled],
};

export default DailyRequestConditions.createFromParams(
  new AttRecord({
    ...commonAttRecordParam,
    requestIds: ['Rejected', 'ApprovalIn', 'Approved', 'Removed'],
    isSummaryLocked: false,
  }),
  commonRequestMapParam,
  availableRequestTypes,
  otherConditions
);

export const dailyRequestConditionsHasRejected =
  DailyRequestConditions.createFromParams(
    new AttRecord({
      ...commonAttRecordParam,
      requestIds: ['Rejected', 'ApprovalIn', 'Approved', 'Removed'],
      isSummaryLocked: false,
    }),
    commonRequestMapParam,
    availableRequestTypes,
    otherConditions
  );

export const dailyRequestConditionsHasApprovalIn =
  DailyRequestConditions.createFromParams(
    new AttRecord({
      ...commonAttRecordParam,
      requestIds: ['ApprovalIn', 'Approved', 'Removed'],
      isSummaryLocked: false,
    }),
    commonRequestMapParam,
    availableRequestTypes,
    otherConditions
  );

export const dailyRequestConditionsHasApproved =
  DailyRequestConditions.createFromParams(
    new AttRecord({
      ...commonAttRecordParam,
      requestIds: ['Approved', 'Removed'],
      isSummaryLocked: false,
    }),
    commonRequestMapParam,
    availableRequestTypes,
    otherConditions
  );

export const dailyRequestConditionsHasNoRequests =
  DailyRequestConditions.createFromParams(
    new AttRecord({
      ...commonAttRecordParam,
      requestIds: [],
      isSummaryLocked: false,
    }),
    commonRequestMapParam,
    availableRequestTypes,
    otherConditions
  );

export const dailyRequestConditionsMap = {};

for (let date = 1; date <= 31; date++) {
  const recordDate = `2017-07-${`0${date}`.slice(-2)}`;
  dailyRequestConditionsMap[recordDate] =
    DailyRequestConditions.createFromParams(
      new AttRecord({
        ...commonAttRecordParam,
        recordDate,
        requestIds: [Object.keys(dummyRequestsMap)[date % 6]],
        isSummaryLocked: false,
      }),
      dummyRequestsMap,
      availableRequestTypes,
      otherConditions
    );
}
