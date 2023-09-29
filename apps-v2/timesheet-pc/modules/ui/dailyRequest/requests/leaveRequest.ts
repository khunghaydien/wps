import DateUtil from '../../../../../commons/utils/DateUtil';

import * as LeaveRequest from '../../../../../domain/models/attendance/AttDailyRequest/LeaveRequest';
import * as AttLeave from '../../../../../domain/models/attendance/AttLeave';

export type State = {
  request: LeaveRequest.LeaveRequest | null;
  attLeaveList: AttLeave.AttLeave[];
  selectedAttLeave: AttLeave.AttLeave | null;
  hasRange: boolean;
};

const initialState: State = {
  request: null,
  hasRange: false,
  attLeaveList: [],
  selectedAttLeave: null,
};

const getHasRange = (request: LeaveRequest.LeaveRequest): boolean =>
  !!request.endDate && request.startDate !== request.endDate;

type Keys = keyof LeaveRequest.LeaveRequest;

type Values = LeaveRequest.LeaveRequest[keyof LeaveRequest.LeaveRequest];

type Initialize = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/LEAVE_REQUEST/INITIALIZE';
  payload: {
    request: LeaveRequest.LeaveRequest;
    attLeaveList: AttLeave.AttLeave[] | null;
  };
};

type Update = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/LEAVE_REQUEST/UPDATE';
  payload: {
    key: Keys;
    value: Values;
  };
};

type UpdateHasRange = {
  type: 'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/LEAVE_REQUEST/UPDATE_HAS_RANGE';
  payload: boolean;
};

type Action = Initialize | Update | UpdateHasRange;

const INITIALIZE: Initialize['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/LEAVE_REQUEST/INITIALIZE';

const UPDATE: Update['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/LEAVE_REQUEST/UPDATE';

const UPDATE_HAS_RANGE: UpdateHasRange['type'] =
  'TIMESHEET_PC/UI/DAILY_REQUEST/REQUESTS/LEAVE_REQUEST/UPDATE_HAS_RANGE';

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

  updateHasRange: (value: boolean): UpdateHasRange => ({
    type: UPDATE_HAS_RANGE,
    payload: value,
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
        hasRange: getHasRange(request),
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

    case UPDATE_HAS_RANGE: {
      const hasRange = action.payload;
      const { request } = state;
      if (request === null) {
        return state;
      } else {
        return {
          ...state,
          hasRange,
          request: LeaveRequest.update(
            request,
            'endDate',
            hasRange
              ? DateUtil.addDays(request.startDate, 1)
              : request.startDate
          ),
        };
      }
    }

    default:
      return state;
  }
};
