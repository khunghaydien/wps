import msg from '../../../commons/languages';
import TextUtil from '../../../commons/utils/TextUtil';
import TimeUtil from '../../../commons/utils/TimeUtil';

import {
  AttDailyAttention,
  CODE as ATT_DAILY_ATTENTION_CODE,
  createAttDailyAttentions,
} from '../../../domain/models/attendance/AttDailyAttention';
import {
  AttDailyRecordContractedDetail,
  createAttDailyContractDetailFromRemote,
} from '../../../domain/models/attendance/AttDailyRecord';
import * as AttDailyRequest from '../../../domain/models/attendance/AttDailyRequest';
import * as AttDailyRequestType from '../../../domain/models/attendance/AttDailyRequestType';
import { AttSummary } from '../../../domain/models/attendance/AttSummary';
import {
  OwnerInfo,
  Period,
  TimesheetFromRemote,
} from '../../../domain/models/attendance/Timesheet';
import * as WorkingType from '../../../domain/models/attendance/WorkingType';
import AttRecord from '../../models/AttRecord';
import { detectPerformableActionForFix } from '@apps/domain/models/attendance/AttFixSummaryRequest';

export type State = {
  ownerInfo: OwnerInfo | null;
  attWorkingType: WorkingType.WorkingType | null;
  summaryPeriodList: Period[] | null;
  attDailyRequestTypeMap: AttDailyRequestType.AttDailyRequestTypeMap | null;
  attDailyRequestMap: {
    [key: string]: AttDailyRequest.AttDailyRequest;
  } | null;
  attRecordList: Array<AttRecord> | null;
  dailyAttentionMessagesMap: { [date: string]: string[] } | null;
  dailyContractedDetailMap: {
    [date: string]: AttDailyRecordContractedDetail;
  } | null;
  attSummary: AttSummary | null;
};

export const initialState: State = {
  ownerInfo: null,
  attWorkingType: null,
  summaryPeriodList: null,
  attDailyRequestTypeMap: null,
  attDailyRequestMap: null,
  attRecordList: null,
  dailyAttentionMessagesMap: null,
  dailyContractedDetailMap: null,
  attSummary: null,
};

export const ACTIONS = {
  SET_TIMESHEET_ITEMS: 'TIMESHEET-PC/ENTITIES/TIMESHEET/SET_TIMESHEET_ITEMS',
  UPDATE_COMMUTE_COUNT: 'TIMESHEET-PC/ENTITIES/TIMESHEET/UPDATE_COMMUTE_COUNT',
  CLEAR_REQUEST_TYPE_CODES:
    'TIMESHEET-PC/ENTITIES/TIMESHEET/CLEAR_REQUEST_TYPE_CODES',
  SET_REQUEST_TYPE_CODES:
    'TIMESHEET-PC/ENTITIES/TIMESHEET/SET_REQUEST_TYPE_CODES',
} as const;

type SetTimesheetAction = {
  type: typeof ACTIONS.SET_TIMESHEET_ITEMS;
  payload: {
    entities: TimesheetFromRemote;
    targetEmployeeId: string | null;
  };
};

type UpdateCommuteCountAction = {
  type: typeof ACTIONS.UPDATE_COMMUTE_COUNT;
  payload: {
    targetDate: string;
    commuteForwardCount: number;
    commuteBackwardCount: number;
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
  | UpdateCommuteCountAction
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
  updateCommuteCount: (
    commuteForwardCount: number,
    commuteBackwardCount: number,
    targetDate: string
  ): UpdateCommuteCountAction => ({
    type: ACTIONS.UPDATE_COMMUTE_COUNT,
    payload: {
      targetDate,
      commuteForwardCount,
      commuteBackwardCount,
    },
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
 * 指定の時間が勤務時間に含まれない旨を伝えるメッセージを返します。
 * @param fromTime 基準となる時間。計算対象の開始時間。
 * @param toTime 計算対象の終了時間。
 * @return string
 */
function makeNotIncludeWorkingTimeMessage(
  fromTime: number,
  toTime: number
): string {
  return TextUtil.template(
    msg().Att_Msg_NotIncludeWorkingTime,
    TimeUtil.toHHmm(fromTime),
    TimeUtil.toHHmm(toTime)
  );
}

/**
 * 不足休憩時間のメッセージを返します。
 * @param insufficientRestTime
 * @return message
 */
function makeInsufficientRestTimeMessage(insufficientRestTime: number): string {
  return TextUtil.template(
    msg().Att_Msg_InsufficientRestTime,
    insufficientRestTime
  );
}

/**
 * 日毎の注意喚起メッセージを作成する
 */
function createDailyAttentionMessages(record: AttRecord): string[] {
  return createAttDailyAttentions(record)
    .map((attention: AttDailyAttention) => {
      switch (attention.code) {
        case ATT_DAILY_ATTENTION_CODE.IneffectiveWorkingTime:
          return makeNotIncludeWorkingTimeMessage(
            attention.value.fromTime,
            attention.value.toTime
          );
        case ATT_DAILY_ATTENTION_CODE.InsufficientRestTime:
          return makeInsufficientRestTimeMessage(attention.value);
        default:
          return '';
      }
    })
    .filter((v) => v);
}

export default function reducer(
  state: State = initialState,
  action: Actions
): State {
  switch (action.type) {
    case ACTIONS.SET_TIMESHEET_ITEMS:
      const { entities } = action.payload;
      const ownerInfo: OwnerInfo = {
        employeeName: entities.employeeName,
        departmentName: entities.departmentName,
        workingTypeName: entities.workingTypeName,
      };
      const attWorkingType = WorkingType.createFromRemote(entities.workingType);
      const summaryPeriodList = entities.periods;
      const attDailyRequestTypeMap = entities.requestTypes;
      const attDailyRequestMap = Object.keys(entities.requests || {}).reduce(
        (hash, key) => {
          const request = entities.requests[key];
          hash[key] = AttDailyRequest.createFromRemote(
            attDailyRequestTypeMap,
            request
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
      const attRecordList = entities.records.map((record) =>
        AttRecord.createFromParam(record, attSummary.isLocked)
      );
      const dailyAttentionMessagesMap = attRecordList.reduce(
        (hash, attRecord) => {
          hash[attRecord.recordDate] = createDailyAttentionMessages(attRecord);
          return hash;
        },
        {}
      );
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
        ownerInfo,
        attWorkingType,
        summaryPeriodList,
        attDailyRequestTypeMap,
        attDailyRequestMap,
        attRecordList,
        dailyAttentionMessagesMap,
        dailyContractedDetailMap,
        attSummary,
      };

    case ACTIONS.UPDATE_COMMUTE_COUNT: {
      const { targetDate, commuteForwardCount, commuteBackwardCount } =
        action.payload;
      const { attRecordList: $attRecordList } = state;
      const attRecordList = $attRecordList.map((record) => {
        if (record.recordDate === targetDate) {
          return new AttRecord({
            ...record,
            commuteForwardCount,
            commuteBackwardCount,
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
      const { attRecordList: $attRecordList } = state;
      const attRecordList = $attRecordList.map(
        (record) => new AttRecord({ ...record, requestTypeCodes: null })
      );

      return {
        ...state,
        attRecordList,
      };
    }

    case ACTIONS.SET_REQUEST_TYPE_CODES: {
      const { attRecordList: $attRecordList } = state;
      const requestTypeCodesMap = action.payload;
      const attRecordList = $attRecordList.map(
        (record) =>
          new AttRecord({
            ...record,
            requestTypeCodes: requestTypeCodesMap[record.id] || [],
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
