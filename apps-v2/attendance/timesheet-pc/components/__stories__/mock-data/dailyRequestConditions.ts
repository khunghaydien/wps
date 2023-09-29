// FIXME: API未加工のモデルは使いたくないが古い実装に合わせるために仕方なく使用している
import { DailyRecord as AttDailyRecordFromRemote } from '@attendance/repositories/models/DailyRecord';

import defaultPermission from '../../../../../domain/models/access-control/Permission';
import AttRecord from '../../../models/AttRecord';
import DailyRequestConditions from '../../../models/DailyRequestConditions';
import { STATUS } from '@attendance/domain/models/AttDailyRequest';
import { CODE } from '@attendance/domain/models/AttDailyRequestType';

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
  dailyRestList: [],
  restHours: undefined,
  otherRestReason: null,
  startStampTime: undefined,
  startTime: undefined,
  useManageLateArrivalPersonalReason: false,
  useManageEarlyLeavePersonalReason: false,
  workSystem: undefined,
  flexStartTime: undefined,
  flexEndTime: undefined,
  withoutCoreTime: undefined,
  recordDate: '2017-08-01',
  dayType: AttRecord.DAY_TYPE.WORKDAY,
  requestTypeCodes: Object.entries(availableRequestTypes).map(
    (reqType) => reqType[1].code
  ),
  fixDailyRequest: {
    id: undefined,
    status: undefined,
    approver01Name: undefined,
    performableActionForFix: undefined,
  },
  requestDayType: 'Holiday',
  isDirectInputTimeRequest: false,
  isLocked: false,
  isHolLegalHoliday: false,
  outInsufficientMinimumWorkHours: 0,
  isFlexWithoutCore: false,
  isFlexWithoutCoreRequireEarlyLeaveApply: false,
  personalReasonEarlyLeaveEndTime: null,
  objectiveReasonEarlyLeaveEndTime: null,
  lateArrivalEarlyLeaveReasonId: '',
  commuteForwardCount: null,
  commuteBackwardCount: null,
};

const commonRequestMapParam = {
  Rejected: dummyRequestsMap[STATUS.REJECTED],
  ApprovalIn: dummyRequestsMap[STATUS.APPROVAL_IN],
  Approved: dummyRequestsMap[STATUS.APPROVED],
  Removed: dummyRequestsMap[STATUS.RECALLED],
};

export default DailyRequestConditions.createFromParams(
  AttRecord.createFromParam(
    {
      ...commonAttRecordParam,
      requestIds: ['Rejected', 'ApprovalIn', 'Approved', 'Removed'],
    },
    {
      useFixDailyRequest: false,
      isSummaryLocked: false,
    }
  ),
  commonRequestMapParam,
  availableRequestTypes,
  otherConditions
);

export const dailyRequestConditionsHasRejected =
  DailyRequestConditions.createFromParams(
    AttRecord.createFromParam(
      {
        ...commonAttRecordParam,
        requestIds: ['Rejected', 'ApprovalIn', 'Approved', 'Removed'],
      },
      {
        useFixDailyRequest: false,
        isSummaryLocked: false,
      }
    ),
    commonRequestMapParam,
    availableRequestTypes,
    otherConditions
  );

export const dailyRequestConditionsHasApprovalIn =
  DailyRequestConditions.createFromParams(
    AttRecord.createFromParam(
      {
        ...commonAttRecordParam,
        requestIds: ['ApprovalIn', 'Approved', 'Removed'],
      },
      {
        useFixDailyRequest: false,
        isSummaryLocked: false,
      }
    ),
    commonRequestMapParam,
    availableRequestTypes,
    otherConditions
  );

export const dailyRequestConditionsHasApproved =
  DailyRequestConditions.createFromParams(
    AttRecord.createFromParam(
      {
        ...commonAttRecordParam,
        requestIds: ['Approved', 'Removed'],
      },
      {
        useFixDailyRequest: false,
        isSummaryLocked: false,
      }
    ),
    commonRequestMapParam,
    availableRequestTypes,
    otherConditions
  );

export const dailyRequestConditionsHasNoRequests =
  DailyRequestConditions.createFromParams(
    AttRecord.createFromParam(
      {
        ...commonAttRecordParam,
        requestIds: [],
      },
      {
        useFixDailyRequest: false,
        isSummaryLocked: false,
      }
    ),
    commonRequestMapParam,
    availableRequestTypes,
    otherConditions
  );

export const dailyRequestConditionsMap = {};

for (let date = 1; date <= 31; date++) {
  const recordDate = `2017-07-${`0${date}`.slice(-2)}`;
  dailyRequestConditionsMap[recordDate] =
    DailyRequestConditions.createFromParams(
      AttRecord.createFromParam(
        {
          ...commonAttRecordParam,
          recordDate,
          requestIds: [Object.keys(dummyRequestsMap)[date % 6]],
        },
        {
          useFixDailyRequest: false,
          isSummaryLocked: false,
        }
      ),
      dummyRequestsMap,
      availableRequestTypes,
      otherConditions
    );
}
