import msg from '../../../../../../commons/languages';
import TextUtil from '../../../../../../commons/utils/TextUtil';
import TimeUtil from '../../../../../../commons/utils/TimeUtil';

import {
  CODE,
  createAttDailyAttentions,
} from '../../../../../../domain/models/attendance/AttDailyAttention';
import {
  AttDailyRecord,
  canEdit as canEditAttDailyRecord,
  shouldInput as shouldInputAttDailyRecord,
} from '../../../../../../domain/models/attendance/AttDailyRecord';
import {
  COMMUTE_STATE,
  toCommuteState,
} from '../../../../../../domain/models/attendance/CommuteCount';
import {
  pushLast as restTimePushLast,
  RestTimes,
} from '../../../../../../domain/models/attendance/RestTime';
import {
  getAttDailyRecordByDate,
  Timesheet,
} from '../../../../../../domain/models/attendance/Timesheet';

export type State = {
  id: string;
  targetDate: string;
  startTime: number | null;
  endTime: number | null;
  restTimes: RestTimes;
  restHours: number | null;
  remarks: string;
  contractedDetail: AttDailyRecord['contractedDetail'];
  canEdit: boolean;
  hasOtherRestTime: boolean;
  attentionMessages: string[];
  commuteForwardCount: number | null;
  commuteBackwardCount: number | null;
};

const ACTIONS = {
  FETCH_SUCCESS:
    'MOBILE_APP/MODULES/ATTENDANCE/TIMESHEET/UI/DAILY/EDITING/FETCH_SUCCESS',
  UPDATE: 'MOBILE_APP/MODULES/ATTENDANCE/TIMESHEET/UI/DAILY/EDITING/UPDATE',
  UPDATE_IN:
    'MOBILE_APP/MODULES/ATTENDANCE/TIMESHEET/UI/DAILY/EDITING/UPDATE_IN',
  DELETE_IN:
    'MOBILE_APP/MODULES/ATTENDANCE/TIMESHEET/UI/DAILY/EDITING/DELETE_IN',
  PUSH_IN: 'MOBILE_APP/MODULES/ATTENDANCE/TIMESHEET/UI/DAILY/EDITING/PUSH_IN',
  CLEAR: 'MOBILE_APP/MODELES/ATTENDANCE/TIMESHEET/UI/DAILY/EDITING/CLEAR',
};

export const actions = {
  fetchSuccess: (targetDate: string, timesheet: Timesheet) => ({
    type: ACTIONS.FETCH_SUCCESS,
    payload: { targetDate, timesheet },
  }),
  updateStartTime: (value?: number) => ({
    type: ACTIONS.UPDATE,
    payload: {
      key: 'startTime',
      value,
    },
  }),
  updateEndTime: (value?: number) => ({
    type: ACTIONS.UPDATE,
    payload: {
      key: 'endTime',
      value,
    },
  }),
  updateRestHours: (value?: number) => ({
    type: ACTIONS.UPDATE,
    payload: {
      key: 'restHours',
      value,
    },
  }),
  updateCommuteForwardCount: (value: number) => ({
    type: ACTIONS.UPDATE,
    payload: {
      key: 'commuteForwardCount',
      value,
    },
  }),
  updateCommuteBackwardCount: (value: number) => ({
    type: ACTIONS.UPDATE,
    payload: {
      key: 'commuteBackwardCount',
      value,
    },
  }),
  updateRemarks: (value: string) => ({
    type: ACTIONS.UPDATE,
    payload: {
      key: 'remarks',
      value,
    },
  }),
  updateRestTime: (index: number, value: State['restTimes']) => ({
    type: ACTIONS.UPDATE_IN,
    payload: {
      key: 'restTimes',
      index,
      value,
    },
  }),
  deleteRestTime: (index: number) => ({
    type: ACTIONS.DELETE_IN,
    payload: {
      key: 'restTimes',
      index,
    },
  }),
  addRestTime: () => ({
    type: ACTIONS.PUSH_IN,
    payload: {
      key: 'restTimes',
      value: {
        startTime: null,
        endTime: null,
      },
    },
  }),
  clear: () => ({
    type: ACTIONS.CLEAR,
  }),
};

const initialState: State = {
  id: '',
  targetDate: '',
  startTime: null,
  endTime: null,
  restTimes: [],
  restHours: null,
  remarks: '',
  contractedDetail: {
    startTime: null,
    endTime: null,
    restTimes: [],
  },
  canEdit: false,
  hasOtherRestTime: false,
  attentionMessages: [],
  commuteForwardCount: null,
  commuteBackwardCount: null,
};

export default (state: State = initialState, action: any): State => {
  const { type, payload } = action;
  switch (type) {
    case ACTIONS.FETCH_SUCCESS:
      const { targetDate, timesheet } = payload;
      const record = getAttDailyRecordByDate(targetDate, timesheet);

      if (record) {
        const {
          id,
          recordDate,
          startTime,
          endTime,
          restTimes,
          restHours,
          remarks,
          insufficientRestTime,
          contractedDetail,
          commuteForwardCount,
          commuteBackwardCount,
        } = record;
        const commuteState = toCommuteState(
          commuteForwardCount,
          commuteBackwardCount
        );
        const useManageCommuteCount =
          timesheet.workingType.useManageCommuteCount;
        const shouldInput =
          shouldInputAttDailyRecord(targetDate, timesheet) ||
          (useManageCommuteCount &&
            (commuteState === COMMUTE_STATE.FORWARD ||
              commuteState === COMMUTE_STATE.BACKWARD ||
              commuteState === COMMUTE_STATE.BOTH_WAYS));
        const attentionMessages = createAttDailyAttentions(record).map(
          (item) => {
            switch (item.code) {
              case CODE.InsufficientRestTime:
                return TextUtil.template(
                  msg().Att_Msg_InsufficientRestTime,
                  item.value
                );
              case CODE.IneffectiveWorkingTime:
                return TextUtil.template(
                  msg().Att_Msg_NotIncludeWorkingTime,
                  TimeUtil.toHHmm(item.value.fromTime),
                  TimeUtil.toHHmm(item.value.toTime)
                );
              default:
                return '';
            }
          }
        );
        const canEdit = canEditAttDailyRecord(
          targetDate,
          timesheet,
          shouldInput
        );
        const hasOtherRestTime = !!(restHours + insufficientRestTime);
        return {
          id,
          targetDate: recordDate,
          startTime,
          endTime,
          restTimes: restTimePushLast(restTimes.map((v) => ({ ...v }))),
          restHours,
          remarks,
          contractedDetail,
          canEdit,
          hasOtherRestTime,
          attentionMessages,
          commuteForwardCount,
          commuteBackwardCount,
        };
      } else {
        return initialState;
      }

    case ACTIONS.UPDATE: {
      const { key, value } = payload;
      return {
        ...state,
        [key]: value,
      };
    }
    case ACTIONS.UPDATE_IN: {
      const { key, index, value } = payload;
      const arr = [...state[key]];
      arr.splice(index, 1, value);
      return {
        ...state,
        [key]: arr,
      };
    }
    case ACTIONS.DELETE_IN: {
      const { key, index } = payload;
      const arr = [...state[key]];
      arr.splice(index, 1);
      return {
        ...state,
        [key]: arr,
      };
    }
    case ACTIONS.PUSH_IN: {
      const { key, value } = payload;
      const arr = [...state[key]];
      arr.push(value);
      return {
        ...state,
        [key]: arr,
      };
    }
    case ACTIONS.CLEAR:
      return initialState;
    default:
      return state;
  }
};
