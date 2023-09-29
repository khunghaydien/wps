import * as LeaveRequest from '../../../../../../domain/models/attendance/AttDailyRequest/LeaveRequest';
import * as AttLeave from '../../../../../../domain/models/attendance/AttLeave';

export type State = {
  /**
   * 申請
   */
  request: LeaveRequest.LeaveRequest | null;

  /**
   * 申請可能な休暇種別の配列
   */
  attLeaveList: AttLeave.AttLeave[];

  /**
   * 選択中の休暇種別
   */
  selectedAttLeave: AttLeave.AttLeave | null;
};

const initialState: State = {
  request: null,
  attLeaveList: [],
  selectedAttLeave: null,
};

type Keys = keyof LeaveRequest.LeaveRequest;

type Values = LeaveRequest.LeaveRequest[keyof LeaveRequest.LeaveRequest];

type Initialize = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/LEAVE_REQUEST/INITIALIZE';
  payload: {
    request: LeaveRequest.LeaveRequest;
    attLeaveList: AttLeave.AttLeave[] | null;
  };
};

type Update = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/LEAVE_REQUEST/UPDATE';
  payload: {
    key: Keys;
    value: Values;
  };
};

type Action = Initialize | Update;

const INITIALIZE: Initialize['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/LEAVE_REQUEST/INITIALIZE';

const UPDATE: Update['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/LEAVE_REQUEST/UPDATE';

export const actions = {
  initialize: (
    request: LeaveRequest.LeaveRequest,
    attLeaveList: AttLeave.AttLeave[] | null = null
  ): Initialize => ({
    type: INITIALIZE,
    payload: {
      request,
      attLeaveList,
    },
  }),

  update: (key: Keys, value: Values): Update => ({
    type: UPDATE,
    payload: { key, value },
  }),
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      const { request, attLeaveList: $attLeaveList } = action.payload;
      const attLeaveList = $attLeaveList || [AttLeave.create(request)];
      const selectedAttLeave = AttLeave.getDefaultLeaveCode(
        attLeaveList,
        request.leaveCode
      );
      return {
        request: LeaveRequest.updateByAttLeave(request, selectedAttLeave),
        attLeaveList,
        selectedAttLeave,
      };
    }

    case UPDATE: {
      const { request, attLeaveList } = state;
      const { key, value } = action.payload;
      if (request === null) {
        return state;
      } else if (key === 'leaveCode') {
        const selectedAttLeave = AttLeave.getDefaultLeaveCode(
          attLeaveList,
          String(value)
        );
        return {
          ...state,
          request: LeaveRequest.updateByAttLeave(request, selectedAttLeave),
          selectedAttLeave,
        };
      } else {
        return {
          ...state,
          request: LeaveRequest.update(request, key, value),
        };
      }
    }
    default:
      return state;
  }
};
