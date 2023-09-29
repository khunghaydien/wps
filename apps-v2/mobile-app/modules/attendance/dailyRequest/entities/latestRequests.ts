import { AttDailyRecord } from '@attendance/domain/models/AttDailyRecord';
import {
  AttDailyRequest,
  getLatestRequestsAt,
} from '@attendance/domain/models/AttDailyRequest';
import { Timesheet } from '@attendance/domain/models/Timesheet';

// State

export type State = Array<AttDailyRequest>;

const initialState: State = [];

// Actions

type Initialize = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILYREQUEST/ENTITIES/LATESTREQUEST/INITIALIZE';
  payload: {
    timesheet: Timesheet;
    dailyRecord: AttDailyRecord;
  };
};

type Clear = {
  type: 'MOBILE_APP/MODULES/ATTENDANCE/DAILYREQUEST/ENTITIES/LATESTREQUEST/CLEAR';
};

type Action = Initialize | Clear;

const INITIALIZE: Initialize['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILYREQUEST/ENTITIES/LATESTREQUEST/INITIALIZE';

const CLEAR: Clear['type'] =
  'MOBILE_APP/MODULES/ATTENDANCE/DAILYREQUEST/ENTITIES/LATESTREQUEST/CLEAR';

export const actions = {
  initialize: <
    TAttDailyRecord extends AttDailyRecord,
    TTimesheet extends Timesheet
  >(
    dailyRecord: TAttDailyRecord,
    timesheet: TTimesheet
  ): Initialize => ({
    type: INITIALIZE,
    payload: {
      timesheet,
      dailyRecord,
    },
  }),
  clear: (): Clear => ({
    type: CLEAR,
  }),
};

// Reducer

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case INITIALIZE: {
      return [
        ...getLatestRequestsAt(
          action.payload.dailyRecord,
          action.payload.timesheet
        ),
      ];
    }

    case CLEAR: {
      return [];
    }

    default:
      return state;
  }
};
