import { DailyRecord } from '@attendance/repositories/models/DailyRecord';

import {
  CODE as REQUEST_CODE,
  DailyRequestNameMap,
} from '@attendance/domain/models/AttDailyRequestType';
import {
  detectPerformableActionForFix,
  STATUS,
} from '@attendance/domain/models/AttFixSummaryRequest';
import { AttSummary } from '@attendance/domain/models/DeprecatedAttSummary';
import { Period } from '@attendance/domain/models/Timesheet';
import AttRecord from '@attendance/timesheet-pc/models/AttRecord';

function formatDate(date) {
  return [
    date.getFullYear(),
    `0${date.getMonth() + 1}`.slice(-2),
    `0${date.getDate()}`.slice(-2),
  ].join('-');
}

export const requestTypes: DailyRequestNameMap = {
  Leave: { code: 'Leave', name: '休暇申請' },
  HolidayWork: { code: 'HolidayWork', name: '休日出勤申請' },
  OvertimeWork: { code: 'OvertimeWork', name: '残業申請' },
};

export const requestIds = [
  'a077F000000UyG2QAK',
  'a077F000000UyG2QAN',
  'a077F000000V3wpQAC',
];

export const generateAttWorkingType = () => {
  return {
    startTime: 540,
    endTime: 1080,
    useObjectivelyEventLog: true,
  };
};

export const generatePeriodObjectList = (): Period[] => {
  const periods = [];

  for (let i = 0; i <= 11; i++) {
    const startDate = new Date(2017, i, 1);
    const endDate = new Date(2017, i + 1, 0);

    periods.push({
      name: `${startDate.getFullYear()}年${startDate.getMonth() + 1}月`,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
    });
  }

  return periods;
};

export const generateAttDailyRequestObjectMap = () => {
  return {
    [requestIds[0]]: {
      id: requestIds[0],
      requestTypeCode: 'Leave',
      leaveType: 'Paid',
      leaveRange: 'AM',
      status: 'Approved',
      directApplyRestList: [],
    },
    [requestIds[1]]: {
      id: requestIds[1],
      requestTypeCode: 'Leave',
      leaveType: 'Paid',
      leaveRange: 'AM',
      status: 'Approval In',
      directApplyRestList: [],
    },
    [requestIds[2]]: {
      id: requestIds[2],
      requestTypeCode: 'Leave',
      leaveType: 'Unpaid',
      leaveRange: 'AM',
      status: 'Rejected',
      directApplyRestList: [],
    },
  };
};

export const generateAttSummaryObject = (): AttSummary => ({
  id: 'dummy-id',
  requestId: 'dummy-request-id',
  status: STATUS.NOT_REQUESTED,
  approver01Name: 'dummy-approver-01-name',
  isLocked: false,
  isAllLeaveOfAbsence: false,
  performableActionForFix: detectPerformableActionForFix(STATUS.NOT_REQUESTED),
});

const recordCreator = function* () {
  for (let i = 1; i <= 31; i++) {
    // 日にち
    const date = new Date(2017, 6, i);

    // 日タイプ
    const dayTypeDummyMap = {
      // @ts-ignore
      0: AttRecord.DAY_TYPE.PREFERRED_LEGAL_HOLIDAY,
      6: AttRecord.DAY_TYPE.LEGAL_HOLIDAY,
    };
    let dayType =
      dayTypeDummyMap[date.getDate() + 1] || AttRecord.DAY_TYPE.WORKDAY;
    if ([17].includes(date.getDate() + 1)) {
      // @ts-ignore
      dayType = AttRecord.DAY_TYPE.PREFERRED_LEGAL_HOLIDAY;
    }
    if ([12].includes(date.getDate() + 1)) {
      dayType = AttRecord.DAY_TYPE.HOLIDAY;
    }

    yield [i, date, dayType];
  }
};

export const generateAttRecordObjectList = (): DailyRecord[] => {
  const attRecords = [];

  const records = recordCreator();
  for (const [i, date, dayType] of records) {
    // 申請可能な勤怠申請タイプコード一覧
    let dailyRequestTypeCodes;
    switch (date.getDay()) {
      case 0:
      case 6:
        dailyRequestTypeCodes = [
          requestTypes.Leave.code,
          requestTypes.HolidayWork.code,
        ];
        break;

      default:
        dailyRequestTypeCodes = [];
    }

    // 提出済み申請リスト
    let dailyRequestIds;
    switch (date.getDay()) {
      case 1:
        dailyRequestIds = [requestIds[0], requestIds[1]];
        break;

      case 2:
        dailyRequestIds = [requestIds[1], requestIds[2]];
        break;

      case 3:
        dailyRequestIds = [requestIds[0], requestIds[2]];
        break;

      case 4:
        dailyRequestIds = [requestIds[0], requestIds[1], requestIds[2]];
        break;

      default:
        dailyRequestIds = [];
    }

    attRecords.push({
      id: `${i}`,
      recordDate: formatDate(date),
      dayType,
      startTime: 600,
      endTime: 1140,
      startStampTime: 599,
      endStampTime: 1141,
      requestTypeCodes: dailyRequestTypeCodes,
      requestIds: dailyRequestIds,
      dailyRestList: [],
      contractedDetail: {
        workSystem: null,
        startTime: 600,
        rest5StartTime: null,
        rest5EndTime: null,
        rest4StartTime: null,
        rest4EndTime: null,
        rest3StartTime: null,
        rest3EndTime: null,
        rest2StartTime: null,
        rest2EndTime: null,
        rest1StartTime: null,
        rest1EndTime: null,
        requireOvertimeWorkApplyAfter: null,
        requireEarlyStartWorkApplyBefore: null,
        holidayWorkConfig: null,
        flexStartTime: null,
        flexEndTime: null,
        endTime: 1140,
        directApplyStartTime: null,
        directApplyRest5StartTime: null,
        directApplyRest5EndTime: null,
        directApplyRest4StartTime: null,
        directApplyRest4EndTime: null,
        directApplyRest3StartTime: null,
        directApplyRest3EndTime: null,
        directApplyRest2StartTime: null,
        directApplyRest2EndTime: null,
        directApplyRest1StartTime: null,
        directApplyRest1EndTime: null,
        directApplyEndTime: null,
        allowToChangeApproverSelf: null,
      },
    });
  }

  return attRecords;
};

export const generateAvailableRequestTypeCodesMap = () => {
  const map = {};
  const records = recordCreator();
  for (const [i, , dayType] of records) {
    switch (dayType) {
      // FIXME: GENIE-18817 PREFERRED_LEGAL_HOLIDAY は現在使われていないのでダミーデータから削除する。
      // @ts-ignore
      case AttRecord.DAY_TYPE.PREFERRED_LEGAL_HOLIDAY:
        map[i] = [];
        break;
      case AttRecord.DAY_TYPE.LEGAL_HOLIDAY:
        map[i] = [REQUEST_CODE.HolidayWork];
        break;
      case AttRecord.DAY_TYPE.HOLIDAY:
        map[i] = [REQUEST_CODE.HolidayWork];
        break;
      case AttRecord.DAY_TYPE.WORKDAY:
        map[i] = [
          REQUEST_CODE.Leave,
          REQUEST_CODE.OvertimeWork,
          REQUEST_CODE.EarlyStartWork,
          REQUEST_CODE.LateArrival,
          REQUEST_CODE.EarlyLeave,
          REQUEST_CODE.Absence,
          REQUEST_CODE.Direct,
        ];
        break;
    }
  }
  return map;
};
