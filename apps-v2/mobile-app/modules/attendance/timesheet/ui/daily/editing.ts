import nanoid from 'nanoid';

import {
  ACTIONS_FOR_FIX,
  STATUS,
} from '@apps/attendance/domain/models/FixDailyRequest';
import { createAttDailyAttentions } from '@attendance/domain/models/AttDailyAttention';
import { AttDailyRecord } from '@attendance/domain/models/AttDailyRecord';
import { CommuteCount } from '@attendance/domain/models/CommuteCount';
import { RestTime as DomainRestTime } from '@attendance/domain/models/RestTime';
import { RestTimeReason } from '@attendance/domain/models/RestTimeReason';
import {
  getAttDailyRecordByDate,
  Timesheet,
} from '@attendance/domain/models/Timesheet';

import ROOT from './actionType';

import $createRestTimesFactory from '@attendance/domain/factories/RestTimesFactory';
import * as attentionHelper from '@attendance/ui/helpers/attentionDailyMessages';

const createRestTimesFactory = $createRestTimesFactory();

export type RestTime = DomainRestTime & {
  id: string;
};

export type RestTimes = RestTime[];

export type State = {
  id: string;
  targetDate: string;
  startTime: number | null;
  endTime: number | null;
  restTimes: RestTimes;
  restHours: number | null;
  otherRestReason: RestTimeReason | null;
  remarks: string;
  commuteCount: CommuteCount;
  contractedDetail: AttDailyRecord['contractedDetail'];
  editable: boolean;
  hasOtherRestTime: boolean;
  attentionMessages: string[];
  fixDailyRequest: AttDailyRecord['fixDailyRequest'];
};

const initialState: State = {
  id: '',
  targetDate: '',
  startTime: null,
  endTime: null,
  restTimes: [],
  restHours: null,
  otherRestReason: null,
  commuteCount: null,
  remarks: '',
  contractedDetail: {
    startTime: null,
    endTime: null,
    restTimes: [],
  },
  editable: false,
  hasOtherRestTime: false,
  attentionMessages: [],
  fixDailyRequest: {
    approver01Name: '',
    id: '',
    performableActionForFix: ACTIONS_FOR_FIX.None,
    status: STATUS.NOT_REQUESTED,
  },
};

const ACTION_TYPE_ROOT = `${ROOT}/EDITING` as const;

const ACTION_TYPE = {
  FETCH_SUCCESS: `${ACTION_TYPE_ROOT}/FETCH_SUCCESS`,
  UPDATE: `${ACTION_TYPE_ROOT}/UPDATE`,
  UPDATE_IN: `${ACTION_TYPE_ROOT}/UPDATE_IN`,
  DELETE_IN: `${ACTION_TYPE_ROOT}/DELETE_IN`,
  PUSH_IN: `${ACTION_TYPE_ROOT}/PUSH_IN`,
  CLEAR: `${ACTION_TYPE_ROOT}/CLEAR`,
} as const;

type FetchSuccess = {
  type: typeof ACTION_TYPE.FETCH_SUCCESS;
  payload: {
    targetDate: string;
    timesheet: Timesheet;
  };
};

type ItemKeys = keyof State;
type Update<T extends ItemKeys = ItemKeys> = {
  type: typeof ACTION_TYPE.UPDATE;
  payload: {
    key: T;
    value: State[T];
  };
};

type UpdateIn = {
  type: typeof ACTION_TYPE.UPDATE_IN;
  payload: {
    index: number;
    key: 'restTimes';
    value: State['restTimes'][number];
  };
};

type DeleteIn = {
  type: typeof ACTION_TYPE.DELETE_IN;
  payload: {
    key: 'restTimes';
    index: number;
  };
};

type PushIn = {
  type: typeof ACTION_TYPE.PUSH_IN;
  payload: {
    key: 'restTimes';
    value: RestTime;
  };
};

type Clear = {
  type: typeof ACTION_TYPE.CLEAR;
};

type Action = FetchSuccess | Update | UpdateIn | DeleteIn | PushIn | Clear;

const appendId = <T>(record: T) => ({ ...record, id: nanoid(8) });

export const actions = {
  fetchSuccess: (targetDate: string, timesheet: Timesheet): FetchSuccess => ({
    type: ACTION_TYPE.FETCH_SUCCESS,
    payload: { targetDate, timesheet },
  }),
  updateStartTime: (value?: number): Update => ({
    type: ACTION_TYPE.UPDATE,
    payload: {
      key: 'startTime',
      value,
    },
  }),
  updateEndTime: (value?: number): Update => ({
    type: ACTION_TYPE.UPDATE,
    payload: {
      key: 'endTime',
      value,
    },
  }),
  updateRestHours: (value?: number): Update => ({
    type: ACTION_TYPE.UPDATE,
    payload: {
      key: 'restHours',
      value,
    },
  }),
  updateOtherRestReason: (value?: RestTimeReason): Update => ({
    type: ACTION_TYPE.UPDATE,
    payload: {
      key: 'otherRestReason',
      value,
    },
  }),
  updateCommuteCount: (value: CommuteCount): Update => ({
    type: ACTION_TYPE.UPDATE,
    payload: {
      key: 'commuteCount',
      value,
    },
  }),
  updateRemarks: (value: string): Update => ({
    type: ACTION_TYPE.UPDATE,
    payload: {
      key: 'remarks',
      value,
    },
  }),
  updateRestTime: (
    index: number,
    value: State['restTimes'][number]
  ): UpdateIn => ({
    type: ACTION_TYPE.UPDATE_IN,
    payload: {
      index,
      key: 'restTimes',
      value,
    },
  }),
  deleteRestTime: (index: number): DeleteIn => ({
    type: ACTION_TYPE.DELETE_IN,
    payload: {
      key: 'restTimes',
      index,
    },
  }),
  addRestTime: (): PushIn => ({
    type: ACTION_TYPE.PUSH_IN,
    payload: {
      key: 'restTimes',
      value: appendId({
        startTime: null,
        endTime: null,
        restReason: null,
      }),
    },
  }),
  clear: (): Clear => ({
    type: ACTION_TYPE.CLEAR,
  }),
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ACTION_TYPE.FETCH_SUCCESS:
      const { targetDate, timesheet } = action.payload;
      const record = getAttDailyRecordByDate(targetDate, timesheet);
      const RestTimesFactory = createRestTimesFactory({
        maxLength: timesheet.dailyRestCountLimit,
      });

      if (record) {
        const {
          id,
          recordDate,
          startTime,
          endTime,
          restTimes,
          restHours,
          otherRestReason,
          commuteCount,
          remarks,
          insufficientRestTime,
          contractedDetail,
          editable,
          fixDailyRequest,
        } = record;
        const attentionMessages = attentionHelper.alert(
          createAttDailyAttentions(record)
        );
        const hasOtherRestTime = !!(restHours + insufficientRestTime);
        return {
          id,
          targetDate: recordDate,
          startTime,
          endTime,
          restTimes: RestTimesFactory.pushLast(restTimes).map(appendId),
          restHours,
          otherRestReason,
          commuteCount,
          remarks,
          contractedDetail,
          editable,
          hasOtherRestTime,
          attentionMessages,
          fixDailyRequest,
        };
      } else {
        return initialState;
      }

    case ACTION_TYPE.UPDATE: {
      const { key, value } = action.payload;
      return {
        ...state,
        [key]: value,
      };
    }
    case ACTION_TYPE.UPDATE_IN: {
      const { key, index, value } = action.payload;
      const arr = [...state[key]];
      arr.splice(index, 1, value);
      return {
        ...state,
        [key]: arr,
      };
    }
    case ACTION_TYPE.DELETE_IN: {
      const { key, index } = action.payload;
      const arr = [...state[key]];
      arr.splice(index, 1);
      return {
        ...state,
        [key]: arr,
      };
    }
    case ACTION_TYPE.PUSH_IN: {
      const { key, value } = action.payload;
      const arr = [...state[key]];
      arr.push(value);
      return {
        ...state,
        [key]: arr,
      };
    }
    case ACTION_TYPE.CLEAR:
      return initialState;
    default:
      return state;
  }
};
