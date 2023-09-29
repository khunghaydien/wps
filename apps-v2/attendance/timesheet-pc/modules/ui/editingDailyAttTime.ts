import cloneDeep from 'lodash/cloneDeep';

import ROOT from './actionType';

import * as ViewModel from '@attendance/timesheet-pc/viewModels/EditingDailyAttendanceTimeViewModel';

export type State = ViewModel.EditingDailyAttendanceTimeViewModel;

const initialState: State = null;

const ACTION_TYPE_ROOT = `${ROOT}/EDITING_DAILY_ATT_TIME` as const;

export const ACTION_TYPE = {
  SET: `${ACTION_TYPE_ROOT}/SET`,
  UNSET: `${ACTION_TYPE_ROOT}/UNSET`,
  UPDATE: `${ACTION_TYPE_ROOT}/UPDATE`,
  UPDATE_DEVIATED_TIME_REASON: `${ACTION_TYPE_ROOT}/UPDATE_DEVIATED_TIME_REASON`,
  UPDATE_DEVIATED_TIME_REASON_ID: `${ACTION_TYPE_ROOT}/UPDATE_DEVIATED_TIME_REASON_ID`,
  ADD_REST_TIME: `${ACTION_TYPE_ROOT}/ADD_REST_TIME`,
  DELETE_REST_TIME: `${ACTION_TYPE_ROOT}/DELETE_REST_TIME`,
  UPDATE_REST_TIME: `${ACTION_TYPE_ROOT}/UPDATE_REST_TIME`,
  UPDATE_REST_TIMES: `${ACTION_TYPE_ROOT}/UPDATE_REST_TIMES`,
  UPDATE_DAILY_OBJECTIVELY_EVENT_LOG: `${ACTION_TYPE_ROOT}/UPDATE_DAILY_OBJECTIVELY_EVENT_LOG`,
} as const;

export const actions = {
  set: (state: State) => ({
    type: ACTION_TYPE.SET,
    payload: state,
  }),

  unset: () => ({
    type: ACTION_TYPE.UNSET,
  }),

  update: (key: string, value: unknown) => ({
    type: ACTION_TYPE.UPDATE,
    payload: { key, value },
  }),

  updateDeviationReason: (
    type: 'entering' | 'leaving',
    key: keyof ViewModel.DeviationReason,
    value: string
  ) => ({
    type: ACTION_TYPE.UPDATE_DEVIATED_TIME_REASON,
    payload: { type, key, value },
  }),

  updateDeviationReasonId: (value: string) => ({
    type: ACTION_TYPE.UPDATE_DEVIATED_TIME_REASON_ID,
    payload: value,
  }),

  addRestTime: () => ({
    type: ACTION_TYPE.ADD_REST_TIME,
  }),

  deleteRestTime: (idx: number) => ({
    type: ACTION_TYPE.DELETE_REST_TIME,
    payload: idx,
  }),

  updateRestTime: (idx: number, restTime: ViewModel.RestTime) => ({
    type: ACTION_TYPE.UPDATE_REST_TIME,
    payload: {
      idx,
      restTime,
    },
  }),

  updateRestTimes: (restTimes: State['restTimes']) => ({
    type: ACTION_TYPE.UPDATE_REST_TIMES,
    payload: restTimes,
  }),

  updateDailyObjectivelyEventLog: (
    record: ViewModel.DailyObjectivelyEventLog | null
  ) => ({
    type: ACTION_TYPE.UPDATE_DAILY_OBJECTIVELY_EVENT_LOG,
    payload: record,
  }),
};

type Actions =
  | ReturnType<typeof actions.set>
  | ReturnType<typeof actions.unset>
  | ReturnType<typeof actions.update>
  | ReturnType<typeof actions.updateDeviationReason>
  | ReturnType<typeof actions.updateDeviationReasonId>
  | ReturnType<typeof actions.addRestTime>
  | ReturnType<typeof actions.deleteRestTime>
  | ReturnType<typeof actions.updateRestTime>
  | ReturnType<typeof actions.updateRestTimes>
  | ReturnType<typeof actions.updateDailyObjectivelyEventLog>;

export default function reducer(state = initialState, action: Actions): State {
  switch (action.type) {
    case ACTION_TYPE.SET:
      const record = action.payload;
      const dailyObjectivelyEventLog = record.dailyObjectivelyEventLog
        ? cloneDeep(record.dailyObjectivelyEventLog)
        : null;
      if (dailyObjectivelyEventLog) {
        if (dailyObjectivelyEventLog.deviatedEnteringTimeReason) {
          dailyObjectivelyEventLog.deviatedEnteringTimeReason.text =
            dailyObjectivelyEventLog.deviatedEnteringTimeReason.text || '';
        } else {
          dailyObjectivelyEventLog.deviatedEnteringTimeReason = {
            label: null,
            value: null,
            text: '',
          };
        }
        if (dailyObjectivelyEventLog.deviatedLeavingTimeReason) {
          dailyObjectivelyEventLog.deviatedLeavingTimeReason.text =
            dailyObjectivelyEventLog.deviatedLeavingTimeReason.text || '';
        } else {
          dailyObjectivelyEventLog.deviatedLeavingTimeReason = {
            label: null,
            value: null,
            text: '',
          };
        }
      }
      return {
        ...record,
        remarks: record.remarks || '',
        dailyObjectivelyEventLog,
      };

    case ACTION_TYPE.UNSET:
      return null;

    case ACTION_TYPE.UPDATE:
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };

    case ACTION_TYPE.UPDATE_DEVIATED_TIME_REASON: {
      const { type, key, value } = action.payload;
      const $state = cloneDeep(state);
      if (!state.dailyObjectivelyEventLog) {
        return state;
      }
      switch (type) {
        case 'entering':
          if (!state.dailyObjectivelyEventLog.deviatedEnteringTimeReason) {
            return state;
          }
          $state.dailyObjectivelyEventLog.deviatedEnteringTimeReason[key] =
            value || '';
          return $state;
        case 'leaving':
          if (!state.dailyObjectivelyEventLog.deviatedLeavingTimeReason) {
            return state;
          }
          $state.dailyObjectivelyEventLog.deviatedLeavingTimeReason[key] =
            value || '';
          return $state;
        default:
          return state;
      }
    }

    case ACTION_TYPE.UPDATE_DEVIATED_TIME_REASON_ID: {
      const $state = cloneDeep(state);
      if (!state.dailyObjectivelyEventLog) {
        return state;
      }
      $state.dailyObjectivelyEventLog.deviationReasonExtendedItemId =
        action.payload;
      return $state;
    }

    case ACTION_TYPE.ADD_REST_TIME: {
      const { maxRestTimesCount } = state;
      const RestTimesFactory = ViewModel.createRestTimesFactory({
        maxLength: maxRestTimesCount,
      });
      return {
        ...state,
        restTimes: RestTimesFactory.push(state.restTimes),
      };
    }

    case ACTION_TYPE.DELETE_REST_TIME: {
      const { maxRestTimesCount } = state;
      const idx = action.payload;
      const RestTimesFactory = ViewModel.createRestTimesFactory({
        maxLength: maxRestTimesCount,
      });
      return {
        ...state,
        restTimes: RestTimesFactory.remove(state.restTimes, idx),
      };
    }

    case ACTION_TYPE.UPDATE_REST_TIME: {
      const { maxRestTimesCount } = state;
      const { idx, restTime } = action.payload;
      const RestTimesFactory = ViewModel.createRestTimesFactory({
        maxLength: maxRestTimesCount,
      });
      return {
        ...state,
        restTimes: RestTimesFactory.update(state.restTimes, idx, restTime),
      };
    }

    case ACTION_TYPE.UPDATE_REST_TIMES: {
      const restTimes = action.payload;
      return { ...state, restTimes };
    }

    case ACTION_TYPE.UPDATE_DAILY_OBJECTIVELY_EVENT_LOG: {
      const record = action.payload;
      if (record) {
        const { deviatedEnteringTimeReason, deviatedLeavingTimeReason } =
          state.dailyObjectivelyEventLog || {};
        return {
          ...state,
          dailyObjectivelyEventLog: {
            ...record,
            deviatedEnteringTimeReason,
            deviatedLeavingTimeReason,
          },
        };
      } else {
        return {
          ...state,
          dailyObjectivelyEventLog: null,
        };
      }
    }

    default:
      return state;
  }
}
