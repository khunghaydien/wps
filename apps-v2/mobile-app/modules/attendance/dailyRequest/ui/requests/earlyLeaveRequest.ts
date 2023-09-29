import { AttDailyRecord } from '@attendance/domain/models/AttDailyRecord';
import * as EarlyLeaveRequest from '@attendance/domain/models/AttDailyRequest/EarlyLeaveRequest';
import {
  createFromEarlyLeaveRequest,
  EarlyLeaveReason,
  getDefaultEarlyLeaveReason,
} from '@attendance/domain/models/EarlyLeaveReason';

export type State = {
  request: EarlyLeaveRequest.EarlyLeaveRequest | null;
  earlyLeaveReasonList: EarlyLeaveReason[];
  useEarlyLeaveReason: boolean;
  selectedEarlyLeaveReason: EarlyLeaveReason | null;
  dailyRecord: AttDailyRecord;
};

export const initialState: State = {
  request: null,
  earlyLeaveReasonList: [],
  useEarlyLeaveReason: false,
  selectedEarlyLeaveReason: null,
  dailyRecord: null,
};

type Keys = keyof EarlyLeaveRequest.EarlyLeaveRequest;

type Values =
  EarlyLeaveRequest.EarlyLeaveRequest[keyof EarlyLeaveRequest.EarlyLeaveRequest];

type Initialize = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/EARLY_LEAVE_REQUEST/INITIALIZE';
  payload: {
    request: EarlyLeaveRequest.EarlyLeaveRequest;
    record: AttDailyRecord | null;
    earlyLeaveReasonList: EarlyLeaveReason[] | null;
  };
};

type SetUpForEditing = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/EARLY_LEAVE_REQUEST/SET_UP_FOR_EDITING';
  payload: {
    request: EarlyLeaveRequest.EarlyLeaveRequest;
    record: AttDailyRecord | null;
    earlyLeaveReasonList: EarlyLeaveReason[] | null;
    useEarlyLeaveReason: boolean;
  };
};

type Update = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/EARLY_LEAVE_REQUEST/UPDATE';
  payload: {
    key: Keys;
    value: Values;
  };
};

type SetUseEarlyLeaveReason = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/EARLY_LEAVE_REQUEST/SET_USE_EARLY_LEAVE_REASON';
  payload: {
    useEarlyLeaveReason: boolean;
  };
};

type Action = Initialize | SetUpForEditing | Update | SetUseEarlyLeaveReason;

export const INITIALIZE: Initialize['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/EARLY_LEAVE_REQUEST/INITIALIZE';

export const SET_UP_FOR_EDITING: SetUpForEditing['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/EARLY_LEAVE_REQUEST/SET_UP_FOR_EDITING';

export const UPDATE: Update['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/EARLY_LEAVE_REQUEST/UPDATE';

export const SET_USE_EARLY_LEAVE_REASON: SetUseEarlyLeaveReason['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/EARLY_LEAVE_REQUEST/SET_USE_EARLY_LEAVE_REASON';

export const actions = {
  initialize: (
    request: EarlyLeaveRequest.EarlyLeaveRequest,
    record: AttDailyRecord | null = null,
    earlyLeaveReasonList: EarlyLeaveReason[] | null = null
  ): Initialize => ({
    type: INITIALIZE,
    payload: {
      request,
      record,
      earlyLeaveReasonList,
    },
  }),

  setUpForEditing: (
    request: EarlyLeaveRequest.EarlyLeaveRequest,
    record: AttDailyRecord | null = null,
    earlyLeaveReasonList: EarlyLeaveReason[] | null = null,
    useEarlyLeaveReason: boolean
  ): SetUpForEditing => ({
    type: SET_UP_FOR_EDITING,
    payload: {
      request,
      record,
      earlyLeaveReasonList,
      useEarlyLeaveReason,
    },
  }),

  update: (key: Keys, value: Values): Update => ({
    type: UPDATE,
    payload: { key, value },
  }),

  /**
   * @deprecated
   * @param useEarlyLeaveReason
   * @returns
   */
  setEarlyLeaveReason: (
    useEarlyLeaveReason: boolean
  ): SetUseEarlyLeaveReason => ({
    type: SET_USE_EARLY_LEAVE_REASON,
    payload: {
      useEarlyLeaveReason,
    },
  }),
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      const {
        request,
        earlyLeaveReasonList: $earlyLeaveReasonList,
        record,
      } = action.payload;
      const { useEarlyLeaveReason } = state;
      const earlyLeaveReasonList = $earlyLeaveReasonList || [
        createFromEarlyLeaveRequest(request),
      ];
      const selectedEarlyLeaveReason = getDefaultEarlyLeaveReason(
        earlyLeaveReasonList,
        request?.reasonId
      );
      return {
        request,
        earlyLeaveReasonList,
        useEarlyLeaveReason,
        selectedEarlyLeaveReason,
        dailyRecord: record,
      };
    }

    case SET_UP_FOR_EDITING: {
      const {
        request,
        record,
        earlyLeaveReasonList: $earlyLeaveReasonList,
        useEarlyLeaveReason,
      } = action.payload;
      const earlyLeaveReasonList = $earlyLeaveReasonList || [
        createFromEarlyLeaveRequest(request),
      ];
      const selectedEarlyLeaveReason = getDefaultEarlyLeaveReason(
        earlyLeaveReasonList,
        request?.reasonId
      );
      return {
        request: EarlyLeaveRequest.convertForEditing(request, {
          dailyRecord: record,
          earlyLeaveReasons: earlyLeaveReasonList,
          useEarlyLeaveReason,
        }),
        earlyLeaveReasonList,
        useEarlyLeaveReason,
        selectedEarlyLeaveReason,
        dailyRecord: record,
      };
    }

    case UPDATE: {
      const { request, earlyLeaveReasonList, dailyRecord } = state;
      const { key, value } = action.payload;
      if (request === null) {
        return state;
      } else {
        return {
          ...state,
          request: EarlyLeaveRequest.update({
            dailyRecord,
            earlyLeaveReasons: earlyLeaveReasonList,
          })(request, key, value),
        };
      }
    }

    case SET_USE_EARLY_LEAVE_REASON: {
      const { useEarlyLeaveReason } = action.payload;
      return {
        ...state,
        useEarlyLeaveReason,
      };
    }

    default:
      return state;
  }
};
