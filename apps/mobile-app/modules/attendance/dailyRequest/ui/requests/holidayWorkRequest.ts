import * as HolidayWorkRequest from '../../../../../../domain/models/attendance/AttDailyRequest/HolidayWorkRequest';
import * as SubstituteLeaveType from '../../../../../../domain/models/attendance/SubstituteLeaveType';

export type State = {
  request: HolidayWorkRequest.HolidayWorkRequest | null;
  substituteLeaveTypeList: SubstituteLeaveType.SubstituteLeaveType[];
};

const initialState: State = {
  request: null,
  substituteLeaveTypeList: [],
};

type Keys = keyof HolidayWorkRequest.HolidayWorkRequest;

type Values =
  HolidayWorkRequest.HolidayWorkRequest[keyof HolidayWorkRequest.HolidayWorkRequest];

type Initialize = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/HOLIDAY_WORK_REQUEST/INITIALIZE';
  payload: {
    request: HolidayWorkRequest.HolidayWorkRequest;
    substituteLeaveTypeList: SubstituteLeaveType.SubstituteLeaveType[] | null;
  };
};

type Update = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/HOLIDAY_WORK_REQUEST/UPDATE';
  payload: {
    key: Keys;
    value: Values;
  };
};

type Action = Initialize | Update;

const INITIALIZE: Initialize['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/HOLIDAY_WORK_REQUEST/INITIALIZE';

const UPDATE: Update['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILY_REQUEST/UI/REQUESTS/HOLIDAY_WORK_REQUEST/UPDATE';

export const actions = {
  initialize: (
    request: HolidayWorkRequest.HolidayWorkRequest,
    substituteLeaveTypeList:
      | SubstituteLeaveType.SubstituteLeaveType[]
      | null = null
  ): Initialize => ({
    type: INITIALIZE,
    payload: {
      request,
      substituteLeaveTypeList,
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
      const { request, substituteLeaveTypeList: $substituteLeaveTypeList } =
        action.payload;
      const substituteLeaveTypeList =
        $substituteLeaveTypeList || SubstituteLeaveType.create(request);
      return {
        request: { ...request },
        substituteLeaveTypeList,
      };
    }

    case UPDATE: {
      const { request } = state;
      const { key, value } = action.payload;
      if (request === null) {
        return state;
      } else {
        return {
          ...state,
          request: HolidayWorkRequest.update(request, key, value),
        };
      }
    }

    default:
      return state;
  }
};
