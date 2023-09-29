// FIXME: 本来ならばドメインの型を使用するべきだが古い実装のために仕方なく使用している
import { createDailyContractDetail as createAttDailyContractDetailFromRemote } from '@attendance/repositories/models/DailyRecord';
import { Timesheet as TimesheetFromRemote } from '@attendance/repositories/models/Timesheet';

import AttRecord from '../../models/AttRecord';
import { createAttDailyAttentions } from '@attendance/domain/models/AttDailyAttention';
import { AttDailyRecordContractedDetail } from '@attendance/domain/models/AttDailyRecord';
import * as AttDailyRequest from '@attendance/domain/models/AttDailyRequest';
import * as AttDailyRequestType from '@attendance/domain/models/AttDailyRequestType';
import { detectPerformableActionForFix } from '@attendance/domain/models/AttFixSummaryRequest';
import { CommuteCount } from '@attendance/domain/models/CommuteCount';
import { DailyObjectivelyEventLog } from '@attendance/domain/models/DailyObjectivelyEventLog';
import { AttSummary } from '@attendance/domain/models/DeprecatedAttSummary';
import { createFromRemote as createFixDailyRequestFromRemote } from '@attendance/domain/models/FixDailyRequest';
import { OwnerInfo, Period } from '@attendance/domain/models/Timesheet';
import * as WorkingType from '@attendance/domain/models/WorkingType';

import ROOT from './actionType';

import * as RecordsUtil from '@attendance/libraries/utils/Records';

import * as attendanceHelper from '@attendance/ui/helpers/attentionDailyMessages';

const ACTION_TYPE_ROOT = `${ROOT}/TIMESHEET` as const;

export type State = {
  ownerInfos: OwnerInfo[] | null;
  workingTypes: WorkingType.WorkingType[] | null;
  summaryPeriodList: Period[] | null;
  attDailyRequestTypeMap: AttDailyRequestType.DailyRequestNameMap | null;
  attDailyRequestMap: {
    [key: string]: AttDailyRequest.AttDailyRequest;
  } | null;
  attRecordList: Array<AttRecord> | null;
  dailyAttentionMessagesMap: { [date: string]: string[] } | null;
  dailyContractedDetailMap: {
    [date: string]: AttDailyRecordContractedDetail;
  } | null;
  attSummary: AttSummary | null;
  dailyObjectivelyEventLogs: DailyObjectivelyEventLog[] | null;
  workingType: {
    useAllowanceManagement: boolean;
    useManageCommuteCount: boolean;
    useObjectivelyEventLog: boolean;
    useFixDailyRequest: boolean;
    useLegalAgreement: boolean;
    useLegalAgreementMonthlyRequest: boolean;
    useLegalAgreementYearlyRequest: boolean;
  };
  dailyRestCountLimit: number;
};

export const initialState: State = {
  ownerInfos: null,
  workingTypes: null,
  summaryPeriodList: null,
  attDailyRequestTypeMap: null,
  attDailyRequestMap: null,
  attRecordList: null,
  dailyAttentionMessagesMap: null,
  dailyContractedDetailMap: null,
  attSummary: null,
  dailyObjectivelyEventLogs: null,
  workingType: {
    useLegalAgreement: false,
    useLegalAgreementMonthlyRequest: false,
    useLegalAgreementYearlyRequest: false,
    useAllowanceManagement: false,
    useManageCommuteCount: false,
    useObjectivelyEventLog: false,
    useFixDailyRequest: false,
  },
  dailyRestCountLimit: 0,
};

const WORKING_TYPE_KEYS = Object.keys(initialState.workingType) as Array<
  keyof State['workingType']
>;

export const ACTIONS = {
  SET_TIMESHEET_ITEMS: `${ACTION_TYPE_ROOT}/SET_TIMESHEET_ITEMS`,
  SET_DAILY_OBJECTIVELY_EVENT_LOGS: `${ACTION_TYPE_ROOT}/SET_DAILY_OBJECTIVELY_EVENT_LOGS`,
  UPDATE_COMMUTE_COUNT: `${ACTION_TYPE_ROOT}/UPDATE_COMMUTE_COUNT`,
  UPDATE_DAILY_OBJECTIVELY_EVENT_LOG: `${ACTION_TYPE_ROOT}/UPDATE_DAILY_OBJECTIVELY_EVENT_LOG`,
  CLEAR_REQUEST_TYPE_CODES: `${ACTION_TYPE_ROOT}/CLEAR_REQUEST_TYPE_CODES`,
  SET_REQUEST_TYPE_CODES: `${ACTION_TYPE_ROOT}/SET_REQUEST_TYPE_CODES`,
} as const;

type SetTimesheetAction = {
  type: typeof ACTIONS.SET_TIMESHEET_ITEMS;
  payload: {
    entities: TimesheetFromRemote;
    targetEmployeeId: string | null;
    dailyObjectivelyEventLogs?: DailyObjectivelyEventLog[] | null;
  };
};

type UpdateCommuteCountAction = {
  type: typeof ACTIONS.UPDATE_COMMUTE_COUNT;
  payload: {
    targetDate: string;
    commuteCount: CommuteCount;
  };
};

type SetDailyObjectivelyEventLogsAction = {
  type: typeof ACTIONS.SET_DAILY_OBJECTIVELY_EVENT_LOGS;
  payload: DailyObjectivelyEventLog[] | null;
};

type UpdateDailyObjectivelyEventLogAction = {
  type: typeof ACTIONS.UPDATE_DAILY_OBJECTIVELY_EVENT_LOG;
  payload: {
    targetDate: string;
    dailyObjectivelyEventLog: DailyObjectivelyEventLog | null;
  };
};

type ClearRequestTypeCodes = {
  type: typeof ACTIONS.CLEAR_REQUEST_TYPE_CODES;
};

type SetRequestTypeCodes = {
  type: typeof ACTIONS.SET_REQUEST_TYPE_CODES;
  payload: { [id: string]: AttDailyRequestType.Code[] };
};

type Actions =
  | SetTimesheetAction
  | SetDailyObjectivelyEventLogsAction
  | UpdateCommuteCountAction
  | UpdateDailyObjectivelyEventLogAction
  | ClearRequestTypeCodes
  | SetRequestTypeCodes;

export const actions = {
  setTimesheetItems: (
    entities: TimesheetFromRemote,
    targetEmployeeId: string | null = null
  ): SetTimesheetAction => ({
    type: ACTIONS.SET_TIMESHEET_ITEMS,
    payload: {
      entities,
      targetEmployeeId,
    },
  }),
  setDailyObjectivelyEventLogs: (
    records: DailyObjectivelyEventLog[] | null
  ): SetDailyObjectivelyEventLogsAction => ({
    type: ACTIONS.SET_DAILY_OBJECTIVELY_EVENT_LOGS,
    payload: records,
  }),
  updateCommuteCount: (
    targetDate: string,
    commuteCount: CommuteCount
  ): UpdateCommuteCountAction => ({
    type: ACTIONS.UPDATE_COMMUTE_COUNT,
    payload: {
      targetDate,
      commuteCount,
    },
  }),
  updateDailyObjectivelyEventLog: (record: {
    targetDate: string;
    dailyObjectivelyEventLog: DailyObjectivelyEventLog | null;
  }): UpdateDailyObjectivelyEventLogAction => ({
    type: ACTIONS.UPDATE_DAILY_OBJECTIVELY_EVENT_LOG,
    payload: record,
  }),
  clearRequestTypeCodes: (): ClearRequestTypeCodes => ({
    type: ACTIONS.CLEAR_REQUEST_TYPE_CODES,
  }),
  setRequestTypeCodes: (requestTypeCodesMap: {
    [id: string]: AttDailyRequestType.Code[];
  }): SetRequestTypeCodes => ({
    type: ACTIONS.SET_REQUEST_TYPE_CODES,
    payload: requestTypeCodesMap,
  }),
};

/**
 * 日毎の注意喚起メッセージを作成する
 */
const createDailyAttentionMessages = (
  record: Parameters<typeof createAttDailyAttentions>[0]
): string[] => {
  return attendanceHelper.alert(createAttDailyAttentions(record));
};

const createDailyAttentionMessageMap = ({
  attRecordList,
  dailyObjectivelyEventLogs,
}: {
  attRecordList: State['attRecordList'];
  dailyObjectivelyEventLogs: State['dailyObjectivelyEventLogs'];
}) =>
  attRecordList.reduce((hash, attRecord) => {
    hash[attRecord.recordDate] = createDailyAttentionMessages({
      ...attRecord,
      objectivelyEventLog: dailyObjectivelyEventLogs?.find(
        (eventLog) => eventLog.recordId === attRecord.id
      ),
    });
    return hash;
  }, {});

export default function reducer(
  state: State = initialState,
  action: Actions
): State {
  switch (action.type) {
    case ACTIONS.SET_TIMESHEET_ITEMS:
      const { entities } = action.payload;
      const dailyObjectivelyEventLogs = state.dailyObjectivelyEventLogs;
      const ownerInfos: OwnerInfo[] = entities.employeeInfoList.map((data) => ({
        startDate: data.startDate,
        endDate: data.endDate,
        employee: {
          code: '',
          name: entities.employeeName,
        },
        department: {
          name: data.departmentName,
        },
        workingType: {
          name: data.workingTypeName,
        },
      }));
      const workingTypes = entities.workingTypeList.map(
        WorkingType.createFromRemote
      );
      const workingType = WORKING_TYPE_KEYS.reduce(
        (obj, key) => {
          obj[key] = entities.workingTypeList.some((wt) => wt[key]);
          return obj;
        },
        {
          useAllowanceManagement: false,
          useObjectivelyEventLog: false,
          useManageCommuteCount: false,
          useFixDailyRequest: false,
          useLegalAgreement: false,
          useLegalAgreementMonthlyRequest: false,
          useLegalAgreementYearlyRequest: false,
        } as State['workingType']
      );
      const lastDayWorkingType = workingTypes.at(-1);
      workingType.useLegalAgreementMonthlyRequest =
        lastDayWorkingType.useLegalAgreementMonthlyRequest;
      workingType.useLegalAgreementYearlyRequest =
        lastDayWorkingType.useLegalAgreementYearlyRequest;
      workingType.useLegalAgreement =
        workingType.useLegalAgreementMonthlyRequest ||
        workingType.useLegalAgreementYearlyRequest;

      const summaryPeriodList = entities.periods;
      const attDailyRequestTypeMap = entities.requestTypes;
      const attDailyRequestMap = Object.keys(entities.requests || {}).reduce(
        (hash, key) => {
          const request = entities.requests[key];
          hash[key] = AttDailyRequest.createFromRemote(
            attDailyRequestTypeMap,
            request,
            entities
          );
          return hash;
        },
        {}
      );
      const attSummary = {
        id: entities.id,
        requestId: entities.requestId,
        status: entities.status,
        approver01Name: entities.approver01Name,
        isLocked: entities.isLocked,
        isAllLeaveOfAbsence: entities.isAllAbsent,
        performableActionForFix: detectPerformableActionForFix(entities.status),
      };
      const attRecordList = entities.records.map((record) => {
        return AttRecord.createFromParam(
          {
            ...record,
            fixDailyRequest: createFixDailyRequestFromRemote(
              record,
              entities.records
            ),
            outInsufficientMinimumWorkHours:
              record.isFlexWithoutCoreRequireEarlyLeaveApply &&
              record.isFlexWithoutCore
                ? record.outInsufficientMinimumWorkHours
                : 0,
          },
          {
            isSummaryLocked: attSummary?.isLocked,
            useFixDailyRequest: RecordsUtil.getWithinRange(
              record.recordDate,
              workingTypes
            )?.useFixDailyRequest,
          }
        );
      });
      const dailyAttentionMessagesMap = createDailyAttentionMessageMap({
        attRecordList,
        dailyObjectivelyEventLogs,
      });
      const dailyContractedDetailMap = attRecordList.reduce(
        (hash, attRecord) => {
          hash[attRecord.recordDate] = attRecord.contractedDetail
            ? createAttDailyContractDetailFromRemote(attRecord.contractedDetail)
            : null;
          return hash;
        },
        {}
      );
      return {
        ...state,
        ownerInfos,
        workingTypes,
        workingType,
        summaryPeriodList,
        attDailyRequestTypeMap,
        attDailyRequestMap,
        attRecordList,
        dailyAttentionMessagesMap,
        dailyContractedDetailMap,
        attSummary,
        dailyObjectivelyEventLogs,
        dailyRestCountLimit: entities.dailyRestCountLimit,
      };

    case ACTIONS.SET_DAILY_OBJECTIVELY_EVENT_LOGS: {
      const dailyObjectivelyEventLogs = action.payload;
      const { attRecordList } = state;

      const dailyAttentionMessagesMap = createDailyAttentionMessageMap({
        attRecordList,
        dailyObjectivelyEventLogs,
      });
      return {
        ...state,
        dailyAttentionMessagesMap,
        dailyObjectivelyEventLogs,
      };
    }

    case ACTIONS.UPDATE_DAILY_OBJECTIVELY_EVENT_LOG: {
      const { targetDate, dailyObjectivelyEventLog } = action.payload;
      const prevRecords = state.dailyObjectivelyEventLogs.filter(
        ({ recordDate }) => recordDate !== targetDate
      );
      const dailyObjectivelyEventLogs = dailyObjectivelyEventLog
        ? prevRecords.concat([dailyObjectivelyEventLog])
        : prevRecords;
      const { attRecordList } = state;
      const dailyAttentionMessagesMap = createDailyAttentionMessageMap({
        attRecordList,
        dailyObjectivelyEventLogs,
      });
      return {
        ...state,
        dailyAttentionMessagesMap,
        dailyObjectivelyEventLogs,
      };
    }

    case ACTIONS.UPDATE_COMMUTE_COUNT: {
      const { targetDate, commuteCount } = action.payload;
      const { attRecordList: $attRecordList, attSummary, workingTypes } = state;
      const attRecordList = $attRecordList.map((record) => {
        if (record.recordDate === targetDate) {
          return new AttRecord({
            ...record,
            commuteCount,
            isSummaryLocked: attSummary?.isLocked,
            useFixDailyRequest: RecordsUtil.getWithinRange(
              record.recordDate,
              workingTypes
            )?.useFixDailyRequest,
          });
        } else {
          return record;
        }
      });

      return {
        ...state,
        attRecordList,
      };
    }

    case ACTIONS.CLEAR_REQUEST_TYPE_CODES: {
      const { attRecordList: $attRecordList, workingTypes, attSummary } = state;
      const attRecordList = $attRecordList.map(
        (record) =>
          new AttRecord({
            ...record,
            requestTypeCodes: null,
            isSummaryLocked: attSummary?.isLocked,
            useFixDailyRequest: RecordsUtil.getWithinRange(
              record.recordDate,
              workingTypes
            )?.useFixDailyRequest,
          })
      );

      return {
        ...state,
        attRecordList,
      };
    }

    case ACTIONS.SET_REQUEST_TYPE_CODES: {
      const { attRecordList: $attRecordList, workingTypes, attSummary } = state;
      const requestTypeCodesMap = action.payload;
      const attRecordList = $attRecordList.map(
        (record) =>
          new AttRecord({
            ...record,
            requestTypeCodes: requestTypeCodesMap[record.id] || [],
            isSummaryLocked: attSummary?.isLocked,
            useFixDailyRequest: RecordsUtil.getWithinRange(
              record.recordDate,
              workingTypes
            )?.useFixDailyRequest,
          })
      );

      return {
        ...state,
        attRecordList,
      };
    }

    default:
      return state;
  }
}
